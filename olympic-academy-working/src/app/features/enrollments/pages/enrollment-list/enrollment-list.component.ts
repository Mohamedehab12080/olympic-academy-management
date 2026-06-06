import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EnrollmentService } from '../../../../core/services/enrollment.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PAYMENT_STATUSES } from '../../../../core/models/common.model';

@Component({
  selector: 'app-enrollment-list',
  template: `
    <div class="enrollments-container">
      <div class="page-header">
        <h2>إدارة التسجيلات</h2>
        <button mat-raised-button color="primary" routerLink="/enrollments/new">
          <mat-icon>add</mat-icon> تسجيل جديد
        </button>
      </div>

      <mat-card>
        <div class="filters">
          <mat-form-field appearance="outline"><mat-label>بحث</mat-label><input matInput (keyup)="applyFilter($event)" placeholder="بحث"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>حالة الدفع</mat-label><mat-select (selectionChange)="filterByPayment($event.value)"><mat-option>الكل</mat-option><mat-option *ngFor="let s of paymentStatuses" [value]="s.title">{{ s.title }}</mat-option></mat-select></mat-form-field>
        </div>

        <div class="table-container" *ngIf="!isLoading; else loading">
          <table mat-table [dataSource]="dataSource" matSort>
            <ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>#</th><td mat-cell *matCellDef="let e">{{ e.id }}</td></ng-container>
            <ng-container matColumnDef="trainee"><th mat-header-cell *matHeaderCellDef>المتدرب</th><td mat-cell *matCellDef="let e">{{ e.trainee?.title }}</td></ng-container>
            <ng-container matColumnDef="course"><th mat-header-cell *matHeaderCellDef>الدورة</th><td mat-cell *matCellDef="let e">{{ e.course?.title }}</td></ng-container>
            <ng-container matColumnDef="trainer"><th mat-header-cell *matHeaderCellDef>المدرب</th><td mat-cell *matCellDef="let e">{{ e.trainer?.title }}</td></ng-container>
            <ng-container matColumnDef="startDate"><th mat-header-cell *matHeaderCellDef>تاريخ البدء</th><td mat-cell *matCellDef="let e">{{ e.startDate | date }}</td></ng-container>
            <ng-container matColumnDef="paymentStatus"><th mat-header-cell *matHeaderCellDef>حالة الدفع</th><td mat-cell *matCellDef="let e"><mat-chip [color]="getPaymentColor(e.paymentStatus?.title)">{{ e.paymentStatus?.title }}</mat-chip></td></ng-container>
            <ng-container matColumnDef="amount"><th mat-header-cell *matHeaderCellDef>المبلغ</th><td mat-cell *matCellDef="let e">{{ e.finalSubscriptionValue | currency:'EGP' }}</td></ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr><tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          <mat-paginator [pageSize]="10"></mat-paginator>
        </div>
        <ng-template #loading><div class="loading-spinner"><mat-spinner diameter="40"></mat-spinner></div></ng-template>
      </mat-card>
    </div>
  `,
  styles: [`
    .enrollments-container { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .filters { display: flex; gap: 16px; margin-bottom: 20px; }
    .filters mat-form-field { flex: 1; }
    .table-container { overflow-x: auto; }
    .loading-spinner { display: flex; justify-content: center; padding: 40px; }
  `]
})
export class EnrollmentListComponent implements OnInit {
  displayedColumns = ['id', 'trainee', 'course', 'trainer', 'startDate', 'paymentStatus', 'amount'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;
  paymentStatuses = PAYMENT_STATUSES;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private enrollmentService: EnrollmentService, private notification: NotificationService) {}

  ngOnInit() { this.loadEnrollments(); }
  ngAfterViewInit() { this.dataSource.paginator = this.paginator; }

  loadEnrollments() {
    this.isLoading = true;
    this.enrollmentService.getAllEnrollmentsByFilter().subscribe({
      next: (res: any) => { this.dataSource.data = res.items; this.isLoading = false; },
      error: () => { this.notification.showError('حدث خطأ'); this.isLoading = false; }
    });
  }

  applyFilter(event: Event) { this.dataSource.filter = (event.target as HTMLInputElement).value; }
  filterByPayment(status: string) { this.loadEnrollments(); }
  getPaymentColor(status: string): string { return status === 'مدفوع' ? 'primary' : 'warn'; }
}