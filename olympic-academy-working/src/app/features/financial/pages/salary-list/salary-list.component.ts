import { Component, OnInit } from '@angular/core';
import { FinancialService } from '../../../../core/services/financial.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-salary-list',
  template: `<div class="financial-container"><h2>الرواتب والحوافز</h2><mat-tab-group><mat-tab label="حوافز"><div class="table-container"><table mat-table [dataSource]="incentives"><ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>#</th><td mat-cell *matCellDef="let i">{{ i.id }}</td></ng-container><ng-container matColumnDef="employee"><th mat-header-cell *matHeaderCellDef>الموظف</th><td mat-cell *matCellDef="let i">{{ i.employee?.title }}</td></ng-container><ng-container matColumnDef="type"><th mat-header-cell *matHeaderCellDef>النوع</th><td mat-cell *matCellDef="let i">{{ i.type?.title }}</td></ng-container><ng-container matColumnDef="amount"><th mat-header-cell *matHeaderCellDef>المبلغ</th><td mat-cell *matCellDef="let i">{{ i.amountWithdrawn | currency:'EGP' }}</td></ng-container><ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>التاريخ</th><td mat-cell *matCellDef="let i">{{ i.withdrawDate | date }}</td></ng-container><tr mat-header-row *matHeaderRowDef="salaryColumns"><tr><tr mat-row *matRowDef="let row; columns: salaryColumns;"></tr></table></div></mat-tab>
    <mat-tab label="خصومات"><div class="table-container"><table mat-table [dataSource]="deductions"><ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>#</th><td mat-cell *matCellDef="let d">{{ d.id }}</td></ng-container><ng-container matColumnDef="employee"><th mat-header-cell *matHeaderCellDef>الموظف</th><td mat-cell *matCellDef="let d">{{ d.employee?.title }}</td></ng-container><ng-container matColumnDef="amount"><th mat-header-cell *matHeaderCellDef>المبلغ</th><td mat-cell *matCellDef="let d">{{ d.amountDeducted | currency:'EGP' }}</td></ng-container><ng-container matColumnDef="reason"><th mat-header-cell *matHeaderCellDef>السبب</th><td mat-cell *matCellDef="let d">{{ d.reason || '-' }}</td></ng-container><tr mat-header-row *matHeaderRowDef="deductionColumns"></tr><tr mat-row *matRowDef="let row; columns: deductionColumns;"></tr></table></div></mat-tab></mat-tab-group></div>`,
  styles: [`.financial-container { padding: 24px; } .table-container { overflow-x: auto; margin-top: 20px; } table { width: 100%; }`]
})
export class SalaryListComponent implements OnInit {
  salaryColumns = ['id', 'employee', 'type', 'amount', 'date'];
  deductionColumns = ['id', 'employee', 'amount', 'reason'];
  incentives: any[] = [];
  deductions: any[] = [];
  constructor(private financialService: FinancialService, private notification: NotificationService) {}
  ngOnInit() {
    this.financialService.getAllSalaryIncentivesByFilter().subscribe({ next: (res: any) => this.incentives = res.items, error: () => this.notification.showError('حدث خطأ') });
    this.financialService.getAllSalaryDeductionsByFilter().subscribe({ next: (res: any) => this.deductions = res.items, error: () => this.notification.showError('حدث خطأ') });
  }
}