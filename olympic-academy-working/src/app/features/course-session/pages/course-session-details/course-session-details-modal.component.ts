import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { animate, style, transition, trigger } from '@angular/animations';
import { CourseSessionVTO } from '../../../../core/models/employee.model';

@Component({
  selector: 'app-course-session-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule
  ],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' }))
      ])
    ])
  ],
  template: `
    <div class="modal-container" @fadeIn>
      <!-- Enhanced Modal Header -->
      <div class="modal-header">
        <div class="header-icon">
          <mat-icon>info</mat-icon>
        </div>
        <div class="header-content">
          <h2>تفاصيل الجلسة التدريبية</h2>
          <p>{{ session.title }}</p>
        </div>
        <button mat-icon-button mat-dialog-close class="close-button">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <mat-divider></mat-divider>
      
      <div class="modal-content">
        <!-- Session Title Card -->
        <div class="info-card" @slideInRight>
          <div class="card-header">
            <mat-icon>title</mat-icon>
            <h3>معلومات الجلسة</h3>
          </div>
          <div class="detail-row highlight">
            <div class="detail-label">عنوان الجلسة:</div>
            <div class="detail-value">{{ session.title }}</div>
          </div>
        </div>
        
        <!-- Course & Trainer Info -->
        <div class="info-card" @slideInRight>
          <div class="card-header">
            <mat-icon>school</mat-icon>
            <h3>البيانات الأساسية</h3>
          </div>
          <div class="detail-row">
            <div class="detail-label">
              <mat-icon>school</mat-icon>
              الدورة:
            </div>
            <div class="detail-value">
              <span class="badge course-badge">{{ session.course?.title }}</span>
            </div>
          </div>
          
          <div class="detail-row">
            <div class="detail-label">
              <mat-icon>person</mat-icon>
              المدرب:
            </div>
            <div class="detail-value">
              <span class="trainer-name">{{ session.trainer?.title }}</span>
            </div>
          </div>
          
          <div class="detail-row">
            <div class="detail-label">
              <mat-icon>location_on</mat-icon>
              المكان:
            </div>
            <div class="detail-value">
              <span class="place-name">{{ session.place?.title }}</span>
            </div>
          </div>
        </div>
        
        <!-- Date & Time Info -->
        <div class="info-card" @slideInRight>
          <div class="card-header">
            <mat-icon>schedule</mat-icon>
            <h3>التاريخ والوقت</h3>
          </div>
          <div class="detail-row">
            <div class="detail-label">
              <mat-icon>event</mat-icon>
              التاريخ:
            </div>
            <div class="detail-value">
              <span class="date-value">{{ session.sessionDate | date:'EEEE, dd/MM/yyyy' }}</span>
            </div>
          </div>
          
          <div class="detail-row">
            <div class="detail-label">
              <mat-icon>play_circle</mat-icon>
              وقت البدء:
            </div>
            <div class="detail-value">
              <span class="time-value">{{ session.startTime }}</span>
            </div>
          </div>
          
          <div class="detail-row">
            <div class="detail-label">
              <mat-icon>stop_circle</mat-icon>
              وقت الانتهاء:
            </div>
            <div class="detail-value">
              <span class="time-value">{{ session.endTime }}</span>
            </div>
          </div>
          
          <div class="detail-row">
            <div class="detail-label">
              <mat-icon>flag</mat-icon>
              الحالة:
            </div>
            <div class="detail-value">
              <span class="status-badge" [ngClass]="getStatusClass(session.status?.id ?? 0)">
                <mat-icon class="status-icon">{{ getStatusIcon(session.status?.id ?? 0) }}</mat-icon>
                {{ session.status?.title || '-' }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Notes Section -->
        <div class="info-card" *ngIf="session.note" @slideInRight>
          <div class="card-header">
            <mat-icon>notes</mat-icon>
            <h3>ملاحظات</h3>
          </div>
          <div class="note-value">
            <mat-icon class="note-icon">format_quote</mat-icon>
            <p>{{ session.note }}</p>
          </div>
        </div>
        
        <!-- Audit Information -->
        <div class="info-card audit-section" @slideInRight>
          <div class="card-header">
            <mat-icon>history</mat-icon>
            <h3>معلومات الإنشاء والتعديل</h3>
          </div>
          <div class="audit-grid">
            <div class="audit-item">
              <div class="audit-label">
                <mat-icon>person_add</mat-icon>
                تم الإنشاء بواسطة:
              </div>
              <div class="audit-value">{{ session.createdBy?.fullName || '-' }}</div>
            </div>
            <div class="audit-item">
              <div class="audit-label">
                <mat-icon>event</mat-icon>
                تاريخ الإنشاء:
              </div>
              <div class="audit-value">{{ session.createdOn | date:'dd/MM/yyyy HH:mm' }}</div>
            </div>
            <div class="audit-item" *ngIf="session.lastModifiedBy">
              <div class="audit-label">
                <mat-icon>person_edit</mat-icon>
                تم التعديل بواسطة:
              </div>
              <div class="audit-value">{{ session.lastModifiedBy?.fullName }}</div>
            </div>
            <div class="audit-item" *ngIf="session.lastModifiedOn">
              <div class="audit-label">
                <mat-icon>update</mat-icon>
                تاريخ التعديل:
              </div>
              <div class="audit-value">{{ session.lastModifiedOn | date:'dd/MM/yyyy HH:mm' }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <mat-divider></mat-divider>
      
      <!-- Enhanced Modal Actions -->
      <div class="modal-actions">
        <button mat-raised-button color="primary" (click)="editSession()" class="action-btn edit-btn">
          <mat-icon>edit</mat-icon>
          <span>تعديل الجلسة</span>
        </button>
        <button mat-raised-button color="warn" (click)="deleteSession()" class="action-btn delete-btn">
          <mat-icon>delete</mat-icon>
          <span>حذف الجلسة</span>
        </button>
        <button mat-stroked-button mat-dialog-close class="action-btn close-btn">
          <mat-icon>close</mat-icon>
          <span>إغلاق</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .modal-container {
      min-width: 550px;
      max-width: 650px;
      direction: rtl;
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    /* Modal Header */
    .modal-header {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 24px 28px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      position: relative;
      overflow: hidden;
    }

    .modal-header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 200px;
      height: 200px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
    }

    .header-icon {
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
      z-index: 1;
    }

    .header-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .header-content {
      flex: 1;
      z-index: 1;
    }

    .header-content h2 {
      margin: 0 0 4px 0;
      font-size: 22px;
      font-weight: 700;
    }

    .header-content p {
      margin: 0;
      font-size: 13px;
      opacity: 0.9;
    }

    .close-button {
      color: white !important;
      background: rgba(255, 255, 255, 0.2) !important;
      transition: all 0.3s;
      z-index: 1;
    }

    .close-button:hover {
      background: rgba(255, 255, 255, 0.3) !important;
      transform: rotate(90deg);
    }

    /* Modal Content */
    .modal-content {
      padding: 24px;
      max-height: 60vh;
      overflow-y: auto;
    }

    .modal-content::-webkit-scrollbar {
      width: 6px;
    }

    .modal-content::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }

    .modal-content::-webkit-scrollbar-thumb {
      background: #c7d2fe;
      border-radius: 10px;
    }

    .modal-content::-webkit-scrollbar-thumb:hover {
      background: #818cf8;
    }

    /* Info Cards */
    .info-card {
      background: white;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      transition: all 0.3s;
    }

    .info-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid #f3f4f6;
    }

    .card-header mat-icon {
      color: #667eea;
      font-size: 24px;
    }

    .card-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }

    /* Detail Rows */
    .detail-row {
      display: flex;
      margin-bottom: 16px;
      align-items: center;
      padding: 8px 0;
    }

    .detail-row.highlight {
      background: linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 100%);
      padding: 12px 16px;
      border-radius: 12px;
      margin-bottom: 0;
    }

    .detail-label {
      width: 140px;
      font-weight: 600;
      color: #6b7280;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
    }

    .detail-label mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #9ca3af;
    }

    .detail-value {
      flex: 1;
      color: #1f2937;
      font-weight: 500;
    }

    .trainer-name,
    .place-name,
    .date-value,
    .time-value {
      font-weight: 600;
      color: #374151;
    }

    /* Badges */
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .course-badge {
      background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
      color: #4338ca;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 30px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .status-badge.status-scheduled {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-badge.status-in-progress {
      background: #fed7aa;
      color: #92400e;
    }

    .status-badge.status-completed {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.status-cancelled {
      background: #fee2e2;
      color: #991b1b;
    }

    /* Notes Section */
    .note-value {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 20%);
      padding: 16px;
      border-radius: 12px;
      position: relative;
      margin-top: 8px;
    }

    .note-icon {
      position: absolute;
      top: -12px;
      right: 16px;
      background: white;
      border-radius: 50%;
      padding: 4px;
      color: #f59e0b;
    }

    .note-value p {
      margin: 8px 0 0 0;
      line-height: 1.6;
      color: #92400e;
    }

    /* Audit Section */
    .audit-section {
      background: #f9fafb;
    }

    .audit-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .audit-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .audit-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: #9ca3af;
      font-weight: 500;
    }

    .audit-label mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .audit-value {
      font-size: 13px;
      color: #374151;
      font-weight: 500;
    }

    /* Modal Actions */
    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding: 20px 24px;
      background: #f9fafb;
    }

    .action-btn {
      padding: 0 20px;
      height: 42px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s;
    }

    .edit-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    }

    .edit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
    }

    .delete-btn {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
    }

    .delete-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
    }

    .close-btn {
      border: 2px solid #e5e7eb !important;
    }

    .close-btn:hover {
      background: #f3f4f6 !important;
      border-color: #d1d5db !important;
    }

    /* Responsive */
    @media (max-width: 640px) {
      .modal-container {
        min-width: 90vw;
        max-width: 90vw;
      }

      .modal-header {
        padding: 18px 20px;
      }

      .header-icon {
        width: 40px;
        height: 40px;
      }

      .header-icon mat-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
      }

      .header-content h2 {
        font-size: 18px;
      }

      .modal-content {
        padding: 16px;
      }

      .info-card {
        padding: 16px;
      }

      .detail-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
      }

      .detail-label {
        width: 100%;
      }

      .audit-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .modal-actions {
        flex-direction: column;
      }

      .action-btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class CourseSessionDetailsModalComponent {
  constructor(
    private dialogRef: MatDialogRef<CourseSessionDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public session: CourseSessionVTO
  ) {}

  getStatusClass(statusId: number): string {
    const classes: { [key: number]: string } = {
      1: 'status-scheduled',
      2: 'status-in-progress',
      3: 'status-completed',
      4: 'status-cancelled'
    };
    return classes[statusId] || '';
  }

  getStatusIcon(statusId: number): string {
    const icons: { [key: number]: string } = {
      1: 'schedule',
      2: 'play_circle',
      3: 'check_circle',
      4: 'cancel'
    };
    return icons[statusId] || 'help';
  }

  editSession(): void {
    // Close the details modal and return edit action
    this.dialogRef.close({ action: 'edit', session: this.session });
  }

  deleteSession(): void {
    this.dialogRef.close({ action: 'delete', session: this.session });
  }
}