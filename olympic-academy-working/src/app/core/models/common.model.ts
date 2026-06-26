// ==================== الأنواع المعدودة (Enums) من Java الخلفي ====================

export interface Gender {
  id: number;
  title: string; // "ذكر" أو "انثي"
}

export const GENDERS: Gender[] = [
  { id: 1, title: 'ذكر' },
  { id: 2, title: 'انثي' }
];

export interface ContactType {
  id: number;
  title: string; // "ايميل" أو "هاتف"
}

export const CONTACT_TYPES: ContactType[] = [
  { id: 1, title: 'ايميل' },
  { id: 2, title: 'هاتف' }
];

export interface PaymentStatus {
  id: number;
  title: string; // "قيد الانتظار", "تم الدفع", "فشل", "تم استرداد المبلغ", "تم الالغاء", "جزئي"
}

export const PAYMENT_STATUSES: PaymentStatus[] = [
  { id: 1, title: 'قيد الانتظار' },
  { id: 2, title: 'تم الدفع' },
  { id: 3, title: 'فشل' },
  { id: 4, title: 'تم استرداد المبلغ' },
  { id: 5, title: 'تم الالغاء' },
  { id: 6, title: 'جزئي' }
];

export interface SalaryType {
  id: number;
  title: string; // "شهري", "بالساعة", "يومي", "نسبة"
}

export const SALARY_TYPES: SalaryType[] = [
  { id: 1, title: 'شهري' },
  { id: 2, title: 'بالساعة' },
  { id: 3, title: 'يومي' },
  { id: 4, title: 'نسبة' }
];

// ==================== القوالب المشتركة من Swagger ====================

export interface LookupVTO {
  id: number;
  title: string;
  imageUrl?: string;
}

export interface LookupResultSet {
  list: LookupVTO[];
  total: number;
}

export interface NewRecordVTO {
  id: number;
}

export interface CommonEnrollmentVTO {
  id: number;
  trainee: LookupVTO;
  course: LookupVTO;
  trainer: LookupVTO;
  enrollmentType?: LookupVTO;
  startDate: string;
  endDate?: string;
  enrollmentStatus: LookupVTO;   // { id: number; title: string; imageUrl: string | null }
  paymentStatus: LookupVTO;      // { id: number; title: string; imageUrl: string | null }
  subscriptionValue?: number;
  discountAmount?: number;
  discountPercentage?: number;
  finalSubscriptionValue?: number;
  remainedSubscriptionValue?: number;
  note?: string;
  isActive: boolean;
  createdOn: string;
}

export interface ErrorVTO {
  code: string;
  messageEn: string;
  reqBodyErrors: string[];
}

export interface LightUserVTO {
  id: number;
  nationalId:string;
  imageUrl:string;
  fullName: string; 
}

export interface RecordAttribute {
  attributeKey: string;
  attributeValue: string;
}