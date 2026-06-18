// employee-attendance.component.ts - COMPLETE FIXED VERSION

import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
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
import { MatDividerModule } from '@angular/material/divider';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { EmployeeService } from '../../../../core/services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportService } from '../../../../core/services/report.service';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';
import { ATTENDANCE_STATUSES } from '../../../../core/models/employee.model';

// ============================================================================
// CONSTANTS - Map status ID to enum string value
// ============================================================================

const STATUS_ENUM_MAP: { [key: number]: string } = {
  1: 'PRESENT',
  2: 'ABSENT',
  3: 'LATE',
  4: 'EXCUSED'
};

// ============================================================================
// TIME CONVERSION HELPER
// ============================================================================

export function convertTo12HourFormat(timeStr: string | undefined | null): string {
  if (!timeStr) return '-';
  if (timeStr.includes('AM') || timeStr.includes('PM') || timeStr.includes('ص') || timeStr.includes('م')) {
    return timeStr;
  }
  
  try {
    const parts = timeStr.split(':');
    if (parts.length < 2) return timeStr;
    
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const seconds = parts.length > 2 ? parts[2] : '';
    
    if (isNaN(hours)) return timeStr;
    
    const ampm = hours >= 12 ? 'م' : 'ص';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes}${seconds ? ':' + seconds : ''} ${ampm}`;
  } catch (error) {
    return timeStr;
  }
}

// ============================================================================
// ERROR HANDLING HELPER - Using ErrorVTO structure
// ============================================================================

function extractErrorMessage(error: any): string {
  console.log('Error object:', error);
  
  if (error?.error) {
    if (error.error.messageEn) {
      return error.error.messageEn;
    }
    if (error.error.reqBodyErrors && Array.isArray(error.error.reqBodyErrors) && error.error.reqBodyErrors.length > 0) {
      return error.error.reqBodyErrors.join(', ');
    }
    if (error.error.code) {
      return error.error.code;
    }
    if (typeof error.error === 'string') {
      return error.error;
    }
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'حدث خطأ غير متوقع';
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

@Component({
  selector: 'app-employee-attendance',
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
    MatDividerModule,
    SearchableSelectComponent
  ],
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.css']
})
export class EmployeeAttendanceComponent implements OnInit {
  displayedColumns: string[] = ['index', 'employee', 'status', 'checkInTime', 'checkOutTime', 'lateTime', 'note', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;
  
  employees: any[] = [];
  selectedDate: string = new Date().toISOString().split('T')[0];
  selectedStatus: number | null = null;
  selectedEmployeeId: number | null = null;
  attendanceStatuses = ATTENDANCE_STATUSES;
  
  statusOptions: SelectOption[] = [];
  employeeOptions: SelectOption[] = [];
  
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
    private employeeService: EmployeeService,
    private notification: NotificationService,
    private reportService: ReportService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.attendanceForm = this.fb.group({
      employeeId: [null],
      status: [null],
      attendanceDate: [this.selectedDate],
      checkInTime: [''],
      checkOutTime: [''],
      lateTime: [null],
      note: ['']
    });
  }

  ngOnInit(): void {
    this.loadSelectOptions();
    this.loadEmployees();
    this.loadAttendances();
  }

  convertTo12HourFormat(timeStr: string | undefined | null): string {
    return convertTo12HourFormat(timeStr);
  }

  loadSelectOptions(): void {
    this.statusOptions = [
      { value: null, label: 'الكل' },
      ...this.attendanceStatuses.map(s => ({ value: s.id, label: s.title }))
    ];
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployeesLookup().subscribe({
      next: (res: any) => {
        this.employees = res.list || [];
        this.employeeOptions = [
          { value: null, label: 'الكل' },
          ...this.employees.map((e: any) => ({ value: e.id, label: e.title }))
        ];
      },
      error: (err) => {
        this.notification.showError(extractErrorMessage(err));
      }
    });
  }

  loadAttendances(): void {
    this.isLoading = true;
    const params: any = { attendanceDate: this.selectedDate };
    if (this.selectedStatus) params.status = this.selectedStatus;
    if (this.selectedEmployeeId) params.employeeId = this.selectedEmployeeId;

    this.employeeService.getAllEmployeesAttendances(params).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.items || [];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.calculateSummary();
        this.isLoading = false;
      },
      error: (err) => {
        this.notification.showError(extractErrorMessage(err));
        this.isLoading = false;
      }
    });
  }

  calculateSummary(): void {
    const data = this.dataSource.data;
    const present = data.filter(a => a.status?.id === 1).length;
    const absent = data.filter(a => a.status?.id === 2).length;
    const late = data.filter(a => a.status?.id === 3).length;
    const excused = data.filter(a => a.status?.id === 4).length;
    const total = data.length;
    
    this.summaryStats = {
      total: total,
      present: present,
      absent: absent,
      late: late,
      excused: excused,
      attendanceRate: total > 0 ? Math.round(((present + late) / total) * 100) : 0
    };
  }

  // ==========================================================================
  // FIXED: Open Attendance Dialog for Edit
  // ==========================================================================

  openAttendanceDialog(attendanceId?: number): void {
    this.editMode = !!attendanceId;
    this.editId = attendanceId || null;

    if (this.editMode && attendanceId) {
      // We need the employee ID to get the attendance
      // First find the attendance in the dataSource
      const attendance = this.dataSource.data.find(a => a.id === attendanceId);
      const employeeId = attendance?.employee?.id;
      
      if (!employeeId) {
        this.notification.showError('لم يتم العثور على الموظف');
        return;
      }
      
      this.employeeService.getEmployeeAttendance(employeeId, attendanceId).subscribe({
        next: (res: any) => {
          this.attendanceForm.patchValue({
            employeeId: employeeId,
            status: res.status?.id,
            attendanceDate: res.attendanceDate,
            checkInTime: res.checkInTime ? convertTo12HourFormat(res.checkInTime) : '',
            checkOutTime: res.checkOutTime ? convertTo12HourFormat(res.checkOutTime) : '',
            lateTime: res.lateTime,
            note: res.note
          });
          this.openDialog();
        },
        error: (err) => {
          this.notification.showError(extractErrorMessage(err));
        }
      });
    } else {
      this.attendanceForm.reset({
        attendanceDate: this.selectedDate,
        checkInTime: '',
        checkOutTime: '',
        lateTime: null,
        note: ''
      });
      this.attendanceForm.get('attendanceDate')?.setValue(this.selectedDate);
      this.openDialog();
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(EmployeeAttendanceDialogComponent, {
      width: '650px',
      maxWidth: '95vw',
      disableClose: true,
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
        const employeeId = result.employeeId ? Number(result.employeeId) : null;
        
        if (!employeeId) {
          this.notification.showError('الرجاء اختيار موظف');
          return;
        }
        
        if (this.editMode && this.editId) {
          this.employeeService.updateEmployeeAttendance(employeeId, this.editId, result).subscribe({
            next: () => {
              this.notification.showSuccess('تم تحديث سجل الحضور بنجاح');
              this.loadAttendances();
            },
            error: (err) => {
              console.error('Update error:', err);
              this.notification.showError(extractErrorMessage(err));
            }
          });
        } else {
          this.employeeService.createEmployeeAttendance(employeeId, result).subscribe({
            next: () => {
              this.notification.showSuccess('تم إضافة سجل الحضور بنجاح');
              this.loadAttendances();
            },
            error: (err) => {
              console.error('Create error:', err);
              this.notification.showError(extractErrorMessage(err));
            }
          });
        }
      }
    });
  }

  // ==========================================================================
  // FIXED: Delete Attendance - Pass BOTH employeeId and attendanceId
  // ==========================================================================

  deleteAttendance(attendance: any): void {
    // Extract employee ID from the attendance record
    const employeeId = attendance.employee?.id;
    const attendanceId = attendance.id;
    
    console.log('Delete attendance - employeeId:', employeeId, 'attendanceId:', attendanceId);
    
    if (!employeeId) {
      this.notification.showError('لم يتم العثور على الموظف');
      return;
    }
    
    if (!attendanceId) {
      this.notification.showError('لم يتم العثور على سجل الحضور');
      return;
    }
    
    if (confirm('هل أنت متأكد من حذف سجل الحضور؟')) {
      // Call the service with both IDs - matches the API signature
      this.employeeService.deleteEmployeeAttendance(employeeId, attendanceId).subscribe({
        next: () => {
          this.notification.showSuccess('تم حذف سجل الحضور بنجاح');
          this.loadAttendances();
        },
        error: (err) => {
          console.error('Delete error:', err);
          this.notification.showError(extractErrorMessage(err));
        }
      });
    }
  }

  resetFilters(): void {
    this.selectedStatus = null;
    this.selectedEmployeeId = null;
    this.selectedDate = new Date().toISOString().split('T')[0];
    this.loadAttendances();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  refreshData(): void {
    this.loadAttendances();
    this.notification.showSuccess('تم تحديث البيانات');
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportToExcel(): void {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = this.dataSource.data.map((item, index) => ({
      '#': index + 1,
      'الموظف': item.employee?.fullName || item.employee?.title || '-',
      'حالة الحضور': item.status?.title || '-',
      'وقت الدخول': convertTo12HourFormat(item.checkInTime),
      'وقت الخروج': convertTo12HourFormat(item.checkOutTime),
      'وقت التأخير': item.lateTime ? `${item.lateTime} دقيقة` : '-',
      'ملاحظات': item.note || '-'
    }));

    this.reportService.exportToExcel(exportData, `employee-attendance-${this.selectedDate}`, 'حضور الموظفين');
    this.notification.showSuccess('تم تصدير البيانات بنجاح');
  }

  exportToPDF(): void {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const doc = new jsPDF('l', 'mm', 'a4');
    
    doc.setFontSize(18);
    doc.text('تقرير حضور الموظفين', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    
    doc.setFontSize(10);
    let yOffset = 25;
    doc.text(`التاريخ: ${this.selectedDate}`, 14, yOffset);
    yOffset += 6;
    
    if (this.selectedStatus) {
      const status = this.attendanceStatuses.find(s => s.id === this.selectedStatus);
      if (status) doc.text(`حالة الحضور: ${status.title}`, 14, yOffset);
      yOffset += 6;
    }
    
    if (this.selectedEmployeeId) {
      const employee = this.employees.find(e => e.id === this.selectedEmployeeId);
      if (employee) doc.text(`الموظف: ${employee.title}`, 14, yOffset);
      yOffset += 6;
    }
    
    doc.text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}`, doc.internal.pageSize.getWidth() - 40, 25);
    doc.text(`عدد السجلات: ${this.dataSource.data.length}`, doc.internal.pageSize.getWidth() - 40, 32);
    doc.text(`نسبة الحضور: ${this.summaryStats.attendanceRate}%`, 14, yOffset + 6);

    autoTable(doc, {
      head: [['#', 'الموظف', 'حالة الحضور', 'وقت الدخول', 'وقت الخروج', 'وقت التأخير', 'ملاحظات']],
      body: this.dataSource.data.map((item, index) => [
        (index + 1).toString(),
        item.employee?.fullName || item.employee?.title || '-',
        item.status?.title || '-',
        convertTo12HourFormat(item.checkInTime),
        convertTo12HourFormat(item.checkOutTime),
        item.lateTime ? `${item.lateTime} دقيقة` : '-',
        item.note || '-'
      ]),
      startY: yOffset + 15,
      styles: { halign: 'right', fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' },
      alternateRowStyles: { fillColor: [243, 244, 246] }
    });

    doc.save(`employee-attendance-report-${this.selectedDate}.pdf`);
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }
}

