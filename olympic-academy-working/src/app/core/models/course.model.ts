import { LookupVTO, LightUserVTO } from './common.model';

// ==================== Enums (specific to Course module) ====================

export interface CourseType {
  id: number;
  title: string;     // Arabic title "تأهيل" أو "تدريب"
  value: string;     // Enum constant "QUALIFICATION" or "TRAINING"
}

export const COURSE_TYPES: CourseType[] = [
  { id: 1, title: 'تأهيل', value: 'QUALIFICATION' },
  { id: 2, title: 'تدريب', value: 'TRAINING' }
];

// ==================== DTOs (sent to backend - use string for enum) ====================

export interface CourseDTO {
  title: string;
  description?: string;
  departmentId: number;
  duration: number;
  maxCapacity?: number;
  startDate: string;
  endDate?: string;
  imageUrl?: string;
  courseType: CourseType;  // Send enum constant: "QUALIFICATION" or "TRAINING"
  price: number;
  isActive: boolean;
  isPublic: boolean;
}

export interface CoursePatchDTO {
  courseIds: number[];
  duration?: number;
  maxCapacity?: number;
  startDate?: string;
  endDate?: string;
  price?: number;
  isActive?: boolean;
  isPublic?: boolean;
}


// ==================== VTOs (received from backend - use LookupVTO for enums) ====================

export interface CourseVTO {
  id: number;
  title: string;
  description?: string;
  department: LookupVTO;
  duration: number;
  maxCapacity?: number;
  startDate: string;
  endDate?: string;
  enrollmentsCount?:number;
  totalRevenue?:number;
  imageUrl?: string;
  courseType: LookupVTO;  // { id: number; title: string; imageUrl: string | null }
  price: number;
  isActive: boolean;
  isPublic: boolean;
  createdOn: string;
  createdBy: LightUserVTO;
  lastModifiedOn?: string;
  lastModifiedBy?: LightUserVTO;
}

// ==================== Result Sets ====================

export interface CourseResultSet {
  total: number;
  items: CourseVTO[];
}