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
import { EmployeeService } from '../../../../core/services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportService } from '../../../../core/services/report.service';
import { ATTENDANCE_STATUSES } from '../../../../core/models/employee.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-employee-attendance',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatSelectModule,
    MatTableModule, MatIconModule, MatProgressSpinnerModule, MatPaginatorModule, MatSortModule, MatDialogModule
  ],
  template: `
    <div class="attendance-container">
      <mat-card>
        <div class="header">
          <div class="header-title">
            <h1>حضور الموظفين</h1>
            <p>تسجيل ومتابعة حضور وانصراف الموظفين</p>
          </div>
          <div class="header-actions">
            <button mat-raised-button color="primary" (click)="openAttendanceDialog()" class="add-btn">
              <mat-icon>add</mat-icon> تسجيل حضور
            </button>
          </div>
        </div>

        <div class="filters">
          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>اختر التاريخ</mat-label>
            <input matInput [matDatepicker]="datePicker" [(ngModel)]="selectedDate" (dateChange)="loadAttendances()">
            <mat-datepicker-toggle matSuffix [for]="datePicker"></mat-datepicker-toggle>
            <mat-datepicker #datePicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>حالة الحضور</mat-label>
            <mat-select [(ngModel)]="selectedStatus" (selectionChange)="filterByStatus()">
              <mat-option [value]="null">الكل</mat-option>
              <mat-option *ngFor="let s of attendanceStatuses" [value]="s.id">{{ s.title }}</mat-option>
            </mat-select>
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

        <div class="table-container" *ngIf="!isLoading; else loading">
          <div class="table-info" *ngIf="dataSource.data.length > 0">
            <p>عدد السجلات: {{ dataSource.data.length }} سجل</p>
          </div>
          <table mat-table [dataSource]="dataSource" matSort class="full-width-table">
            <ng-container matColumnDef="employee">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>الموظف</th>
              <td mat-cell *matCellDef="let a">{{ a.employee?.fullName || a.employee?.title }}<\/td>
            <\/ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>الحالة</th>
              <td mat-cell *matCellDef="let a">
                <span class="status-badge" [class.present]="a.status?.id===1" [class.absent]="a.status?.id===2" [class.late]="a.status?.id===3" [class.excused]="a.status?.id===4">
                  {{ a.status?.title }}
                <\/span>
              <\/td>
            <\/ng-container>
            <ng-container matColumnDef="checkInTime">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>وقت الدخول</th>
              <td mat-cell *matCellDef="let a">{{ a.checkInTime || '-' }}<\/td>
            <\/ng-container>
            <ng-container matColumnDef="checkOutTime">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>وقت الخروج</th>
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
        <ng-template #loading>
          <div class="loading"><mat-spinner diameter="40"><\/mat-spinner><p>جاري تحميل البيانات...<\/p><\/div>
        <\/ng-template>
      <\/mat-card>
    <\/div>
  `,
  styles: [`
    .attendance-container { padding: 24px; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    .header-title h1 { margin: 0 0 8px 0; font-size: 28px; font-weight: 700; color: #1f2937; }
    .header-title p { margin: 0; color: #6b7280; }
    .header-actions { display: flex; gap: 12px; }
    .add-btn { height: 48px; padding: 0 24px; }
    .filters { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; align-items: center; }
    .filter-field { width: 200px; }
    .action-buttons { display: flex; gap: 12px; align-items: center; }
    .refresh-btn, .export-btn { height: 56px; padding: 0 24px; }
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
    .loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; gap: 16px; }
    .dialog-form { display: flex; flex-direction: column; gap: 16px; min-width: 450px; padding: 16px 0; }
    .full-width { width: 100%; }
    @media (max-width: 768px) { .action-buttons { width: 100%; justify-content: flex-start; } }
  `]
})
export class EmployeeAttendanceComponent implements OnInit {
  displayedColumns = ['employee', 'status', 'checkInTime', 'checkOutTime', 'lateTime', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;
  employees: any[] = [];
  selectedDate: string = new Date().toISOString().split('T')[0];
  selectedStatus: number | null = null;
  attendanceStatuses = ATTENDANCE_STATUSES;
  attendanceForm: FormGroup;
  editMode = false;
  editId: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private employeeService: EmployeeService,
    private notification: NotificationService,
    private reportService: ReportService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.attendanceForm = this.fb.group({
      employeeId: [null, Validators.required],
      status: [null, Validators.required],
      attendanceDate: [new Date().toISOString().split('T')[0], Validators.required],
      checkInTime: ['', Validators.required],
      checkOutTime: [''],
      lateTime: [null],
      note: ['']
    });
  }

  ngOnInit() {
    this.loadEmployees();
    this.loadAttendances();
  }

  loadEmployees() {
    this.employeeService.getAllEmployeesLookup().subscribe({
      next: (res: any) => { this.employees = res.list; },
      error: () => { this.notification.showError('حدث خطأ'); }
    });
  }

