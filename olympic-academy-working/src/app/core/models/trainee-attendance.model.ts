export interface TraineeAttendanceStatus {
  id: number;
  code: string;
  arabicLabel: string;
  title: string;
}

export const TRAINEE_ATTENDANCE_STATUSES: TraineeAttendanceStatus[] = [
  { id: 1, code: 'PRESENT', arabicLabel: 'حاضر', title: 'حاضر' },
  { id: 2, code: 'ABSENT', arabicLabel: 'غائب', title: 'غائب' },
  { id: 3, code: 'LATE', arabicLabel: 'متأخر', title: 'متأخر' },
  { id: 4, code: 'EXCUSED', arabicLabel: 'معذور', title: 'معذور' }
];

export interface TraineeAttendanceDTO {
  courseSessionId: number;
  traineeId: number;
  status: TraineeAttendanceStatus;
  attendanceDate?: string;
  checkInTime?: string;
  checkOutTime?: string;
  lateTime?: number;
  note?: string;
}

export interface TraineeAttendanceVTO {
  id: number;
  trainee: { id: number; title: string };
  session: { id: number; title: string };
  course: { id: number; title: string };
  status: TraineeAttendanceStatus;
  attendanceDate: string;
  checkInTime?: string;
  checkOutTime?: string;
  lateTime?: number;
  note?: string;
  createdOn: string;
  createdBy: { id: number; fullName: string };
}

export interface TraineeAttendanceListItem {
  id: number;
  traineeName: string;
  sessionTitle: string;
  courseTitle: string;
  sessionDate: string;
  status: TraineeAttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  lateTime?: number;
}

export interface TraineeAttendanceResultSet {
  total: number;
  items: TraineeAttendanceListItem[];
}

export interface DailyAttendanceReport {
  attendanceDate: string;
  totalNumber: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendanceRate: number;
  details: TraineeAttendanceListItem[];
}

export interface SessionAttendanceReport {
  sessionId: number;
  sessionTitle: string;
  sessionDate: string;
  totalTrainees: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendanceRate: number;
  details: TraineeAttendanceListItem[];
}