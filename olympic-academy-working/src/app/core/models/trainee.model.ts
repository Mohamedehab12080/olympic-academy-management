import { Gender, LightUserVTO, LookupVTO, ContactType } from './common.model';

export interface TraineeContactDTO {
  contactType: ContactType;
  contactValue: string;
}

export interface TraineeDTO {
  fullName: string;
  nationalId: string;
  academicYear?: string;
  birthDate?: string;
  gender?: Gender;
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

export interface TraineeVTO {
  id: number;
  fullName: string;
  nationalId: string;
  academicYear?: string;
  birthDate?: string;
  gender?: Gender;
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
  contactType: ContactType;
  contactValue: string;
}

export interface TraineeCertificateVTO {
  id: number;
  certificateNumber: string;
  certificateName: string;
  course: LookupVTO;
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
  gender: Gender;
}

export interface TraineeContactResultSet {
  total: number;
  items: TraineeContactListItem[];
}

export interface TraineeContactListItem {
  id: number;
  contactType: ContactType;
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