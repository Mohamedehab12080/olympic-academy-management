import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FinancialService } from '../../../../../../core/services/financial.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { REFUND_STATUSES } from '../../../../../../core/models/financial.model';

@Component({
  selector: 'app-enrollment-refund-list',
  standalone: false,
  template: `
    <div class="container">
      <div class="header">
        <h1>استردادات التسجيلات</h1>
        <button mat-raised-button color="primary" routerLink="/financial/enrollment-refunds/new">
          <mat-icon>add</mat-icon> استرداد جديد
        </button>
      </div>

      <mat-card>
        <div class="filters">
          <mat-form-field appearance="outline"><mat-label>بحث</mat-label><input matInput (keyup)="applyFilter($event)" placeholder="بحث"><\/mat-form-field>
          <mat-form-field appearance="outline"><mat-label>حالة الاسترداد</mat-label><mat-select (selectionChange)="filterByStatus($event.value)"><mat-option>الكل</mat-option><mat-option *ngFor="let s of refundStatuses" [value]="s.id">{{ s.title }}</mat-option><\/mat-select><\/mat-form-field>
        <\/div>

        <div class="table-container">
          <table mat-table [dataSource]="dataSource" matSort>
            <ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>#</th><td mat-cell *matCellDef="let r">{{ r.id }}<\/td><\/ng-container>
            <ng-container matColumnDef="enrollment"><th mat-header-cell *matHeaderCellDef>التسجيل</th><td mat-cell *matCellDef="let r">{{ r.enrollment?.title }}<\/td><\/ng-container>
            <ng-container matColumnDef="amountRefunded"><th mat-header-cell *matHeaderCellDef>المبلغ المسترد</th><td mat-cell *matCellDef="let r">{{ r.amountRefunded | currency:'SAR ' }}<\/td><\/ng-container>
            <ng-container matColumnDef="refundDate"><th mat-header-cell *matHeaderCellDef>تاريخ الاسترداد</th><td mat-cell *matCellDef="let r">{{ r.refundDate | date }}<\/td><\/ng-container>
            <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>الحالة</th><td mat-cell *matCellDef="let r"><span class="badge" [class.approved]="r.status?.id === 2" [class.pending]="r.status?.id === 1" [class.completed]="r.status?.id === 4">{{ r.status?.title }}<\/span><\/td><\/ng-container>
            <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>الإجراءات</th><td mat-cell *matCellDef="let r"><button mat-icon-button color="primary" [routerLink]="['/financial/enrollment-refunds', r.id, 'edit']"><mat-icon>edit</mat-icon><\/button><button mat-icon-button color="warn" (click)="deleteItem(r)"><mat-icon>delete</mat-icon><\/button><\/td><\/ng-container>
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
    .badge.approved { background: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
    .badge.pending { background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
    .badge.completed { background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
    .table-container { overflow-x: auto; }
  `]
})
export class EnrollmentRefundListComponent implements OnInit {
  displayedColumns = ['id', 'enrollment', 'amountRefunded', 'refundDate', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  refundStatuses = REFUND_STATUSES;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private financialService: FinancialService, private notification: NotificationService) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    this.financialService.getAllEnrollmentRefundsByFilter().subscribe({
      next: (res: any) => { this.dataSource.data = res.items; this.dataSource.paginator = this.paginator; },
      error: () => this.notification.showError('حدث خطأ')
    });
  }

  applyFilter(event: Event) { this.dataSource.filter = (event.target as HTMLInputElement).value; }
  filterByStatus(statusId: number) { this.financialService.getAllEnrollmentRefundsByFilter({ status: statusId }).subscribe((res: any) => this.dataSource.data = res.items); }

  deleteItem(item: any) {
    if (confirm('هل أنت متأكد من حذف هذا الاسترداد؟')) {
      this.financialService.deleteEnrollmentRefund(item.id).subscribe({
        next: () => { this.notification.showSuccess('تم الحذف'); this.loadData(); },
        error: () => this.notification.showError('حدث خطأ')
      });
    }
  }
}