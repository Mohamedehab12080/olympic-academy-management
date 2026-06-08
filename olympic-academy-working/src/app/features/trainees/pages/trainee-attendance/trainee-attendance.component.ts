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

import { TraineeAttendanceService } from '../../../../core/services/trainee-attendance.service';
import { CourseService } from '../../../../core/services/course.service';
import { EnrollmentService } from '../../../../core/services/enrollment.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportService } from '../../../../core/services/report.service';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';
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
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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

    const doc = new jsPDF('l', 'mm', 'a4');
    
    doc.setFontSize(18);
    doc.text('تقرير حضور المتدربين', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    
    doc.setFontSize(10);
    let yOffset = 25;
    
    if (this.selectedCourseId) {
      const course = this.courses.find(c => c.id === this.selectedCourseId);
      if (course) doc.text(`الدورة: ${course.title}`, 14, yOffset);
      yOffset += 6;
    }
    if (this.selectedSessionId) {
      const session = this.sessions.find(s => s.id === this.selectedSessionId);
      if (session) doc.text(`الجلسة: ${session.title}`, 14, yOffset);
      yOffset += 6;
    }
    if (this.selectedStatus) {
      const status = this.attendanceStatuses.find(s => s.id === this.selectedStatus);
      if (status) doc.text(`حالة الحضور: ${status.title}`, 14, yOffset);
      yOffset += 6;
    }
    if (this.fromDate) doc.text(`من تاريخ: ${this.fromDate}`, 14, yOffset);
    if (this.toDate) doc.text(`إلى تاريخ: ${this.toDate}`, 14, yOffset + 6);
    
    doc.text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}`, doc.internal.pageSize.getWidth() - 40, 25);
    doc.text(`عدد السجلات: ${this.dataSource.data.length}`, doc.internal.pageSize.getWidth() - 40, 32);
    doc.text(`نسبة الحضور: ${this.summaryStats.attendanceRate}%`, 14, yOffset + 12);

    autoTable(doc, {
      head: [['#', 'المتدرب', 'الدورة', 'الجلسة', 'تاريخ الجلسة', 'الحالة', 'وقت الدخول', 'وقت الخروج', 'وقت التأخير']],
      body: this.dataSource.data.map((item, index) => [
        (index + 1).toString(),
        item.traineeName || '-',
        item.courseTitle || '-',
        item.sessionTitle || '-',
        item.sessionDate || '-',
        item.status?.title || '-',
        item.checkInTime || '-',
        item.checkOutTime || '-',
        item.lateTime ? `${item.lateTime} دقيقة` : '-'
      ]),
      startY: yOffset + 20,
      styles: { halign: 'right', fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' },
      alternateRowStyles: { fillColor: [243, 244, 246] }
    });

    doc.save('trainee-attendance-report.pdf');
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }
}

// Dialog Component
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