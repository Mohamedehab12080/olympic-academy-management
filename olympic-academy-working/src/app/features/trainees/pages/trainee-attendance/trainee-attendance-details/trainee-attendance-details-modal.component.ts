import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TraineeAttendanceVTO } from '../../../../../core/models/trainee-attendance.model';

@Component({
  selector: 'app-trainee-attendance-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule
  ],
  template: `
    <div class="modal-container" dir="rtl">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <mat-icon>event</mat-icon>
          <h2>تفاصيل سجل الحضور</h2>
        </div>
        <div class="header-actions">
          <button mat-icon-button (click)="printAttendanceDocument()" matTooltip="طباعة التفاصيل">
            <mat-icon>print</mat-icon>
          </button>
          <button mat-icon-button mat-dialog-close class="close-btn">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>
      
      <mat-divider></mat-divider>
      
      <div class="modal-content">
        <!-- Basic Info -->
        <div class="detail-row">
          <div class="detail-label">رقم السجل:</div>
          <div class="detail-value">#{{ attendance.id }}</div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">المتدرب:</div>
          <div class="detail-value">
            <mat-icon>person</mat-icon>
            <span>{{ attendance.trainee?.title }}</span>
          </div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">الدورة:</div>
          <div class="detail-value">
            <span class="badge course-badge">{{ attendance.course?.title }}</span>
          </div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">الجلسة:</div>
          <div class="detail-value">
            <mat-icon>schedule</mat-icon>
            <span>{{ attendance.session?.title }}</span>
          </div>
        </div>

        <div class="detail-row">
          <div class="detail-label">المكان:</div>
          <div class="detail-value">
            <mat-icon>location_on</mat-icon>
            <span>{{ attendance.session?.place?.title }}</span>
          </div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">تاريخ الجلسة:</div>
          <div class="detail-value">
            <mat-icon>event</mat-icon>
            <span>{{ attendance.attendanceDate | date:'dd/MM/yyyy' }}</span>
          </div>
        </div>
        
        <!-- Status -->
        <div class="detail-row">
          <div class="detail-label">حالة الحضور:</div>
          <div class="detail-value">
            <span class="status-badge" [ngClass]="getStatusClass(attendance.status?.id ?? 0)">
              {{ attendance.status?.title }}
            </span>
          </div>
        </div>
        
        <!-- Times -->
        <div class="detail-row" *ngIf="attendance.checkInTime">
          <div class="detail-label">وقت الدخول:</div>
          <div class="detail-value">
            <mat-icon>login</mat-icon>
            <span>{{ attendance.checkInTime }}</span>
          </div>
        </div>
        
        <div class="detail-row" *ngIf="attendance.checkOutTime">
          <div class="detail-label">وقت الخروج:</div>
          <div class="detail-value">
            <mat-icon>logout</mat-icon>
            <span>{{ attendance.checkOutTime }}</span>
          </div>
        </div>
        
        <div class="detail-row" *ngIf="attendance.lateTime">
          <div class="detail-label">وقت التأخير:</div>
          <div class="detail-value late-value">
            <mat-icon>warning</mat-icon>
            <span>{{ attendance.lateTime }} دقيقة</span>
          </div>
        </div>
        
        <!-- Note -->
        <div class="detail-row" *ngIf="attendance.note">
          <div class="detail-label">ملاحظات:</div>
          <div class="detail-value note-value">{{ attendance.note }}</div>
        </div>
        
        <mat-divider></mat-divider>
        
        <!-- System Info -->
        <div class="info-section">
          <h4>معلومات الإنشاء والتعديل</h4>
          <div class="detail-row small">
            <div class="detail-label">تم الإنشاء بواسطة:</div>
            <div class="detail-value">{{ attendance.createdBy?.fullName || '-' }}</div>
          </div>
          <div class="detail-row small">
            <div class="detail-label">تاريخ الإنشاء:</div>
            <div class="detail-value">{{ attendance.createdOn | date:'dd/MM/yyyy HH:mm' }}</div>
          </div>
          <div class="detail-row small" *ngIf="attendance.lastModifiedBy">
            <div class="detail-label">تم التعديل بواسطة:</div>
            <div class="detail-value">{{ attendance.lastModifiedBy?.fullName }}</div>
          </div>
          <div class="detail-row small" *ngIf="attendance.lastModifiedOn">
            <div class="detail-label">تاريخ التعديل:</div>
            <div class="detail-value">{{ attendance.lastModifiedOn | date:'dd/MM/yyyy HH:mm' }}</div>
          </div>
        </div>
      </div>
      
      <mat-divider></mat-divider>
      
      <!-- Modal Actions -->
      <div class="modal-actions">
        <button mat-raised-button color="accent" (click)="printAttendanceDocument()" matTooltip="طباعة التفاصيل">
          <mat-icon>print</mat-icon>
          طباعة
        </button>
        <button mat-raised-button color="primary" (click)="editAttendance()">
          <mat-icon>edit</mat-icon>
          تعديل
        </button>
        <button mat-raised-button color="warn" (click)="deleteAttendance()">
          <mat-icon>delete</mat-icon>
          حذف
        </button>
        <button mat-button mat-dialog-close>
          <mat-icon>close</mat-icon>
          إغلاق
        </button>
      </div>
    </div>
  `,
  styles: [`
    .modal-container {
      min-width: 550px;
      max-width: 650px;
      direction: rtl;
      background: #f5f7fa;
      border-radius: 24px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .modal-header {
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
      color: white;
    }
    .header-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .header-title mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    .modal-header h2 {
      margin: 0;
      font-size: 20px;
    }
    .header-actions {
      display: flex;
      gap: 8px;
    }
    .close-btn {
      color: white;
      transition: transform 0.2s;
    }
    .close-btn:hover {
      transform: scale(1.1);
    }
    .modal-content {
      padding: 20px;
      max-height: 60vh;
      overflow-y: auto;
    }
    .detail-row {
      display: flex;
      margin-bottom: 14px;
      align-items: center;
    }
    .detail-label {
      width: 130px;
      font-weight: 600;
      color: #374151;
    }
    .detail-value {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      color: #1f2937;
    }
    .detail-value mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #6b7280;
    }
    .detail-value.late-value {
      color: #f59e0b;
      font-weight: 500;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }
    .course-badge {
      background: #e0e7ff;
      color: #4338ca;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 14px;
      border-radius: 30px;
      font-size: 12px;
      font-weight: 600;
    }
    .status-badge.present {
      background: #d1fae5;
      color: #065f46;
    }
    .status-badge.absent {
      background: #fee2e2;
      color: #991b1b;
    }
    .status-badge.late {
      background: #fef3c7;
      color: #92400e;
    }
    .status-badge.excused {
      background: #dbeafe;
      color: #1e40af;
    }
    .note-value {
      background: #f9fafb;
      padding: 8px 12px;
      border-radius: 8px;
      line-height: 1.5;
    }
    .info-section {
      margin-top: 20px;
      padding: 16px;
      background: #f9fafb;
      border-radius: 12px;
    }
    .info-section h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: #374151;
    }
    .detail-row.small {
      margin-bottom: 8px;
    }
    .detail-row.small .detail-label {
      font-size: 12px;
      color: #6b7280;
    }
    .detail-row.small .detail-value {
      font-size: 12px;
    }
    .modal-actions {
      flex-shrink: 0;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding: 16px 20px;
      background: white;
      border-top: 1px solid #e5e7eb;
    }
    @media (max-width: 600px) {
      .modal-container {
        min-width: 90vw;
        max-width: 90vw;
      }
      .detail-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }
      .detail-label {
        width: 100%;
      }
      .modal-actions {
        flex-wrap: wrap;
      }
    }
  `]
})
export class TraineeAttendanceDetailsModalComponent {
  constructor(
    private dialogRef: MatDialogRef<TraineeAttendanceDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public attendance: TraineeAttendanceVTO,
    private router: Router
  ) {}

