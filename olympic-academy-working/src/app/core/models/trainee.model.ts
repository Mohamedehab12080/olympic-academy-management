// trainee.model.ts
import { LightUserVTO, LookupVTO, Gender, ContactType, CommonEnrollmentVTO } from './common.model';

// ==================== Enums (specific to Trainee module) ====================

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

// ==================== Academic Year Enum ====================

export interface AcademicYear {
  id: number;
  title: string;
}

export const ACADEMIC_YEARS: AcademicYear[] = [
  { id: 1, title: '1' },
  { id: 2, title: '2' },
  { id: 3, title: '3' },
  { id: 4, title: '4' }
];

// ==================== DTOs (sent to backend - use enum objects with id and title) ====================

export interface TraineeContactDTO {
  contactType: ContactType;  // From common.model
  contactValue: string;
}

export interface TraineeLookupVTO {
  id: number;
  title: string;
  nationalId: string;
  imageUrl: string;
}

export interface TraineeLookupResultSet {
  list: TraineeLookupVTO[];
  total: number;
}

export interface TraineeDTO {
  fullName: string;
  nationalId: string;
  academicYear?: AcademicYear;  // Changed from string to AcademicYear object
  birthDate?: string;
  isActive?: boolean;
  gender?: Gender;  // From common.model
  address?: string;
  imageUrl?: string;
  contacts: TraineeContactDTO[];
}

export interface TraineeCertificateDTO {
  certificateNumber?: string;
  certificateName: string;
  courseId: number;
  issueDate?: string;
  grade?: string;
}

export interface HealthConditionDTO {
  title: string;
  description?: string;
  medication?: string;
  note?: string;
}

// ==================== VTOs (received from backend - use LookupVTO for enums) ====================

export interface TraineeVTO {
  id: number;
  fullName: string;
  nationalId: string;
  academicYear?: LookupVTO;  // Changed from string to AcademicYear object
  birthDate?: string;
  gender?: LookupVTO;  // From common.model
  enrollments?: CommonEnrollmentVTO[];
  isActive: boolean;
  address?: string;
  imageUrl?: string;
  contacts: TraineeContactVTO[];
  certificates: TraineeCertificateVTO[];
  healthConditions: HealthConditionVTO[];
  createdOn: string;
  createdBy: LightUserVTO;
  lastModifiedOn?: string;
  lastModifiedBy?: LightUserVTO;
}

export interface TraineeContactVTO {
  id: number;
  contactType: LookupVTO;  // From common.model
  contactValue: string;
}

export interface TraineeCertificateVTO {
  id: number;
  certificateNumber: string;
  certificateName: string;
  course: LookupVTO;  // From common.model
  issueDate: string;
  grade: string;
}

export interface HealthConditionVTO {
  id: number;
  title: string;
  description?: string;
  medication?: string;
  note?: string;
}

// ==================== Result Sets ====================

export interface TraineeResultSet {
  total: number;
  items: TraineeListItem[];
}

export interface TraineeListItem {
  id: number;
  fullName: string;
  nationalId: string;
  isActive: boolean;
  academicYear: LookupVTO;  // Keep as string for display (the title from AcademicYear)
  imageUrl: string;
  gender: LookupVTO;  // From common.model
}

export interface TraineeContactResultSet {
  total: number;
  items: TraineeContactListItem[];
}

export interface TraineeContactListItem {
  id: number;
  contactType: LookupVTO;  // From common.model
  contactValue: string;
}

export interface TraineeCertificateResultSet {
  total: number;
  items: TraineeCertificateVTO[];
}

export interface HealthConditionResultSet {
  total: number;
  items: HealthConditionVTO[];
}