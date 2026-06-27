import { LightUserVTO, LookupVTO } from '../../core/models/common.model';
import {CourseSessionVTO} from '../../core/models/employee.model';

// ==================== Enum for DTOs (sent to backend) - Trainee specific ====================

export interface TraineeAttendanceStatus {
  id: number;
  title: string;
}

export const TRAINEE_ATTENDANCE_STATUSES: TraineeAttendanceStatus[] = [
  { id: 1, title: 'حاضر' },
  { id: 2, title: 'غائب' },
  { id: 3, title: 'متأخر' },
  { id: 4, title: 'معذور' }
];

// ==================== DTOs (sent to backend - uses enum object with id and title) ====================

export interface TraineeAttendanceDTO {
  courseSessionId: number;
  traineeId: number;
  status: TraineeAttendanceStatus;  // { id: number; title: string }
  attendanceDate?: string;
  checkInTime?: string;
  checkOutTime?: string;
  lateTime?: number;
  note?: string;
}

// ==================== VTOs (received from backend - uses LookupVTO) ====================

export interface TraineeAttendanceVTO {
  id: number;
  trainee: LookupVTO;      // { id: number; title: string; imageUrl: string | null }
  session: CourseSessionVTO;      // { id: number; title: string; imageUrl: string | null }
  course: LookupVTO;       // { id: number; title: string; imageUrl: string | null }
  status: LookupVTO;       // { id: number; title: string; imageUrl: string | null }
  attendanceDate: string;
  checkInTime?: string;
  checkOutTime?: string;
  lateTime?: number;
  note?: string;
  createdOn: string;
  createdBy: { id: number; fullName: string };
  lastModifiedOn?: string;
  lastModifiedBy?: { id: number; fullName: string };
}

export interface TraineeAttendanceListItem {
  id: number;
  trainee: LightUserVTO;
  sessionTitle: string;
  courseTitle: string;
  sessionDate: string;
  attendanceDate:string;
  sessionDay: string;
  status: LookupVTO;       // { id: number; title: string; imageUrl: string | null }
  checkInTime?: string;
  checkOutTime?: string;
  lateTime?: number;
}

// ==================== Result Sets ====================

export interface TraineeAttendanceResultSet {
  total: number;
  items: TraineeAttendanceListItem[];
}

// ==================== Reports ====================

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