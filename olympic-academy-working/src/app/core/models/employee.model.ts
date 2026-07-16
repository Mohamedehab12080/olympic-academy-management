// employee.model.ts
import { LookupVTO, LightUserVTO, Gender, ContactType, SalaryType } from './../models/common.model';

// ==================== Enums (specific to Employee module) ====================

export interface EmployeeType {
  id: number;
  title: string; // "مدرب" أو "مدير"
}

export const EMPLOYEE_TYPES: EmployeeType[] = [
  { id: 1, title: 'مدرب' },
  { id: 2, title: 'مدير' },
  { id: 3, title: 'محاضر' }
];

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

// ==================== DTOs (sent to backend - use enum objects with id and title) ====================

export interface EmployeeContactDTO {
  contactType: ContactType;  // From common.model
  contactValue: string;
}

export interface EmployeeDTO {
  fullName: string;
  nationalId: string;
  birthDate?: string;
  gender?: Gender;  // From common.model
  salary?: number;
  isActive?:boolean;
  isMonthlyUpdated:boolean;
  updatePeriodInDays: number;
  remainedSalary?: number;
  salaryType?: SalaryType;  // From common.model
  employeeType: EmployeeType;
  imageUrl?: string;
  hireDate?: string;
  departmentIds: number[];
  contacts: EmployeeContactDTO[];
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
  trainersId: number[];
  placeId: number;
  sessionDate: string;
  sessionDays: string[];
  startTime: string;
  endTime: string;
  status?: SessionStatus;  // { id: number; title: string }
  note?: string;
}

// ==================== VTOs (received from backend - use LookupVTO for enums) ====================

export interface EmployeeLookupVTO {
  id: number;
  fullName: string;
  nationalId: string;
  salary?: number;
  remainedSalary?: number;
  salaryType?: LookupVTO;  // From common.model
  employeeType: LookupVTO;
  imageUrl?: string;
}

export interface EmployeeVTO {
  id: number;
  fullName: string;
  nationalId: string;
  birthDate?: string;
  gender?: LookupVTO;  // From common.model
  salary?: number;
  remainedSalary?: number;
  salaryType?: LookupVTO;  // From common.model
  employeeType: LookupVTO;
  imageUrl?: string;
  hireDate?: string;
  isActive: boolean;
  isMonthlyUpdated:boolean;
  updatePeriodInDays: number;
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
  contactType: LookupVTO;  // From common.model
  contactValue: string;
}

export interface EmployeeAttendanceVTO {
  id: number;
  employee: LookupVTO;
  attendanceDate: string;
  status: LookupVTO;
  checkInTime: string;
  checkOutTime?: string;
  lateTime?: number;
  note?: string;
  createdOn: string;
  createdBy: LightUserVTO;
  lastModifiedOn?: string;
  lastModifiedBy?: LightUserVTO;
}

export interface CourseSessionVTO {
  id:number;
  title: string;
  course: LookupVTO;
  trainers: LookupVTO[];
  place: LookupVTO;
  sessionDate: string;
  sessionDay: string;
  startTime: string;
  endTime: string;
  status: LookupVTO;  // SessionStatus as LookupVTO
  note?: string;
  createdOn: string;
  createdBy: LightUserVTO;
  lastModifiedOn?: string;
  lastModifiedBy?: LightUserVTO;
}

export interface CourseSessionLookupVTO {
  id:number;
  title: string;
  course: LookupVTO;
  trainer: EmployeeLookupVTO;
  place: LookupVTO;
  sessionDate: string;
  sessionDay: string;
  startTime: string;
  endTime: string;
  status: LookupVTO;  // SessionStatus as LookupVTO
  note?: string;
  createdOn: string;
  createdBy: LightUserVTO;
  lastModifiedOn?: string;
  lastModifiedBy?: LightUserVTO;
}

export interface TrainerCourseVTO {
  id: number;
  trainer:LookupVTO;
  course: LookupVTO;
  createdOn: string;
  createdBy: LightUserVTO;
}

// ==================== Trainer Department VTOs ====================

export interface TrainerDepartmentVTO {
  id: number;
  trainer: LookupVTO;
  department: LookupVTO;
  createdOn: string;
  createdBy: LightUserVTO;
}

export interface TrainerDepartmentResultSet {
  total: number;
  items: TrainerDepartmentVTO[];
}

// ==================== Result Sets ====================

export interface EmployeeResultSet {
  total: number;
  items: EmployeeListItem[];
}

export interface EmployeeListItem {
  id: number;
  fullName: string;
  nationalId: string;
  imageUrl: string;
  gender: LookupVTO;
  employeeType: LookupVTO;
  hireDate: string;
  isActive: boolean;
  isMonthlyUpdated:boolean;
  updatePeriodInDays: number;
  salary: number;
  remainedSalary: number;
}

export interface EmployeeAttendanceResultSet {
  total: number;
  items: EmployeeAttendanceListItem[];
}

export interface EmployeeAttendanceListItem {
  id: number;
  employee: LightUserVTO;
  attendanceDate: string;
  status: LookupVTO;
  checkInTime: string;
  checkOutTime?: string;
  lateTime?: number;
}

export interface TrainerCourseResultSet {
  total: number;
  items: TrainerCourseVTO[];
}

export interface CourseSessionResultSet {
  total: number;
  items: CourseSessionVTO[];
}

// ==================== Reports ====================

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

// ==================== DTOs for Assigning ====================

export interface AssignCourseDTO {
  courseIdToBeAdded: number[];
  courseIdToBeDeleted:number[];
}

export interface AssignDepartmentDTO {
  departmentId: number[];  
}
