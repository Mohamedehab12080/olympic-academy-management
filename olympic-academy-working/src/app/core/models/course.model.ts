import { LookupVTO, LightUserVTO } from './common.model';

// نوع الدورة من Java Enum
export interface CourseType {
  id: number;
  title: string; // "تأهيل" أو "تدريب"
}

export const COURSE_TYPES: CourseType[] = [
  { id: 1, title: 'تأهيل' },
  { id: 2, title: 'تدريب' }
];

export interface CourseDTO {
  title: string;
  description?: string;
  departmentId: number;
  duration: number;
  maxCapacity?: number;
  startDate: string;
  endDate?: string;
  imageUrl?: string;
  courseType: CourseType;
  price: number;
}

export interface CourseVTO {
  id: number;
  title: string;
  description?: string;
  department: LookupVTO;
  duration: number;
  maxCapacity?: number;
  startDate: string;
  endDate?: string;
  imageUrl?: string;
  courseType: CourseType;
  price: number;
  isActive: boolean;
  createdOn: string;
  createdBy: LightUserVTO;
  lastModifiedOn?: string;
  lastModifiedBy?: LightUserVTO;
}

export interface CourseResultSet {
  total: number;
  items: CourseVTO[];
}