// ============================================================================
// DIALOG COMPONENT
// ============================================================================

@Component({
  selector: 'app-employee-attendance-dialog',
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
    MatTooltipModule,
    MatDividerModule,
    SearchableSelectComponent
  ],
  template: `
    <div class="dialog-header">
      <div class="dialog-header-content">
        <mat-icon class="header-icon">event_note</mat-icon>
        <h2 mat-dialog-title class="dialog-title">{{ data.title }}</h2>
      </div>
      <button mat-icon-button mat-dialog-close class="dialog-close-btn">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-divider></mat-divider>

    <mat-dialog-content class="dialog-content">
      <form [formGroup]="data.form" class="dialog-form">
        <app-searchable-select
          formControlName="employeeId"
          label="الموظف *"
          [options]="employeeOptions"
          [required]="false"
          class="full-width">
        </app-searchable-select>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>التاريخ</mat-label>
          <input matInput [matDatepicker]="datePicker" formControlName="attendanceDate">
          <mat-datepicker-toggle matSuffix [for]="datePicker"></mat-datepicker-toggle>
          <mat-datepicker #datePicker></mat-datepicker>
        </mat-form-field>

        <app-searchable-select
          formControlName="status"
          label="حالة الحضور *"
          [options]="statusOptions"
          [required]="false"
          class="full-width">
        </app-searchable-select>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>وقت الدخول</mat-label>
          <input matInput type="time" formControlName="checkInTime" placeholder="HH:MM">
          <mat-icon matSuffix>login</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>وقت الخروج</mat-label>
          <input matInput type="time" formControlName="checkOutTime" placeholder="HH:MM">
          <mat-icon matSuffix>logout</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>وقت التأخير (دقائق)</mat-label>
          <input matInput type="number" formControlName="lateTime" min="0" placeholder="0">
          <mat-icon matSuffix>timer</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>ملاحظات</mat-label>
          <textarea matInput formControlName="note" rows="3" placeholder="أدخل أي ملاحظات إضافية..."></textarea>
          <mat-icon matSuffix>note</mat-icon>
        </mat-form-field>

        <div style="font-size: 12px; color: #6b7280; margin-top: 8px; padding: 8px; background: #f3f4f6; border-radius: 8px; direction: ltr;">
          <div>Employee ID: {{ data.form.get('employeeId')?.value }}</div>
          <div>Status ID: {{ data.form.get('status')?.value }}</div>
          <div>Form Value: {{ data.form.value | json }}</div>
        </div>
      </form>
    </mat-dialog-content>

    <mat-divider></mat-divider>

    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button mat-dialog-close class="cancel-btn">
        <mat-icon>close</mat-icon>
        إلغاء
      </button>
      <button mat-raised-button color="primary" 
              (click)="save()" 
              class="save-btn">
        <mat-icon>save</mat-icon>
        {{ data.editMode ? 'تحديث' : 'حفظ' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
      color: white;
      border-radius: 24px 24px 0 0;
    }
    .dialog-header-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .header-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    .dialog-title {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
    }
    .dialog-close-btn {
      color: white;
      transition: transform 0.2s;
    }
    .dialog-close-btn:hover {
      transform: scale(1.1);
      background: rgba(255, 255, 255, 0.15);
    }
    .dialog-content {
      padding: 24px;
      max-height: 70vh;
      overflow-y: auto;
    }
    .dialog-content::-webkit-scrollbar {
      width: 6px;
    }
    .dialog-content::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }
    .dialog-content::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #06b6d4, #0891b2);
      border-radius: 10px;
    }
    .dialog-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 350px;
    }
    .full-width {
      width: 100%;
    }
    .dialog-actions {
      padding: 16px 24px;
      gap: 12px;
    }
    .cancel-btn {
      color: #6b7280 !important;
      font-weight: 500;
    }
    .cancel-btn:hover {
      background: #f3f4f6 !important;
    }
    .save-btn {
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%) !important;
      color: white !important;
      font-weight: 600;
      border-radius: 10px !important;
      padding: 0 28px;
    }
    .save-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(6, 182, 212, 0.4);
    }
    @media (max-width: 600px) {
      .dialog-content {
        padding: 16px;
      }
      .dialog-form {
        min-width: 100%;
      }
      .dialog-header {
        padding: 16px 20px;
      }
      .dialog-title {
        font-size: 18px;
      }
      .dialog-actions {
        flex-wrap: wrap;
        justify-content: center;
      }
      .save-btn,
      .cancel-btn {
        flex: 1;
        min-width: 120px;
      }
    }
  `]
})
export class EmployeeAttendanceDialogComponent {
  employeeOptions: SelectOption[] = [];
  statusOptions: SelectOption[] = [];

