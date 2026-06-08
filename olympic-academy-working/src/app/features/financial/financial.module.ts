import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Angular Material Imports
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FinancialDashboardComponent } from './pages/financial-dashboard/financial-dashboard.component';

// ============================================
// Payment Method Components
// ============================================
import { PaymentMethodListComponent } from './pages/payment-method/payment-method-list/payment-method-list.component';
import { PaymentMethodFormComponent } from './pages/payment-method/payment-method-form/payment-method-form.component';

// ============================================
// Expense Type Components
// ============================================
import { ExpenseTypeListComponent } from './pages/expense/expense-type/expense-type-list/expense-type-list.component';
import { ExpenseTypeFormComponent } from './pages/expense/expense-type/expense-type-form/expense-type-form.component';

// ============================================
// Rent Type Components
// ============================================
import { RentTypeListComponent } from './pages/rent/rent-type/rent-type-list/rent-type-list.component';
import { RentTypeFormComponent } from './pages/rent/rent-type/rent-type-form/rent-type-form.component';

// ============================================
// Place Rent Payment Components
// ============================================
import { PlaceRentPaymentListComponent } from './pages/rent/place-rent-payment/place-rent-payment-list/place-rent-payment-list.component';
import { PlaceRentPaymentFormComponent } from './pages/rent/place-rent-payment/place-rent-payment-form/place-rent-payment-form.component';

// ============================================
// Expense Components
// ============================================
import { ExpenseListComponent } from './pages/expense/expense-list/expense-list.component';
import { ExpenseFormComponent } from './pages/expense/expense-form/expense-form.component';

// ============================================
// Enrollment Payment Components
// ============================================
import { EnrollmentPaymentListComponent } from './pages/enrollment/enrollment-payment/enrollment-payment-list/enrollment-payment-list.component';
import { EnrollmentPaymentFormComponent } from './pages/enrollment/enrollment-payment/enrollment-payment-form/enrollment-payment-form.component';

// ============================================
// Enrollment Refund Components
// ============================================
import { EnrollmentRefundListComponent } from './pages/enrollment/enrollment-refund/enrollment-refund-list/enrollment-refund-list.component';
import { EnrollmentRefundFormComponent } from './pages/enrollment/enrollment-refund/enrollment-refund-form/enrollment-refund-form.component';

// ============================================
// Salary Incentive Components
// ============================================
import { SalaryIncentiveListComponent } from './pages/salary/salary-incentive/salary-incentive-list/salary-incentive-list.component';
import { SalaryIncentiveFormComponent } from './pages/salary/salary-incentive/salary-incentive-form/salary-incentive-form.component';

// ============================================
// Salary Deduction Components (Standalone)
// ============================================
// import { SalaryDeductionListComponent } from './pages/salary/salary-deduction/salary-deduction-list/salary-deduction-list.component';
// import { SalaryDeductionFormComponent } from './pages/salary/salary-deduction/salary-deduction-form/salary-deduction-form.component';

// ============================================
// Financial Report Component (Standalone)
// ============================================
import { FinancialReportComponent } from './reports/financial-report/financial-report.component';

// ============================================
// Routes Configuration
// ============================================
const routes: Routes = [

  { path: '', component: FinancialDashboardComponent },

  // Payment Methods
  { path: 'payment-methods', component: PaymentMethodListComponent },
  { path: 'payment-methods/new', component: PaymentMethodFormComponent },
  { path: 'payment-methods/:id/edit', component: PaymentMethodFormComponent },

  // Expense Types
  { path: 'expense-types', component: ExpenseTypeListComponent },
  { path: 'expense-types/new', component: ExpenseTypeFormComponent },
  { path: 'expense-types/:id/edit', component: ExpenseTypeFormComponent },

  // Rent Types
  { path: 'rent-types', component: RentTypeListComponent },
  { path: 'rent-types/new', component: RentTypeFormComponent },
  { path: 'rent-types/:id/edit', component: RentTypeFormComponent },

  // Place Rent Payments
  { path: 'place-rent-payments', component: PlaceRentPaymentListComponent },
  { path: 'place-rent-payments/new', component: PlaceRentPaymentFormComponent },
  { path: 'place-rent-payments/:id/edit', component: PlaceRentPaymentFormComponent },

  // Expenses
  { path: 'expenses', component: ExpenseListComponent },
  { path: 'expenses/new', component: ExpenseFormComponent },
  { path: 'expenses/:id/edit', component: ExpenseFormComponent },

  // Enrollment Payments
  { path: 'enrollment-payments', component: EnrollmentPaymentListComponent },
  { path: 'enrollment-payments/new', component: EnrollmentPaymentFormComponent },
  { path: 'enrollment-payments/:id/edit', component: EnrollmentPaymentFormComponent },

  // Enrollment Refunds
  { path: 'enrollment-refunds', component: EnrollmentRefundListComponent },
  { path: 'enrollment-refunds/new', component: EnrollmentRefundFormComponent },
  { path: 'enrollment-refunds/:id/edit', component: EnrollmentRefundFormComponent },

  // Salary Incentives
  { path: 'salary-incentives', component: SalaryIncentiveListComponent },
  { path: 'salary-incentives/new', component: SalaryIncentiveFormComponent },
  { path: 'salary-incentives/:id/edit', component: SalaryIncentiveFormComponent },

  // Salary Deductions (Standalone Components - use loadComponent)
  { 
    path: 'salary-deductions', 
    loadComponent: () => import('./pages/salary/salary-deduction/salary-deduction-list/salary-deduction-list.component')
      .then(m => m.SalaryDeductionListComponent) 
  },
  { 
    path: 'salary-deductions/new', 
    loadComponent: () => import('./pages/salary/salary-deduction/salary-deduction-form/salary-deduction-form.component')
      .then(m => m.SalaryDeductionFormComponent) 
  },
  { 
    path: 'salary-deductions/:id/edit', 
    loadComponent: () => import('./pages/salary/salary-deduction/salary-deduction-form/salary-deduction-form.component')
      .then(m => m.SalaryDeductionFormComponent) 
  },

  // Financial Report
  { path: 'reports', component: FinancialReportComponent },
];

@NgModule({
  declarations: [
    FinancialDashboardComponent,

    // Payment Method
    PaymentMethodListComponent,
    PaymentMethodFormComponent,

    // Expense Type
    ExpenseTypeListComponent,
    ExpenseTypeFormComponent,

    // Rent Type
    RentTypeListComponent,
    RentTypeFormComponent,

    // Place Rent Payment
    PlaceRentPaymentListComponent,
    PlaceRentPaymentFormComponent,

    // Expense
    ExpenseListComponent,
    ExpenseFormComponent,

    // Enrollment Payment
    EnrollmentPaymentListComponent,
    EnrollmentPaymentFormComponent,

    // Enrollment Refund
    EnrollmentRefundListComponent,
    EnrollmentRefundFormComponent,

    // Salary Incentive Form (NOT standalone - keep in declarations)
    SalaryIncentiveFormComponent,

    // Financial Report - REMOVED (standalone)
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatTooltipModule,
    // Add ONLY standalone components here
    SalaryIncentiveListComponent,  // Standalone
    FinancialReportComponent        // Standalone
  ]
})
export class FinancialModule { }