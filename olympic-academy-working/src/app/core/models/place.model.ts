import { LightUserVTO } from './common.model';

export interface PlaceDTO {
  title: string;
  rentValue?: number;
  remainedValue?: number;
  address?: string;
  phoneNumber?: string;
}

export interface PlaceVTO {
  id: number;
  title: string;
  rentValue?: number;
  remainedValue?: number;
  address?: string;
  phoneNumber?: string;
  createdOn: string;
  createdBy: LightUserVTO;
  lastModifiedOn?: string;
  lastModifiedBy?: LightUserVTO;
}

export interface PlaceResultSet {
  total: number;
  items: PlaceListItem[];
}

export interface PlaceListItem {
  id: number;
  title: string;
  rentValue?: number;
  remainedValue?: number;
  address?: string;
  phoneNumber?: string;
}