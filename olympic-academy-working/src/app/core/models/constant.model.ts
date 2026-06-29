// models/constant.model.ts
export interface ConstantDTO {
  title: string;
  value: string;
  location?: string;
  position?: string;
}

export interface ConstantListItem {
  id: number;
  title: string;
  value: string;
  location?: string;
  position?: string;
}

export interface ConstantVTO {
  id: number;
  title: string;
  value: string;
  location?: string;
  position?: string;
  createdOn: string;
  createdBy: {
    id: number;
    fullName?: string;
    nationalId?: string;
    title?: string;
    imageUrl?: string;
  };
}

export interface ConstantResultSet {
  total: number;
  items: ConstantListItem[];
}

export interface ConstantFilterParams {
  value?: string;
  location?: string;
  position?: string;
  quickSearch?: string;
  pageNum?: number;
  pageSize?: number;
  orderDir?: 'ASC' | 'DESC';
  orderBy?: string;
}

export function toConstantDTO(formData: any): ConstantDTO {
  return {
    title: formData.title,
    value: formData.value,
    location: formData.location || undefined,
    position: formData.position || undefined
  };
}