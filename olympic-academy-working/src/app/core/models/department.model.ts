import { LightUserVTO } from './common.model';

// ==================== DTOs (sent to backend) ====================

export interface DepartmentDTO {
  title: string;
  description?: string;
}

// ==================== VTOs (received from backend) ====================

export interface DepartmentVTO {
  id: number;
  title: string;
  description?: string;
  isActive: boolean;
  totalCourses:number;
  totalGained:number;
  totalEnrollmentPayments:number;
  totalStudents:number;
  createdOn: string;
  createdBy: LightUserVTO;
  lastModifiedOn?: string;
  lastModifiedBy?: LightUserVTO;
}

// ==================== List Items (for result sets) ====================

export interface DepartmentListItem {
  id: number;
  title: string;
  description?: string;
  isActive: boolean;
  createdOn: string;
  createdBy: LightUserVTO;
  lastModifiedOn?: string;
  lastModifiedBy?: LightUserVTO;
}

// ==================== Result Sets ====================

export interface DepartmentResultSet {
  total: number;
  items: DepartmentListItem[];
}