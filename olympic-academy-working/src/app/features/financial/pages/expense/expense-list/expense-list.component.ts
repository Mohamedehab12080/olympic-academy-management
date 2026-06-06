import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FinancialService } from '../../../../../core/services/financial.service';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-expense-list',
  standalone: false,
  template: `
    <div class="container">
      <div class="header">
        <h1>المصروفات</h1>
        <button mat-raised-button color="primary" routerLink="/financial/expenses/new">
          <mat-icon>add</mat-icon> مصروف جديد
        </button>
      </div>
      <mat-card>
        <div class="filters">
          <mat-form-field appearance="outline"><mat-label>بحث</mat-label><input matInput (keyup)="applyFilter($event)" placeholder="بحث"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>نوع المصروف</mat-label><mat-select (selectionChange)="filterByType($event.value)"><mat-option>الكل</mat-option><mat-option *ngFor="let t of expenseTypes" [value]="t.id">{{ t.title }}</mat-option></mat-select></mat-form-field>
        </div>
        <div class="table-container">
          <table mat-table [dataSource]="dataSource" matSort>
            <ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>#</th><td mat-cell *matCellDef="let e">{{ e.id }}<\/td><\/ng-container>
            <ng-container matColumnDef="expenseType"><th mat-header-cell *matHeaderCellDef>النوع</th><td mat-cell *matCellDef="let e">{{ e.expenseType?.title }}<\/td><\/ng-container>
            <ng-container matColumnDef="amountExpensed"><th mat-header-cell *matHeaderCellDef>المبلغ</th><td mat-cell *matCellDef="let e">{{ e.amountExpensed | currency:'SAR ' }}<\/td><\/ng-container>
            <ng-container matColumnDef="expenseDate"><th mat-header-cell *matHeaderCellDef>التاريخ</th><td mat-cell *matCellDef="let e">{{ e.expenseDate | date }}<\/td><\/ng-container>
            <ng-container matColumnDef="paymentMethod"><th mat-header-cell *matHeaderCellDef>طريقة الدفع</th><td mat-cell *matCellDef="let e">{{ e.paymentMethod?.title }}<\/td><\/ng-container>
            <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>الإجراءات</th><td mat-cell *matCellDef="let e"><button mat-icon-button color="primary" [routerLink]="['/financial/expenses', e.id, 'edit']"><mat-icon>edit</mat-icon><\/button><button mat-icon-button color="warn" (click)="deleteItem(e)"><mat-icon>delete</mat-icon><\/button><\/td><\/ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"><\/tr><tr mat-row *matRowDef="let row; columns: displayedColumns;"><\/tr>
          <\/table>
          <mat-paginator [pageSize]="10"><\/mat-paginator>
        <\/div>
      <\/mat-card>
    <\/div>
  `,
  styles: [`
    .container { padding: 24px; }
    .header { display: flex; justify-content: space-between; margin-bottom: 24px; }
    .filters { display: flex; gap: 16px; margin-bottom: 20px; }
    .filters mat-form-field { flex: 1; }
    .table-container { overflow-x: auto; }
  `]
})
export class ExpenseListComponent implements OnInit {
  displayedColumns = ['id', 'expenseType', 'amountExpensed', 'expenseDate', 'paymentMethod', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  expenseTypes: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private financialService: FinancialService, private notification: NotificationService) {}

  ngOnInit() {
    this.loadData();
    this.loadExpenseTypes();
  }

  loadData() {
    this.financialService.getAllExpensesByFilter().subscribe({
      next: (res: any) => { this.dataSource.data = res.items; this.dataSource.paginator = this.paginator; },
      error: () => this.notification.showError('حدث خطأ')
    });
  }

  loadExpenseTypes() { this.financialService.getAllExpenseTypesLookup().subscribe((res: any) => this.expenseTypes = res.list); }

  applyFilter(event: Event) { this.dataSource.filter = (event.target as HTMLInputElement).value; }
  filterByType(typeId: number) { this.financialService.getAllExpensesByFilter({ expenseTypeId: typeId }).subscribe((res: any) => this.dataSource.data = res.items); }

  deleteItem(item: any) {
    if (confirm(`هل أنت متأكد من حذف هذا المصروف؟`)) {
      this.financialService.deleteExpense(item.id).subscribe({
        next: () => { this.notification.showSuccess('تم الحذف'); this.loadData(); },
        error: () => this.notification.showError('حدث خطأ')
      });
    }
  }
}