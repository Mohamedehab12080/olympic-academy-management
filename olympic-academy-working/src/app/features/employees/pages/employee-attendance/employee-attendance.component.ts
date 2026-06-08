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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { EmployeeService } from '../../../../core/services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportService } from '../../../../core/services/report.service';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';
import { ATTENDANCE_STATUSES } from '../../../../core/models/employee.model';

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
  
  // Options for searchable selects
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
      employeeId: [null, Validators.required],
      status: [null, Validators.required],
      attendanceDate: [this.selectedDate, Validators.required],
      checkInTime: ['', Validators.required],
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
      error: () => {
        this.notification.showError('حدث خطأ في تحميل الموظفين');
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
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات الحضور');
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

  filterByStatus(): void {
    this.loadAttendances();
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

  openAttendanceDialog(attendanceId?: number): void {
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
        error: () => {
          this.notification.showError('حدث خطأ في تحميل البيانات');
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
      width: '600px',
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
            next: () => {
              this.notification.showSuccess('تم تحديث سجل الحضور بنجاح');
              this.loadAttendances();
            },
            error: () => {
              this.notification.showError('حدث خطأ في تحديث سجل الحضور');
            }
          });
        } else {
          this.employeeService.createEmployeeAttendance(result.employeeId, result).subscribe({
            next: () => {
              this.notification.showSuccess('تم إضافة سجل الحضور بنجاح');
              this.loadAttendances();
            },
            error: () => {
              this.notification.showError('حدث خطأ في إضافة سجل الحضور');
            }
          });
        }
      }
    });
  }

  deleteAttendance(id: number): void {
    if (confirm('هل أنت متأكد من حذف سجل الحضور؟')) {
      this.employeeService.deleteEmployeeAttendance(0, id).subscribe({
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
      'الموظف': item.employee?.fullName || item.employee?.title || '-',
      'حالة الحضور': item.status?.title || '-',
      'وقت الدخول': item.checkInTime || '-',
      'وقت الخروج': item.checkOutTime || '-',
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
        item.checkInTime || '-',
        item.checkOutTime || '-',
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

// Dialog Component
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
    SearchableSelectComponent
  ],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <form [formGroup]="data.form" class="dialog-form">
        <app-searchable-select
          [ngModel]="data.form.get('employeeId')?.value"
          (ngModelChange)="data.form.get('employeeId')?.setValue($event)"
          label="الموظف *"
          [options]="employeeOptions"
          [required]="true"
          class="full-width">
        </app-searchable-select>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>التاريخ *</mat-label>
          <input matInput [matDatepicker]="datePicker" formControlName="attendanceDate">
          <mat-datepicker-toggle matSuffix [for]="datePicker"></mat-datepicker-toggle>
          <mat-datepicker #datePicker></mat-datepicker>
          <mat-error *ngIf="data.form.get('attendanceDate')?.hasError('required')">التاريخ مطلوب</mat-error>
        </mat-form-field>

        <app-searchable-select
          [ngModel]="data.form.get('status')?.value?.id"
          (ngModelChange)="data.form.get('status')?.setValue($event)"
          label="حالة الحضور *"
          [options]="statusOptions"
          [required]="true"
          class="full-width">
        </app-searchable-select>

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
export class EmployeeAttendanceDialogComponent {
  employeeOptions: SelectOption[] = [];
  statusOptions: SelectOption[] = [];

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
        value: s, 
        label: s.title 
      }))
    ];
  }

  save(): void {
    if (this.data.form.valid) {
      const formValue = this.data.form.value;
      const attendanceData = {
        employeeId: formValue.employeeId,
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