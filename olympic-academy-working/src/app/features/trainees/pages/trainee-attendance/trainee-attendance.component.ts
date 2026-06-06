import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TraineeAttendanceService } from '../../../../core/services/trainee-attendance.service';
import { CourseService } from '../../../../core/services/course.service';
import { EnrollmentService } from '../../../../core/services/enrollment.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportService } from '../../../../core/services/report.service';
import { TRAINEE_ATTENDANCE_STATUSES, TraineeAttendanceListItem } from '../../../../core/models/trainee-attendance.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-trainee-attendance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatChipsModule,
    MatTooltipModule
  ],
  template: `
    <div class="attendance-container">
      <mat-card>
        <div class="header">
          <div class="header-title">
            <h1>حضور المتدربين</h1>
            <p>تسجيل ومتابعة حضور المتدربين في جلسات الدورات</p>
          </div>
          <div class="header-actions">
            <button mat-raised-button color="primary" (click)="openAttendanceDialog()" class="add-btn">
              <mat-icon>add</mat-icon> تسجيل حضور
            </button>
          </div>
        </div>

        <!-- الفلاتر -->
        <div class="filters">
          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>اختر الدورة</mat-label>
            <mat-select [(ngModel)]="selectedCourseId" (selectionChange)="onCourseChange()">
              <mat-option [value]="null">الكل</mat-option>
              <mat-option *ngFor="let course of courses" [value]="course.id">{{ course.title }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>اختر الجلسة</mat-label>
            <mat-select [(ngModel)]="selectedSessionId" (selectionChange)="loadAttendances()">
              <mat-option [value]="null">الكل</mat-option>
              <mat-option *ngFor="let session of sessions" [value]="session.id">
                {{ session.title }} - {{ session.sessionDate | date }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>حالة الحضور</mat-label>
            <mat-select [(ngModel)]="selectedStatus" (selectionChange)="filterByStatus()">
              <mat-option [value]="null">الكل</mat-option>
              <mat-option *ngFor="let status of attendanceStatuses" [value]="status.id">{{ status.title }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>من تاريخ</mat-label>
            <input matInput [matDatepicker]="fromPicker" [(ngModel)]="fromDate" (dateChange)="loadAttendances()">
            <mat-datepicker-toggle matSuffix [for]="fromPicker"></mat-datepicker-toggle>
            <mat-datepicker #fromPicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>إلى تاريخ</mat-label>
            <input matInput [matDatepicker]="toPicker" [(ngModel)]="toDate" (dateChange)="loadAttendances()">
            <mat-datepicker-toggle matSuffix [for]="toPicker"></mat-datepicker-toggle>
            <mat-datepicker #toPicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>بحث</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="ابحث باسم المتدرب">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <div class="action-buttons">
            <button mat-stroked-button (click)="refreshData()" class="refresh-btn">
              <mat-icon>refresh</mat-icon> تحديث
            </button>
            <button mat-stroked-button color="accent" (click)="exportToExcel()" [disabled]="dataSource.data.length === 0" class="export-btn">
              <mat-icon>table_chart</mat-icon> Excel
            </button>
            <button mat-stroked-button color="warn" (click)="exportToPDF()" [disabled]="dataSource.data.length === 0" class="export-btn">
              <mat-icon>picture_as_pdf</mat-icon> PDF
            </button>
          </div>
        </div>

        <!-- حالة التحميل -->
        <div class="loading-container" *ngIf="isLoading">
          <mat-spinner diameter="40"></mat-spinner>
          <p>جاري تحميل البيانات...</p>
        </div>

        <!-- جدول الحضور -->
        <div class="table-container" *ngIf="!isLoading">
          <div class="table-info" *ngIf="dataSource.data.length > 0">
            <p>عدد السجلات: {{ dataSource.data.length }} سجل</p>
          </div>
          <table mat-table [dataSource]="dataSource" matSort class="full-width-table">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>#</th>
              <td mat-cell *matCellDef="let a">{{ a.id }}<\/td>
            <\/ng-container>
            <ng-container matColumnDef="traineeName">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>المتدرب</th>
              <td mat-cell *matCellDef="let a">{{ a.traineeName || '-' }}<\/td>
            <\/ng-container>
            <ng-container matColumnDef="courseTitle">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>الدورة</th>
              <td mat-cell *matCellDef="let a">{{ a.courseTitle || '-' }}<\/td>
            <\/ng-container>
            <ng-container matColumnDef="sessionTitle">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>الجلسة</th>
              <td mat-cell *matCellDef="let a">{{ a.sessionTitle || '-' }}<\/td>
            <\/ng-container>
            <ng-container matColumnDef="sessionDate">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>تاريخ الجلسة</th>
              <td mat-cell *matCellDef="let a">{{ a.sessionDate | date:'dd/MM/yyyy' }}<\/td>
            <\/ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>الحالة</th>
              <td mat-cell *matCellDef="let a">
                <span class="status-badge" [class.present]="a.status?.id===1" [class.absent]="a.status?.id===2" [class.late]="a.status?.id===3" [class.excused]="a.status?.id===4">
                  {{ a.status?.title || '-' }}
                <\/span>
              <\/td>
            <\/ng-container>
            <ng-container matColumnDef="checkInTime">
              <th mat-header-cell *matHeaderCellDef>وقت الدخول</th>
              <td mat-cell *matCellDef="let a">{{ a.checkInTime || '-' }}<\/td>
            <\/ng-container>
            <ng-container matColumnDef="checkOutTime">
              <th mat-header-cell *matHeaderCellDef>وقت الخروج</th>
              <td mat-cell *matCellDef="let a">{{ a.checkOutTime || '-' }}<\/td>
            <\/ng-container>
            <ng-container matColumnDef="lateTime">
              <th mat-header-cell *matHeaderCellDef>وقت التأخير</th>
              <td mat-cell *matCellDef="let a">{{ a.lateTime ? a.lateTime + ' دقيقة' : '-' }}<\/td>
            <\/ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>الإجراءات</th>
              <td mat-cell *matCellDef="let a">
                <button mat-icon-button color="primary" (click)="openAttendanceDialog(a.id)" matTooltip="تعديل"><mat-icon>edit<\/mat-icon><\/button>
                <button mat-icon-button color="warn" (click)="deleteAttendance(a.id)" matTooltip="حذف"><mat-icon>delete<\/mat-icon><\/button>
              <\/td>
            <\/ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"><\/tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"><\/tr>
          <\/table>
          <div class="no-data" *ngIf="dataSource.data.length === 0">
            <mat-icon>event_busy</mat-icon>
            <p>لا توجد سجلات حضور</p>
            <button mat-raised-button color="primary" (click)="openAttendanceDialog()">
              <mat-icon>add</mat-icon> تسجيل حضور جديد
            <\/button>
          <\/div>
          <mat-paginator [pageSize]="10" [pageSizeOptions]="[5,10,25,50]" showFirstLastButtons><\/mat-paginator>
        <\/div>
      <\/mat-card>
    <\/div>
  `,
  styles: [`
    .attendance-container { padding: 24px; max-width: 1400px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    .header-title h1 { margin: 0 0 8px 0; font-size: 28px; font-weight: 700; color: #1f2937; }
    .header-title p { margin: 0; color: #6b7280; }
    .header-actions { display: flex; gap: 12px; }
    .add-btn { height: 48px; padding: 0 24px; }
    .filters { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; align-items: center; }
    .filter-field { flex: 1; min-width: 150px; }
    .action-buttons { display: flex; gap: 12px; align-items: center; }
    .refresh-btn, .export-btn { height: 56px; padding: 0 24px; }
    .loading-container { display: flex; justify-content: center; padding: 60px; }
    .table-container { overflow-x: auto; }
    .table-info { margin-bottom: 16px; padding: 8px 12px; background: #f0f9ff; border-radius: 8px; display: inline-block; }
    .table-info p { margin: 0; color: #0369a1; font-size: 14px; }
    .full-width-table { width: 100%; }
    .table-row { transition: background-color 0.2s; cursor: pointer; }
    .table-row:hover { background-color: #f9fafb; }
    .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 30px; font-size: 12px; font-weight: 500; }
    .status-badge.present { background: #d1fae5; color: #065f46; }
    .status-badge.absent { background: #fee2e2; color: #991b1b; }
    .status-badge.late { background: #fef3c7; color: #92400e; }
    .status-badge.excused { background: #dbeafe; color: #1e40af; }
    .no-data { text-align: center; padding: 60px; color: #6b7280; }
    .no-data mat-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 16px; color: #d1d5db; }
    @media (max-width: 768px) { .action-buttons { width: 100%; justify-content: flex-start; } }
  `]
})
export class TraineeAttendanceComponent implements OnInit {
  displayedColumns = ['id', 'traineeName', 'courseTitle', 'sessionTitle', 'sessionDate', 'status', 'checkInTime', 'checkOutTime', 'lateTime', 'actions'];
  dataSource = new MatTableDataSource<TraineeAttendanceListItem>([]);
  isLoading = false;
  courses: any[] = [];
  sessions: any[] = [];
  trainees: any[] = [];
  selectedCourseId: number | null = null;
  selectedSessionId: number | null = null;
  selectedStatus: number | null = null;
  fromDate: string = '';
  toDate: string = '';
  attendanceStatuses = TRAINEE_ATTENDANCE_STATUSES;
  attendanceForm: FormGroup;
  editMode = false;
  editId: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private traineeAttendanceService: TraineeAttendanceService,
    private courseService: CourseService,
    private enrollmentService: EnrollmentService,
    private notification: NotificationService,
    private reportService: ReportService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.attendanceForm = this.fb.group({
      traineeId: [null, Validators.required],
      courseSessionId: [null, Validators.required],
      status: [null, Validators.required],
      attendanceDate: [new Date().toISOString().split('T')[0]],
      checkInTime: [''],
      checkOutTime: [''],
      lateTime: [null],
      note: ['']
    });
  }

  ngOnInit() {
    this.loadCourses();
    this.loadTrainees();
    this.loadAttendances();
  }

  loadCourses() {
    this.courseService.getAllCourses().subscribe({
      next: (res: any) => { this.courses = res.items; },
      error: () => { this.notification.showError('حدث خطأ في تحميل الدورات'); }
    });
  }

  loadTrainees() {
    this.enrollmentService.getAllEnrollmentsByFilter().subscribe({
      next: (res: any) => {
        const uniqueTrainees = new Map();
        res.items.forEach((e: any) => {
          if (e.trainee && !uniqueTrainees.has(e.trainee.id)) {
            uniqueTrainees.set(e.trainee.id, e.trainee);
          }
        });
        this.trainees = Array.from(uniqueTrainees.values());
      },
      error: () => { this.notification.showError('حدث خطأ في تحميل المتدربين'); }
    });
  }

  onCourseChange() {
    if (this.selectedCourseId) {
      this.courseService.getAllSessionsByFilter({ courseId: this.selectedCourseId }).subscribe({
        next: (res: any) => { this.sessions = res.items; },
        error: () => { this.notification.showError('حدث خطأ في تحميل الجلسات'); }
      });
    } else {
      this.sessions = [];
      this.selectedSessionId = null;
      this.loadAttendances();
    }
  }

  loadAttendances() {
    this.isLoading = true;
    const params: any = {};
    if (this.selectedSessionId) params.courseSessionId = this.selectedSessionId;
    if (this.selectedStatus) params.status = this.selectedStatus;
    if (this.fromDate) params.fromDate = this.fromDate;
    if (this.toDate) params.toDate = this.toDate;

    this.traineeAttendanceService.getAllAttendances(params).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.items;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات الحضور');
        this.isLoading = false;
      }
    });
  }

  filterByStatus() { this.loadAttendances(); }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  refreshData() { this.loadAttendances(); this.notification.showSuccess('تم تحديث البيانات'); }

  // ==================== دوال التصدير ====================

  exportToExcel() {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = this.dataSource.data.map((item, index) => ({
      '#': index + 1,
      'المتدرب': item.traineeName,
      'الدورة': item.courseTitle,
      'الجلسة': item.sessionTitle,
      'تاريخ الجلسة': item.sessionDate,
      'حالة الحضور': item.status?.title,
      'وقت الدخول': item.checkInTime || '-',
      'وقت الخروج': item.checkOutTime || '-',
      'وقت التأخير': item.lateTime ? `${item.lateTime} دقيقة` : '-',
      'ملاحظات': ''
    }));

    this.reportService.exportToExcel(exportData, 'trainee-attendance-data', 'سجلات الحضور');
    this.notification.showSuccess('تم تصدير البيانات بنجاح');
  }

  exportToPDF() {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const doc = new jsPDF('l', 'mm', 'a4');
    
    // عنوان التقرير
    doc.setFontSize(18);
    doc.text('تقرير حضور المتدربين', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    
    // معلومات الفلترة
    doc.setFontSize(10);
    let yOffset = 25;
    if (this.selectedCourseId) {
      const course = this.courses.find(c => c.id === this.selectedCourseId);
      doc.text(`الدورة: ${course?.title || ''}`, 14, yOffset);
      yOffset += 6;
    }
    if (this.selectedSessionId) {
      const session = this.sessions.find(s => s.id === this.selectedSessionId);
      doc.text(`الجلسة: ${session?.title || ''}`, 14, yOffset);
      yOffset += 6;
    }
    if (this.selectedStatus) {
      const status = this.attendanceStatuses.find(s => s.id === this.selectedStatus);
      doc.text(`حالة الحضور: ${status?.title || ''}`, 14, yOffset);
      yOffset += 6;
    }
    if (this.fromDate) doc.text(`من تاريخ: ${this.fromDate}`, 14, yOffset);
    if (this.toDate) doc.text(`إلى تاريخ: ${this.toDate}`, 14, yOffset + 6);
    
    doc.text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}`, doc.internal.pageSize.getWidth() - 40, 25);
    doc.text(`عدد السجلات: ${this.dataSource.data.length}`, doc.internal.pageSize.getWidth() - 40, 32);

    // إنشاء الجدول
    autoTable(doc, {
      head: [['#', 'المتدرب', 'الدورة', 'الجلسة', 'تاريخ الجلسة', 'الحالة', 'وقت الدخول', 'وقت الخروج', 'وقت التأخير']],
      body: this.dataSource.data.map((item, index) => [
        (index + 1).toString(),
        item.traineeName,
        item.courseTitle,
        item.sessionTitle,
        item.sessionDate,
        item.status?.title || '-',
        item.checkInTime || '-',
        item.checkOutTime || '-',
        item.lateTime ? `${item.lateTime} دقيقة` : '-'
      ]),
      startY: yOffset + 10,
      styles: { halign: 'right', fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' },
      alternateRowStyles: { fillColor: [243, 244, 246] }
    });

    doc.save('trainee-attendance-report.pdf');
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }

  // ==================== دوال الحضور ====================

  openAttendanceDialog(attendanceId?: number) {
    this.editMode = !!attendanceId;
    this.editId = attendanceId || null;

    if (this.editMode && attendanceId) {
      this.traineeAttendanceService.getAttendanceById(attendanceId).subscribe({
        next: (res: any) => {
          this.attendanceForm.patchValue({
            traineeId: res.trainee?.id,
            courseSessionId: res.session?.id,
            status: res.status,
            attendanceDate: res.attendanceDate,
            checkInTime: res.checkInTime,
            checkOutTime: res.checkOutTime,
            lateTime: res.lateTime,
            note: res.note
          });
          this.openDialog();
        },
        error: () => { this.notification.showError('حدث خطأ في تحميل البيانات'); }
      });
    } else {
      this.attendanceForm.reset({
        attendanceDate: new Date().toISOString().split('T')[0],
        checkInTime: '',
        checkOutTime: '',
        lateTime: null,
        note: ''
      });
      this.openDialog();
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(TraineeAttendanceDialogComponent, {
      width: '600px',
      data: {
        form: this.attendanceForm,
        trainees: this.trainees,
        sessions: this.sessions,
        attendanceStatuses: this.attendanceStatuses,
        editMode: this.editMode,
        title: this.editMode ? 'تعديل سجل حضور' : 'تسجيل حضور جديد'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.editMode && this.editId) {
          this.traineeAttendanceService.updateAttendance(this.editId, result).subscribe({
            next: () => {
              this.notification.showSuccess('تم تحديث سجل الحضور بنجاح');
              this.loadAttendances();
            },
            error: (err) => {
              this.notification.showError(err.error?.messageEn || 'حدث خطأ في تحديث سجل الحضور');
            }
          });
        } else {
          this.traineeAttendanceService.createAttendance(result).subscribe({
            next: () => {
              this.notification.showSuccess('تم إضافة سجل الحضور بنجاح');
              this.loadAttendances();
            },
            error: (err) => {
              this.notification.showError(err.error?.messageEn || 'حدث خطأ في إضافة سجل الحضور');
            }
          });
        }
      }
    });
  }

  deleteAttendance(id: number) {
    if (confirm('هل أنت متأكد من حذف سجل الحضور؟')) {
      this.traineeAttendanceService.deleteAttendance(id).subscribe({
        next: () => {
          this.notification.showSuccess('تم حذف سجل الحضور بنجاح');
          this.loadAttendances();
        },
        error: () => { this.notification.showError('حدث خطأ في حذف سجل الحضور'); }
      });
    }
  }
}

// ==================== Dialog Component ====================
@Component({
  selector: 'app-trainee-attendance-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <form [formGroup]="data.form" class="dialog-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>المتدرب *</mat-label>
          <mat-select formControlName="traineeId">
            <mat-option *ngFor="let t of data.trainees" [value]="t.id">{{ t.title }}</mat-option>
          </mat-select>
          <mat-error *ngIf="data.form.get('traineeId')?.hasError('required')">المتدرب مطلوب</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>الجلسة *</mat-label>
          <mat-select formControlName="courseSessionId">
            <mat-option *ngFor="let s of data.sessions" [value]="s.id">{{ s.title }} - {{ s.sessionDate | date }}</mat-option>
          </mat-select>
          <mat-error *ngIf="data.form.get('courseSessionId')?.hasError('required')">الجلسة مطلوبة</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>حالة الحضور *</mat-label>
          <mat-select formControlName="status">
            <mat-option *ngFor="let s of data.attendanceStatuses" [value]="s">{{ s.title }}</mat-option>
          </mat-select>
          <mat-error *ngIf="data.form.get('status')?.hasError('required')">حالة الحضور مطلوبة</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>تاريخ الحضور</mat-label>
          <input matInput [matDatepicker]="datePicker" formControlName="attendanceDate">
          <mat-datepicker-toggle matSuffix [for]="datePicker"></mat-datepicker-toggle>
          <mat-datepicker #datePicker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>وقت الدخول</mat-label>
          <input matInput type="time" formControlName="checkInTime">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>وقت الخروج</mat-label>
          <input matInput type="time" formControlName="checkOutTime">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>وقت التأخير (دقائق)</mat-label>
          <input matInput type="number" formControlName="lateTime" min="0">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>ملاحظات</mat-label>
          <textarea matInput formControlName="note" rows="3"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>إلغاء</button>
      <button mat-raised-button color="primary" [disabled]="data.form.invalid" (click)="save()">
        <mat-icon>save</mat-icon> {{ data.editMode ? 'تحديث' : 'حفظ' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`.dialog-form { display: flex; flex-direction: column; gap: 16px; min-width: 450px; } .full-width { width: 100%; }`]
})
export class TraineeAttendanceDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TraineeAttendanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  save() {
    if (this.data.form.valid) {
      const formValue = this.data.form.value;
      const attendanceData = {
        traineeId: formValue.traineeId,
        courseSessionId: formValue.courseSessionId,
        status: formValue.status,
        attendanceDate: formValue.attendanceDate,
        checkInTime: formValue.checkInTime,
        checkOutTime: formValue.checkOutTime,
        lateTime: formValue.lateTime,
        note: formValue.note
      };
      this.dialogRef.close(attendanceData);
    }
  }
}