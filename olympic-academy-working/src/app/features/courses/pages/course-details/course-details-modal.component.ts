import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { CourseVTO } from '../../../../core/models/course.model';
import { CourseWizardModalComponent } from '../course-wizard/course-wizard-modal.component';

@Component({
  selector: 'app-course-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatTabsModule,
    MatTooltipModule,
    MatProgressBarModule
  ],
  template: `
    <div class="modal-container" dir="rtl">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <mat-icon>school</mat-icon>
          <h2>تفاصيل الدورة</h2>
        </div>
        <div class="header-actions">
          <button mat-icon-button (click)="printCourseDocument()" matTooltip="طباعة التفاصيل">
            <mat-icon>print</mat-icon>
          </button>
          <button mat-icon-button mat-dialog-close class="close-btn">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>
      
      <mat-divider></mat-divider>
      
      <!-- Course Header -->
      <div class="course-header" *ngIf="course">
        <div class="course-image" *ngIf="course.imageUrl; else noImage">
          <img [src]="course.imageUrl" [alt]="course.title">
        </div>
        <ng-template #noImage>
          <div class="course-image-placeholder">
            <mat-icon>school</mat-icon>
          </div>
        </ng-template>
        
        <div class="course-info">
          <h1>{{ course.title }}</h1>
          <div class="info-badges">
            <mat-chip [color]="course.isActive ? 'primary' : 'warn'" selected>
              {{ course.isActive ? 'نشط' : 'غير نشط' }}
            </mat-chip>
            <mat-chip color="accent" selected>
              {{ course.courseType?.title }}
            </mat-chip>
            <mat-chip>
              <mat-icon>business</mat-icon>
              {{ course.department?.title }}
            </mat-chip>
          </div>
        </div>
      </div>
      
      <mat-divider></mat-divider>
      
      <!-- Statistics Cards - Using course.enrollmentsCount and course.totalRevenue -->
      <div class="stats-row">
        <div class="stat-card">
          <mat-icon>people</mat-icon>
          <div class="stat-info">
            <span class="stat-value">{{ course.enrollmentsCount || 0 }}</span>
            <span class="stat-label">عدد المسجلين</span>
          </div>
        </div>
        <div class="stat-card">
          <mat-icon>attach_money</mat-icon>
          <div class="stat-info">
            <span class="stat-value">{{ (course.totalRevenue || 0) | currency:'EGP' }}</span>
            <span class="stat-label">إجمالي الإيرادات</span>
          </div>
        </div>
        <div class="stat-card">
          <mat-icon>schedule</mat-icon>
          <div class="stat-info">
            <span class="stat-value">{{ course.duration }} ساعة</span>
            <span class="stat-label">المدة</span>
          </div>
        </div>
        <div class="stat-card">
          <mat-icon>group</mat-icon>
          <div class="stat-info">
            <span class="stat-value">{{ course.maxCapacity || 'غير محدود' }}</span>
            <span class="stat-label">السعة القصوى</span>
          </div>
        </div>
      </div>
      
      <!-- Capacity Progress -->
      <div class="capacity-section" *ngIf="course.maxCapacity">
        <div class="capacity-header">
          <span>نسبة الإشغال</span>
          <span>{{ capacityPercentage }}%</span>
        </div>
        <mat-progress-bar mode="determinate" [value]="capacityPercentage" [color]="capacityColor"></mat-progress-bar>
      </div>
      
      <mat-divider></mat-divider>
      
      <!-- Tabs -->
      <mat-tab-group class="custom-tabs">
        <!-- Basic Info Tab -->
        <mat-tab label="المعلومات الأساسية">
          <div class="tab-content">
            <div class="info-grid">
              <div class="info-item">
                <mat-icon>title</mat-icon>
                <div>
                  <label>اسم الدورة</label>
                  <p>{{ course.title }}</p>
                </div>
              </div>
              
              <div class="info-item">
                <mat-icon>business</mat-icon>
                <div>
                  <label>القسم</label>
                  <p>{{ course.department?.title }}</p>
                </div>
              </div>
              
              <div class="info-item">
                <mat-icon>category</mat-icon>
                <div>
                  <label>نوع الدورة</label>
                  <p>{{ course.courseType?.title }}</p>
                </div>
              </div>
              
              <div class="info-item">
                <mat-icon>schedule</mat-icon>
                <div>
                  <label>المدة</label>
                  <p>{{ course.duration }} ساعة</p>
                </div>
              </div>
              
              <div class="info-item">
                <mat-icon>attach_money</mat-icon>
                <div>
                  <label>السعر</label>
                  <p>{{ course.price | currency:'EGP' }}</p>
                </div>
              </div>
              
              <div class="info-item">
                <mat-icon>group</mat-icon>
                <div>
                  <label>السعة القصوى</label>
                  <p>{{ course.maxCapacity || 'غير محدد' }}</p>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>
        
        <!-- Dates Tab -->
        <mat-tab label="التواريخ">
          <div class="tab-content">
            <div class="info-grid">
              <div class="info-item">
                <mat-icon>event</mat-icon>
                <div>
                  <label>تاريخ البدء</label>
                  <p>{{ course.startDate | date:'dd/MM/yyyy' }}</p>
                </div>
              </div>
              
              <div class="info-item">
                <mat-icon>event</mat-icon>
                <div>
                  <label>تاريخ الانتهاء</label>
                  <p>{{ course.endDate ? (course.endDate | date:'dd/MM/yyyy') : 'غير محدد' }}</p>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>
        
        <!-- Description Tab -->
        <mat-tab label="الوصف">
          <div class="tab-content">
            <div class="description-box">
              <p>{{ course.description || 'لا يوجد وصف لهذه الدورة' }}</p>
            </div>
          </div>
        </mat-tab>
        
        <!-- Sessions Tab -->
        <mat-tab label="الجلسات">
          <div class="tab-content">
            <div class="sessions-list" *ngIf="sessions.length > 0; else noSessions">
              <div class="session-card" *ngFor="let session of sessions">
                <div class="session-header">
                  <h4>{{ session.title }}</h4>
                  <span class="session-status" [class.completed]="session.status?.id === 3" [class.cancelled]="session.status?.id === 4">
                    {{ session.status?.title }}
                  </span>
                </div>
                <div class="session-details">
                  <div class="session-detail">
                    <mat-icon>event</mat-icon>
                    <span>{{ session.sessionDate | date:'dd/MM/yyyy' }}</span>
                  </div>
                  <div class="session-detail">
                    <mat-icon>access_time</mat-icon>
                    <span>{{ session.startTime }} - {{ session.endTime }}</span>
                  </div>
                  <div class="session-detail">
                    <mat-icon>location_on</mat-icon>
                    <span>{{ session.place?.title }}</span>
                  </div>
                  <div class="session-detail">
                    <mat-icon>person</mat-icon>
                    <span>{{ session.trainer?.title }}</span>
                  </div>
                </div>
              </div>
            </div>
            <ng-template #noSessions>
              <div class="empty-state">
                <mat-icon>event_busy</mat-icon>
                <p>لا توجد جلسات مسجلة لهذه الدورة</p>
              </div>
            </ng-template>
          </div>
        </mat-tab>
        
        <!-- System Info Tab -->
        <mat-tab label="معلومات النظام">
          <div class="tab-content">
            <div class="info-grid">
              <div class="info-item">
                <mat-icon>person_add</mat-icon>
                <div>
                  <label>تم الإنشاء بواسطة</label>
                  <p>{{ course.createdBy?.fullName || '-' }}</p>
                </div>
              </div>
              <div class="info-item">
                <mat-icon>schedule</mat-icon>
                <div>
                  <label>تاريخ الإنشاء</label>
                  <p>{{ course.createdOn | date:'dd/MM/yyyy HH:mm' }}</p>
                </div>
              </div>
              <div class="info-item" *ngIf="course.lastModifiedBy">
                <mat-icon>edit</mat-icon>
                <div>
                  <label>تم التعديل بواسطة</label>
                  <p>{{ course.lastModifiedBy?.fullName }}</p>
                </div>
              </div>
              <div class="info-item" *ngIf="course.lastModifiedOn">
                <mat-icon>update</mat-icon>
                <div>
                  <label>تاريخ التعديل</label>
                  <p>{{ course.lastModifiedOn | date:'dd/MM/yyyy HH:mm' }}</p>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
      
      <mat-divider></mat-divider>
      
      <!-- Modal Actions -->
      <div class="modal-actions">
        <button mat-raised-button color="accent" (click)="printCourseDocument()" matTooltip="طباعة التفاصيل">
          <mat-icon>print</mat-icon>
          طباعة
        </button>
        <button mat-raised-button color="primary" (click)="editCourse()">
          <mat-icon>edit</mat-icon>
          تعديل
        </button>
        <button mat-raised-button color="warn" (click)="deleteCourse()">
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
      min-width: 750px;
      max-width: 950px;
      max-height: 90vh;
      direction: rtl;
      background: #f5f7fa;
      border-radius: 24px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    /* Header */
    .modal-header {
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
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

    /* Course Header */
    .course-header {
      display: flex;
      gap: 20px;
      padding: 20px;
      background: white;
    }
    .course-image {
      width: 100px;
      height: 100px;
      border-radius: 12px;
      overflow: hidden;
      flex-shrink: 0;
    }
    .course-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .course-image-placeholder {
      width: 100px;
      height: 100px;
      border-radius: 12px;
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .course-image-placeholder mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: white;
    }
    .course-info {
      flex: 1;
    }
    .course-info h1 {
      margin: 0 0 12px 0;
      font-size: 22px;
      color: #1f2937;
    }
    .info-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    /* Stats Row */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      padding: 20px;
      background: #f9fafb;
    }
    .stat-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .stat-card mat-icon {
      color: #2563eb;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }
    .stat-info {
      display: flex;
      flex-direction: column;
    }
    .stat-value {
      font-size: 20px;
      font-weight: 700;
      color: #1f2937;
    }
    .stat-label {
      font-size: 11px;
      color: #6b7280;
    }

    /* Capacity Section */
    .capacity-section {
      padding: 16px 20px;
      background: white;
    }
    .capacity-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 13px;
      color: #374151;
    }

    /* Tabs */
    .custom-tabs {
      flex: 1;
      overflow-y: auto;
    }
    .tab-content {
      padding: 20px;
      max-height: 40vh;
      overflow-y: auto;
    }

    /* Info Grid */
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: #f9fafb;
      border-radius: 12px;
    }
    .info-item mat-icon {
      color: #2563eb;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    .info-item div {
      flex: 1;
    }
    .info-item label {
      display: block;
      font-size: 11px;
      color: #6b7280;
      margin-bottom: 2px;
    }
    .info-item p {
      margin: 0;
      font-size: 14px;
      color: #1f2937;
      font-weight: 500;
    }

    /* Description Box */
    .description-box {
      padding: 16px;
      background: #f9fafb;
      border-radius: 12px;
      line-height: 1.6;
      color: #374151;
    }

    /* Sessions List */
    .sessions-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .session-card {
      padding: 16px;
      background: #f9fafb;
      border-radius: 12px;
      border-right: 4px solid #2563eb;
    }
    .session-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .session-header h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }
    .session-status {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 20px;
      background: #d1fae5;
      color: #065f46;
    }
    .session-status.completed {
      background: #dbeafe;
      color: #1e40af;
    }
    .session-status.cancelled {
      background: #fee2e2;
      color: #991b1b;
    }
    .session-details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }
    .session-detail {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #6b7280;
    }
    .session-detail mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 60px;
      color: #9ca3af;
    }
    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }

    /* Modal Actions */
    .modal-actions {
      flex-shrink: 0;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding: 16px 20px;
      background: white;
      border-top: 1px solid #e5e7eb;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .modal-container {
        min-width: 90vw;
        max-width: 90vw;
      }
      .course-header {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      .stats-row {
        grid-template-columns: repeat(2, 1fr);
      }
      .info-grid {
        grid-template-columns: 1fr;
      }
      .session-details {
        grid-template-columns: 1fr;
      }
      .info-badges {
        justify-content: center;
      }
      .modal-actions {
        flex-wrap: wrap;
      }
    }
  `]
})
export class CourseDetailsModalComponent {
  course: CourseVTO;
  sessions: any[] = [];

