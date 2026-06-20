// trainer-departments-list.component.ts
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

import { EmployeeService } from '../../../../../core/services/employee.service';
import { DepartmentService } from '../../../../../core/services/department.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { TrainerDepartmentVTO } from '../../../../../core/models/employee.model';
import { AssignDepartmentWizardModalComponent } from '../assign-department-wizard/assign-department-wizard-modal.component';

@Component({
  selector: 'app-trainer-departments-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  template: `
    <div class="departments-container">
      <!-- Header -->
      <div class="header-section">
        <div class="header-title">
          <mat-icon>business</mat-icon>
          <div>
            <h2>إدارة أقسام المدربين</h2>
            <p>عرض وإدارة الأقسام المسندة للمدربين</p>
          </div>
        </div>
        <button mat-raised-button color="primary" (click)="openAssignModal()">
          <mat-icon>add</mat-icon>
          إسناد قسم
        </button>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>بحث سريع</mat-label>
          <input matInput [(ngModel)]="quickSearch" (ngModelChange)="onSearchChange()" placeholder="بحث بالاسم أو القسم...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="filter-field" *ngIf="trainers.length > 0">
          <mat-label>فلتر بالمدرب</mat-label>
          <mat-select [(ngModel)]="selectedTrainerId" (selectionChange)="applyFilters()">
            <mat-option [value]="null">الكل</mat-option>
            <mat-option *ngFor="let trainer of trainers" [value]="trainer.id">
              {{ trainer.label }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="filter-field" *ngIf="departments.length > 0">
          <mat-label>فلتر بالقسم</mat-label>
          <mat-select [(ngModel)]="selectedDepartmentId" (selectionChange)="applyFilters()">
            <mat-option [value]="null">الكل</mat-option>
            <mat-option *ngFor="let dept of departments" [value]="dept.id">
              {{ dept.label }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <button mat-stroked-button color="primary" (click)="resetFilters()" class="reset-btn">
          <mat-icon>refresh</mat-icon>
          إعادة ضبط
        </button>
      </div>

      <!-- Table -->
      <mat-card class="table-card">
        <mat-card-content>
          <div class="table-container" *ngIf="!isLoading; else loadingSpinner">
            <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z0" (matSortChange)="onSortChange($event)">
              
              <!-- ID Column -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>#</th>
                <td mat-cell *matCellDef="let item">{{ item.id }}</td>
              </ng-container>

              <!-- Trainer Column -->
              <ng-container matColumnDef="trainer">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>المدرب</th>
                <td mat-cell *matCellDef="let item">
                  <div class="trainer-info">
                    <span class="trainer-name">{{ item.trainer?.title || '-' }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Department Column -->
              <ng-container matColumnDef="department">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>القسم</th>
                <td mat-cell *matCellDef="let item">
                  <mat-chip>{{ item.department?.title || '-' }}</mat-chip>
                </td>
              </ng-container>

              <!-- Created On Column -->
              <ng-container matColumnDef="createdOn">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>تاريخ الإسناد</th>
                <td mat-cell *matCellDef="let item">
                  {{ item.createdOn | date:'dd/MM/yyyy HH:mm' }}
                </td>
              </ng-container>

              <!-- Created By Column -->
              <ng-container matColumnDef="createdBy">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>تم بواسطة</th>
                <td mat-cell *matCellDef="let item">
                  {{ item.createdBy?.fullName || '-' }}
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>الإجراءات</th>
                <td mat-cell *matCellDef="let item">
                  <button mat-icon-button color="warn" (click)="unassignDepartment(item)" matTooltip="إلغاء الإسناد">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

              <!-- No Data Row -->
              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell" [attr.colspan]="displayedColumns.length">
                  <div class="no-data">
                    <mat-icon>inbox</mat-icon>
                    <span>لا توجد أقسام مسندة</span>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <mat-paginator 
            [pageSizeOptions]="[10, 25, 50, 100]"
            [pageSize]="pageSize"
            [length]="totalItems"
            (page)="onPageChange($event)"
            showFirstLastButtons
            aria-label="Select page of trainer departments">
          </mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>

    <ng-template #loadingSpinner>
      <div class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
        <p>جاري تحميل البيانات...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .departments-container {
      padding: 24px;
      background: #f8fafc;
      min-height: 100vh;
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      background: white;
      padding: 20px 24px;
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }

    .header-title {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .header-title mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #f59e0b;
    }

    .header-title h2 {
      margin: 0;
      font-size: 22px;
      font-weight: 600;
      color: #0f172a;
    }

    .header-title p {
      margin: 4px 0 0;
      color: #64748b;
      font-size: 14px;
    }

    .filters-section {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
      background: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      align-items: center;
    }

    .filter-field {
      flex: 1;
      min-width: 200px;
    }

    .reset-btn {
      height: 56px;
      min-width: 120px;
    }

    .table-card {
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }

    .table-container {
      overflow-x: auto;
    }

    table {
      width: 100%;
    }

    th.mat-header-cell {
      font-weight: 600;
      color: #475569;
      font-size: 13px;
    }

    td.mat-cell {
      padding: 12px 16px;
    }

    .trainer-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .trainer-name {
      font-weight: 500;
      color: #0f172a;
    }

    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 40px;
      color: #94a3b8;
    }

    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 60px;
      color: #64748b;
    }

    @media (max-width: 768px) {
      .departments-container {
        padding: 16px;
      }

      .header-section {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .filters-section {
        flex-direction: column;
      }

      .filter-field {
        min-width: 100%;
      }

      .reset-btn {
        width: 100%;
      }
    }
  `]
})
export class TrainerDepartmentsListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['id', 'trainer', 'department', 'createdOn', 'createdBy', 'actions'];
  dataSource = new MatTableDataSource<TrainerDepartmentVTO>([]);
  
  trainers: any[] = [];
  departments: any[] = [];
  isLoading = false;
  totalItems = 0;
  
  // Filter parameters
  quickSearch: string = '';
  selectedTrainerId: number | null = null;
  selectedDepartmentId: number | null = null;
  
  // Pagination
  pageSize: number = 25;
  pageNum: number = 0;
  
  // Sorting
  sortField: string = 'CREATION_DATE';
  sortDirection: string = 'DESC';
  
  // Search debounce
  private searchSubject = new Subject<string>();

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private dialog: MatDialog,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadFilterData();
    this.loadData();
    
    // Debounce search input
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      this.loadData();
    });
  }

  ngAfterViewInit(): void {
    // Data is loaded via API, no need for client-side pagination/sorting
  }

  loadFilterData(): void {
    // Load trainers for filter
    this.employeeService.getAllTrainersLookup().subscribe({
      next: (res) => {
        this.trainers = (res.list || []).map((item: any) => ({
          id: item.id,
          label: item.title || item.fullName
        }));
      },
      error: () => {
        console.error('Error loading trainers for filter');
      }
    });

    // Load departments for filter
    this.departmentService.getAllDepartmentsLookup().subscribe({
      next: (res) => {
        this.departments = (res.list || []).map((item: any) => ({
          id: item.id,
          label: item.title
        }));
      },
      error: () => {
        console.error('Error loading departments for filter');
      }
    });
  }

  loadData(): void {
    this.isLoading = true;
    
    const params: any = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      orderBy: this.sortField,
      orderDir: this.sortDirection
    };
    
    if (this.quickSearch && this.quickSearch.trim().length > 0) {
      params.quickSearch = this.quickSearch.trim();
    }
    
    if (this.selectedTrainerId !== null) {
      params.trainerId = this.selectedTrainerId;
    }
    
    if (this.selectedDepartmentId !== null) {
      params.departmentId = this.selectedDepartmentId;
    }
    
    this.employeeService.getTrainerDepartments(params).subscribe({
      next: (result) => {
        this.dataSource.data = result.items || [];
        this.totalItems = result.total || 0;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading trainer departments:', err);
        this.notification.showError('حدث خطأ في تحميل الأقسام المسندة');
        this.isLoading = false;
      }
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.quickSearch);
  }

  applyFilters(): void {
    this.pageNum = 0;
    this.loadData();
  }

  resetFilters(): void {
    this.quickSearch = '';
    this.selectedTrainerId = null;
    this.selectedDepartmentId = null;
    this.pageNum = 0;
    this.loadData();
    this.notification.showSuccess('تم إعادة ضبط الفلاتر');
  }

  onPageChange(event: PageEvent): void {
    this.pageNum = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onSortChange(event: any): void {
    if (event.active) {
      this.sortField = event.active;
      this.sortDirection = event.direction.toUpperCase() || 'DESC';
      this.loadData();
    }
  }

  openAssignModal(): void {
    const dialogRef = this.dialog.open(AssignDepartmentWizardModalComponent, {
      width: '600px',
      maxWidth: '90vw',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
        this.notification.showSuccess('تم إسناد القسم بنجاح');
      }
    });
  }

  unassignDepartment(item: TrainerDepartmentVTO): void {
    if (!item.id) return;

    const confirmMessage = `هل أنت متأكد من إلغاء إسناد القسم "${item.department?.title}" من المدرب "${item.trainer?.title}"؟`;
    
    if (confirm(confirmMessage)) {
      this.employeeService.unassignDepartmentFromTrainer(item.id).subscribe({
        next: () => {
          this.notification.showSuccess('تم إلغاء إسناد القسم بنجاح');
          this.loadData();
        },
        error: (err) => {
          console.error('Error unassigning department:', err);
          this.notification.showError('حدث خطأ في إلغاء إسناد القسم');
        }
      });
    }
  }
}