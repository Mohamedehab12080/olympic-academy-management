import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  PaymentMethodDTO, PaymentMethodVTO, PaymentMethodResultSet,
  RentTypeDTO, RentTypeVTO, RentTypeResultSet,
  ExpenseTypeDTO, ExpenseTypeVTO, ExpenseTypeResultSet,
  PlaceRentPaymentDTO, PlaceRentPaymentVTO, PlaceRentPaymentResultSet,
  ExpenseDTO, ExpenseVTO, ExpenseResultSet,
  EnrollmentPaymentDTO, EnrollmentPaymentVTO, EnrollmentPaymentResultSet,
  EnrollmentRefundDTO, EnrollmentRefundVTO, EnrollmentRefundResultSet,
  SalaryIncentiveDTO, SalaryIncentiveVTO, SalaryIncentiveResultSet,
  SalaryDeductionDTO, SalaryDeductionVTO, SalaryDeductionResultSet
} from '../models/financial.model';
import { NewRecordVTO, LookupResultSet } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class FinancialService {
  constructor(private api: ApiService) {}

  // Payment Method
  createPaymentMethod(data: PaymentMethodDTO): Observable<NewRecordVTO> {
    return this.api.post('/payment-methods', data);
  }

  getAllPaymentMethods(params?: any): Observable<PaymentMethodResultSet> {
    return this.api.get('/payment-methods', params);
  }

  getPaymentMethodById(id: number): Observable<PaymentMethodVTO> {
    return this.api.get(`/payment-methods/${id}`);
  }

  updatePaymentMethod(id: number, data: PaymentMethodDTO): Observable<NewRecordVTO> {
    return this.api.put(`/payment-methods/${id}`, data);
  }

  deletePaymentMethod(id: number): Observable<void> {
    return this.api.delete(`/payment-methods/${id}`);
  }

  // Rent Type
  createRentType(data: RentTypeDTO): Observable<NewRecordVTO> {
    return this.api.post('/rent-types', data);
  }

  getAllRentTypes(params?: any): Observable<RentTypeResultSet> {
    return this.api.get('/rent-types', params);
  }

  getRentTypeById(id: number): Observable<RentTypeVTO> {
    return this.api.get(`/rent-types/${id}`);
  }

  updateRentType(id: number, data: RentTypeDTO): Observable<NewRecordVTO> {
    return this.api.put(`/rent-types/${id}`, data);
  }

  deleteRentType(id: number): Observable<void> {
    return this.api.delete(`/rent-types/${id}`);
  }

  // Expense Type
  createExpenseType(data: ExpenseTypeDTO): Observable<NewRecordVTO> {
    return this.api.post('/expense-types', data);
  }

  getAllExpenseTypes(params?: any): Observable<ExpenseTypeResultSet> {
    return this.api.get('/expense-types', params);
  }

  getExpenseTypeById(id: number): Observable<ExpenseTypeVTO> {
    return this.api.get(`/expense-types/${id}`);
  }

  updateExpenseType(id: number, data: ExpenseTypeDTO): Observable<NewRecordVTO> {
    return this.api.put(`/expense-types/${id}`, data);
  }

  deleteExpenseType(id: number): Observable<void> {
    return this.api.delete(`/expense-types/${id}`);
  }

  // Place Rent Payment
  createPlaceRentPayment(data: PlaceRentPaymentDTO): Observable<NewRecordVTO> {
    return this.api.post('/place-rent-payments', data);
  }

  getAllPlaceRentPaymentsByFilter(params?: any): Observable<PlaceRentPaymentResultSet> {
    return this.api.get('/place-rent-payments', params);
  }

  getPlaceRentPaymentById(id: number): Observable<PlaceRentPaymentVTO> {
    return this.api.get(`/place-rent-payments/${id}`);
  }

  updatePlaceRentPayment(id: number, data: PlaceRentPaymentDTO): Observable<NewRecordVTO> {
    return this.api.put(`/place-rent-payments/${id}`, data);
  }

  deletePlaceRentPayment(id: number): Observable<void> {
    return this.api.delete(`/place-rent-payments/${id}`);
  }

  // Expense
  createExpense(data: ExpenseDTO): Observable<NewRecordVTO> {
    return this.api.post('/expenses', data);
  }

  getAllExpensesByFilter(params?: any): Observable<ExpenseResultSet> {
    return this.api.get('/expenses', params);
  }

  getExpenseById(id: number): Observable<ExpenseVTO> {
    return this.api.get(`/expenses/${id}`);
  }

  updateExpense(id: number, data: ExpenseDTO): Observable<NewRecordVTO> {
    return this.api.put(`/expenses/${id}`, data);
  }

  deleteExpense(id: number): Observable<void> {
    return this.api.delete(`/expenses/${id}`);
  }

  // Enrollment Payment
  createEnrollmentPayment(data: EnrollmentPaymentDTO): Observable<NewRecordVTO> {
    return this.api.post('/enrollment-payments', data);
  }

  getAllEnrollmentPaymentsByFilter(params?: any): Observable<EnrollmentPaymentResultSet> {
    return this.api.get('/enrollment-payments', params);
  }

  getEnrollmentPaymentById(id: number): Observable<EnrollmentPaymentVTO> {
    return this.api.get(`/enrollment-payments/${id}`);
  }

  updateEnrollmentPayment(id: number, data: EnrollmentPaymentDTO): Observable<NewRecordVTO> {
    return this.api.put(`/enrollment-payments/${id}`, data);
  }

  deleteEnrollmentPayment(id: number): Observable<void> {
    return this.api.delete(`/enrollment-payments/${id}`);
  }

  // Enrollment Refund
  createEnrollmentRefund(data: EnrollmentRefundDTO): Observable<NewRecordVTO> {
    return this.api.post('/enrollment-refunds', data);
  }

  getAllEnrollmentRefundsByFilter(params?: any): Observable<EnrollmentRefundResultSet> {
    return this.api.get('/enrollment-refunds', params);
  }

  getEnrollmentRefundById(id: number): Observable<EnrollmentRefundVTO> {
    return this.api.get(`/enrollment-refunds/${id}`);
  }

  updateEnrollmentRefund(id: number, data: EnrollmentRefundDTO): Observable<NewRecordVTO> {
    return this.api.put(`/enrollment-refunds/${id}`, data);
  }

  deleteEnrollmentRefund(id: number): Observable<void> {
    return this.api.delete(`/enrollment-refunds/${id}`);
  }

  // Salary Incentive
  createSalaryIncentive(data: SalaryIncentiveDTO): Observable<NewRecordVTO> {
    return this.api.post('/salary-incentives', data);
  }

  getAllSalaryIncentivesByFilter(params?: any): Observable<SalaryIncentiveResultSet> {
    return this.api.get('/salary-incentives', params);
  }

  getSalaryIncentiveById(id: number): Observable<SalaryIncentiveVTO> {
    return this.api.get(`/salary-incentives/${id}`);
  }

  updateSalaryIncentive(id: number, data: SalaryIncentiveDTO): Observable<NewRecordVTO> {
    return this.api.put(`/salary-incentives/${id}`, data);
  }

  deleteSalaryIncentive(id: number): Observable<void> {
    return this.api.delete(`/salary-incentives/${id}`);
  }

  // Salary Deduction
  createSalaryDeduction(data: SalaryDeductionDTO): Observable<NewRecordVTO> {
    return this.api.post('/salary-deductions', data);
  }

  getAllSalaryDeductionsByFilter(params?: any): Observable<SalaryDeductionResultSet> {
    return this.api.get('/salary-deductions', params);
  }

  getSalaryDeductionById(id: number): Observable<SalaryDeductionVTO> {
    return this.api.get(`/salary-deductions/${id}`);
  }

  updateSalaryDeduction(id: number, data: SalaryDeductionDTO): Observable<NewRecordVTO> {
    return this.api.put(`/salary-deductions/${id}`, data);
  }

  deleteSalaryDeduction(id: number): Observable<void> {
    return this.api.delete(`/salary-deductions/${id}`);
  }

  // Lookup endpoints
  getAllPaymentMethodsLookup(): Observable<LookupResultSet> {
    return this.api.get('/lookup/payment-methods');
  }

  getAllRentTypesLookup(): Observable<LookupResultSet> {
    return this.api.get('/lookup/rent-types');
  }

  getAllExpenseTypesLookup(isActive?: boolean): Observable<LookupResultSet> {
    return this.api.get('/lookup/expense-types', { isActive });
  }

  getAllPaymentStatusLookup(): Observable<LookupResultSet> {
    return this.api.get('/lookup/payment-status');
  }

  getAllRefundStatusLookup(): Observable<LookupResultSet> {
    return this.api.get('/lookup/refund-status');
  }

  getAllSalaryTransactionTypesLookup(): Observable<LookupResultSet> {
    return this.api.get('/lookup/salary-transaction-types');
  }

  getAllSalaryTypesLookup(): Observable<LookupResultSet> {
    return this.api.get('/lookup/salary-types');
  }
}