  get capacityPercentage(): number {
    if (!this.course.maxCapacity || this.course.maxCapacity === 0) return 0;
    const enrolledCount = this.course.enrollmentsCount || 0;
    return Math.min(100, Math.round((enrolledCount / this.course.maxCapacity) * 100));
  }

  get capacityColor(): string {
    const percentage = this.capacityPercentage;
    if (percentage >= 80) return 'warn';
    if (percentage >= 50) return 'accent';
    return 'primary';
  }

  constructor(
    private dialogRef: MatDialogRef<CourseDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { course: CourseVTO; sessions: any[] },
    private router: Router,
    private dialog: MatDialog
  ) {
    this.course = data.course;
    this.sessions = data.sessions || [];
  }

  editCourse(): void {
    this.dialogRef.close();
    const wizardDialogRef = this.dialog.open(CourseWizardModalComponent, {
      data: { courseId: this.course.id },
      width: '850px',
      maxWidth: '90vw'
    });
    
    wizardDialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refresh needed - handled by parent
      }
    });
  }

  deleteCourse(): void {
    this.dialogRef.close({ action: 'delete', course: this.course });
  }

  printCourseDocument(): void {
    this.generatePrintDocument();
  }

  generatePrintDocument(): void {
    const printContainer = document.createElement('div');
    printContainer.style.direction = 'rtl';
    printContainer.style.fontFamily = 'Cairo, "Segoe UI", Tahoma, sans-serif';
    printContainer.style.padding = '20px';
    printContainer.style.backgroundColor = 'white';
    printContainer.style.maxWidth = '800px';
    printContainer.style.margin = '0 auto';
    
    const today = new Date().toLocaleDateString('ar-EG');
    const enrolledCount = this.course.enrollmentsCount || 0;
    const totalRevenue = this.course.totalRevenue || 0;
    
    printContainer.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>بيانات الدورة - ${this.course.title}</title>
        <style>
          * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; }
          @media print { body { margin: 0; padding: 20px; } .no-print { display: none; } }
          .course-container { max-width: 800px; margin: 0 auto; background: white; }
          .header { text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; border-radius: 12px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 10px 0 0 0; font-size: 12px; opacity: 0.9; }
          .course-details { display: flex; justify-content: space-between; margin-bottom: 20px; padding: 10px; background: #f9fafb; border-radius: 8px; }
          .stats { display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
          .stat-box { flex: 1; text-align: center; padding: 12px; background: #f3f4f6; border-radius: 8px; min-width: 120px; }
          .stat-box .value { font-size: 24px; font-weight: bold; color: #2563eb; }
          .stat-box .label { font-size: 11px; color: #6b7280; }
          h2 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 8px; margin-top: 24px; margin-bottom: 16px; font-size: 18px; }
          .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px; }
          .info-item { border-bottom: 1px solid #e5e7eb; padding: 8px 0; }
          .info-label { font-weight: 600; color: #374151; font-size: 13px; margin-bottom: 4px; }
          .info-value { color: #1f2937; font-size: 14px; }
          .full-width { grid-column: span 2; }
          .sessions-list { margin-top: 16px; }
          .session-item { padding: 12px; border-bottom: 1px solid #e5e7eb; }
          .session-title { font-weight: bold; font-size: 15px; color: #2563eb; }
          .session-details { display: flex; gap: 16px; margin-top: 8px; font-size: 12px; color: #6b7280; flex-wrap: wrap; }
          .signature-section { margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; flex-wrap: wrap; }
          .signature-box { text-align: center; flex: 1; min-width: 150px; }
          .signature-line { width: 100%; border-top: 1px solid #000; margin-top: 40px; padding-top: 8px; }
          .footer { text-align: center; margin-top: 30px; padding: 16px; font-size: 10px; color: #9ca3af; }
          @media (max-width: 600px) { .info-grid { grid-template-columns: 1fr; } .stats { flex-direction: column; } .signature-section { flex-direction: column; align-items: center; } .session-details { flex-direction: column; gap: 4px; } }
        </style>
      </head>
      <body>
        <div class="course-container">
          <div class="header">
            <h1>بيانات الدورة التدريبية</h1>
            <p>نظام إدارة  الأكاديمية الأولمبية لعلوم الرياضة</p>
          </div>
          <div class="course-details">
            <div><strong>رقم الدورة:</strong> #${this.course.id}</div>
            <div><strong>تاريخ الطباعة:</strong> ${today}</div>
          </div>
          <div class="stats">
            <div class="stat-box"><div class="value">${enrolledCount}</div><div class="label">عدد المسجلين</div></div>
            <div class="stat-box"><div class="value">${totalRevenue.toLocaleString('ar-EG')} جم</div><div class="label">إجمالي الإيرادات</div></div>
            <div class="stat-box"><div class="value">${this.course.duration}</div><div class="label">المدة (ساعة)</div></div>
            <div class="stat-box"><div class="value">${this.course.maxCapacity || 'غير محدود'}</div><div class="label">السعة القصوى</div></div>
          </div>
          <h2>📋 المعلومات الأساسية</h2>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">اسم الدورة</div><div class="info-value">${this.course.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">القسم</div><div class="info-value">${this.course.department?.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">نوع الدورة</div><div class="info-value">${this.course.courseType?.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">السعر</div><div class="info-value">${(this.course.price || 0).toLocaleString('ar-EG')} جم</div></div>
            <div class="info-item"><div class="info-label">تاريخ البدء</div><div class="info-value">${this.course.startDate || '-'}</div></div>
            <div class="info-item"><div class="info-label">تاريخ الانتهاء</div><div class="info-value">${this.course.endDate || '-'}</div></div>
            <div class="info-item full-width"><div class="info-label">الوصف</div><div class="info-value">${this.course.description || '-'}</div></div>
          </div>
          ${this.sessions.length > 0 ? `
          <h2>📚 الجلسات</h2>
          <div class="sessions-list">
            ${this.sessions.map(session => `
              <div class="session-item">
                <div class="session-title">${session.title || '-'}</div>
                <div class="session-details">
                  <span>📅 ${session.sessionDate || '-'}</span>
                  <span>⏰ ${session.startTime || '-'} - ${session.endTime || '-'}</span>
                  <span>📍 ${session.place?.title || '-'}</span>
                  <span>👨‍🏫 ${session.trainer?.title || '-'}</span>
                </div>
              </div>
            `).join('')}
          </div>
          ` : ''}
          <div class="signature-section">
            <div class="signature-box"><div class="signature-line"></div><div>توقيع مدير القسم</div></div>
            <div class="signature-box"><div class="signature-line"></div><div>توقيع المدير الأكاديمي</div></div>
            <div class="signature-box"><div class="signature-line"></div><div>ختم الأكاديمية</div></div>
          </div>
          <div class="footer">تم التصدير من نظام إدارة  الأكاديمية الأولمبية لعلوم الرياضة</div>
        </div>
        <div class="no-print" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print();" style="padding: 10px 20px; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; border: none; border-radius: 5px; cursor: pointer;">🖨️ طباعة / حفظ كـ PDF</button>
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