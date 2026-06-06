import { LookupVTO, LightUserVTO, PaymentStatus, SalaryType } from './common.model';

// حالة استرداد المبلغ من Java Enum
export interface RefundStatus {
  id: number;
  title: string; // "قيد الانتظار", "موافق", "مرفوض", "مكتمل"
}

export const REFUND_STATUSES: RefundStatus[] = [
  { id: 1, title: 'قيد الانتظار' },
  { id: 2, title: 'موافق' },
  { id: 3, title: 'مرفوض' },
  { id: 4, title: 'مكتمل' }
];

// نوع معاملة الراتب من Java Enum
export interface SalaryTransactionType {
  id: number;
  title: string; // "راتب", "حافز", "مكافأة", "سلفة"
}

export const SALARY_TRANSACTION_TYPES: SalaryTransactionType[] = [
  { id: 1, title: 'راتب' },
  { id: 2, title: 'حافز' },
  { id: 3, title: 'مكافأة' },
  { id: 4, title: 'سلفة' }
];

// نوع الخصم من Java Enum
export interface DeductionType {
  id: number;
  title: string; // "غياب", "تأخير"
}

export const DEDUCTION_TYPES: DeductionType[] = [
  { id: 1, title: 'غياب' },
  { id: 2, title: 'تأخير' }
];

export interface PaymentMethodDTO {
  title: string;
}

export interface PaymentMethodVTO {
  id: number;
  title: string;
}

export interface RentTypeDTO {
  title: string;
  description?: string;
}

export interface RentTypeVTO {
  id: number;
  title: string;
  description?: string;
  createdOn: string;
  createdBy: LightUserVTO;
}

export interface ExpenseTypeDTO {
  title: string;
  description?: string;
  isActive?: boolean;
}

export interface ExpenseTypeVTO {
  id: number;
  title: string;
  description?: string;
  isActive: boolean;
  createdOn: string;
  createdBy: LightUserVTO;
}

export interface PlaceRentPaymentDTO {
  placeId: number;
  rentAmount: number;
  payedAmount: number;
  remainedAmount?: number;
  rentTypeId?: number;
  paymentDate: string;
  paymentMethodId?: number;
}

export interface PlaceRentPaymentVTO {
  id: number;
  place: LookupVTO;
  rentAmount: number;
  payedAmount: number;
  remainedAmount: number;
  rentType: LookupVTO;
  paymentDate: string;
  paymentMethod: LookupVTO;
  createdOn: string;
  createdBy: LightUserVTO;
  lastModifiedOn?: string;
  lastModifiedBy?: LightUserVTO;
}

export interface ExpenseDTO {
  expenseDate: string;
  amountExpensed: number;
  paymentMethodId?: number;
  expenseTypeId: number;
  imagesUrls?: string[];
  note?: string;
}

export interface ExpenseVTO {
  id: number;
  expenseDate: string;
  amountExpensed: number;
  paymentMethod: LookupVTO;
  expenseType: LookupVTO;
  imagesUrls: string[];
  note?: string;
  createdOn: string;
  createdBy: LightUserVTO;
  lastModifiedOn?: string;
  lastModifiedBy?: LightUserVTO;
}

export interface EnrollmentPaymentDTO {
  enrollmentId: number;
  paymentDate: string;
  enrollmentValue?: number;
  paidAmount: number;
  remainedValue?: number;
  paymentMethodId?: number;
  imageUrl?: string;
  note?: string;
  paymentStatus?: PaymentStatus;
}

export interface EnrollmentPaymentVTO {
  id: number;
  enrollment: LookupVTO;
  paymentDate: string;
  enrollmentValue: number;
  paidAmount: number;
  remainedValue: number;
  paymentMethod: LookupVTO;
  imageUrl?: string;
  note?: string;
  paymentStatus: PaymentStatus;
  createdOn: string;
  createdBy: LightUserVTO;
  lastModifiedOn?: string;
  lastModifiedBy?: LightUserVTO;
}

export interface EnrollmentRefundDTO {
  enrollmentId: number;
  refundDate: string;
  amountRefunded: number;
  paymentMethodId?: number;
  imageUrl?: string;
  note?: string;
  status?: RefundStatus;
}

export interface EnrollmentRefundVTO {
  id: number;
  enrollment: LookupVTO;
  refundDate: string;
  amountRefunded: number;
  paymentMethod: LookupVTO;
  imageUrl?: string;
  note?: string;
  status: RefundStatus;
  createdOn: string;
  createdBy: LightUserVTO;
  lastModifiedOn?: string;
  lastModifiedBy?: LightUserVTO;
}

export interface SalaryIncentiveDTO {
  employeeId: number;
  withdrawDate: string;
  amountWithdrawn: number;
  paymentMethodId?: number;
  imageUrl?: string;
  salaryType?: SalaryType;
  salaryTransactionType?: SalaryTransactionType;
  note?: string;
}

export interface SalaryIncentiveVTO {
  id: number;
  employee: LookupVTO;
  withdrawDate: string;
  amountWithdrawn: number;
  paymentMethod: LookupVTO;
  imageUrl?: string;
  type: SalaryTransactionType;
  note?: string;
  createdOn: string;
  createdBy: LightUserVTO;
  lastModifiedOn?: string;
  lastModifiedBy?: LightUserVTO;
}

export interface SalaryDeductionDTO {
  employeeId: number;
  deductionDate: string;
  amountDeducted: number;
  imageUrl?: string;
  reason?: string;
  salaryType?: SalaryType;
  note?: string;
}

export interface SalaryDeductionVTO {
  id: number;
  employee: LookupVTO;
  deductionDate: string;
  amountDeducted: number;
  imageUrl?: string;
  reason?: string;
  salaryType: SalaryType;
  note?: string;
  createdOn: string;
  createdBy: LightUserVTO;
  lastModifiedOn?: string;
  lastModifiedBy?: LightUserVTO;
}

export interface PaymentMethodResultSet {
  total: number;
  items: PaymentMethodVTO[];
}

export interface RentTypeResultSet {
  total: number;
  items: RentTypeVTO[];
}

export interface ExpenseTypeResultSet {
  total: number;
  items: ExpenseTypeVTO[];
}

export interface PlaceRentPaymentResultSet {
  total: number;
  items: PlaceRentPaymentVTO[];
}

export interface ExpenseResultSet {
  total: number;
  items: ExpenseVTO[];
}

export interface EnrollmentPaymentResultSet {
  total: number;
  items: EnrollmentPaymentVTO[];
}

export interface EnrollmentRefundResultSet {
  total: number;
  items: EnrollmentRefundVTO[];
}

export interface SalaryIncentiveResultSet {
  total: number;
  items: SalaryIncentiveVTO[];
}

export interface SalaryDeductionResultSet {
  total: number;
  items: SalaryDeductionVTO[];
}