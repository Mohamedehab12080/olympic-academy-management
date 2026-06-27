import { LookupVTO, LightUserVTO, PaymentStatus } from './common.model';

// ==================== Enums (specific to Enrollment module) ====================

export interface EnrollmentStatus {
  id: number;
  title: string; // "قيد الانتظار", "مكتمل", "تم الإلغاء"
}

export const ENROLLMENT_STATUSES: EnrollmentStatus[] = [
  { id: 1, title: 'قيد الانتظار' },
  { id: 2, title: 'مكتمل' },
  { id: 3, title: 'تم الإلغاء' }
];

// ==================== DTOs (sent to backend - use enum objects with id and title) ====================

export interface EnrollmentTypeDTO {
  title: string;
  description?: string;
}

export interface EnrollmentDTO {
  traineeId: number;
  courseId: number;
  trainerId: number;
  enrollmentTypeId?: number;
  startDate: string;
  endDate?: string;
  enrollmentStatus?: EnrollmentStatus;  // { id: number; title: string }
  paymentStatus?: PaymentStatus;        // From common.model
  subscriptionValue?: number;
  discountAmount?: number;
  discountPercentage?: number;
  finalSubscriptionValue?: number;
  remainedSubscriptionValue?: number;
  isActive?:boolean;
  note?: string;
}

// ==================== VTOs (received from backend - use LookupVTO for enums) ====================

export interface EnrollmentTypeVTO {
  id: number;
  title: string;
  description?: string;
  createdOn: string;
  createdBy: LightUserVTO;
}

export interface EnrollmentVTO {
  id: number;
  trainee: LightUserVTO;
  course: LookupVTO;
  trainer: LookupVTO;
  enrollmentType?: LookupVTO;
  startDate: string;
  endDate?: string;
  enrollmentStatus: LookupVTO;   // { id: number; title: string; imageUrl: string | null }
  paymentStatus: LookupVTO;      // { id: number; title: string; imageUrl: string | null }
  subscriptionValue?: number;
  discountAmount?: number;
  discountPercentage?: number;
  finalSubscriptionValue?: number;
  remainedSubscriptionValue?: number;
  note?: string;
  isActive: boolean;
  createdOn: string;
  createdBy: LightUserVTO;
  lastModifiedOn?: string;
  lastModifiedBy?: LightUserVTO;
}

// ==================== Result Sets ====================

export interface EnrollmentResultSet {
  total: number;
  items: EnrollmentListItem[];
}

export interface EnrollmentListItem {
  id: number;
  trainee: LightUserVTO;
  course: LookupVTO;
  trainer: LookupVTO;
  startDate: string;
  endDate?: string;
  enrollmentStatus: LookupVTO;   // { id: number; title: string; imageUrl: string | null }
  paymentStatus: LookupVTO;      // { id: number; title: string; imageUrl: string | null }
  finalSubscriptionValue?: number;
  remainedSubscriptionValue?:number;
  isActive: boolean;
}

export interface EnrollmentTypeResultSet {
  total: number;
  items: EnrollmentTypeVTO[];
}