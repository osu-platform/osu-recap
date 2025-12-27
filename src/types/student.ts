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

export interface ProgressSubject {
  name: string;
  controlType: string;
  marks: number[]; // Numeric marks found (3, 4, 5)
  isPassed: boolean; // Has 'z' or positive mark
}

export interface ProgressData {
  subjects: ProgressSubject[];
  averageGrade: number;
  totalPassed: number;
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
