// salary-incentive-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FinancialService } from '../../../../../../core/services/financial.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { EmployeeService } from '../../../../../../core/services/employee.service';
import { SALARY_TRANSACTION_TYPES } from '../../../../../../core/models/financial.model';

@Component({
  selector: 'app-salary-incentive-list',
  template: `
    <div class="container"><div class="header"><h1>حوافز الموظفين</h1><button mat-raised-button color="primary" routerLink="/financial/salary-incentives/new"><mat-icon>add</mat-icon> حافز جديد</button></div>
    <mat-card><div class="filters"><mat-form-field appearance="outline"><mat-label>بحث</mat-label><input matInput (keyup)="applyFilter($event)" placeholder="بحث"></mat-form-field>
    <mat-form-field appearance="outline"><mat-label>النوع</mat-label><mat-select (selectionChange)="filterByType($event.value)"><mat-option>الكل</mat-option><mat-option *ngFor="let t of transactionTypes" [value]="t.id">{{ t.title }}</mat-option></mat-select></mat-form-field></div>
    <div class="table-container"><table mat-table [dataSource]="dataSource" matSort><ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>#</th><td mat-cell *matCellDef="let i">{{ i.id }}<\/td><\/ng-container>
    <ng-container matColumnDef="employee"><th mat-header-cell *matHeaderCellDef>الموظف</th><td mat-cell *matCellDef="let i">{{ i.employee?.title }}<\/td><\/ng-container>
    <ng-container matColumnDef="type"><th mat-header-cell *matHeaderCellDef>النوع</th><td mat-cell *matCellDef="let i">{{ i.type?.title }}<\/td><\/ng-container>
    <ng-container matColumnDef="amount"><th mat-header-cell *matHeaderCellDef>المبلغ</th><td mat-cell *matCellDef="let i">{{ i.amountWithdrawn | currency:'SAR ' }}<\/td><\/ng-container>
    <ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>التاريخ</th><td mat-cell *matCellDef="let i">{{ i.withdrawDate | date }}<\/td><\/ng-container>
    <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>الإجراءات</th><td mat-cell *matCellDef="let i"><button mat-icon-button color="primary" [routerLink]="['/financial/salary-incentives', i.id, 'edit']"><mat-icon>edit</mat-icon><\/button><button mat-icon-button color="warn" (click)="deleteItem(i)"><mat-icon>delete</mat-icon><\/button><\/td><\/ng-container>
    <tr mat-header-row *matHeaderRowDef="displayedColumns"><\/tr><tr mat-row *matRowDef="let row; columns: displayedColumns;"><\/tr><\/table><mat-paginator [pageSize]="10"><\/mat-paginator><\/div><\/mat-card><\/div>
  `,
  styles: [`.container { padding: 24px; } .header { display: flex; justify-content: space-between; margin-bottom: 24px; } .filters { display: flex; gap: 16px; margin-bottom: 20px; } .filters mat-form-field { flex: 1; } .table-container { overflow-x: auto; }`]
})
export class SalaryIncentiveListComponent implements OnInit {
  displayedColumns = ['id', 'employee', 'type', 'amount', 'date', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  transactionTypes = SALARY_TRANSACTION_TYPES;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private financialService: FinancialService, private notification: NotificationService) {}

  ngOnInit() { this.loadData(); }
  loadData() { this.financialService.getAllSalaryIncentivesByFilter().subscribe({ next: (res: any) => { this.dataSource.data = res.items; this.dataSource.paginator = this.paginator; }, error: () => this.notification.showError('حدث خطأ') }); }
  applyFilter(event: Event) { this.dataSource.filter = (event.target as HTMLInputElement).value; }
  filterByType(typeId: number) { this.financialService.getAllSalaryIncentivesByFilter({ type: typeId }).subscribe((res: any) => this.dataSource.data = res.items); }
  deleteItem(item: any) { if (confirm('هل أنت متأكد؟')) this.financialService.deleteSalaryIncentive(item.id).subscribe({ next: () => { this.notification.showSuccess('تم الحذف'); this.loadData(); }, error: () => this.notification.showError('حدث خطأ') }); }
}