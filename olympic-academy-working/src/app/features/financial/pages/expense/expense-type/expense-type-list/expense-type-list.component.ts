import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FinancialService } from '../../../../../../core/services/financial.service';
import { NotificationService } from '../../../../../../core/services/notification.service';

@Component({
  selector: 'app-expense-type-list',
  standalone: false,
  template: `
    <div class="container">
      <div class="header">
        <h1>أنواع المصروفات</h1>
        <button mat-raised-button color="primary" routerLink="/financial/expense-types/new">
          <mat-icon>add</mat-icon> نوع مصروف جديد
        </button>
      </div>

      <mat-card>
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>بحث</mat-label>
          <input matInput (keyup)="applyFilter($event)" placeholder="ابحث عن نوع مصروف">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <div class="table-container">
          <table mat-table [dataSource]="dataSource" matSort>
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>#</th>
              <td mat-cell *matCellDef="let item">{{ item.id }}<\/td>
            <\/ng-container>

            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>الاسم</th>
              <td mat-cell *matCellDef="let item">{{ item.title }}<\/td>
            <\/ng-container>

            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>الوصف</th>
              <td mat-cell *matCellDef="let item">{{ item.description || '-' }}<\/td>
            <\/ng-container>

            <ng-container matColumnDef="isActive">
              <th mat-header-cell *matHeaderCellDef>الحالة</th>
              <td mat-cell *matCellDef="let item">
                <span class="badge" [class.active]="item.isActive">{{ item.isActive ? 'نشط' : 'غير نشط' }}<\/span>
              <\/td>
            <\/ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>الإجراءات</th>
              <td mat-cell *matCellDef="let item">
                <button mat-icon-button color="primary" [routerLink]="['/financial/expense-types', item.id, 'edit']">
                  <mat-icon>edit</mat-icon>
                <\/button>
                <button mat-icon-button color="warn" (click)="deleteItem(item)">
                  <mat-icon>delete</mat-icon>
                <\/button>
              <\/td>
            <\/ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"><\/tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"><\/tr>
          <\/table>
          <mat-paginator [pageSize]="10" [pageSizeOptions]="[5,10,25,50]"><\/mat-paginator>
        <\/div>
      <\/mat-card>
    <\/div>
  `,
  styles: [`
    .container { padding: 24px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .search-field { width: 100%; margin-bottom: 20px; }
    .table-container { overflow-x: auto; }
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; background: #fee2e2; color: #991b1b; }
    .badge.active { background: #d1fae5; color: #065f46; }
  `]
})
export class ExpenseTypeListComponent implements OnInit {
  displayedColumns = ['id', 'title', 'description', 'isActive', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private financialService: FinancialService,
    private notification: NotificationService
  ) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    this.financialService.getAllExpenseTypes().subscribe({
      next: (res: any) => { this.dataSource.data = res.items; this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; },
      error: () => { this.notification.showError('حدث خطأ في تحميل البيانات'); }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteItem(item: any) {
    if (confirm(`هل أنت متأكد من حذف "${item.title}"؟`)) {
      this.financialService.deleteExpenseType(item.id).subscribe({
        next: () => { this.notification.showSuccess('تم الحذف بنجاح'); this.loadData(); },
        error: () => { this.notification.showError('حدث خطأ في الحذف'); }
      });
    }
  }
}