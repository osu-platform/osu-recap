import * as cheerio from 'cheerio';
import { StudentData, ScudDay, ScudSession, StudentProfile, StatementsData, MessagesData, ProgressData, ProgressSubject } from '../types/student';

export class OsuParser {
  private baseUrl = "https://www.osu.ru"
  private credentials: { login: string; pass: string } | null = null;
  private statusCallback: ((message: string) => void) | null = null;
  private lastRequestTime = 0;

  setCredentials(login: string, pass: string) {
    this.credentials = { login, pass };
  }

  setStatusCallback(callback: (message: string) => void) {
    this.statusCallback = callback;
  }

  private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    if (!this.credentials) {
      throw new Error("No credentials provided");
    }

    // Rate limiting: ensure at least 2 seconds between requests
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < 3000) {
      await new Promise(resolve => setTimeout(resolve, 3000 - timeSinceLastRequest));
    }

    this.lastRequestTime = Date.now();

    const body = new URLSearchParams(options.body as any);
    body.append('login', this.credentials.login);
    body.append('psw', this.credentials.pass);
    body.append('opsw', '');

    const response = await fetch(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...options.headers,
      },
      body: body,
    });

    // Check for rate limit error
    const clone = response.clone();
    const buffer = await clone.arrayBuffer();
    const decoder = new TextDecoder('windows-1251');
    const text = decoder.decode(buffer);

    if (text.includes('Вы слишком часто пытаетесь входить в систему')) {
      if (this.statusCallback) {
        this.statusCallback('Ждем пару секунд...');
      }
      await new Promise(resolve => setTimeout(resolve, 3000));
      return this.fetchWithAuth(url, options);
    }

    return response;
  }

  async login(login: string, pass: string): Promise<boolean> {
    this.setCredentials(login, pass);
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}/iss/lks/index.php`);

      if (!response.ok) return false;

      const text = await response.text();
      // If we see the login form again, login failed
      if (text.includes('name="login"') && text.includes('name="psw"')) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  async fetchMainPage(): Promise<string> {
    // We use fetchWithAuth which attaches credentials
    const response = await this.fetchWithAuth(`${this.baseUrl}/iss/lks/index.php`);
    
    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder('windows-1251');
    const html = decoder.decode(buffer);
    return html;
  }

  async fetchPage(page: string): Promise<string> {
     // Helper to fetch specific pages like ?page=personal
     // We need to pass the page param. Since we are forcing POST, 
     // we should probably pass 'page' in the body or keep it in URL.
     // Let's try keeping it in URL first.
     const response = await this.fetchWithAuth(`${this.baseUrl}/iss/lks/index.php?page=${page}`);
     const buffer = await response.arrayBuffer();
     const decoder = new TextDecoder('windows-1251');
     return decoder.decode(buffer);
  }

  parseStudentProfile(html: string): StudentProfile {
    const $ = cheerio.load(html);
    
    const fio = $('.fio a').text().trim(); // "Колядин Дмитрий Павлович"
    const group = $('.grplist__title').text().trim(); // "25ИСТ(б)-1"
    
    // Parse main info block
    const mainInfoText = $('.maininfo').first().text();
    
    const instituteMatch = mainInfoText.match(/Институт.*?(?=\n|$)/);
    const institute = instituteMatch ? instituteMatch[0].trim() : '';
    
    const courseMatch = mainInfoText.match(/Курс:\s*(\d+)/);
    const course = courseMatch ? parseInt(courseMatch[1]) : 1;
    
    const eduFormMatch = mainInfoText.match(/Форма финансирования обучения:\s*(.*?)(?=\n|$)/);
    const education_form = eduFormMatch ? eduFormMatch[1].trim() : '';
    
    const curatorMatch = mainInfoText.match(/Куратор группы:\s*(.*?)(?=Староста группы:|$)/);
    const curator = curatorMatch ? curatorMatch[1].trim() : '';
    
    const headmanMatch = mainInfoText.match(/Староста группы:\s*(.*?)(?=\n|$)/);
    const headman = headmanMatch ? headmanMatch[1].trim() : '';

    // Parse student book number from history table
    const studentBookNumber = $('.HistoryStudyTable tr').eq(1).find('td').last().text().trim();

    return {
      group,
      institute,
      course,
      education_form,
      curator,
      headman,
      student_book_number: studentBookNumber
    };
  }

  async fetchAttendance(dateFrom: string = '01.09.2025', dateTo: string = '31.01.2026'): Promise<string> {
    const body = new URLSearchParams();
    body.append('action', 'setattendanceparams');
    body.append('attendance_date_from', dateFrom);
    body.append('attendance_date_to', dateTo);

    const response = await this.fetchWithAuth(`${this.baseUrl}/iss/lks/index.php?page=attendance`, {
      body: body,
    });
    
    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder('windows-1251');
    return decoder.decode(buffer);
  }

  parseAttendance(html: string): { days: any[] } {
    const $ = cheerio.load(html);
    const days: any[] = [];
    
    let currentDate = '';
    let currentPair = 0;
    let currentTime = '';
    let currentSubject = '';
    let currentType: any = 'other';

    const rows = $('.attendance_table tr');
    
    rows.each((i, row) => {
      const cells = $(row).find('td');
      if (cells.length === 0) return; // Header or empty

      let colIdx = 0;
      
      // Heuristic:
      // 10 cells: Date, Pair, Time, Subject, Subgroup, Room, Turnstiles, Teacher, Graph, PresenceTime
      // 9 cells: Pair, Time, Subject, Subgroup, Room, Turnstiles, Teacher, Graph, PresenceTime (Same Date)
      // 6 cells: Subgroup, Room, Turnstiles, Teacher, Graph, PresenceTime (Same Pair/Subject)
      
      if (cells.length === 10) {
        const dateText = $(cells[0]).text().trim(); // "01.09.2025, пн"
        currentDate = dateText.split(',')[0].trim();
        colIdx = 1;
      }
      
      if (cells.length >= 9) {
        const pairText = $(cells[colIdx]).text().trim();
        currentPair = parseInt(pairText) || 0;
        
        const timeText = $(cells[colIdx + 1]).text().trim(); // "11:20-12:50"
        currentTime = timeText;
        
        const subjectText = $(cells[colIdx + 2]).text().trim();
        currentSubject = subjectText;
        
        if (subjectText.includes('(лк)')) currentType = 'lecture';
        else if (subjectText.includes('(пз)')) currentType = 'practice';
        else if (subjectText.includes('(лб)')) currentType = 'lab';
        else if (subjectText.includes('(экз)')) currentType = 'exam';
        else currentType = 'other';
        
        colIdx += 3;
      }
      
      if (cells.length === 6) {
        colIdx = 0;
      }

      const subgroup = $(cells[colIdx]).text().trim();
      const room = $(cells[colIdx + 1]).text().trim();
      const teacher = $(cells[colIdx + 3]).text().trim();
      const graphCell = $(cells[colIdx + 4]);
      const presenceTimeText = $(cells[colIdx + 5]).text().trim(); // "01:30"

      const [hours, minutes] = presenceTimeText.split(':').map(Number);
      const presenceSeconds = (hours || 0) * 3600 + (minutes || 0) * 60;
      
      const rawIntervals: string[] = [];
      graphCell.find('div').each((_, div) => {
        const title = $(div).attr('title');
        if (title) rawIntervals.push(title);
      });

      const [timeStart, timeEnd] = currentTime.split('-').map(t => t.trim());

      const session = {
        pair_number: currentPair,
        time_start: timeStart,
        time_end: timeEnd,
        subject: currentSubject,
        type: currentType,
        subgroup,
        room,
        teacher,
        attendance: {
          status: presenceSeconds > 0 ? 'present' : 'absent',
          presence_time_seconds: presenceSeconds,
          raw_intervals: rawIntervals
        }
      };

      let day = days.find(d => d.date === currentDate);
      if (!day) {
        day = { date: currentDate, classes: [] };
        days.push(day);
      }
      day.classes.push(session);
    });

    return { days };
  }

  async fetchScud(dateFrom: string = '01.09.2025', dateTo: string = '31.01.2026'): Promise<string> {
    const body = new URLSearchParams();
    body.append('action', 'setvisitsparams');
    body.append('visits_passdate_from', dateFrom);
    body.append('visits_passdate_to', dateTo);

    // The user said this is on ?page=personal
    const response = await this.fetchWithAuth(`${this.baseUrl}/iss/lks/index.php?page=personal`, {
      body: body,
    });
    
    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder('windows-1251');
    return decoder.decode(buffer);
  }

  parseScud(html: string): ScudData {
    const $ = cheerio.load(html);
    const days: ScudDay[] = [];

    // Handle both .day_graph and .day_graph_last
    $('.day_graph, .day_graph_last').each((_, element) => {
      const dateTextRaw = $(element).find('.date_visit').text().trim(); // "09.10.2025, чт"
      const [datePart, weekdayPart] = dateTextRaw.replace(/\u00a0/g, ' ').split(',');
      
      if (!datePart) return;

      const [day, month, year] = datePart.trim().split('.');
      const date = `${year}-${month}-${day}`;

      const weekdayMap: Record<string, ScudDay['weekday']> = {
        'пн': 'monday', 'вт': 'tuesday', 'ср': 'wednesday', 'чт': 'thursday', 'пт': 'friday', 'сб': 'saturday', 'вс': 'sunday'
      };
      const weekday = weekdayMap[weekdayPart?.trim()] || 'monday';

      const sessions: ScudSession[] = [];
      let totalTimeSeconds = 0;

      // Iterate over all divs in peaces-container that have a title
      $(element).find('.peaces-container > div').each((_, piece) => {
        const title = $(piece).attr('title');
        if (!title) return;

        // Check for "Нет проходов"
        if (title.includes('Нет проходов')) return;

        // Format: "10:42:43 (корп.3: т.3) - 13:51:41 (корп.1: т.2) прод. 03:08:58"
        // Sometimes it might be partial? " - 10:42:43 (корп.3: т.3)" or "14:37:36 (корп.3: т.4) до 24:00:00"
        // The user provided HTML shows:
        // title=" - 10:42:43 (корп.3: т.3)" (Entry missing?) -> Actually this looks like "absent until X"
        // title="10:42:43 (корп.3: т.3) - 13:51:41 (корп.1: т.2) прод. 03:08:58" (Normal session)
        // title="14:37:36 (корп.3: т.4) до 24:00:00" (Open ended?)
        
        // We are interested in actual presence (p-g, p-lb2, etc? No, user said "p-g" is presence in buildings)
        // Legend says:
        // p-g: присутствие в учебных корпусах
        // p-lb2: присутствие в общежитиях
        // p-gr: отсутствие
        
        const isPresence = $(piece).hasClass('p-g') || $(piece).hasClass('p-lb2');
        if (!isPresence) return;

        const regex = /(\d{2}:\d{2}:\d{2}) \((.*?)\) - (\d{2}:\d{2}:\d{2}) \((.*?)\) прод\. (\d{2}:\d{2}:\d{2})/;
        const match = title.match(regex);

        if (match) {
          const [, entryTime, entryLoc, exitTime, exitLoc, duration] = match;
          
          const [durH, durM, durS] = duration.split(':').map(Number);
          const durationSeconds = durH * 3600 + durM * 60 + durS;
          totalTimeSeconds += durationSeconds;

          const parseLoc = (loc: string) => {
            const parts = loc.split(':');
            if (parts.length === 2) {
                return { building: parts[0].trim(), turnstile: parts[1].trim() };
            }
            return { building: loc, turnstile: '' };
          };

          sessions.push({
            entry_time: `${date}T${entryTime}`,
            exit_time: `${date}T${exitTime}`,
            duration_seconds: durationSeconds,
            entry: parseLoc(entryLoc),
            exit: parseLoc(exitLoc)
          });
        }
      });

      const noVisits = $(element).find('.date_visit').hasClass('day_off') || sessions.length === 0;

      days.push({
        date,
        weekday,
        total_time_seconds: totalTimeSeconds,
        sessions,
        no_visits: noVisits
      });
    });

    return { days };
  }

  parseStatements(html: string): StatementsData {
    const $ = cheerio.load(html);
    const allTab = $('.tab-list__item[href*="tab=all"] span').text();
    const match = allTab.match(/\((\d+)\)/);
    const total = match ? parseInt(match[1], 10) : 0;
    
    return {
      total,
      items: [] 
    };
  }

  parseMessages(html: string): MessagesData {
    const $ = cheerio.load(html);
    let scriptContent = '';
    
    // Find the script containing the dialogs data
    $('script').each((_, el) => {
      const content = $(el).html() || '';
      if (content.includes('window.lk_messenger.dialogs') && content.includes('data: [')) {
        scriptContent = content;
      }
    });

    if (!scriptContent) return { total_teacher_dialogs: 0 };

    // Extract the data array using bracket counting
    const dataMarker = 'data: [';
    const dataStartIndex = scriptContent.indexOf(dataMarker);
    
    if (dataStartIndex === -1) return { total_teacher_dialogs: 0 };

    const startBracketIndex = dataStartIndex + dataMarker.length - 1; // Index of '['
    let bracketCount = 1;
    let dataEndIndex = -1;
    let inString = false;
    
    for (let i = startBracketIndex + 1; i < scriptContent.length; i++) {
      const char = scriptContent[i];
      
      // Handle strings to ignore brackets inside them
      if (char === '"' && scriptContent[i-1] !== '\\') {
        inString = !inString;
        continue;
      }
      
      if (!inString) {
        if (char === '[') bracketCount++;
        if (char === ']') {
          bracketCount--;
          if (bracketCount === 0) {
            dataEndIndex = i + 1;
            break;
          }
        }
      }
    }

    if (dataEndIndex === -1) return { total_teacher_dialogs: 0 };

    const jsonString = scriptContent.substring(startBracketIndex, dataEndIndex);
    
    try {
      const dialogs = JSON.parse(jsonString);
      let teacherDialogs = 0;
      
      if (Array.isArray(dialogs)) {
        teacherDialogs = dialogs.filter((d: any) => {
          if (!d.comp_types || !Array.isArray(d.comp_types)) return false;
          return d.comp_types.some((ct: any) => 
            ct.comp_type_name && ct.comp_type_name.toLowerCase().includes('преподаватель')
          );
        }).length;
      }
      
      return { total_teacher_dialogs: teacherDialogs };
    } catch (e) {
      console.error('Failed to parse messages JSON', e);
      return { total_teacher_dialogs: 0 };
    }
  }

  parseProgress(html: string): ProgressData {
    const $ = cheerio.load(html);
    const subjects: ProgressSubject[] = [];
    
    let module1PassedCount = 0;
    let module1GradesSum = 0;
    let module1GradesCount = 0;
    
    let module2PassedCount = 0;
    let module2GradesSum = 0;
    let module2GradesCount = 0;
    
    let finalPassedCount = 0;
    let finalAverageGrade = 0; // Итоговый средний балл из строки sem_sum

    $('.progress_table tr').each((i, row) => {
      // Parse summary row to get final average grade
      if ($(row).hasClass('sem_sum')) {
        const cells = $(row).find('td');
        // Structure: colspan="3" (Итого), then 4 more cells with numbers
        // Look for numeric values in the row
        let finalAvg = 0;
        cells.each((idx, cell) => {
          const text = $(cell).text().trim();
          const num = parseFloat(text);
          // The last numeric value in sem_sum row should be the final average (usually around 3-5)
          if (!isNaN(num) && num > 0 && num <= 5 && idx > 0) {
            finalAvg = num; // Keep updating, last one will be the final average
          }
        });
        finalAverageGrade = finalAvg;
        return;
      }
      
      // Skip header rows, separators, and group names
      if ($(row).find('th').length > 0 || 
          $(row).hasClass('sem_separator') ||
          $(row).find('td.group_name').length > 0) return;
      
      const cells = $(row).find('td');
      if (cells.length < 9) return;

      // Structure: Semester, Subject, ControlType, Mod1Mark, Mod1Skips, Mod2Mark, Mod2Skips, FinalMark, Teacher
      const semester = parseInt($(cells[0]).text().trim()) || 1;
      const name = $(cells[1]).text().trim();
      const controlType = $(cells[2]).text().trim();
      const isExam = controlType.toLowerCase().includes('экзамен') || 
                     controlType.toLowerCase().includes('дифференцированный');
      
      // Parse Module 1
      const mod1Cell = $(cells[3]);
      const mod1Mark = mod1Cell.text().trim();
      const mod1Title = mod1Cell.find('span').attr('title') || '';
      const mod1Numeric = ['3', '4', '5'].includes(mod1Mark) ? parseInt(mod1Mark) : undefined;
      const mod1Passed = mod1Mark.toLowerCase() === 'з' || mod1Title === 'зачтено' || !!mod1Numeric;
      const mod1Skips = parseInt($(cells[4]).text().trim()) || 0;
      
      const module1 = {
        mark: mod1Mark,
        title: mod1Title,
        numericValue: mod1Numeric,
        isPassed: mod1Passed,
        skips: mod1Skips
      };
      
      // Parse Module 2
      const mod2Cell = $(cells[5]);
      const mod2Mark = mod2Cell.text().trim();
      const mod2Title = mod2Cell.find('span').attr('title') || '';
      const mod2Numeric = ['3', '4', '5'].includes(mod2Mark) ? parseInt(mod2Mark) : undefined;
      const mod2Passed = mod2Mark.toLowerCase() === 'з' || mod2Title === 'зачтено' || !!mod2Numeric;
      const mod2Skips = parseInt($(cells[6]).text().trim()) || 0;
      
      const module2 = {
        mark: mod2Mark,
        title: mod2Title,
        numericValue: mod2Numeric,
        isPassed: mod2Passed,
        skips: mod2Skips
      };
      
      // Parse Final Mark
      const finalCell = $(cells[7]);
      const finalMark = finalCell.text().trim();
      const finalTitle = finalMark;
      const finalNumeric = ['3', '4', '5'].includes(finalMark) ? parseInt(finalMark) : undefined;
      
      // Parse Teacher
      const teacher = $(cells[8]).text().trim();
      
      subjects.push({
        semester,
        name,
        controlType,
        isExam,
        module1,
        module2,
        finalMark,
        finalTitle,
        finalNumericValue: finalNumeric,
        teacher
      });
      
      // Calculate Module 1 stats
      if (mod1Passed) module1PassedCount++;
      if (mod1Numeric) {
        module1GradesSum += mod1Numeric;
        module1GradesCount++;
      }
      
      // Calculate Module 2 stats
      if (mod2Passed) module2PassedCount++;
      if (mod2Numeric) {
        module2GradesSum += mod2Numeric;
        module2GradesCount++;
      }
      
      // Calculate Final stats - count passed subjects
      const finalPassed = finalMark.toLowerCase().includes('зачтено') || 
                         finalMark.toLowerCase().includes('отлично') ||
                         finalMark.toLowerCase().includes('хорошо') ||
                         finalMark.toLowerCase().includes('удовлетворительно');
      if (finalPassed) finalPassedCount++;
    });

    return {
      subjects,
      module1Stats: {
        passedCount: module1PassedCount,
        averageGrade: module1GradesCount > 0 ? module1GradesSum / module1GradesCount : 0
      },
      module2Stats: {
        passedCount: module2PassedCount,
        averageGrade: module2GradesCount > 0 ? module2GradesSum / module2GradesCount : 0
      },
      finalStats: {
        passedCount: finalPassedCount,
        averageGrade: finalAverageGrade
      }
    };
  }

  // Placeholder for the full parsing logic
  async getAllData(): Promise<StudentData> {
    // 1. Fetch pages
    // 2. Parse HTML
    // 3. Construct StudentData object
    
    throw new Error("Not implemented");
  }
}

export const osuParser = new OsuParser();
