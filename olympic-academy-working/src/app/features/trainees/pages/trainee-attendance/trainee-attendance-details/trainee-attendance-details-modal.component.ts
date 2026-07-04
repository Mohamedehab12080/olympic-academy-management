// trainee-attendance-details-modal.component.ts - UPDATED WITH TRAINER

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
        <!-- Record ID -->
        <div class="detail-row">
          <div class="detail-label">رقم السجل:</div>
          <div class="detail-value">#{{ attendance.id }}</div>
        </div>
        
        <!-- Trainee -->
        <div class="detail-row">
          <div class="detail-label">
            <mat-icon>person</mat-icon>
            المتدرب:
          </div>
          <div class="detail-value">
            <span class="trainee-name">{{ attendance.trainee?.title || '-' }}</span>
          </div>
        </div>
        
        <!-- Course -->
        <div class="detail-row">
          <div class="detail-label">
            <mat-icon>school</mat-icon>
            الدورة:
          </div>
          <div class="detail-value">
            <span class="badge course-badge">{{ attendance.session?.course?.title ||'-' }}</span>
          </div>
        </div>
        
        <!-- Session -->
        <div class="detail-row">
          <div class="detail-label">
            <mat-icon>schedule</mat-icon>
            الجلسة:
          </div>
          <div class="detail-value">
            <span class="session-title">{{ attendance.session?.title || '-' }}</span>
          </div>
        </div>

        <!-- Trainer - NEW -->
        <div class="detail-row">
          <div class="detail-label">
            <mat-icon>person</mat-icon>
            المدرب:
          </div>
          <div class="detail-value">
            <span class="trainer-name">{{ attendance.session?.trainer?.fullName || '-' }}</span>
          </div>
        </div>

        <!-- Place -->
        <div class="detail-row">
          <div class="detail-label">
            <mat-icon>location_on</mat-icon>
            المكان:
          </div>
          <div class="detail-value">
            <span class="place-name">{{ attendance.session?.place?.title || '-' }}</span>
          </div>
        </div>
        
        <!-- Session Date -->
        <div class="detail-row">
          <div class="detail-label">
            <mat-icon>event</mat-icon>
            تاريخ الجلسة:
          </div>
          <div class="detail-value">
            <span>{{ attendance.session?.sessionDate || attendance.attendanceDate | date:'dd/MM/yyyy' }}</span>
          </div>
        </div>
        
        <!-- Session Day -->
        <div class="detail-row">
          <div class="detail-label">
            <mat-icon>today</mat-icon>
            اليوم:
          </div>
          <div class="detail-value">
            <span class="day-badge">{{ getDayDisplay(attendance.session.sessionDay) }}</span>
          </div>
        </div>
        
        <!-- Attendance Date -->
        <div class="detail-row">
          <div class="detail-label">
            <mat-icon>event</mat-icon>
            تاريخ الحضور:
          </div>
          <div class="detail-value">
            <span>{{ attendance.attendanceDate | date:'dd/MM/yyyy' }}</span>
          </div>
        </div>
        
        <!-- Status -->
        <div class="detail-row">
          <div class="detail-label">
            <mat-icon>check_circle</mat-icon>
            حالة الحضور:
          </div>
          <div class="detail-value">
            <span class="status-badge" [ngClass]="getStatusClass(attendance.status?.id ?? 0)">
              <mat-icon class="status-icon">{{ getStatusIcon(attendance.status?.id ?? 0) }}</mat-icon>
              {{ attendance.status?.title || '-' }}
            </span>
          </div>
        </div>
        
        <!-- Times -->
        <div class="detail-row" *ngIf="attendance.checkInTime">
          <div class="detail-label">
            <mat-icon>login</mat-icon>
            وقت الدخول:
          </div>
          <div class="detail-value">
            <span class="time-value">{{ formatTime(attendance.checkInTime) }}</span>
          </div>
        </div>
        
        <div class="detail-row" *ngIf="attendance.checkOutTime">
          <div class="detail-label">
            <mat-icon>logout</mat-icon>
            وقت الخروج:
          </div>
          <div class="detail-value">
            <span class="time-value">{{ formatTime(attendance.checkOutTime) }}</span>
          </div>
        </div>
        
        <div class="detail-row" *ngIf="attendance.lateTime">
          <div class="detail-label">
            <mat-icon>warning</mat-icon>
            وقت التأخير:
          </div>
          <div class="detail-value late-value">
            <span>{{ attendance.lateTime }} دقيقة</span>
          </div>
        </div>
        
        <!-- Note -->
        <div class="detail-row note-row" *ngIf="attendance.note">
          <div class="detail-label">
            <mat-icon>notes</mat-icon>
            ملاحظات:
          </div>
          <div class="detail-value note-value">{{ attendance.note }}</div>
        </div>
        
        <mat-divider></mat-divider>
        
        <!-- System Info -->
        <div class="info-section">
          <div class="info-header">
            <mat-icon>history</mat-icon>
            <h4>معلومات الإنشاء والتعديل</h4>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">تم الإنشاء بواسطة:</div>
              <div class="info-value">{{ attendance.createdBy?.fullName || '-' }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">تاريخ الإنشاء:</div>
              <div class="info-value">{{ attendance.createdOn | date:'dd/MM/yyyy HH:mm' }}</div>
            </div>
            <div class="info-item" *ngIf="attendance.lastModifiedBy">
              <div class="info-label">تم التعديل بواسطة:</div>
              <div class="info-value">{{ attendance.lastModifiedBy?.fullName }}</div>
            </div>
            <div class="info-item" *ngIf="attendance.lastModifiedOn">
              <div class="info-label">تاريخ التعديل:</div>
              <div class="info-value">{{ attendance.lastModifiedOn | date:'dd/MM/yyyy HH:mm' }}</div>
            </div>
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
      min-width: 580px;
      max-width: 680px;
      direction: rtl;
      background: #f5f7fa;
      border-radius: 24px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
    }

    .modal-header {
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
      color: white;
    }

    .header-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-title mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }

    .header-actions button {
      color: white !important;
      transition: all 0.3s;
    }

    .header-actions button:hover {
      background: rgba(255, 255, 255, 0.15) !important;
      transform: scale(1.05);
    }

    .close-btn:hover {
      transform: rotate(90deg) scale(1.05) !important;
    }

    .modal-content {
      padding: 24px;
      max-height: 65vh;
      overflow-y: auto;
      background: #fafbfc;
    }

    .modal-content::-webkit-scrollbar {
      width: 5px;
    }

    .modal-content::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }

    .modal-content::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #8b5cf6, #6d28d9);
      border-radius: 10px;
    }

    .detail-row {
      display: flex;
      align-items: center;
      padding: 10px 14px;
      background: white;
      border-radius: 12px;
      margin-bottom: 10px;
      transition: all 0.2s;
      border: 1px solid #f1f5f9;
    }

    .detail-row:hover {
      border-color: #e2e8f0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }

    .detail-label {
      width: 140px;
      font-weight: 600;
      color: #64748b;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    .detail-label mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #94a3b8;
    }

    .detail-value {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      color: #1f2937;
      font-size: 14px;
      font-weight: 500;
      flex-wrap: wrap;
    }

    .trainee-name {
      font-weight: 600;
      color: #0f172a;
      font-size: 15px;
    }

    .trainer-name {
      font-weight: 600;
      color: #7c3aed;
      font-size: 14px;
    }

    .place-name {
      color: #374151;
    }

    .session-title {
      font-weight: 500;
      color: #1e293b;
    }

    .detail-value.late-value {
      color: #f59e0b;
      font-weight: 600;
    }

    .time-value {
      font-weight: 600;
      color: #0f172a;
    }

    .badge {
      display: inline-block;
      padding: 4px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .course-badge {
      background: #e0e7ff;
      color: #4338ca;
    }

    .day-badge {
      display: inline-block;
      padding: 4px 14px;
      border-radius: 20px;
      background: #ede9fe;
      color: #7c3aed;
      font-size: 12px;
      font-weight: 600;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 16px;
      border-radius: 30px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
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

    .note-row {
      align-items: flex-start;
    }

    .note-value {
      background: #f8fafc;
      padding: 8px 12px;
      border-radius: 8px;
      line-height: 1.6;
      font-weight: 400;
      color: #475569;
      border: 1px solid #f1f5f9;
      flex: 1;
    }

    .info-section {
      margin-top: 16px;
      padding: 16px 20px;
      background: white;
      border-radius: 12px;
      border: 1px solid #f1f5f9;
    }

    .info-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
      padding-bottom: 10px;
      border-bottom: 2px solid #f1f5f9;
    }

    .info-header mat-icon {
      color: #8b5cf6;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .info-header h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: #0f172a;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .info-item {
      padding: 8px 12px;
      background: #f8fafc;
      border-radius: 8px;
    }

    .info-label {
      font-size: 11px;
      color: #94a3b8;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .info-value {
      font-size: 13px;
      color: #1f2937;
      font-weight: 500;
      margin-top: 2px;
    }

    .modal-actions {
      flex-shrink: 0;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding: 16px 24px;
      background: white;
      border-top: 1px solid #f1f5f9;
    }

    .modal-actions button {
      border-radius: 10px !important;
      font-weight: 600;
      padding: 0 20px !important;
      transition: all 0.3s !important;
    }

    .modal-actions button:hover:not(.mat-button) {
      transform: translateY(-2px);
    }

    .modal-actions button.mat-raised-button.mat-accent {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
      color: white !important;
    }

    .modal-actions button.mat-raised-button.mat-primary {
      background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%) !important;
      color: white !important;
    }

    .modal-actions button.mat-raised-button.mat-warn {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
      color: white !important;
    }

    .modal-actions button.mat-button {
      color: #64748b !important;
    }

    .modal-actions button.mat-button:hover {
      background: #f1f5f9 !important;
    }

    @media (max-width: 640px) {
      .modal-container {
        min-width: 92vw;
        max-width: 95vw;
        border-radius: 16px;
      }

      .modal-header {
        padding: 16px 20px;
        flex-wrap: wrap;
      }

      .modal-header h2 {
        font-size: 18px;
      }

      .modal-content {
        padding: 16px;
        max-height: 60vh;
      }

      .detail-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
        padding: 12px 14px;
      }

      .detail-label {
        width: 100%;
        font-size: 12px;
      }

      .detail-value {
        width: 100%;
        font-size: 13px;
      }

      .info-grid {
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .modal-actions {
        flex-wrap: wrap;
        gap: 8px;
        padding: 12px 16px;
      }

      .modal-actions button {
        flex: 1;
        min-width: 80px;
        justify-content: center;
        font-size: 12px;
        padding: 0 12px !important;
        height: 38px;
      }
    }

    @media (max-width: 420px) {
      .modal-container {
        min-width: 88vw;
      }

      .modal-header {
        padding: 12px 16px;
      }

      .modal-header h2 {
        font-size: 16px;
      }

      .modal-content {
        padding: 12px;
      }

      .detail-row {
        padding: 10px 12px;
      }

      .detail-label {
        font-size: 11px;
      }

      .detail-value {
        font-size: 12px;
      }

      .modal-actions button {
        font-size: 11px;
        height: 34px;
        padding: 0 8px !important;
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

  /**
   * Get status CSS class
   */
  getStatusClass(statusId: number): string {
    const classes: { [key: number]: string } = {
      1: 'present',
      2: 'absent',
      3: 'late',
      4: 'excused'
    };
    return classes[statusId] || '';
  }

  /**
   * Get status icon
   */
  getStatusIcon(statusId: number): string {
    const icons: { [key: number]: string } = {
      1: 'check_circle',
      2: 'cancel',
      3: 'warning',
      4: 'event_note'
    };
    return icons[statusId] || 'help';
  }

  /**
   * Get day display name
   */
  getDayDisplay(day: string): string {
    const dayMap: { [key: string]: string } = {
      'SATURDAY': 'السبت',
      'SUNDAY': 'الأحد',
      'MONDAY': 'الإثنين',
      'TUESDAY': 'الثلاثاء',
      'WEDNESDAY': 'الأربعاء',
      'THURSDAY': 'الخميس',
      'FRIDAY': 'الجمعة'
    };
    return dayMap[day] || day || '-';
  }

  /**
   * Format time to 12-hour format
   */
  formatTime(time: string): string {
    if (!time) return '-';
    
    try {
      // If time is in HH:mm format
      const parts = time.split(':');
      if (parts.length >= 2) {
        let hours = parseInt(parts[0], 10);
        const minutes = parts[1];
        
        if (isNaN(hours)) return time;
        
        const ampm = hours >= 12 ? 'م' : 'ص';
        const hours12 = hours % 12 || 12;
        return `${hours12}:${minutes} ${ampm}`;
      }
      return time;
    } catch (error) {
      return time;
    }
  }

  /**
   * Edit attendance - close and navigate to edit page
   */
  editAttendance(): void {
    this.dialogRef.close();
    this.router.navigate(['/trainees/attendance', this.attendance.id, 'edit']);
  }

  /**
   * Delete attendance - return delete action
   */
  deleteAttendance(): void {
    this.dialogRef.close({ action: 'delete', attendanceId: this.attendance.id });
  }

  /**
   * Print attendance document
   */
  printAttendanceDocument(): void {
    this.generatePrintDocument(this.attendance);
  }

  /**
   * Generate print document
   */
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
    
    // Get trainer name
    const trainerName = attendance.session?.trainer?.fullName || '-';
    const courseTitle = attendance.session?.course?.title || '-';
    const placeTitle = attendance.session?.place?.title || '-';
    const sessionTitle = attendance.session?.title || '-';
    const sessionDay = this.getDayDisplay(attendance.session?.sessionDay);
    const sessionDate = attendance.session?.sessionDate || attendance.attendanceDate;
    
    printContainer.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>سجل حضور - ${attendance.trainee?.title || ''}</title>
        <style>
          * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; box-sizing: border-box; }
          @media print { 
            body { margin: 0; padding: 20px; } 
            .no-print { display: none; }
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
          .status-badge-print { display: inline-block; padding: 4px 12px; border-radius: 20px; font-weight: 600; font-size: 13px; }
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
            <div class="info-item"><div class="info-label">الدورة</div><div class="info-value">${courseTitle}</div></div>
            <div class="info-item"><div class="info-label">الجلسة</div><div class="info-value">${sessionTitle}</div></div>
            <div class="info-item"><div class="info-label">المدرب</div><div class="info-value">${trainerName}</div></div>
            <div class="info-item"><div class="info-label">المكان</div><div class="info-value">${placeTitle}</div></div>
            <div class="info-item"><div class="info-label">اليوم</div><div class="info-value">${sessionDay}</div></div>
            <div class="info-item"><div class="info-label">تاريخ الجلسة</div><div class="info-value">${sessionDate || '-'}</div></div>
            <div class="info-item"><div class="info-label">تاريخ الحضور</div><div class="info-value">${attendance.attendanceDate || '-'}</div></div>
          </div>
          
          <h2>⏱️ تفاصيل الحضور</h2>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">حالة الحضور</div><div class="info-value"><span class="status-badge-print" style="${statusStyle}">${attendance.status?.title || '-'}</span></div></div>
            <div class="info-item"><div class="info-label">وقت الدخول</div><div class="info-value">${attendance.checkInTime ? this.formatTime(attendance.checkInTime) : '-'}</div></div>
            <div class="info-item"><div class="info-label">وقت الخروج</div><div class="info-value">${attendance.checkOutTime ? this.formatTime(attendance.checkOutTime) : '-'}</div></div>
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