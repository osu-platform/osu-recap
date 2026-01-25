export interface StudentProfile {
  group: string;
  institute: string;
  course: number;
  education_form: string;
  curator: string;
  headman: string;
  student_book_number: string;
}

export interface Period {
  from: string;
  to: string;
}

export interface ScudSession {
  entry_time: string;
  exit_time: string;
  duration_seconds: number;
  entry: {
    building: string;
    turnstile: string;
  };
  exit: {
    building: string;
    turnstile: string;
  };
}

export interface ScudDay {
  date: string;
  weekday: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  total_time_seconds: number;
  sessions: ScudSession[];
  no_visits: boolean;
}

export interface ScudData {
  days: ScudDay[];
}

export interface ClassAttendance {
  status: 'present' | 'absent' | 'partial';
  presence_time_seconds: number;
  raw_intervals: string[]; // Extracted from tooltips
}

export interface ClassSession {
  pair_number: number;
  time_start: string;
  time_end: string;
  subject: string;
  type: 'lecture' | 'practice' | 'lab' | 'exam' | 'other';
  subgroup?: string;
  room?: string;
  teacher?: string;
  attendance: ClassAttendance;
}
  attendance: ClassAttendance;
}

export interface AttendanceDay {
  date: string;
  classes: ClassSession[];
}

export interface AttendanceData {
  days: AttendanceDay[];
}

export interface StatementItem {
  id: number;
  type: string;
  submitted_at: string;
  status: string;
}

export interface StatementsData {
  total: number;
  items: StatementItem[];
}

export interface MessagesData {
  total_teacher_dialogs: number;
}

export interface ModuleGrade {
  mark: string; // "з", "н/з", "3", "4", "5"
  title: string; // "зачтено", "не зачтено", "удовлетворительно", "хорошо", "отлично"
  numericValue?: number; // Numeric value if applicable (3, 4, 5)
  isPassed: boolean;
  skips: number;
}

export interface ProgressSubject {
  semester: number;
  name: string;
  controlType: string;
  isExam: boolean; // true if экзамен or дифференцированный зачет
  module1: ModuleGrade;
  module2: ModuleGrade;
  finalMark: string;
  finalTitle: string;
  finalNumericValue?: number;
  teacher: string;
}

export interface ProgressData {
  subjects: ProgressSubject[];
  module1Stats: {
    passedCount: number; // Предметов сдано (зачтено или есть оценка)
    averageGrade: number; // Средний балл по предметам с оценкой
  };
  module2Stats: {
    passedCount: number; // Предметов сдано
    averageGrade: number;
  };
  finalStats: {
    passedCount: number; // Всего предметов сдано за семестр
    averageGrade: number; // Средний балл за семестр
  };
}

export interface StudentData {
  student: StudentProfile;
  period: Period;
  scud: ScudData;
  attendance: AttendanceData;
  statements: StatementsData;
  messages: MessagesData;
  progress: ProgressData;
}
