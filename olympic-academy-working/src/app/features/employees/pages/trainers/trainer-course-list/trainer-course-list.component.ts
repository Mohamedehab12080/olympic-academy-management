// trainer-courses-list.component.ts - UPDATED WITH CORRECT UNASSIGNMENT

import { Component, OnInit, ViewChild } from '@angular/core';
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
import { CourseService } from '../../../../../core/services/course.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { AssignCourseWizardModalComponent } from '../assign-course-wizard/assign-course-wizard-modal.component';
import { TrainerCourseVTO } from '../../../../../core/models/employee.model';

@Component({
  selector: 'app-trainer-courses-list',
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
    <div class="courses-container">
      <!-- Header -->
      <div class="header-section">
        <div class="header-title">
          <mat-icon>school</mat-icon>
          <div>
            <h2>إدارة دورات المدربين</h2>
            <p>عرض وإدارة الدورات المسندة للمدربين</p>
          </div>
        </div>
        <button mat-raised-button color="primary" (click)="openAssignModal()">
          <mat-icon>add</mat-icon>
          إسناد دورة
        </button>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>بحث سريع</mat-label>
          <input matInput [(ngModel)]="quickSearch" (ngModelChange)="onSearchChange()" placeholder="بحث بالمدرب أو الدورة...">
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

        <mat-form-field appearance="outline" class="filter-field" *ngIf="coursesList.length > 0">
          <mat-label>فلتر بالدورة</mat-label>
          <mat-select [(ngModel)]="selectedCourseId" (selectionChange)="applyFilters()">
            <mat-option [value]="null">الكل</mat-option>
            <mat-option *ngFor="let course of coursesList" [value]="course.id">
              {{ course.label }}
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

              <!-- Course Column -->
              <ng-container matColumnDef="course">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>الدورة</th>
                <td mat-cell *matCellDef="let item">
                  <mat-chip>{{ item.course?.title || '-' }}</mat-chip>
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
                  <button mat-icon-button color="warn" (click)="unassignCourse(item)" matTooltip="إلغاء الإسناد">
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
                    <span>لا توجد دورات مسندة</span>
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
            aria-label="Select page of trainer courses">
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
    .courses-container {
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
      .courses-container {
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
export class TrainerCoursesListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['id', 'trainer', 'course', 'createdOn', 'createdBy', 'actions'];
  dataSource = new MatTableDataSource<TrainerCourseVTO>([]);
  
  trainers: any[] = [];
  coursesList: any[] = [];
  isLoading = false;
  totalItems = 0;
  
  // Filter parameters
  quickSearch: string = '';
  selectedTrainerId: number | null = null;
  selectedCourseId: number | null = null;
  
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
    private courseService: CourseService,
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

    // Load courses for filter
    this.courseService.getAllCoursesLookup().subscribe({
      next: (res) => {
        this.coursesList = (res.list || []).map((item: any) => ({
          id: item.id,
          label: item.title
        }));
      },
      error: () => {
        console.error('Error loading courses for filter');
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
    
    if (this.selectedCourseId !== null) {
      params.courseId = this.selectedCourseId;
    }
    
    this.employeeService.getTrainerCourses(params).subscribe({
      next: (result) => {
        this.dataSource.data = result.items || [];
        this.totalItems = result.total || 0;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading trainer courses:', err);
        this.notification.showError('حدث خطأ في تحميل الدورات المسندة');
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
    this.selectedCourseId = null;
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
      // Map column names to backend field names
      const fieldMap: { [key: string]: string } = {
        'id': 'ID',
        'trainer': 'TRAINER',
        'course': 'COURSE',
        'createdOn': 'CREATION_DATE'
      };
      
      this.sortField = fieldMap[event.active] || event.active.toUpperCase();
      this.sortDirection = event.direction.toUpperCase() || 'DESC';
      this.loadData();
    }
  }

  openAssignModal(): void {
    const dialogRef = this.dialog.open(AssignCourseWizardModalComponent, {
      width: '600px',
      maxWidth: '90vw',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
        this.notification.showSuccess('تم إسناد الدورة بنجاح');
      }
    });
  }

  /**
   * Unassign a course from a trainer
   * Uses DELETE /trainers/{trainerCourseId}
   * The item.id is the trainer_course assignment ID
   */
  unassignCourse(item: TrainerCourseVTO): void {
    if (!item.id) {
      this.notification.showError('بيانات غير مكتملة لإلغاء الإسناد');
      return;
    }

    const trainerName = item.trainer?.title || 'المدرب';
    const courseName = item.course?.title || 'الدورة';
    const confirmMessage = `هل أنت متأكد من إلغاء إسناد الدورة "${courseName}" من المدرب "${trainerName}"؟`;
    
    if (confirm(confirmMessage)) {
      // Use the assignment ID (item.id) - this is the trainer_course ID
      this.employeeService.unassignCourseFromTrainer(item.id).subscribe({
        next: () => {
          this.notification.showSuccess(`تم إلغاء إسناد الدورة "${courseName}" بنجاح`);
          this.loadData();
        },
        error: (err) => {
          console.error('Error unassigning course:', err);
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في إلغاء إسناد الدورة');
        }
      });
    }
  }
}