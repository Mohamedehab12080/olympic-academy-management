import { LightUserVTO, LookupVTO, Gender, ContactType } from './common.model';

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

// ==================== DTOs (sent to backend - use enum objects with id and title) ====================

export interface TraineeContactDTO {
  contactType: ContactType;  // From common.model
  contactValue: string;
}

export interface TraineeDTO {
  fullName: string;
  nationalId: string;
  academicYear?: string;
  birthDate?: string;
  isActive?:boolean;
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
  academicYear?: string;
  birthDate?: string;
  gender?: LookupVTO;  // From common.model
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
  academicYear: string;
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