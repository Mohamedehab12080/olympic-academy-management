// core/models/file.model.ts

import { LightUserVTO, LookupVTO } from './common.model';

export interface UploadFileResponse {
  fid: string; // 15 or 18 digit unique file identifier
}

export interface FileVTO {
  id: number;
  fid: string; // 15 or 18-digit unique file identifier
  domain: LookupVTO;
  extension: string;
  lastVersion: number;
  createdOn: string;
  createdBy: LightUserVTO;
}

// Domain types for different modules (matches backend domain IDs)
export enum FileDomain {
  TRAINEE = 5002,
  EMPLOYEE = 4002,
  COURSE = 3,
  DEPARTMENT = 4,
  CERTIFICATE = 5003,
  ATTENDANCE = 6,
  FINANCIAL = 7
}

export const FileDomainMap: Record<FileDomain, string> = {
  [FileDomain.TRAINEE]: 'TRAINEE',
  [FileDomain.EMPLOYEE]: 'EMPLOYEE',
  [FileDomain.COURSE]: 'COURSE',
  [FileDomain.DEPARTMENT]: 'DEPARTMENT',
  [FileDomain.CERTIFICATE]: 'CERTIFICATE',
  [FileDomain.ATTENDANCE]: 'ATTENDANCE',
  [FileDomain.FINANCIAL]: 'FINANCIAL'
};