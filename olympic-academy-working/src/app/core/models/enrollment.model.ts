import { LookupVTO, LightUserVTO, PaymentStatus } from './common.model';

// حالة التسجيل من Java Enum
export interface EnrollmentStatus {
  id: number;
  title: string; // "قيد الانتظار", "مكتمل", "تم الالغاء"
}

export const ENROLLMENT_STATUSES: EnrollmentStatus[] = [
  { id: 1, title: 'قيد الانتظار' },
  { id: 2, title: 'مكتمل' },
  { id: 3, title: 'تم الالغاء' }
];

export interface EnrollmentTypeDTO {
  title: string;
  description?: string;
}

export interface EnrollmentTypeVTO {
  id: number;
  title: string;
  description?: string;
  createdOn: string;
  createdBy: LightUserVTO;
}

export interface EnrollmentDTO {
  traineeId: number;
  courseId: number;
  trainerId: number;
  enrollmentTypeId?: number;
  startDate: string;
  endDate?: string;
  enrollmentStatus?: EnrollmentStatus;
  paymentStatus?: PaymentStatus;
  subscriptionValue?: number;
  discountAmount?: number;
  discountPercentage?: number;
  finalSubscriptionValue?: number;
  remainedSubscriptionValue?: number;
  note?: string;
}

export interface EnrollmentVTO {
  id: number;
  trainee: LookupVTO;
  course: LookupVTO;
  trainer: LookupVTO;
  enrollmentType?: LookupVTO;
  startDate: string;
  endDate?: string;
  enrollmentStatus: EnrollmentStatus;
  paymentStatus: PaymentStatus;
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

export interface EnrollmentResultSet {
  total: number;
  items: EnrollmentListItem[];
}

export interface EnrollmentListItem {
  id: number;
  trainee: LookupVTO;
  course: LookupVTO;
  trainer: LookupVTO;
  startDate: string;
  endDate?: string;
  enrollmentStatus: EnrollmentStatus;
  paymentStatus: PaymentStatus;
  finalSubscriptionValue?: number;
  isActive: boolean;
}

export interface EnrollmentTypeResultSet {
  total: number;
  items: EnrollmentTypeVTO[];
}