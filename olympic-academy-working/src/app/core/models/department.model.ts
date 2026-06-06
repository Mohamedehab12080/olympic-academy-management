import { LightUserVTO } from './common.model';

export interface DepartmentDTO {
  title: string;
  description?: string;
}

export interface DepartmentVTO {
  id: number;
  title: string;
  description?: string;
  isActive: boolean;
  createdOn: string;
  createdBy: LightUserVTO;
  lastModifiedOn?: string;
  lastModifiedBy?: LightUserVTO;
}

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

export interface DepartmentResultSet {
  total: number;
  items: DepartmentListItem[];
}