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
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TraineeAttendanceDetailsModalComponent } from './trainee-attendance-details/trainee-attendance-details-modal.component';

import { TraineeAttendanceService } from '../../../../core/services/trainee-attendance.service';
import { CourseService } from '../../../../core/services/course.service';
import { EnrollmentService } from '../../../../core/services/enrollment.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportService } from '../../../../core/services/report.service';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';
import { TRAINEE_ATTENDANCE_STATUSES, TraineeAttendanceListItem ,TraineeAttendanceVTO} from '../../../../core/models/trainee-attendance.model';
import { LookupVTO } from '../../../../core/models/common.model';

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
    MatChipsModule,
    MatTooltipModule,
    SearchableSelectComponent
  ],
  templateUrl: './trainee-attendance.component.html',
  styleUrls: ['./trainee-attendance.component.css']
})
export class TraineeAttendanceComponent implements OnInit {
  displayedColumns: string[] = ['index', 'traineeName', 'courseTitle', 'sessionTitle', 'sessionDate', 'status', 'checkInTime', 'checkOutTime', 'lateTime', 'actions'];
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
  
  courseOptions: SelectOption[] = [];
  sessionOptions: SelectOption[] = [];
  statusOptions: SelectOption[] = [];
  
  attendanceForm: FormGroup;
  editMode = false;
  editId: number | null = null;
  
  summaryStats = {
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    attendanceRate: 0
  };

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

  ngOnInit(): void {
    this.loadSelectOptions();
    this.loadCourses();
    this.loadTrainees();
    this.loadAttendances();
  }

