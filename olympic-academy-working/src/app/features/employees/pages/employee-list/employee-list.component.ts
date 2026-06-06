import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EmployeeService } from '../../../../core/services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-employee-list',
  template: `
    <div class="employees-container">
      <div class="page-header">
        <h2>إدارة الموظفين</h2>
        <button mat-raised-button color="primary" routerLink="/employees/new">
          <mat-icon>add</mat-icon> موظف جديد
        </button>
      </div>

      <mat-card>
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>بحث</mat-label>
          <input matInput (keyup)="applyFilter($event)" placeholder="ابحث باسم الموظف">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <div class="table-container" *ngIf="!isLoading; else loading">
          <table mat-table [dataSource]="dataSource" matSort class="full-width">
            <ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>#</th><td mat-cell *matCellDef="let e">{{ e.id }}</td></ng-container>
            <ng-container matColumnDef="fullName"><th mat-header-cell *matHeaderCellDef>الاسم</th><td mat-cell *matCellDef="let e">{{ e.fullName }}</td></ng-container>
            <ng-container matColumnDef="nationalId"><th mat-header-cell *matHeaderCellDef>الهوية</th><td mat-cell *matCellDef="let e">{{ e.nationalId }}</td></ng-container>
            <ng-container matColumnDef="employeeType"><th mat-header-cell *matHeaderCellDef>النوع</th><td mat-cell *matCellDef="let e">{{ e.employeeType?.title }}</td></ng-container>
            <ng-container matColumnDef="departments"><th mat-header-cell *matHeaderCellDef>الأقسام</th><td mat-cell *matCellDef="let e"><mat-chip *ngFor="let d of e.departments">{{ d.title }}</mat-chip></td></ng-container>
            <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>الحالة</th><td mat-cell *matCellDef="let e"><mat-chip [color]="e.isActive ? 'primary' : 'warn'">{{ e.isActive ? 'نشط' : 'غير نشط' }}</mat-chip></td></ng-container>
            <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>الإجراءات</th><td mat-cell *matCellDef="let e"><button mat-icon-button color="primary" [routerLink]="['/employees', e.id, 'edit']"><mat-icon>edit</mat-icon></button><button mat-icon-button color="warn" (click)="deleteEmployee(e)"><mat-icon>delete</mat-icon></button></td></ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns">觉<tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          <mat-paginator [pageSize]="10" [pageSizeOptions]="[5, 10, 25, 50]"></mat-paginator>
        </div>
        <ng-template #loading><div class="loading-spinner"><mat-spinner diameter="40"></mat-spinner></div></ng-template>
      </mat-card>
    </div>
  `,
  styles: [`
    .employees-container { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h2 { margin: 0; font-size: 24px; }
    .search-field { width: 100%; margin-bottom: 20px; }
    .table-container { overflow-x: auto; }
    .full-width { width: 100%; }
    .loading-spinner { display: flex; justify-content: center; padding: 40px; }
  `]
})
export class EmployeeListComponent implements OnInit {
  displayedColumns = ['id', 'fullName', 'nationalId', 'employeeType', 'departments', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private employeeService: EmployeeService, private notificationService: NotificationService) {}

  ngOnInit() { this.loadEmployees(); }
  ngAfterViewInit() { this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; }

  loadEmployees() {
    this.isLoading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (res: any) => { this.dataSource.data = res.items; this.isLoading = false; },
      error: () => { this.notificationService.showError('حدث خطأ'); this.isLoading = false; }
    });
  }

  applyFilter(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  deleteEmployee(emp: any) {
    if (confirm(`هل أنت متأكد من حذف الموظف "${emp.fullName}"؟`)) {
      this.employeeService.deleteEmployee(emp.id).subscribe({
        next: () => { this.notificationService.showSuccess('تم الحذف'); this.loadEmployees(); },
        error: () => this.notificationService.showError('خطأ في الحذف')
      });
    }
  }
}