  loadAttendances() {
    this.isLoading = true;
    const params: any = { attendanceDate: this.selectedDate };
    if (this.selectedStatus) params.status = this.selectedStatus;

    this.employeeService.getAllEmployeesAttendances(params).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.items;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: () => { this.notification.showError('حدث خطأ'); this.isLoading = false; }
    });
  }

  filterByStatus() { this.loadAttendances(); }

  refreshData() { this.loadAttendances(); this.notification.showSuccess('تم تحديث البيانات'); }

  // ==================== دوال التصدير ====================

  exportToExcel() {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = this.dataSource.data.map((item, index) => ({
      '#': index + 1,
      'الموظف': item.employee?.fullName || item.employee?.title,
      'حالة الحضور': item.status?.title,
      'وقت الدخول': item.checkInTime || '-',
      'وقت الخروج': item.checkOutTime || '-',
      'وقت التأخير': item.lateTime ? `${item.lateTime} دقيقة` : '-',
      'ملاحظات': item.note || '-'
    }));

    this.reportService.exportToExcel(exportData, `employee-attendance-${this.selectedDate}`, 'حضور الموظفين');
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
    doc.text('تقرير حضور الموظفين', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    
    // معلومات الفلترة
    doc.setFontSize(10);
    doc.text(`التاريخ: ${this.selectedDate}`, 14, 25);
    if (this.selectedStatus) {
      const status = this.attendanceStatuses.find(s => s.id === this.selectedStatus);
      doc.text(`حالة الحضور: ${status?.title || ''}`, 14, 32);
    }
    doc.text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}`, doc.internal.pageSize.getWidth() - 40, 25);
    doc.text(`عدد السجلات: ${this.dataSource.data.length}`, doc.internal.pageSize.getWidth() - 40, 32);

    // إنشاء الجدول
    autoTable(doc, {
      head: [['#', 'الموظف', 'حالة الحضور', 'وقت الدخول', 'وقت الخروج', 'وقت التأخير', 'ملاحظات']],
      body: this.dataSource.data.map((item, index) => [
        (index + 1).toString(),
        item.employee?.fullName || item.employee?.title,
        item.status?.title || '-',
        item.checkInTime || '-',
        item.checkOutTime || '-',
        item.lateTime ? `${item.lateTime} دقيقة` : '-',
        item.note || '-'
      ]),
      startY: 40,
      styles: { halign: 'right', fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' },
      alternateRowStyles: { fillColor: [243, 244, 246] }
    });

    doc.save(`employee-attendance-report-${this.selectedDate}.pdf`);
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }

  // ==================== دوال الحضور ====================

  openAttendanceDialog(attendanceId?: number) {
    this.editMode = !!attendanceId;
    this.editId = attendanceId || null;

    if (this.editMode && attendanceId) {
      this.employeeService.getEmployeeAttendance(0, attendanceId).subscribe({
        next: (res: any) => {
          this.attendanceForm.patchValue({
            employeeId: res.employee?.id,
            status: res.status,
            attendanceDate: res.attendanceDate,
            checkInTime: res.checkInTime,
            checkOutTime: res.checkOutTime,
            lateTime: res.lateTime,
            note: res.note
          });
          this.openDialog();
        },
        error: () => { this.notification.showError('حدث خطأ'); }
      });
    } else {
      this.attendanceForm.reset({
        attendanceDate: this.selectedDate,
        checkInTime: '',
        checkOutTime: '',
        lateTime: null,
        note: ''
      });
      this.openDialog();
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(EmployeeAttendanceDialogComponent, {
      width: '550px',
      data: {
        form: this.attendanceForm,
        employees: this.employees,
        attendanceStatuses: this.attendanceStatuses,
        editMode: this.editMode,
        selectedDate: this.selectedDate,
        title: this.editMode ? 'تعديل سجل حضور' : 'تسجيل حضور جديد'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.editMode && this.editId) {
          this.employeeService.updateEmployeeAttendance(result.employeeId, this.editId, result).subscribe({
            next: () => { this.notification.showSuccess('تم التحديث'); this.loadAttendances(); },
            error: () => { this.notification.showError('حدث خطأ'); }
          });
        } else {
          this.employeeService.createEmployeeAttendance(result.employeeId, result).subscribe({
            next: () => { this.notification.showSuccess('تم الإضافة'); this.loadAttendances(); },
            error: () => { this.notification.showError('حدث خطأ'); }
          });
        }
      }
    });
  }

  deleteAttendance(id: number) {
    if (confirm('هل أنت متأكد من حذف سجل الحضور؟')) {
      this.employeeService.deleteEmployeeAttendance(0, id).subscribe({
        next: () => { this.notification.showSuccess('تم الحذف'); this.loadAttendances(); },
        error: () => { this.notification.showError('حدث خطأ'); }
      });
    }
  }
}

// ==================== Dialog Component ====================
@Component({
  selector: 'app-employee-attendance-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <form [formGroup]="data.form" class="dialog-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>الموظف *</mat-label>
          <mat-select formControlName="employeeId">
            <mat-option *ngFor="let e of data.employees" [value]="e.id">{{ e.title }}</mat-option>
          </mat-select>
          <mat-error *ngIf="data.form.get('employeeId')?.hasError('required')">الموظف مطلوب</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>التاريخ *</mat-label>
          <input matInput [matDatepicker]="datePicker" formControlName="attendanceDate">
          <mat-datepicker-toggle matSuffix [for]="datePicker"></mat-datepicker-toggle>
          <mat-datepicker #datePicker></mat-datepicker>
          <mat-error *ngIf="data.form.get('attendanceDate')?.hasError('required')">التاريخ مطلوب</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>حالة الحضور *</mat-label>
          <mat-select formControlName="status">
            <mat-option *ngFor="let s of data.attendanceStatuses" [value]="s">{{ s.title }}</mat-option>
          </mat-select>
          <mat-error *ngIf="data.form.get('status')?.hasError('required')">حالة الحضور مطلوبة</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>وقت الدخول *</mat-label>
          <input matInput type="time" formControlName="checkInTime">
          <mat-error *ngIf="data.form.get('checkInTime')?.hasError('required')">وقت الدخول مطلوب</mat-error>
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
export class EmployeeAttendanceDialogComponent {
  constructor(public dialogRef: MatDialogRef<EmployeeAttendanceDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  
  save() { 
    if (this.data.form.valid) {
      this.dialogRef.close(this.data.form.value);
    }
  }
}