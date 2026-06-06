import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CourseService } from '../../../../core/services/course.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-course-list',
  template: `
    <div class="courses-container">
      <div class="page-header">
        <h2>إدارة الدورات</h2>
        <button mat-raised-button color="primary" routerLink="/courses/new">
          <mat-icon>add</mat-icon> دورة جديدة
        </button>
      </div>

      <mat-card>
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>بحث</mat-label>
          <input matInput (keyup)="applyFilter($event)" placeholder="ابحث باسم الدورة">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <div class="table-container" *ngIf="!isLoading; else loading">
          <table mat-table [dataSource]="dataSource" matSort class="full-width">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>#</th>
              <td mat-cell *matCellDef="let course">{{ course.id }}</td>
            </ng-container>

            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>اسم الدورة</th>
              <td mat-cell *matCellDef="let course">{{ course.title }}</td>
            </ng-container>

            <ng-container matColumnDef="department">
              <th mat-header-cell *matHeaderCellDef>القسم</th>
              <td mat-cell *matCellDef="let course">{{ course.department?.title }}</td>
            </ng-container>

            <ng-container matColumnDef="courseType">
              <th mat-header-cell *matHeaderCellDef>النوع</th>
              <td mat-cell *matCellDef="let course">
                <mat-chip [color]="course.courseType?.title === 'تأهيل' ? 'primary' : 'accent'" highlighted>
                  {{ course.courseType?.title }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="duration">
              <th mat-header-cell *matHeaderCellDef>المدة (ساعة)</th>
              <td mat-cell *matCellDef="let course">{{ course.duration }}</td>
            </ng-container>

            <ng-container matColumnDef="price">
              <th mat-header-cell *matHeaderCellDef>السعر</th>
              <td mat-cell *matCellDef="let course">{{ course.price | currency:'EGP' }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>الحالة</th>
              <td mat-cell *matCellDef="let course">
                <mat-chip [color]="course.isActive ? 'primary' : 'warn'" highlighted>
                  {{ course.isActive ? 'نشط' : 'غير نشط' }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>الإجراءات</th>
              <td mat-cell *matCellDef="let course">
                <button mat-icon-button color="primary" [routerLink]="['/courses', course.id, 'edit']">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteCourse(course)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="clickable-row"></tr>
          </table>

          <mat-paginator [pageSize]="10" [pageSizeOptions]="[5, 10, 25, 50]" showFirstLastButtons></mat-paginator>
        </div>

        <ng-template #loading>
          <div class="loading-spinner"><mat-spinner diameter="40"></mat-spinner></div>
        </ng-template>
      </mat-card>
    </div>
  `,
  styles: [`
    .courses-container { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h2 { margin: 0; font-size: 24px; font-weight: 600; }
    .search-field { width: 100%; margin-bottom: 20px; }
    .table-container { overflow-x: auto; }
    .full-width { width: 100%; }
    .clickable-row { cursor: pointer; transition: background 0.2s; }
    .clickable-row:hover { background: #f9fafb; }
    .loading-spinner { display: flex; justify-content: center; padding: 40px; }
  `]
})
export class CourseListComponent implements OnInit {
  displayedColumns = ['id', 'title', 'department', 'courseType', 'duration', 'price', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private courseService: CourseService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() { this.loadCourses(); }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCourses() {
    this.isLoading = true;
    this.courseService.getAllCourses().subscribe({
      next: (res: any) => {
        this.dataSource.data = res.items;
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('حدث خطأ في تحميل الدورات');
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  deleteCourse(course: any) {
    if (confirm(`هل أنت متأكد من حذف دورة "${course.title}"؟`)) {
      this.courseService.deleteCourse(course.id).subscribe({
        next: () => {
          this.notificationService.showSuccess('تم حذف الدورة بنجاح');
          this.loadCourses();
        },
        error: () => this.notificationService.showError('حدث خطأ في حذف الدورة')
      });
    }
  }
}