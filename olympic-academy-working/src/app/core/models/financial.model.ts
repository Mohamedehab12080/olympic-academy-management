import { LookupVTO, LightUserVTO, PaymentStatus, SalaryType } from './common.model';
import { EmployeeVTO } from './employee.model';
import { EnrollmentVTO } from './enrollment.model';

// ==================== Enums (specific to Financial module) ====================

export interface RefundStatus {
  id: number;
  title: string;
}

export const REFUND_STATUSES: RefundStatus[] = [
  { id: 1, title: 'قيد الانتظار' },
  { id: 2, title: 'موافق عليه' },
  { id: 3, title: 'مرفوض' },
  { id: 4, title: 'مكتمل' }
];

export interface SalaryTransactionType {
  id: number;
  title: string;
}

export const SALARY_TRANSACTION_TYPES: SalaryTransactionType[] = [
  { id: 1, title: 'راتب' },
  { id: 2, title: 'حافز' },
  { id: 3, title: 'مكافأة' },
  { id: 4, title: 'سلفة' }
];

export interface DeductionType {
  id: number;
  title: string;
}

export const DEDUCTION_TYPES: DeductionType[] = [
  { id: 1, title: 'غياب' },
  { id: 2, title: 'تأخير' }
];

// ==================== DTOs (sent to backend - use enum objects with id and title) ====================

export interface PaymentMethodDTO {
  title: string;
}

export interface RentTypeDTO {
  title: string;
  description?: string;
  effect: boolean;
}

export interface ExpenseTypeDTO {
  title: string;
  description?: string;
  isActive?: boolean;
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

export interface ExpenseDTO {
  expenseDate: string;
  amountExpensed: number;
  paymentMethodId?: number;
  expenseTypeId: number;
  imagesUrls?: string[];
  note?: string;
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

export interface EnrollmentRefundDTO {
  enrollmentId: number;
  refundDate: string;
  amountRefunded: number;
  paymentMethodId?: number;
  imageUrl?: string;
  note?: string;
  status?: RefundStatus;
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

export interface SalaryDeductionDTO {
  employeeId: number;
  deductionDate: string;
  amountDeducted: number;
  imageUrl?: string;
  reason?: string;
  salaryType?: SalaryType;
  note?: string;
}

// ==================== VTOs (received from backend - use LookupVTO for enums) ====================

export interface PaymentMethodVTO {
  id: number;
  title: string;
}

export interface RentTypeVTO {
  id: number;
  title: string;
  effect: boolean;
  description?: string;
  createdOn: string;
  createdBy: LightUserVTO;
}

export interface ExpenseTypeVTO {
  id: number;
  title: string;
  description?: string;
  isActive: boolean;
  createdOn: string;
  createdBy: LightUserVTO;
}

export interface PlaceRentPaymentVTO {
  id: number;
  place: LookupVTO;
  rentAmount: number;
  payedAmount: number;
  remainedAmount: number;
  rentType: RentTypeVTO;
  paymentDate: string;
  paymentMethod: LookupVTO;
  createdOn: string;
  createdBy: LightUserVTO;
  lastModifiedOn?: string;
  lastModifiedBy?: LightUserVTO;
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

export interface EnrollmentPaymentVTO {
  id: number;
  enrollment: EnrollmentVTO;
  paymentDate: string;
  enrollmentValue: number;
  paidAmount: number;
  remainedValue: number;
  paymentMethod: LookupVTO;
  imageUrl?: string;
  note?: string;
  paymentStatus: LookupVTO;
  createdOn: string;
  createdBy: LightUserVTO;
  lastModifiedOn?: string;
  lastModifiedBy?: LightUserVTO;
}

export interface EnrollmentRefundVTO {
  id: number;
  enrollment: EnrollmentVTO;
  refundDate: string;
  amountRefunded: number;
  paymentMethod: LookupVTO;
  imageUrl?: string;
  note?: string;
  refundStatus: LookupVTO;
  createdOn: string;
  createdBy: LightUserVTO;
  lastModifiedOn?: string;
  lastModifiedBy?: LightUserVTO;
}

export interface SalaryIncentiveVTO {
  id: number;
  employee: EmployeeVTO;
  withdrawDate: string;
  amountWithdrawn: number;
  paymentMethod: LookupVTO;
  imageUrl?: string;
  salaryType: LookupVTO;
  salaryTransactionType: LookupVTO;
  note?: string;
  createdOn: string;
  createdBy: LightUserVTO;
  lastModifiedOn?: string;
  lastModifiedBy?: LightUserVTO;
}

export interface SalaryDeductionVTO {
  id: number;
  employee: EmployeeVTO;
  deductionDate: string;
  amountDeducted: number;
  imageUrl?: string;
  reason?: string;
  salaryType: LookupVTO;
  note?: string;
  createdOn: string;
  createdBy: LightUserVTO;
  lastModifiedOn?: string;
  lastModifiedBy?: LightUserVTO;
}

// ==================== Financial Totals VTO ====================

export interface FinancialTotalVTO {
  totalSalary: number;
  totalAdvance: number;
  totalIncentives: number;
  totalPlacesRent: number;
  totalPlacesGained: number;
  totalEnrollmentPayments: number;
  totalEnrollmentRefunds: number;
  totalExpenses: number;
  activeEnrollmentsCount: number;
  activeCoursesCount: number;
  activeTraineesCount: number;
  activeEmployeesCount: number;
  inactiveEnrollmentsCount: number;
  inactiveCoursesCount: number;
  inactiveTraineesCount: number;
  inactiveEmployeesCount: number;
}

// ==================== Result Sets ====================

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