  // Map status ID to enum string value
  private readonly STATUS_ENUM_MAP: { [key: number]: string } = {
    1: 'PRESENT',
    2: 'ABSENT',
    3: 'LATE',
    4: 'EXCUSED'
  };

  constructor(
    public dialogRef: MatDialogRef<EmployeeAttendanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.employeeOptions = [
      ...(data.employees || []).map((e: any) => ({ 
        value: e.id, 
        label: e.title 
      }))
    ];

    this.statusOptions = [
      ...(data.attendanceStatuses || []).map((s: any) => ({ 
        value: s.id, 
        label: s.title 
      }))
    ];

    console.log('Dialog opened');
    console.log('Employee Options:', this.employeeOptions);
    console.log('Status Options:', this.statusOptions);
  }

  save(): void {
    const formValue = this.data.form.value;
    
    console.log('Form values before save:', formValue);
    
    let employeeId = formValue.employeeId;
    if (employeeId === null || employeeId === undefined || employeeId === 'null' || employeeId === '') {
      employeeId = null;
    } else {
      employeeId = Number(employeeId);
      if (isNaN(employeeId) || employeeId <= 0) {
        employeeId = null;
      }
    }
    
    if (!employeeId) {
      this.data.form.get('employeeId')?.markAsTouched();
      this.data.form.get('employeeId')?.setErrors({ required: true });
      this.data.form.updateValueAndValidity();
      alert('الرجاء اختيار موظف');
      return;
    }
    
    let statusId = formValue.status;
    if (statusId === null || statusId === undefined || statusId === 'null' || statusId === '') {
      statusId = null;
    } else {
      statusId = Number(statusId);
      if (isNaN(statusId) || statusId <= 0) {
        statusId = null;
      }
    }
    
    if (!statusId) {
      this.data.form.get('status')?.markAsTouched();
      this.data.form.get('status')?.setErrors({ required: true });
      this.data.form.updateValueAndValidity();
      alert('الرجاء اختيار حالة الحضور');
      return;
    }
    
    const statusEnumValue = this.STATUS_ENUM_MAP[statusId];
    
    const attendanceData = {
      employeeId: employeeId,
      status: statusEnumValue,
      attendanceDate: formValue.attendanceDate || new Date().toISOString().split('T')[0],
      checkInTime: formValue.checkInTime || null,
      checkOutTime: formValue.checkOutTime || null,
      lateTime: formValue.lateTime ? Number(formValue.lateTime) : null,
      note: formValue.note || null
    };
    
    console.log('Sending attendance data:', attendanceData);
    this.dialogRef.close(attendanceData);
  }
}