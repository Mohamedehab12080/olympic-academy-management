import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FinancialService } from '../../../../../../core/services/financial.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { PAYMENT_STATUSES } from '../../../../../../core/models/common.model';

@Component({
  selector: 'app-enrollment-payment-list',
  standalone: false,
  template: `
    <div class="container">
      <div class="header">
        <h1>مدفوعات التسجيلات</h1>
        <button mat-raised-button color="primary" routerLink="/financial/enrollment-payments/new">
          <mat-icon>add</mat-icon> دفعة جديدة
        </button>
      </div>

      <mat-card>
        <div class="filters">
          <mat-form-field appearance="outline"><mat-label>بحث</mat-label><input matInput (keyup)="applyFilter($event)" placeholder="بحث"><\/mat-form-field>
          <mat-form-field appearance="outline"><mat-label>حالة الدفع</mat-label><mat-select (selectionChange)="filterByStatus($event.value)"><mat-option>الكل</mat-option><mat-option *ngFor="let s of paymentStatuses" [value]="s.id">{{ s.title }}</mat-option><\/mat-select><\/mat-form-field>
        <\/div>

        <div class="table-container">
          <table mat-table [dataSource]="dataSource" matSort>
            <ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>#</th><td mat-cell *matCellDef="let p">{{ p.id }}<\/td><\/ng-container>
            <ng-container matColumnDef="enrollment"><th mat-header-cell *matHeaderCellDef>التسجيل</th><td mat-cell *matCellDef="let p">{{ p.enrollment?.title }}<\/td><\/ng-container>
            <ng-container matColumnDef="paidAmount"><th mat-header-cell *matHeaderCellDef>المبلغ المدفوع</th><td mat-cell *matCellDef="let p">{{ p.paidAmount | currency:'SAR ' }}<\/td><\/ng-container>
            <ng-container matColumnDef="remainedValue"><th mat-header-cell *matHeaderCellDef>المتبقي</th><td mat-cell *matCellDef="let p">{{ p.remainedValue | currency:'SAR ' }}<\/td><\/ng-container>
            <ng-container matColumnDef="paymentDate"><th mat-header-cell *matHeaderCellDef>تاريخ الدفع</th><td mat-cell *matCellDef="let p">{{ p.paymentDate | date }}<\/td><\/ng-container>
            <ng-container matColumnDef="paymentStatus"><th mat-header-cell *matHeaderCellDef>الحالة</th><td mat-cell *matCellDef="let p"><span class="badge" [class.paid]="p.paymentStatus?.id === 2" [class.pending]="p.paymentStatus?.id === 1">{{ p.paymentStatus?.title }}<\/span><\/td><\/ng-container>
            <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>الإجراءات</th><td mat-cell *matCellDef="let p"><button mat-icon-button color="primary" [routerLink]="['/financial/enrollment-payments', p.id, 'edit']"><mat-icon>edit</mat-icon><\/button><button mat-icon-button color="warn" (click)="deleteItem(p)"><mat-icon>delete</mat-icon><\/button><\/td><\/ng-container>
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
    .badge.paid { background: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
    .badge.pending { background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
    .table-container { overflow-x: auto; }
  `]
})
export class EnrollmentPaymentListComponent implements OnInit {
  displayedColumns = ['id', 'enrollment', 'paidAmount', 'remainedValue', 'paymentDate', 'paymentStatus', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  paymentStatuses = PAYMENT_STATUSES;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private financialService: FinancialService, private notification: NotificationService) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    this.financialService.getAllEnrollmentPaymentsByFilter().subscribe({
      next: (res: any) => { this.dataSource.data = res.items; this.dataSource.paginator = this.paginator; },
      error: () => this.notification.showError('حدث خطأ')
    });
  }

  applyFilter(event: Event) { this.dataSource.filter = (event.target as HTMLInputElement).value; }
  filterByStatus(statusId: number) { this.financialService.getAllEnrollmentPaymentsByFilter({ status: statusId }).subscribe((res: any) => this.dataSource.data = res.items); }

  deleteItem(item: any) {
    if (confirm('هل أنت متأكد من حذف هذه الدفعة؟')) {
      this.financialService.deleteEnrollmentPayment(item.id).subscribe({
        next: () => { this.notification.showSuccess('تم الحذف'); this.loadData(); },
        error: () => this.notification.showError('حدث خطأ')
      });
    }
  }
}