  getStatusClass(statusId: number): string {
    const classes: { [key: number]: string } = {
      1: 'present',
      2: 'absent',
      3: 'late',
      4: 'excused'
    };
    return classes[statusId] || '';
  }

  editAttendance(): void {
    this.dialogRef.close();
    this.router.navigate(['/trainees/attendance', this.attendance.id, 'edit']);
  }

  deleteAttendance(): void {
    this.dialogRef.close({ action: 'delete', attendanceId: this.attendance.id });
  }

  printAttendanceDocument(): void {
    this.generatePrintDocument(this.attendance);
  }

  generatePrintDocument(attendance: TraineeAttendanceVTO): void {
    const printContainer = document.createElement('div');
    printContainer.style.direction = 'rtl';
    printContainer.style.fontFamily = 'Cairo, "Segoe UI", Tahoma, sans-serif';
    printContainer.style.padding = '20px';
    printContainer.style.backgroundColor = 'white';
    printContainer.style.maxWidth = '800px';
    printContainer.style.margin = '0 auto';
    
    const today = new Date().toLocaleDateString('ar-EG');
    const statusClass = this.getStatusClass(attendance.status?.id ?? 0);
    let statusStyle = '';
    if (statusClass === 'present') statusStyle = 'background-color: #d1fae5; color: #065f46;';
    else if (statusClass === 'absent') statusStyle = 'background-color: #fee2e2; color: #991b1b;';
    else if (statusClass === 'late') statusStyle = 'background-color: #fef3c7; color: #92400e;';
    else if (statusClass === 'excused') statusStyle = 'background-color: #dbeafe; color: #1e40af;';
    
    printContainer.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>سجل حضور - ${attendance.trainee?.title || ''}</title>
        <style>
          * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; }
          @media print { 
            body { margin: 0; padding: 20px; } 
            .no-print { display: none; }
            .signature-line { border-top: 1px solid #000 !important; }
          }
          .application-container { max-width: 800px; margin: 0 auto; background: white; }
          .header { text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: white; border-radius: 12px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 10px 0 0 0; font-size: 12px; opacity: 0.9; }
          .application-details { display: flex; justify-content: space-between; margin-bottom: 20px; padding: 10px; background: #f9fafb; border-radius: 8px; }
          h2 { color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 8px; margin-top: 24px; margin-bottom: 16px; font-size: 18px; }
          .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px; }
          .info-item { border-bottom: 1px solid #e5e7eb; padding: 8px 0; }
          .info-label { font-weight: 600; color: #374151; font-size: 13px; margin-bottom: 4px; }
          .info-value { color: #1f2937; font-size: 14px; }
          .info-value.late { color: #f59e0b; font-weight: 500; }
          .signature-section { margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          .signature-box { text-align: center; flex: 1; }
          .signature-line { width: 100%; border-top: 1px solid #000; margin-top: 40px; padding-top: 8px; }
          .signature-date { font-size: 10px; color: #6b7280; margin-top: 8px; }
          .footer { text-align: center; margin-top: 30px; padding: 16px; font-size: 10px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
          @media (max-width: 600px) { 
            .info-grid { grid-template-columns: 1fr; } 
            .signature-section { flex-direction: column; align-items: center; gap: 30px; }
            .signature-box { width: 100%; }
          }
        </style>
      </head>
      <body>
        <div class="application-container">
          <div class="header">
            <h1>سجل حضور متدرب</h1>
            <p>نظام إدارة الأكاديمية الأولمبية</p>
          </div>
          
          <div class="application-details">
            <div><strong>رقم السجل:</strong> #${attendance.id}</div>
            <div><strong>تاريخ الطباعة:</strong> ${today}</div>
          </div>
          
          <h2>📋 معلومات المتدرب</h2>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">اسم المتدرب</div><div class="info-value">${attendance.trainee?.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">الدورة</div><div class="info-value">${attendance.course?.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">الجلسة</div><div class="info-value">${attendance.session?.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">المكان</div><div class="info-value">${attendance.session?.place?.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">تاريخ الحضور</div><div class="info-value">${attendance.attendanceDate || '-'}</div></div>
          </div>
          
          <h2>⏱️ تفاصيل الحضور</h2>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">حالة الحضور</div><div class="info-value"><span style="display: inline-block; padding: 4px 12px; border-radius: 20px; ${statusStyle}">${attendance.status?.title || '-'}</span></div></div>
            <div class="info-item"><div class="info-label">وقت الدخول</div><div class="info-value">${attendance.checkInTime || '-'}</div></div>
            <div class="info-item"><div class="info-label">وقت الخروج</div><div class="info-value">${attendance.checkOutTime || '-'}</div></div>
            <div class="info-item"><div class="info-label">وقت التأخير</div><div class="info-value ${attendance.lateTime ? 'late' : ''}">${attendance.lateTime ? attendance.lateTime + ' دقيقة' : '-'}</div></div>
          </div>
          
          ${attendance.note ? `
          <h2>📝 ملاحظات</h2>
          <div class="info-item" style="border-bottom: none;">${attendance.note}</div>
          ` : ''}
          
          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line"></div>
              <div>توقيع المتدرب</div>
              <div class="signature-date">التاريخ: ___ / ___ / _____</div>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <div>توقيع المدرب</div>
              <div class="signature-date">التاريخ: ___ / ___ / _____</div>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <div>ختم الأكاديمية</div>
              <div class="signature-date">التاريخ: ___ / ___ / _____</div>
            </div>
          </div>
          
          <div class="footer">
            تم التصدير من نظام إدارة الأكاديمية الأولمبية<br>
            هذا المستند معتمد ويحتوي على بيانات حضور المتدرب
          </div>
        </div>
        <div class="no-print" style="text-align: center; margin-top: 20px; padding: 10px;">
          <button onclick="window.print();" style="padding: 10px 20px; background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: white; border: none; border-radius: 5px; cursor: pointer;">
            🖨️ طباعة / حفظ كـ PDF
          </button>
        </div>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank', 'width=800,height=800,scrollbars=yes');
    if (printWindow) {
      printWindow.document.write(printContainer.innerHTML);
      printWindow.document.close();
    } else {
      document.body.appendChild(printContainer);
      window.print();
      setTimeout(() => { document.body.removeChild(printContainer); }, 500);
    }
  }
}