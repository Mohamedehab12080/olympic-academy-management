import { LookupVTO, LightUserVTO, Gender, SalaryType, ContactType } from './common.model';

// أنواع الموظفين من Java Enum
export interface EmployeeType {
  id: number;
  title: string; // "مدرب" أو "مدير"
}

export const EMPLOYEE_TYPES: EmployeeType[] = [
  { id: 1, title: 'مدرب' },
  { id: 2, title: 'مدير' }
];

// حالة حضور الموظف من Java Enum
export interface EmployeeAttendanceStatus {
  id: number;
  title: string; // "حاضر", "غائب", "متأخر", "معتذر"
}

export const ATTENDANCE_STATUSES: EmployeeAttendanceStatus[] = [
  { id: 1, title: 'حاضر' },
  { id: 2, title: 'غائب' },
  { id: 3, title: 'متأخر' },
  { id: 4, title: 'معتذر' }
];

// حالة الجلسة من Java Enum
export interface SessionStatus {
  id: number;
  title: string; // "مجدول", "في تقدم", "مكتمل", "ملغي"
}

export const SESSION_STATUSES: SessionStatus[] = [
  { id: 1, title: 'مجدول' },
  { id: 2, title: 'في تقدم' },
  { id: 3, title: 'مكتمل' },
  { id: 4, title: 'ملغي' }
];

export interface EmployeeContactDTO {
  contactType: ContactType;
  contactValue: string;
}

export interface EmployeeDTO {
  fullName: string;
  nationalId: string;
  birthDate?: string;
  gender?: Gender;
  salary?: number;
  remainedSalary?: number;
  salaryType?: SalaryType;
  employeeType: EmployeeType;
  imageUrl?: string;
  hireDate?: string;
  departmentIds: number[];
  contacts: EmployeeContactDTO[];
}

export interface EmployeeAttendanceVTO {
  id: number;
  employee: LookupVTO;
  attendanceDate: string;
  status: EmployeeAttendanceStatus;
  checkInTime: string;
  checkOutTime?: string;
  lateTime?: number;
  note?: string;
  createdOn: string;
  createdBy: LightUserVTO;
  lastModifiedOn?: string;
  lastModifiedBy?: LightUserVTO;
}

export interface EmployeeAttendanceDTO {
  attendanceDate: string;
  status: EmployeeAttendanceStatus;
  checkInTime: string;
  checkOutTime?: string;
  lateTime?: number;
  note?: string;
}

export interface CourseSessionDTO {
  title: string;
  courseId: number;
  trainerId: number;
  placeId: number;
  sessionDate: string;
  startTime: string;
  endTime: string;
  status?: SessionStatus;
  note?: string;
}

export interface EmployeeVTO {
  id: number;
  fullName: string;
  nationalId: string;
  birthDate?: string;
  gender?: Gender;
  salary?: number;
  remainedSalary?: number;
  salaryType?: SalaryType;
  employeeType: EmployeeType;
  imageUrl?: string;
  hireDate?: string;
  isActive: boolean;
  departments: LookupVTO[];
  contacts: EmployeeContactVTO[];
  courses: LookupVTO[];
  sessions: CourseSessionVTO[];
  createdOn: string;
  createdBy: LightUserVTO;
  lastModifiedOn?: string;
  lastModifiedBy?: LightUserVTO;
}

export interface EmployeeContactVTO {
  id: number;
  contactType: ContactType;
  contactValue: string;
}

export interface CourseSessionVTO {
  id: number;
  title: string;
  course: LookupVTO;
  trainer: LookupVTO;
  place: LookupVTO;
  sessionDate: string;
  startTime: string;
  endTime: string;
  status: SessionStatus;
  note?: string;
  createdOn: string;
  createdBy: LightUserVTO;
  lastModifiedOn?: string;
  lastModifiedBy?: LightUserVTO;
}

export interface TrainerCourseVTO {
  id: number;
  course: LookupVTO;
  createdOn: string;
  createdBy: LightUserVTO;
}

export interface AssignCourseDTO {
  courseId: number;
}

export interface EmployeeResultSet {
  total: number;
  items: EmployeeListItem[];
}

export interface EmployeeListItem {
  id: number;
  fullName: string;
  nationalId: string;
  gender: Gender;
  employeeType: EmployeeType;
  hireDate: string;
  isActive: boolean;
  departments: LookupVTO[];
}

export interface EmployeeAttendanceResultSet {
  total: number;
  items: EmployeeAttendanceListItem[];
}

export interface EmployeeAttendanceListItem {
  id: number;
  employee: LightUserVTO;
  attendanceDate: string;
  status: EmployeeAttendanceStatus;
  checkInTime: string;
  checkOutTime?: string;
  lateTime?: number;
}

export interface DailyAttendanceReport {
  attendanceDate: string;
  totalEmployees: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendanceRate: number;
  details: EmployeeAttendanceListItem[];
}

export interface TrainerCourseResultSet {
  total: number;
  items: TrainerCourseVTO[];
}

export interface TrainerCourseAssignmentResultSet {
  total: number;
  items: TrainerCourseAssignmentVTO[];
}

export interface TrainerCourseAssignmentVTO {
  id: number;
  trainer: LookupVTO;
  course: LookupVTO;
  createdOn: string;
  createdBy: LightUserVTO;
}

export interface CourseSessionResultSet {
  total: number;
  items: CourseSessionVTO[];
}