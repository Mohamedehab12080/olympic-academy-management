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
  placeReport?:PlaceVTO;
  address?: string;
  phoneNumber?: string;
  createdOn: string;
  createdBy: LightUserVTO;
  lastModifiedOn?: string;
  lastModifiedBy?: LightUserVTO;
}

export interface PlaceVTO {
  totalPayed: number;
  totalGained:number;
}

export interface PlaceListItem {
  id: number;
  title: string;
  rentValue?: number;
  remainedValue?: number;
  address?: string;
  phoneNumber?: string;
}

export interface PlaceResultSet {
  total: number;
  items: PlaceListItem[];
}