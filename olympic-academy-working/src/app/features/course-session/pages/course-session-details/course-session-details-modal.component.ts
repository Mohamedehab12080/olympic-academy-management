// course-session-details-modal.component.ts - COMPLETE WITH SERVICE INJECTION

import { Component, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { animate, style, transition, trigger, query, stagger } from '@angular/animations';
import { Subject, takeUntil, finalize } from 'rxjs';
import { CourseSessionVTO } from '../../../../core/models/employee.model';
import { CourseSessionService } from '../../../../core/services/course-session.service';
import { NotificationService } from '../../../../core/services/notification.service';

// ============================================================================
// CONSTANTS
// ============================================================================

const DAYS_OF_WEEK: { [key: string]: string } = {
  'SUNDAY': 'الأحد',
  'MONDAY': 'الإثنين',
  'TUESDAY': 'الثلاثاء',
  'WEDNESDAY': 'الأربعاء',
  'THURSDAY': 'الخميس',
  'FRIDAY': 'الجمعة',
  'SATURDAY': 'السبت'
};

const STATUS_CONFIG: { [key: number]: { class: string; icon: string; color: string; bg: string } } = {
  1: { class: 'status-scheduled', icon: 'schedule', color: '#3b82f6', bg: '#dbeafe' },
  2: { class: 'status-in-progress', icon: 'play_circle', color: '#f59e0b', bg: '#fed7aa' },
  3: { class: 'status-completed', icon: 'check_circle', color: '#10b981', bg: '#d1fae5' },
  4: { class: 'status-cancelled', icon: 'cancel', color: '#ef4444', bg: '#fee2e2' }
};

@Component({
  selector: 'app-course-session-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.92) translateY(20px)' }),
        animate('400ms cubic-bezier(0.34, 1.56, 0.64, 1)', 
          style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 0, transform: 'scale(0.95) translateY(10px)' }))
      ])
    ]),
    trigger('staggerCards', [
      transition(':enter', [
        query('.info-card', [
          style({ opacity: 0, transform: 'translateX(30px)' }),
          stagger('80ms', [
            animate('400ms cubic-bezier(0.4, 0, 0.2, 1)',
              style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ],
  template: `
    <div class="modal-container" @modalAnimation>
      <!-- ============================================ -->
      <!-- HEADER -->
      <!-- ============================================ -->
      <div class="modal-header" [class]="'status-' + (session.status?.id || 1)">
        <div class="header-decoration"></div>
        
        <div class="header-content-wrapper">
          <div class="header-icon-wrapper">
            <div class="header-icon">
              <mat-icon>event_note</mat-icon>
            </div>
          </div>
          
          <div class="header-text">
            <div class="header-title-row">
              <h2>تفاصيل الجلسة</h2>
              <span class="header-status" 
                    [style.background-color]="getStatusColor(session.status?.id || 1)"
                    [style.color]="'white'">
                <mat-icon>{{ getStatusIcon(session.status?.id || 1) }}</mat-icon>
                {{ session.status?.title || 'غير محدد' }}
              </span>
            </div>
            <p class="header-subtitle">{{ session.title }}</p>
          </div>
        </div>

        <div class="header-actions">
          <button mat-icon-button (click)="printDetails()" class="action-btn-header print-btn" matTooltip="طباعة التفاصيل">
            <mat-icon>print</mat-icon>
          </button>
          <button mat-icon-button mat-dialog-close class="action-btn-header close-btn" matTooltip="إغلاق">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>

      <mat-divider></mat-divider>

      <!-- ============================================ -->
      <!-- CONTENT -->
      <!-- ============================================ -->
      <div class="modal-content" id="print-content" @staggerCards>
        
        <!-- Session Title -->
        <div class="info-card title-card" @fadeIn>
          <div class="card-header">
            <div class="card-icon-wrapper">
              <mat-icon>title</mat-icon>
            </div>
            <h3>معلومات الجلسة</h3>
          </div>
          <div class="title-display">
            <mat-icon class="title-icon">description</mat-icon>
            <span class="title-text">{{ session.title }}</span>
          </div>
        </div>

        <!-- Basic Info -->
        <div class="info-card" @fadeIn>
          <div class="card-header">
            <div class="card-icon-wrapper">
              <mat-icon>school</mat-icon>
            </div>
            <h3>البيانات الأساسية</h3>
          </div>
          
          <div class="detail-grid">
            <div class="detail-item">
              <div class="detail-label">
                <mat-icon>school</mat-icon>
                <span>الدورة</span>
              </div>
              <div class="detail-value">
                <span class="badge course-badge">
                  <mat-icon>menu_book</mat-icon>
                  {{ session.course?.title || '-' }}
                </span>
              </div>
            </div>

            <div class="detail-item">
              <div class="detail-label">
                <mat-icon>location_on</mat-icon>
                <span>المكان</span>
              </div>
              <div class="detail-value">
                <span class="badge place-badge">
                  <mat-icon>place</mat-icon>
                  {{ session.place?.title || '-' }}
                </span>
              </div>
            </div>

            <div class="detail-item full-width">
              <div class="detail-label">
                <mat-icon>people</mat-icon>
                <span>المدربون</span>
              </div>
              <div class="detail-value">
                <div class="trainers-list">
                  <span *ngFor="let trainer of session.trainers" class="trainer-chip">
                    <div class="trainer-avatar">{{ getTrainerInitials(trainer) }}</div>
                    <span class="trainer-name">{{ getTrainerName(trainer) }}</span>
                  </span>
                  <span *ngIf="!session.trainers || session.trainers.length === 0" class="no-trainer">
                    <mat-icon>person_off</mat-icon>
                    لا يوجد مدربون
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Date & Time -->
        <div class="info-card" @fadeIn>
          <div class="card-header">
            <div class="card-icon-wrapper">
              <mat-icon>schedule</mat-icon>
            </div>
            <h3>التاريخ والوقت</h3>
          </div>
          
          <div class="datetime-grid">
            <div class="datetime-item">
              <div class="datetime-icon">
                <mat-icon>event</mat-icon>
              </div>
              <div class="datetime-content">
                <span class="datetime-label">التاريخ</span>
                <span class="datetime-value">{{ session.sessionDate | date:'EEEE, dd/MM/yyyy' }}</span>
              </div>
            </div>

            <div class="datetime-item">
              <div class="datetime-icon">
                <mat-icon>today</mat-icon>
              </div>
              <div class="datetime-content">
                <span class="datetime-label">اليوم</span>
                <span class="datetime-value day-badge">{{ getDayLabel(session.sessionDay) }}</span>
              </div>
            </div>

            <div class="datetime-item">
              <div class="datetime-icon">
                <mat-icon>play_circle</mat-icon>
              </div>
              <div class="datetime-content">
                <span class="datetime-label">وقت البدء</span>
                <span class="datetime-value time-value">{{ formatTime(session.startTime) }}</span>
              </div>
            </div>

            <div class="datetime-item">
              <div class="datetime-icon">
                <mat-icon>stop_circle</mat-icon>
              </div>
              <div class="datetime-content">
                <span class="datetime-label">وقت الانتهاء</span>
                <span class="datetime-value time-value">{{ formatTime(session.endTime) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div class="info-card notes-card" *ngIf="session.note" @fadeIn>
          <div class="card-header">
            <div class="card-icon-wrapper">
              <mat-icon>notes</mat-icon>
            </div>
            <h3>ملاحظات</h3>
          </div>
          <div class="notes-content">
            <div class="notes-icon">
              <mat-icon>format_quote</mat-icon>
            </div>
            <p class="notes-text">{{ session.note }}</p>
          </div>
        </div>

        <!-- Audit -->
        <div class="info-card audit-card" @fadeIn>
          <div class="card-header">
            <div class="card-icon-wrapper">
              <mat-icon>history</mat-icon>
            </div>
            <h3>معلومات الإنشاء والتعديل</h3>
          </div>
          
          <div class="audit-grid">
            <div class="audit-item">
              <div class="audit-label">
                <mat-icon>person_add</mat-icon>
                <span>تم الإنشاء بواسطة</span>
              </div>
              <div class="audit-value">
                <span class="audit-name">{{ session.createdBy?.fullName || '-' }}</span>
              </div>
              <div class="audit-date">{{ session.createdOn | date:'dd/MM/yyyy HH:mm' }}</div>
            </div>
            
            <div class="audit-item" *ngIf="session.lastModifiedBy">
              <div class="audit-label">
                <mat-icon>person_edit</mat-icon>
                <span>تم التعديل بواسطة</span>
              </div>
              <div class="audit-value">
                <span class="audit-name">{{ session.lastModifiedBy?.fullName }}</span>
              </div>
              <div class="audit-date">{{ session.lastModifiedOn | date:'dd/MM/yyyy HH:mm' }}</div>
            </div>
            
            <div class="audit-item" *ngIf="!session.lastModifiedBy">
              <div class="audit-label">
                <mat-icon>info</mat-icon>
                <span>الحالة</span>
              </div>
              <div class="audit-value">
                <span class="badge status-badge" [ngClass]="getStatusClass(session.status?.id ?? 1)">
                  <mat-icon>{{ getStatusIcon(session.status?.id ?? 1) }}</mat-icon>
                  {{ session.status?.title || '-' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <mat-divider></mat-divider>

      <!-- ============================================ -->
      <!-- ACTIONS -->
      <!-- ============================================ -->
      <div class="modal-actions">
        <div class="actions-left">
          <button mat-stroked-button (click)="printDetails()" class="action-btn print-action-btn" [disabled]="isLoading">
            <mat-icon>print</mat-icon>
            <span>طباعة</span>
          </button>
          <button mat-stroked-button mat-dialog-close class="action-btn close-action-btn" [disabled]="isLoading">
            <mat-icon>close</mat-icon>
            <span>إغلاق</span>
          </button>
        </div>
        
        <div class="actions-right">
          <!-- Delete Dropdown Menu -->
          <div class="delete-dropdown">
            <button mat-raised-button color="warn" class="action-btn delete-action-btn" 
                    [matTooltip]="'خيارات الحذف'"
                    (click)="toggleDeleteMenu()"
                    [disabled]="isLoading">
              <mat-icon>{{ isLoading ? 'hourglass_empty' : 'delete' }}</mat-icon>
              <span>{{ isLoading ? 'جاري الحذف...' : 'حذف' }}</span>
              <mat-icon class="dropdown-icon" *ngIf="!isLoading">arrow_drop_down</mat-icon>
            </button>
            
            <div class="delete-menu" *ngIf="showDeleteMenu && !isLoading" @fadeIn>
              <button class="delete-menu-item" (click)="deleteSpecificSession()">
                <mat-icon>delete</mat-icon>
                <span>حذف هذه الجلسة فقط</span>
              </button>
              <button class="delete-menu-item" (click)="deleteSpecificDay()">
                <mat-icon>delete_sweep</mat-icon>
                <span>حذف جميع جلسات هذا اليوم</span>
              </button>
            </div>
          </div>
          
          <button mat-raised-button color="primary" (click)="editSession()" class="action-btn edit-action-btn" [disabled]="isLoading">
            <mat-icon>edit</mat-icon>
            <span>تعديل</span>
          </button>
        </div>
      </div>
      
      <!-- Loading overlay -->
      <div class="loading-overlay" *ngIf="isLoading" @fadeIn>
        <div class="loading-content">
          <mat-spinner diameter="40"></mat-spinner>
          <p>جاري حذف الجلسات...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ============================================ */
    /* CONTAINER */
    /* ============================================ */
    .modal-container {
      min-width: 580px;
      max-width: 680px;
      direction: rtl;
      background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.3);
      max-height: 95vh;
      display: flex;
      flex-direction: column;
    }

    /* ============================================ */
    /* HEADER */
    /* ============================================ */
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24px 28px;
      color: white;
      position: relative;
      overflow: hidden;
      min-height: 100px;
    }

    .modal-header.status-1 {
      background: linear-gradient(135deg, #1a1a2e 0%, #2563eb 100%);
    }
    .modal-header.status-2 {
      background: linear-gradient(135deg, #1a1a2e 0%, #f59e0b 100%);
    }
    .modal-header.status-3 {
      background: linear-gradient(135deg, #1a1a2e 0%, #10b981 100%);
    }
    .modal-header.status-4 {
      background: linear-gradient(135deg, #1a1a2e 0%, #ef4444 100%);
    }

    .header-decoration {
      position: absolute;
      top: -50%;
      right: -10%;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }

    .header-decoration::after {
      content: '';
      position: absolute;
      bottom: -40%;
      left: -20%;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-content-wrapper {
      display: flex;
      align-items: center;
      gap: 20px;
      z-index: 1;
      flex: 1;
    }

    .header-icon-wrapper {
      position: relative;
    }

    .header-icon {
      width: 56px;
      height: 56px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .header-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .header-text {
      flex: 1;
    }

    .header-title-row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .header-text h2 {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.3px;
    }

    .header-status {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.2);
    }

    .header-status mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .header-subtitle {
      margin: 4px 0 0;
      font-size: 13px;
      opacity: 0.85;
      font-weight: 300;
    }

    .header-actions {
      display: flex;
      gap: 6px;
      z-index: 1;
    }

    .action-btn-header {
      color: white !important;
      background: rgba(255, 255, 255, 0.12) !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      width: 40px;
      height: 40px;
    }

    .action-btn-header:hover {
      background: rgba(255, 255, 255, 0.25) !important;
      transform: scale(1.05);
    }

    .close-btn:hover {
      transform: rotate(90deg) scale(1.05);
    }

    /* ============================================ */
    /* CONTENT */
    /* ============================================ */
    .modal-content {
      padding: 24px 28px;
      overflow-y: auto;
      flex: 1;
    }

    .modal-content::-webkit-scrollbar {
      width: 5px;
    }

    .modal-content::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }

    .modal-content::-webkit-scrollbar-thumb {
      background: #c7d2fe;
      border-radius: 10px;
    }

    .modal-content::-webkit-scrollbar-thumb:hover {
      background: #818cf8;
    }

    /* ============================================ */
    /* INFO CARDS */
    /* ============================================ */
    .info-card {
      background: white;
      border-radius: 16px;
      padding: 20px 24px;
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      border: 1px solid #f1f5f9;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .info-card:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
      border-color: #e2e8f0;
      transform: translateY(-1px);
    }

    .info-card:last-child {
      margin-bottom: 0;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid #f8fafc;
    }

    .card-icon-wrapper {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .card-icon-wrapper mat-icon {
      color: #667eea;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .card-header h3 {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      color: #0f172a;
    }

    /* ============================================ */
    /* TITLE CARD */
    /* ============================================ */
    .title-card {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-color: #e2e8f0;
    }

    .title-display {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: white;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }

    .title-icon {
      color: #667eea;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .title-text {
      font-size: 15px;
      font-weight: 600;
      color: #0f172a;
      flex: 1;
    }

    /* ============================================ */
    /* DETAIL GRID */
    /* ============================================ */
    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 8px 12px;
      background: #fafbfc;
      border-radius: 10px;
      border: 1px solid #f1f5f9;
    }

    .detail-item.full-width {
      grid-column: span 2;
    }

    .detail-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 500;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .detail-label mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .detail-value {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }

    /* ============================================ */
    /* BADGES */
    /* ============================================ */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .course-badge {
      background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
      color: #4338ca;
    }

    .place-badge {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      color: #065f46;
    }

    .status-badge {
      background: #f1f5f9;
      color: #0f172a;
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

    .status-badge mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    /* ============================================ */
    /* TRAINERS */
    /* ============================================ */
    .trainers-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .trainer-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px 4px 8px;
      background: white;
      border-radius: 20px;
      border: 1px solid #e2e8f0;
      transition: all 0.2s ease;
    }

    .trainer-chip:hover {
      border-color: #667eea;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
    }

    .trainer-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
    }

    .trainer-name {
      font-size: 13px;
      font-weight: 500;
      color: #0f172a;
    }

    .no-trainer {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #94a3b8;
      font-size: 13px;
    }

    .no-trainer mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* ============================================ */
    /* DATE & TIME */
    /* ============================================ */
    .datetime-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .datetime-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      background: #fafbfc;
      border-radius: 10px;
      border: 1px solid #f1f5f9;
      transition: all 0.2s ease;
    }

    .datetime-item:hover {
      border-color: #e2e8f0;
    }

    .datetime-icon {
      width: 36px;
      height: 36px;
      background: white;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border: 1px solid #f1f5f9;
    }

    .datetime-icon mat-icon {
      color: #667eea;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .datetime-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .datetime-label {
      font-size: 10px;
      color: #94a3b8;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .datetime-value {
      font-size: 13px;
      font-weight: 600;
      color: #0f172a;
    }

    .day-badge {
      display: inline-block;
      padding: 2px 12px;
      background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
      border-radius: 12px;
      font-size: 12px;
      color: #4338ca;
    }

    .time-value {
      color: #0f172a;
    }

    /* ============================================ */
    /* NOTES */
    /* ============================================ */
    .notes-card {
      background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
      border-color: #fde68a;
    }

    .notes-content {
      position: relative;
      padding: 16px 20px 16px 16px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 12px;
      border: 1px solid #fde68a;
    }

    .notes-icon {
      position: absolute;
      top: -12px;
      right: 16px;
      background: white;
      border-radius: 50%;
      padding: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    .notes-icon mat-icon {
      color: #f59e0b;
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .notes-text {
      margin: 0;
      line-height: 1.8;
      color: #92400e;
      font-size: 14px;
    }

    /* ============================================ */
    /* AUDIT */
    /* ============================================ */
    .audit-card {
      background: #fafbfc;
      border-color: #f1f5f9;
    }

    .audit-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .audit-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 10px 14px;
      background: white;
      border-radius: 10px;
      border: 1px solid #f1f5f9;
    }

    .audit-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 10px;
      color: #94a3b8;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .audit-label mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .audit-value {
      font-size: 13px;
      font-weight: 600;
      color: #0f172a;
    }

    .audit-name {
      color: #0f172a;
    }

    .audit-date {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 2px;
    }

    /* ============================================ */
    /* DELETE DROPDOWN */
    /* ============================================ */
    .delete-dropdown {
      position: relative;
      display: inline-block;
    }

    .delete-dropdown .dropdown-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      margin-right: -4px;
    }

    .delete-menu {
      position: absolute;
      bottom: 100%;
      left: 0;
      margin-bottom: 8px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      min-width: 220px;
      overflow: hidden;
      border: 1px solid #e5e7eb;
      z-index: 1000;
    }

    .delete-menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      width: 100%;
      border: none;
      background: white;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      color: #1f2937;
      transition: all 0.2s ease;
      text-align: right;
      font-family: inherit;
    }

    .delete-menu-item:hover {
      background: #fef2f2;
      color: #dc2626;
    }

    .delete-menu-item:first-child {
      border-radius: 12px 12px 0 0;
    }

    .delete-menu-item:last-child {
      border-radius: 0 0 12px 12px;
    }

    .delete-menu-item mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #6b7280;
    }

    .delete-menu-item:hover mat-icon {
      color: #dc2626;
    }

    /* ============================================ */
    /* ACTIONS */
    /* ============================================ */
    .modal-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: #fafbfc;
      border-top: 1px solid #f1f5f9;
      gap: 12px;
      flex-wrap: wrap;
    }

    .actions-left,
    .actions-right {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .action-btn {
      padding: 0 20px;
      height: 42px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      border-radius: 10px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .edit-action-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.25);
    }

    .edit-action-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.35);
    }

    .delete-action-btn {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
      box-shadow: 0 4px 16px rgba(239, 68, 68, 0.25);
      position: relative;
    }

    .delete-action-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(239, 68, 68, 0.35);
    }

    .delete-action-btn:disabled {
      opacity: 0.7;
    }

    .print-action-btn {
      border: 2px solid #667eea !important;
      color: #667eea !important;
    }

    .print-action-btn:hover:not(:disabled) {
      background: #f3f0ff !important;
      border-color: #764ba2 !important;
      color: #764ba2 !important;
    }

    .close-action-btn {
      border: 2px solid #e2e8f0 !important;
      color: #475569 !important;
    }

    .close-action-btn:hover:not(:disabled) {
      background: #f8fafc !important;
      border-color: #cbd5e1 !important;
    }

    /* ============================================ */
    /* LOADING OVERLAY */
    /* ============================================ */
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.92);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
      border-radius: 28px;
    }

    .loading-content {
      text-align: center;
    }

    .loading-content p {
      margin-top: 16px;
      color: #667eea;
      font-weight: 600;
      font-size: 14px;
    }

    /* ============================================ */
    /* RESPONSIVE */
    /* ============================================ */
    @media (max-width: 700px) {
      .modal-container {
        min-width: 92vw;
        max-width: 95vw;
        border-radius: 20px;
      }

      .loading-overlay {
        border-radius: 20px;
      }

      .modal-header {
        padding: 18px 20px;
        flex-wrap: wrap;
        min-height: auto;
      }

      .header-content-wrapper {
        flex-wrap: wrap;
        gap: 12px;
      }

      .header-icon {
        width: 44px;
        height: 44px;
      }

      .header-icon mat-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
      }

      .header-text h2 {
        font-size: 18px;
      }

      .header-title-row {
        flex-wrap: wrap;
      }

      .header-subtitle {
        font-size: 12px;
      }

      .modal-content {
        padding: 16px 18px;
      }

      .detail-grid {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .detail-item.full-width {
        grid-column: span 1;
      }

      .datetime-grid {
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .audit-grid {
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .modal-actions {
        flex-direction: column-reverse;
        padding: 12px 16px;
      }

      .actions-left,
      .actions-right {
        width: 100%;
        justify-content: center;
        flex-wrap: wrap;
      }

      .action-btn {
        flex: 1;
        justify-content: center;
        min-width: 80px;
      }

      .delete-menu {
        position: fixed;
        bottom: auto;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        min-width: 300px;
        max-width: 90vw;
      }

      .info-card {
        padding: 16px 18px;
      }

      .trainers-list {
        flex-direction: column;
        gap: 4px;
      }
    }

    @media (max-width: 420px) {
      .modal-container {
        border-radius: 16px;
        max-height: 98vh;
      }

      .loading-overlay {
        border-radius: 16px;
      }

      .modal-header {
        padding: 14px 16px;
      }

      .header-icon {
        width: 36px;
        height: 36px;
      }

      .header-icon mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .header-text h2 {
        font-size: 16px;
      }

      .header-status {
        font-size: 10px;
        padding: 2px 10px;
      }

      .modal-content {
        padding: 12px 14px;
      }

      .action-btn {
        height: 38px;
        font-size: 13px;
        padding: 0 14px;
      }

      .delete-menu {
        min-width: 250px;
      }
    }

    /* ============================================ */
    /* PRINT */
    /* ============================================ */
    @media print {
      .modal-container {
        box-shadow: none !important;
        border-radius: 0 !important;
        min-width: 100% !important;
        max-width: 100% !important;
        max-height: none !important;
      }

      .modal-header {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        background: #667eea !important;
      }

      .modal-actions,
      .header-actions,
      .delete-dropdown,
      .loading-overlay {
        display: none !important;
      }

      .info-card {
        box-shadow: none !important;
        border: 1px solid #e5e7eb !important;
        page-break-inside: avoid !important;
        transform: none !important;
      }

      .info-card:hover {
        transform: none !important;
        box-shadow: none !important;
      }

      .status-badge,
      .day-badge,
      .badge,
      .trainer-chip {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .modal-content {
        max-height: none !important;
        overflow: visible !important;
        padding: 16px !important;
      }

      .detail-item,
      .datetime-item,
      .audit-item {
        border: 1px solid #e5e7eb !important;
      }
    }
  `]
})
export class CourseSessionDetailsModalComponent implements OnDestroy {
  showDeleteMenu: boolean = false;
  isLoading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<CourseSessionDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public session: CourseSessionVTO,
    private sessionService: CourseSessionService,
    private notification: NotificationService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Get trainer display name
   */
  getTrainerName(trainer: any): string {
    if (!trainer) return '-';
    return trainer.title || trainer.name || trainer.fullName || `مدرب ${trainer.id}`;
  }

  /**
   * Get trainer initials for avatar
   */
  getTrainerInitials(trainer: any): string {
    if (!trainer) return 'م';
    const name = trainer.title || trainer.name || trainer.fullName || 'مدرب';
    return name.charAt(0);
  }

  /**
   * Get all trainer names as a string (for print view)
   */
  getTrainerNamesString(trainers: any[]): string {
    if (!trainers || !Array.isArray(trainers) || trainers.length === 0) {
      return '-';
    }
    return trainers.map(t => this.getTrainerName(t)).join('، ');
  }

  /**
   * Format time to 12-hour format with AM/PM
   */
  formatTime(time: string): string {
    if (!time) return '-';
    
    try {
      const [hours, minutes] = time.split(':');
      let hour = parseInt(hours, 10);
      const minute = parseInt(minutes, 10);
      
      const ampm = hour >= 12 ? 'م' : 'ص';
      hour = hour % 12;
      hour = hour ? hour : 12;
      
      const hourStr = hour.toString().padStart(2, '0');
      const minuteStr = minute.toString().padStart(2, '0');
      
      return `${hourStr}:${minuteStr} ${ampm}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return time;
    }
  }

  /**
   * Get Arabic day label from enum value
   */
  getDayLabel(dayEnum: string): string {
    if (!dayEnum) return '-';
    return DAYS_OF_WEEK[dayEnum] || dayEnum;
  }

  /**
   * Get status CSS class - Backend uses IDs 1-4
   */
  getStatusClass(statusId: number): string {
    return STATUS_CONFIG[statusId]?.class || '';
  }

  /**
   * Get status icon - Backend uses IDs 1-4
   */
  getStatusIcon(statusId: number): string {
    return STATUS_CONFIG[statusId]?.icon || 'help';
  }

  /**
   * Get status color - Backend uses IDs 1-4
   */
  getStatusColor(statusId: number): string {
    return STATUS_CONFIG[statusId]?.color || '#6b7280';
  }

  /**
   * Toggle delete menu
   */
  toggleDeleteMenu(): void {
    if (!this.isLoading) {
      this.showDeleteMenu = !this.showDeleteMenu;
    }
  }

  /**
   * Edit session - returns edit action with session data
   */
  editSession(): void {
    if (!this.isLoading) {
      this.dialogRef.close({ action: 'edit', session: this.session });
    }
  }

  /**
   * Delete this specific session only
   * Uses deleteSpecificSession endpoint
   */
  deleteSpecificSession(): void {
    this.showDeleteMenu = false;
    const title = this.session.title || `جلسة #${this.session.id}`;
    
    if (!confirm(`هل أنت متأكد من حذف الجلسة "${title}"؟`)) {
      return;
    }

    this.isLoading = true;

    this.sessionService.deleteSpecificSession(this.session.id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.notification.showSuccess('تم حذف الجلسة بنجاح');
          this.dialogRef.close({ 
            action: 'deleted', 
            deleteType: 'single',
            session: this.session
          });
        },
        error: (err) => {
          this.notification.showError('حدث خطأ في حذف الجلسة');
          console.error('Delete error:', err);
        }
      });
  }

  /**
   * Delete all sessions for this day (same course + same day + same time)
   * Uses deleteSessionsByDayCourseAndTrainers endpoint
   */
  deleteSpecificDay(): void {
    this.showDeleteMenu = false;
    const dayLabel = this.getDayLabel(this.session.sessionDay || '');
    const courseTitle = this.session.course?.title || 'هذه الدورة';
    const trainerNames = this.session.trainers?.map(t => this.getTrainerName(t)).join('، ') || 'جميع المدربين';
    
    if (!confirm(
      `هل أنت متأكد من حذف جميع جلسات يوم ${dayLabel} في "${courseTitle}"؟\n\n` +
      `سيتم حذف الجلسات التالية:\n` +
      `• اليوم: ${dayLabel}\n` +
      `• الوقت: ${this.formatTime(this.session.startTime)} - ${this.formatTime(this.session.endTime)}\n` +
      `• المدربون: ${trainerNames}\n\n` +
      `⚠️ سيتم حذف جميع الجلسات التي تطابق هذه البيانات.`
    )) {
      return;
    }

    this.isLoading = true;

    // Extract trainer IDs from the session
    const trainerIds = this.session.trainers?.map((t: any) => t.id).filter(Boolean) || [];
    const courseId = this.session.course?.id;
    const sessionDay = this.session.sessionDay;

    if (!courseId || !sessionDay || trainerIds.length === 0) {
      this.notification.showError('بيانات غير مكتملة للحذف');
      this.isLoading = false;
      return;
    }

    // Call the service directly
    this.sessionService.deleteSessionsByDayCourseAndTrainers(courseId, sessionDay, trainerIds)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.notification.showSuccess(`تم حذف جميع جلسات يوم ${dayLabel} بنجاح`);
          this.dialogRef.close({ 
            action: 'deleted', 
            deleteType: 'day',
            courseId: courseId,
            sessionDay: sessionDay,
            trainerIds: trainerIds
          });
        },
        error: (err) => {
          this.notification.showError('حدث خطأ في حذف الجلسات');
          console.error('Delete error:', err);
        }
      });
  }

  /**
   * Print session details with enhanced styling
   */
  printDetails(): void {
    if (this.isLoading) return;
    
    const printWindow = window.open('', '_blank', 'width=900,height=700,scrollbars=yes');
    if (!printWindow) {
      window.print();
      return;
    }

    const statusConfig = STATUS_CONFIG[this.session.status?.id ?? 1];
    const statusStyle = `
      background-color: ${statusConfig?.bg || '#dbeafe'};
      color: ${statusConfig?.color || '#1e40af'};
      padding: 6px 16px;
      border-radius: 30px;
      display: inline-block;
      font-weight: 600;
      font-size: 13px;
    `;

    const trainerNames = this.getTrainerNamesString(this.session.trainers);
    const dayLabel = this.getDayLabel(this.session.sessionDay || '');
    const startTime = this.formatTime(this.session.startTime || '');
    const endTime = this.formatTime(this.session.endTime || '');
    const sessionDate = this.session.sessionDate 
      ? new Date(this.session.sessionDate).toLocaleDateString('ar-EG', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) 
      : '-';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>تفاصيل الجلسة - ${this.session.title}</title>
        <style>
          * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; box-sizing: border-box; }
          body { padding: 30px; background: white; direction: rtl; }
          
          .print-header {
            text-align: center;
            padding: 24px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 12px;
            margin-bottom: 24px;
          }
          .print-header h1 { margin: 0; font-size: 24px; font-weight: 700; }
          .print-header p { margin: 6px 0 0; opacity: 0.9; font-size: 14px; }
          .print-header .date { font-size: 12px; opacity: 0.8; margin-top: 4px; }
          
          .print-section {
            margin-bottom: 20px;
            padding: 18px 20px;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            page-break-inside: avoid;
            background: white;
          }
          .print-section h3 {
            margin: 0 0 14px 0;
            color: #667eea;
            font-size: 16px;
            border-bottom: 2px solid #f3f4f6;
            padding-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .print-row {
            display: flex;
            padding: 6px 0;
            border-bottom: 1px solid #f8fafc;
          }
          .print-row:last-child { border-bottom: none; }
          .print-label {
            width: 160px;
            font-weight: 600;
            color: #6b7280;
            font-size: 13px;
            flex-shrink: 0;
          }
          .print-value {
            flex: 1;
            color: #1f2937;
            font-weight: 500;
            font-size: 13px;
          }
          
          .print-badge {
            display: inline-block;
            padding: 3px 14px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
          }
          .print-badge.course { background: #e0e7ff; color: #4338ca; }
          .print-badge.day { background: #e0e7ff; color: #4338ca; }
          .print-badge.place { background: #ecfdf5; color: #065f46; }
          
          .status-badge-print {
            display: inline-block;
            padding: 6px 16px;
            border-radius: 30px;
            font-size: 13px;
            font-weight: 600;
          }
          
          .print-notes {
            background: #fef3c7;
            padding: 14px 18px;
            border-radius: 8px;
            margin-top: 4px;
            border-right: 4px solid #f59e0b;
          }
          .print-notes p { margin: 0; color: #92400e; font-size: 14px; line-height: 1.6; }
          
          .print-footer {
            text-align: center;
            margin-top: 24px;
            padding: 16px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #9ca3af;
          }
          
          .print-audit-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }
          .print-audit-item {
            display: flex;
            flex-direction: column;
            gap: 2px;
            padding: 8px 12px;
            background: #f8fafc;
            border-radius: 8px;
          }
          .print-audit-label {
            font-size: 11px;
            color: #9ca3af;
            font-weight: 500;
          }
          .print-audit-value {
            font-size: 13px;
            color: #1f2937;
            font-weight: 500;
          }
          
          .trainer-tag {
            display: inline-block;
            padding: 4px 14px;
            background: #e8f0fe;
            border-radius: 16px;
            font-size: 13px;
            font-weight: 500;
            color: #1e40af;
            margin: 2px 4px 2px 0;
          }
          
          .print-status-container {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          @media print {
            body { padding: 15px; }
            .print-section { break-inside: avoid; }
            .no-print { display: none; }
          }
          
          @media (max-width: 600px) {
            .print-row { flex-direction: column; gap: 4px; }
            .print-label { width: 100%; }
            .print-audit-grid { grid-template-columns: 1fr; }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>📋 تفاصيل الجلسة التدريبية</h1>
          <p>${this.session.title}</p>
          <div class="date">تم الطباعة في: ${new Date().toLocaleString('ar-EG')}</div>
        </div>

        <!-- Session Info -->
        <div class="print-section">
          <h3>📌 معلومات الجلسة</h3>
          <div class="print-row">
            <div class="print-label">عنوان الجلسة:</div>
            <div class="print-value"><strong>${this.session.title}</strong></div>
          </div>
        </div>

        <!-- Basic Info -->
        <div class="print-section">
          <h3>🏫 البيانات الأساسية</h3>
          <div class="print-row">
            <div class="print-label">الدورة:</div>
            <div class="print-value"><span class="print-badge course">${this.session.course?.title || '-'}</span></div>
          </div>
          <div class="print-row">
            <div class="print-label">المدربون:</div>
            <div class="print-value">
              ${this.session.trainers && this.session.trainers.length > 0 
                ? this.session.trainers.map(t => `<span class="trainer-tag">${this.getTrainerName(t)}</span>`).join('') 
                : '-'
              }
            </div>
          </div>
          <div class="print-row">
            <div class="print-label">المكان:</div>
            <div class="print-value"><span class="print-badge place">${this.session.place?.title || '-'}</span></div>
          </div>
        </div>

        <!-- Date & Time -->
        <div class="print-section">
          <h3>⏰ التاريخ والوقت</h3>
          <div class="print-row">
            <div class="print-label">التاريخ:</div>
            <div class="print-value">${sessionDate}</div>
          </div>
          <div class="print-row">
            <div class="print-label">اليوم:</div>
            <div class="print-value"><span class="print-badge day">${dayLabel}</span></div>
          </div>
          <div class="print-row">
            <div class="print-label">وقت البدء:</div>
            <div class="print-value">${startTime}</div>
          </div>
          <div class="print-row">
            <div class="print-label">وقت الانتهاء:</div>
            <div class="print-value">${endTime}</div>
          </div>
          <div class="print-row">
            <div class="print-label">الحالة:</div>
            <div class="print-value">
              <div class="print-status-container">
                <span class="status-badge-print" style="${statusStyle}">
                  ${this.session.status?.title || '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes -->
        ${this.session.note ? `
        <div class="print-section">
          <h3>📝 ملاحظات</h3>
          <div class="print-notes">
            <p>${this.session.note}</p>
          </div>
        </div>
        ` : ''}

        <!-- Audit -->
        <div class="print-section">
          <h3>📋 معلومات الإنشاء والتعديل</h3>
          <div class="print-audit-grid">
            <div class="print-audit-item">
              <div class="print-audit-label">تم الإنشاء بواسطة</div>
              <div class="print-audit-value">${this.session.createdBy?.fullName || '-'}</div>
            </div>
            <div class="print-audit-item">
              <div class="print-audit-label">تاريخ الإنشاء</div>
              <div class="print-audit-value">${this.session.createdOn ? new Date(this.session.createdOn).toLocaleString('ar-EG') : '-'}</div>
            </div>
            ${this.session.lastModifiedBy ? `
            <div class="print-audit-item">
              <div class="print-audit-label">تم التعديل بواسطة</div>
              <div class="print-audit-value">${this.session.lastModifiedBy?.fullName}</div>
            </div>
            ` : ''}
            ${this.session.lastModifiedOn ? `
            <div class="print-audit-item">
              <div class="print-audit-label">تاريخ التعديل</div>
              <div class="print-audit-value">${new Date(this.session.lastModifiedOn).toLocaleString('ar-EG')}</div>
            </div>
            ` : ''}
          </div>
        </div>

        <div class="print-footer">
          تم التصدير من نظام إدارة الأكاديمية الأولمبية
        </div>

        <div class="no-print" style="text-align: center; margin-top: 20px; padding: 10px; position: sticky; bottom: 0; background: white; border-top: 1px solid #e5e7eb;">
          <button onclick="window.print();" style="padding: 10px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);">
            🖨️ طباعة / حفظ كـ PDF
          </button>
          <button onclick="window.close();" style="padding: 10px 24px; background: #f1f5f9; color: #475569; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; margin-right: 12px;">
            ✖ إغلاق
          </button>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
  }
}