  loadSelectOptions(): void {
    this.statusOptions = [
      { value: null, label: 'الكل' },
      ...this.attendanceStatuses.map(s => ({ value: s.id, label: s.title }))
    ];
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (res: any) => {
        this.courses = res.items || [];
        this.courseOptions = [
          { value: null, label: 'الكل' },
          ...this.courses.map(c => ({ value: c.id, label: c.title }))
        ];
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل الدورات');
      }
    });
  }

  loadTrainees(): void {
    this.enrollmentService.getAllEnrollmentsByFilter().subscribe({
      next: (res: any) => {
        const uniqueTrainees = new Map();
        res.items?.forEach((e: any) => {
          if (e.trainee && !uniqueTrainees.has(e.trainee.id)) {
            uniqueTrainees.set(e.trainee.id, e.trainee);
          }
        });
        this.trainees = Array.from(uniqueTrainees.values());
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل المتدربين');
      }
    });
  }

  onCourseChange(): void {
    if (this.selectedCourseId) {
      this.courseService.getAllSessionsByFilter({ courseId: this.selectedCourseId }).subscribe({
        next: (res: any) => {
          this.sessions = res.items || [];
          this.sessionOptions = [
            { value: null, label: 'الكل' },
            ...this.sessions.map(s => ({ 
              value: s.id, 
              label: `${s.title} - ${s.sessionDate ? new Date(s.sessionDate).toLocaleDateString('ar-EG') : ''}`
            }))
          ];
        },
        error: () => {
          this.notification.showError('حدث خطأ في تحميل الجلسات');
        }
      });
    } else {
      this.sessions = [];
      this.sessionOptions = [{ value: null, label: 'الكل' }];
      this.selectedSessionId = null;
      this.loadAttendances();
    }
  }

  loadAttendances(): void {
    this.isLoading = true;
    const params: any = {};
    
    if (this.selectedSessionId) params.courseSessionId = this.selectedSessionId;
    if (this.selectedStatus) params.status = this.selectedStatus;
    if (this.fromDate) params.fromDate = this.fromDate;
    if (this.toDate) params.toDate = this.toDate;

    this.traineeAttendanceService.getAllAttendances(params).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.items || [];
        if (this.dataSource.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        if (this.dataSource.sort) {
          this.dataSource.sort = this.sort;
        }
        this.calculateSummary();
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات الحضور');
        this.isLoading = false;
      }
    });
  }

  calculateSummary(): void {
    const data = this.dataSource.data;
    const present = data.filter(a => a.status?.id === 1).length;
    const total = data.length;
    
    this.summaryStats = {
      total: total,
      present: present,
      absent: data.filter(a => a.status?.id === 2).length,
      late: data.filter(a => a.status?.id === 3).length,
      excused: data.filter(a => a.status?.id === 4).length,
      attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0
    };
  }

  resetFilters(): void {
    this.selectedCourseId = null;
    this.selectedSessionId = null;
    this.selectedStatus = null;
    this.fromDate = '';
    this.toDate = '';
    this.sessions = [];
    this.sessionOptions = [{ value: null, label: 'الكل' }];
    this.loadAttendances();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAttendanceDialog(attendanceId?: number): void {
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
        error: () => {
          this.notification.showError('حدث خطأ في تحميل البيانات');
        }
      });
    } else {
      this.attendanceForm.reset({
        traineeId: null,
        courseSessionId: null,
        status: null,
        attendanceDate: new Date().toISOString().split('T')[0],
        checkInTime: '',
        checkOutTime: '',
        lateTime: null,
        note: ''
      });
      this.openDialog();
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TraineeAttendanceDialogComponent, {
      width: '650px',
      disableClose: true,
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

  viewAttendance(id: number): void {
  this.traineeAttendanceService.getAttendanceById(id).subscribe({
    next: (attendance: TraineeAttendanceVTO) => {
      this.dialog.open(TraineeAttendanceDetailsModalComponent, {
        data: attendance,
        width: '650px',
        maxWidth: '90vw'
      });
    },
    error: () => {
      this.notification.showError('حدث خطأ في تحميل بيانات سجل الحضور');
    }
  });
}

  deleteAttendance(id: number): void {
    if (confirm('هل أنت متأكد من حذف سجل الحضور؟')) {
      this.traineeAttendanceService.deleteAttendance(id).subscribe({
        next: () => {
          this.notification.showSuccess('تم حذف سجل الحضور بنجاح');
          this.loadAttendances();
        },
        error: () => {
          this.notification.showError('حدث خطأ في حذف سجل الحضور');
        }
      });
    }
  }

  exportToExcel(): void {
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
      'وقت التأخير': item.lateTime ? `${item.lateTime} دقيقة` : '-'
    }));

    this.reportService.exportToExcel(exportData, 'trainee-attendance', 'سجلات الحضور');
    this.notification.showSuccess('تم تصدير البيانات بنجاح');
  }

  exportToPDF(): void {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    this.isLoading = true;

    // Build filter text
    const filterTexts: string[] = [];
    if (this.selectedCourseId) {
      const course = this.courses.find(c => c.id === this.selectedCourseId);
      if (course) filterTexts.push(`الدورة: ${course.title}`);
    }
    if (this.selectedSessionId) {
      const session = this.sessions.find(s => s.id === this.selectedSessionId);
      if (session) filterTexts.push(`الجلسة: ${session.title}`);
    }
    if (this.selectedStatus) {
      const status = this.attendanceStatuses.find(s => s.id === this.selectedStatus);
      if (status) filterTexts.push(`حالة الحضور: ${status.title}`);
    }
    if (this.fromDate) filterTexts.push(`من تاريخ: ${this.fromDate}`);
    if (this.toDate) filterTexts.push(`إلى تاريخ: ${this.toDate}`);

    // Build table rows
    let tableRows = '';
    this.dataSource.data.forEach((item: TraineeAttendanceListItem, index: number) => {
      const statusClass = this.getStatusClass(item.status?.id);
      let statusStyle = '';
      if (statusClass === 'present') statusStyle = 'background-color: #d1fae5; color: #065f46;';
      else if (statusClass === 'absent') statusStyle = 'background-color: #fee2e2; color: #991b1b;';
      else if (statusClass === 'late') statusStyle = 'background-color: #fef3c7; color: #92400e;';
      else if (statusClass === 'excused') statusStyle = 'background-color: #dbeafe; color: #1e40af;';
      
      tableRows += `
        <tr>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd; font-weight: bold;">${item.traineeName || '-'}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${item.courseTitle || '-'}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${item.sessionTitle || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.sessionDate || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd; ${statusStyle}">
            ${item.status?.title || '-'}
          </td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.checkInTime || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.checkOutTime || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.lateTime ? item.lateTime + ' دقيقة' : '-'}</td>
        </tr>
      `;
    });

    // Create print container
    const printContainer = document.createElement('div');
    printContainer.style.direction = 'rtl';
    printContainer.style.fontFamily = 'Cairo, "Segoe UI", Tahoma, sans-serif';
    printContainer.style.padding = '20px';
    printContainer.style.backgroundColor = 'white';
    
    printContainer.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>تقرير حضور المتدربين</title>
        <style>
          * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; }
          @media print {
            body { margin: 0; padding: 20px; }
            .no-print { display: none; }
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            padding: 20px;
            background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
            color: white;
            border-radius: 8px;
          }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 10px 0 0 0; font-size: 12px; }
          .filters {
            margin-bottom: 20px;
            padding: 10px;
            background-color: #f3f4f6;
            border-radius: 8px;
            font-size: 12px;
          }
          .stats {
            display: flex;
            gap: 16px;
            margin-bottom: 20px;
            padding: 16px;
            background: #f9fafb;
            border-radius: 8px;
            flex-wrap: wrap;
          }
          .stat-item {
            flex: 1;
            text-align: center;
            min-width: 100px;
          }
          .stat-label { font-size: 12px; color: #6b7280; }
          .stat-value { font-size: 20px; font-weight: bold; color: #8b5cf6; }
          .stat-value.present { color: #10b981; }
          .stat-value.absent { color: #ef4444; }
          .stat-value.late { color: #f59e0b; }
          .stat-value.excused { color: #3b82f6; }
          table {
            width: 100%;
            border-collapse: collapse;
            direction: rtl;
          }
          th {
            background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
            color: white;
            padding: 10px;
            border: 1px solid #ddd;
            text-align: center;
            font-weight: bold;
          }
          td { padding: 8px; border: 1px solid #ddd; }
          .footer {
            text-align: center;
            margin-top: 20px;
            padding: 10px;
            font-size: 10px;
            color: #666;
          }
          @media (max-width: 768px) {
            .stats { flex-direction: column; }
            .stat-item { min-width: auto; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>تقرير حضور المتدربين</h1>
          <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</p>
          <p>عدد السجلات: ${this.dataSource.data.length} سجل</p>
        </div>
        ${filterTexts.length > 0 ? `<div class="filters"><strong>الفلاتر المطبقة:</strong> ${filterTexts.join(' | ')}</div>` : ''}
        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">${this.summaryStats.total}</div>
            <div class="stat-label">إجمالي السجلات</div>
          </div>
          <div class="stat-item">
            <div class="stat-value present">${this.summaryStats.present}</div>
            <div class="stat-label">حاضر</div>
          </div>
          <div class="stat-item">
            <div class="stat-value absent">${this.summaryStats.absent}</div>
            <div class="stat-label">غائب</div>
          </div>
          <div class="stat-item">
            <div class="stat-value late">${this.summaryStats.late}</div>
            <div class="stat-label">متأخر</div>
          </div>
          <div class="stat-item">
            <div class="stat-value excused">${this.summaryStats.excused}</div>
            <div class="stat-label">معتذر</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${this.summaryStats.attendanceRate}%</div>
            <div class="stat-label">نسبة الحضور</div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>المتدرب</th>
              <th>الدورة</th>
              <th>الجلسة</th>
              <th>تاريخ الجلسة</th>
              <th>الحالة</th>
              <th>وقت الدخول</th>
              <th>وقت الخروج</th>
              <th>وقت التأخير</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <div class="footer">
          تم التصدير من نظام إدارة الأكاديمية الأولمبية
        </div>
        <div class="no-print" style="text-align: center; margin-top: 20px; padding: 10px;">
          <button onclick="window.print();" style="padding: 10px 20px; background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: white; border: none; border-radius: 5px; cursor: pointer;">
            🖨️ طباعة / حفظ كـ PDF
          </button>
        </div>
      </body>
      </html>
    `;

    // Open in new window for printing
    const printWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes');
    if (printWindow) {
      printWindow.document.write(printContainer.innerHTML);
      printWindow.document.close();
      this.isLoading = false;
      this.notification.showSuccess('تم فتح التقرير - يمكنك طباعته أو حفظه كـ PDF');
    } else {
      document.body.appendChild(printContainer);
      window.print();
      setTimeout(() => {
        document.body.removeChild(printContainer);
      }, 500);
      this.isLoading = false;
      this.notification.showSuccess('تم فتح التقرير - يمكنك حفظه كـ PDF من نافذة الطباعة');
    }
  }

  getStatusClass(statusId: number): string {
    const classes: { [key: number]: string } = {
      1: 'present',
      2: 'absent',
      3: 'late',
      4: 'excused'
    };
    return classes[statusId] || '';
  }
}

// Dialog Component remains the same
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
    MatIconModule,
    SearchableSelectComponent
  ],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <form [formGroup]="data.form" class="dialog-form">
        <app-searchable-select
          [ngModel]="data.form.get('traineeId')?.value"
          (ngModelChange)="data.form.get('traineeId')?.setValue($event)"
          label="المتدرب *"
          [options]="traineeOptions"
          [required]="true"
          [ngModelOptions]="{standalone: true}">
        </app-searchable-select>

        <app-searchable-select
          [ngModel]="data.form.get('courseSessionId')?.value"
          (ngModelChange)="data.form.get('courseSessionId')?.setValue($event)"
          label="الجلسة *"
          [options]="sessionOptions"
          [required]="true"
          [ngModelOptions]="{standalone: true}">
        </app-searchable-select>

        <app-searchable-select
          [ngModel]="data.form.get('status')?.value"
          (ngModelChange)="data.form.get('status')?.setValue($event)"
          label="حالة الحضور *"
          [options]="statusOptions"
          [required]="true"
          [ngModelOptions]="{standalone: true}">
        </app-searchable-select>

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
  styles: [`
    .dialog-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 450px;
      padding: 16px 0;
    }
    .full-width {
      width: 100%;
    }
  `]
})
export class TraineeAttendanceDialogComponent {
  traineeOptions: SelectOption[] = [];
  sessionOptions: SelectOption[] = [];
  statusOptions: SelectOption[] = [];

  constructor(
    public dialogRef: MatDialogRef<TraineeAttendanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.traineeOptions = (data.trainees || []).map((t: any) => ({ 
      value: t.id, 
      label: t.title || t.fullName 
    }));
    
    this.sessionOptions = (data.sessions || []).map((s: any) => ({ 
      value: s.id, 
      label: `${s.title} - ${s.sessionDate ? new Date(s.sessionDate).toLocaleDateString('ar-EG') : ''}`
    }));
    
    this.statusOptions = (data.attendanceStatuses || []).map((s: any) => ({ 
      value: s, 
      label: s.title 
    }));
  }

  save(): void {
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