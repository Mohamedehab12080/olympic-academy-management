import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DepartmentService } from '../../../../core/services/department.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { DepartmentDetailsModalComponent } from './../department-details/department-details-modal.component';
@Component({
  selector: 'app-department-list',
  template: `
    <div class="departments-container">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">إدارة الأقسام</h1>
          <p class="page-subtitle">إدارة الأقسام الأكاديمية والإدارية في الأكاديمية</p>
        </div>
        <button mat-raised-button color="primary" routerLink="/departments/new" class="add-btn">
          <mat-icon>add</mat-icon>
          <span>قسم جديد</span>
        </button>
      </div>

      <!-- Main Card -->
      <mat-card class="main-card">
        <!-- Search Bar -->
        <div class="search-section">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>بحث</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="ابحث باسم القسم أو الوصف..." #filterInput>
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          
          <div class="actions">
            <button mat-stroked-button (click)="refreshData()" class="refresh-btn">
              <mat-icon>refresh</mat-icon>
              <span>تحديث</span>
            </button>
          </div>
        </div>

        <!-- Loading Spinner -->
        <div class="loading-container" *ngIf="isLoading">
          <mat-spinner diameter="40"></mat-spinner>
          <p>جاري تحميل البيانات...</p>
        </div>

        <!-- Table -->
        <div class="table-container" *ngIf="!isLoading">
          <table mat-table [dataSource]="dataSource" matSort class="full-width-table">
            
            <!-- ID Column -->
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="col-id">#</th>
              <td mat-cell *matCellDef="let department" class="col-id">{{ department.id }}</td>
            </ng-container>

            <!-- Title Column -->
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="col-title">اسم القسم</th>
              <td mat-cell *matCellDef="let department" class="col-title">
                <div class="department-title">
                  <mat-icon class="title-icon">business</mat-icon>
                  <span class="title-text">{{ department.title }}</span>
                </div>
              </td>
            </ng-container>

            <!-- Description Column -->
            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef class="col-description">الوصف</th>
              <td mat-cell *matCellDef="let department" class="col-description">
                <span class="description-text">{{ department.description || '—' }}</span>
              </td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef class="col-status">الحالة</th>
              <td mat-cell *matCellDef="let department" class="col-status">
                <span class="status-badge" [class.active]="department.isActive" [class.inactive]="!department.isActive">
                  <mat-icon class="status-icon">{{ department.isActive ? 'check_circle' : 'cancel' }}</mat-icon>
                  <span>{{ department.isActive ? 'نشط' : 'غير نشط' }}</span>
                </span>
              </td>
            </ng-container>

            <!-- Created Date Column -->
            <ng-container matColumnDef="createdOn">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="col-date">تاريخ الإنشاء</th>
              <td mat-cell *matCellDef="let department" class="col-date">
                <div class="date-info">
                  <mat-icon>calendar_today</mat-icon>
                  <span>{{ department.createdOn | date:'dd/MM/yyyy' }}</span>
                </div>
              </td>
            </ng-container>

            <!-- Created By Column -->
            <ng-container matColumnDef="createdBy">
              <th mat-header-cell *matHeaderCellDef class="col-user">منشئ بواسطة</th>
              <td mat-cell *matCellDef="let department" class="col-user">
                <div class="user-info">
                  <mat-icon>person</mat-icon>
                  <span>{{ department.createdBy?.fullName || '—' }}</span>
                </div>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="col-actions">الإجراءات</th>
              <td mat-cell *matCellDef="let department" class="col-actions">
                <div class="action-buttons">
                  <button mat-icon-button color="primary" [routerLink]="['/departments', department.id, 'edit']" matTooltip="تعديل">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button [color]="department.isActive ? 'warn' : 'accent'" (click)="toggleStatus(department)" [matTooltip]="department.isActive ? 'تعطيل' : 'تفعيل'">
                    <mat-icon>{{ department.isActive ? 'block' : 'check_circle' }}</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row" (click)="viewDepartment(row)"></tr>
          </table>

          <!-- No Data Message -->
          <div class="no-data" *ngIf="dataSource.data.length === 0">
            <mat-icon>folder_open</mat-icon>
            <p>لا توجد أقسام لعرضها</p>
            <button mat-raised-button color="primary" routerLink="/departments/new">
              <mat-icon>add</mat-icon>
              إضافة قسم جديد
            </button>
          </div>

          <!-- Paginator -->
          <mat-paginator [pageSize]="10" [pageSizeOptions]="[5, 10, 25, 50]" showFirstLastButtons dir="rtl" class="paginator"></mat-paginator>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .departments-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Header Styles */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .page-title {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 8px 0;
      color: #1f2937;
    }

    .page-subtitle {
      color: #6b7280;
      margin: 0;
      font-size: 14px;
    }

    .add-btn {
      padding: 0 20px;
      height: 48px;
    }

    .add-btn mat-icon {
      margin-left: 8px;
    }

    /* Main Card */
    .main-card {
      border-radius: 16px;
      overflow: hidden;
    }

    /* Search Section */
    .search-section {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .search-field {
      flex: 1;
      min-width: 250px;
    }

    .refresh-btn {
      height: 56px;
      padding: 0 24px;
    }

    /* Loading Container */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;
      gap: 16px;
    }

    .loading-container p {
      color: #6b7280;
      margin: 0;
    }

    /* Table Styles */
    .table-container {
      overflow-x: auto;
    }

    .full-width-table {
      width: 100%;
    }

    .table-row {
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .table-row:hover {
      background-color: #f9fafb;
    }

    /* Column Widths */
    .col-id { width: 60px; }
    .col-title { width: 200px; }
    .col-description { min-width: 250px; }
    .col-status { width: 100px; }
    .col-date { width: 120px; }
    .col-user { width: 150px; }
    .col-actions { width: 100px; }

    /* Department Title */
    .department-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .title-icon {
      color: #2563eb;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .title-text {
      font-weight: 500;
      color: #1f2937;
    }

    /* Description Text */
    .description-text {
      color: #4b5563;
      font-size: 14px;
      line-height: 1.4;
    }

    /* Status Badge */
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 30px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.active {
      background-color: #d1fae5;
      color: #065f46;
    }

    .status-badge.inactive {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .custom-dialog-container .mat-dialog-container {
      padding: 0;
      border-radius: 24px;
      overflow: hidden;
    }

    .status-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    /* Date Info */
    .date-info, .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .date-info mat-icon, .user-info mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #9ca3af;
    }

    /* Action Buttons */
    .action-buttons {
      display: flex;
      gap: 4px;
    }

    /* No Data */
    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;
      gap: 16px;
    }

    .no-data mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #d1d5db;
    }

    .no-data p {
      color: #6b7280;
      font-size: 16px;
    }

    /* Paginator */
    .paginator {
      border-top: 1px solid #e5e7eb;
      margin-top: 16px;
    }
  `]
})
export class DepartmentListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'description', 'status', 'createdOn', 'createdBy', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private departmentService: DepartmentService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  
  ngOnInit() {
    this.loadDepartments();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadDepartments() {
    this.isLoading = true;
    this.departmentService.getAllDepartments().subscribe({
      next: (result: any) => {
        this.dataSource.data = result.items;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.notificationService.showError('حدث خطأ في تحميل الأقسام');
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  refreshData() {
    this.loadDepartments();
    this.notificationService.showSuccess('تم تحديث البيانات');
  }

  toggleStatus(department: any) {
    const action = department.isActive ? 'تعطيل' : 'تفعيل';
    const confirmMessage = `هل أنت متأكد من ${action} قسم "${department.title}"؟`;
    
    if (confirm(confirmMessage)) {
      this.departmentService.deleteDepartment(department.id).subscribe({
        next: () => {
          this.notificationService.showSuccess(`تم ${action} القسم بنجاح`);
          this.loadDepartments();
        },
        error: () => {
          this.notificationService.showError(`حدث خطأ في ${action} القسم`);
        }
      });
    }
  }

 viewDepartment(department: any) {
  this.dialog.open(DepartmentDetailsModalComponent, {
    width: '700px',
    maxWidth: '95vw',
    data: { departmentId: department.id },
    panelClass: 'custom-dialog-container'
  });
}
}