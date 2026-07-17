import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router'; // Add this import
import { DepartmentService } from '../../../../core/services/department.service';

export interface DepartmentVTO {
  id: number;
  title: string;
  description?: string;
  isActive: boolean;
  totalCourses: number;
  totalGained: number;
  totalEnrollmentPayments: number;
  totalStudents: number;
  createdOn: string;
  createdBy: any;
  lastModifiedOn?: string;
  lastModifiedBy?: any;
}

@Component({
  selector: 'app-department-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    FormsModule,
    RouterLink // Add RouterLink here
  ],
  template: `
    <div class="modal-container" *ngIf="!loading; else loadingTemplate">
      <!-- Header -->
      <div class="modal-header" [class.active]="departmentData?.isActive" [class.inactive]="!departmentData?.isActive">
        <div class="header-title">
          <mat-icon>business</mat-icon>
          <h2>تفاصيل القسم</h2>
        </div>
        <button mat-icon-button (click)="onClose()" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <mat-divider></mat-divider>
      
      <div class="modal-content">
        <!-- Basic Info Section -->
        <div class="info-section">
          <div class="section-header">
            <mat-icon>info</mat-icon>
            <h3>معلومات أساسية</h3>
          </div>
          <div class="info-grid">
            <div class="info-item full-width">
              <span class="label">اسم القسم:</span>
              <span class="value">{{ departmentData?.title }}</span>
            </div>
            <div class="info-item full-width" *ngIf="departmentData?.description">
              <span class="label">الوصف:</span>
              <span class="value">{{ departmentData?.description }}</span>
            </div>
            <div class="info-item">
              <span class="label">الحالة:</span>
              <span class="value">
                <span class="status-badge" [class.active]="departmentData?.isActive" [class.inactive]="!departmentData?.isActive">
                  <mat-icon class="status-icon">{{ departmentData?.isActive ? 'check_circle' : 'cancel' }}</mat-icon>
                  <span>{{ departmentData?.isActive ? 'نشط' : 'غير نشط' }}</span>
                </span>
              </span>
            </div>
          </div>
        </div>

        <!-- Statistics Section -->
        <div class="info-section stats-section">
          <div class="section-header">
            <mat-icon>analytics</mat-icon>
            <h3>إحصائيات القسم</h3>
          </div>
          
          <div class="stats-grid">
            <div class="stat-card courses-card">
              <div class="stat-icon">
                <mat-icon>book</mat-icon>
              </div>
              <div class="stat-content">
                <span class="stat-label">إجمالي الدورات</span>
                <span class="stat-value">{{ departmentData?.totalCourses || 0 }}</span>
              </div>
            </div>
            
            <div class="stat-card students-card">
              <div class="stat-icon">
                <mat-icon>people</mat-icon>
              </div>
              <div class="stat-content">
                <span class="stat-label">إجمالي الطلاب</span>
                <span class="stat-value">{{ departmentData?.totalStudents || 0 }}</span>
              </div>
            </div>
            
            <div class="stat-card payments-card">
              <div class="stat-icon">
                <mat-icon>receipt</mat-icon>
              </div>
              <div class="stat-content">
                <span class="stat-label">عدد المدفوعات</span>
                <span class="stat-value">{{ departmentData?.totalEnrollmentPayments || 0 }}</span>
              </div>
            </div>
            
            <div class="stat-card revenue-card">
              <div class="stat-icon">
                <mat-icon>trending_up</mat-icon>
              </div>
              <div class="stat-content">
                <span class="stat-label">إجمالي الإيرادات</span>
                <span class="stat-value revenue">{{ departmentData?.totalGained || 0 | number }} جم</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Date Filter Section -->
        <div class="info-section financial-report">
          <div class="section-header">
            <mat-icon>filter_alt</mat-icon>
            <h3>تصفية التقرير المالي</h3>
          </div>
          <div class="filter-container">
            <div class="filter-row">
              <div class="filter-group">
                <label>من تاريخ</label>
                <input type="date" 
                       [(ngModel)]="fromDate" 
                       (change)="loadDepartmentData()" 
                       class="date-input">
              </div>
              <div class="filter-group">
                <label>إلى تاريخ</label>
                <input type="date" 
                       [(ngModel)]="toDate" 
                       (change)="loadDepartmentData()" 
                       class="date-input">
              </div>
              <button mat-stroked-button 
                      (click)="clearDateFilter()" 
                      class="clear-filter-btn"
                      *ngIf="fromDate || toDate">
                <mat-icon>clear</mat-icon>
                مسح الفلتر
              </button>
              <button mat-stroked-button 
                      (click)="refreshReport()" 
                      class="refresh-btn">
                <mat-icon>refresh</mat-icon>
                تحديث
              </button>
            </div>
          </div>
        </div>

        <!-- Financial Report Section -->
        <div class="info-section financial-report" *ngIf="departmentData && (departmentData.totalGained > 0 || departmentData.totalEnrollmentPayments > 0)">
          <div class="section-header">
            <mat-icon>assessment</mat-icon>
            <h3>التقرير المالي للقسم</h3>
            <span class="report-date" *ngIf="fromDate || toDate">
              ({{ fromDate || 'من البداية' }} - {{ toDate || 'حتى الآن' }})
            </span>
          </div>
          
          <div class="report-container">
            <div class="report-cards">
              <div class="report-card students-report-card">
                <div class="card-icon">
                  <mat-icon>people</mat-icon>
                </div>
                <div class="card-content">
                  <span class="card-label">إجمالي الطلاب المسجلين</span>
                  <span class="card-value">{{ departmentData?.totalStudents || 0 }}</span>
                </div>
              </div>
              
              <div class="report-card courses-report-card">
                <div class="card-icon">
                  <mat-icon>book</mat-icon>
                </div>
                <div class="card-content">
                  <span class="card-label">إجمالي الدورات النشطة</span>
                  <span class="card-value">{{ departmentData?.totalCourses || 0 }}</span>
                </div>
              </div>
              
              <div class="report-card revenue-report-card">
                <div class="card-icon">
                  <mat-icon>payments</mat-icon>
                </div>
                <div class="card-content">
                  <span class="card-label">إجمالي الإيرادات</span>
                  <span class="card-value revenue">{{ departmentData?.totalGained || 0 | number }} جم</span>
                </div>
              </div>
              
              <div class="report-card payments-report-card">
                <div class="card-icon">
                  <mat-icon>receipt_long</mat-icon>
                </div>
                <div class="card-content">
                  <span class="card-label">عدد المدفوعات</span>
                  <span class="card-value">{{ departmentData?.totalEnrollmentPayments || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Report Loading State -->
        <div class="info-section financial-report" *ngIf="reportLoading">
          <div class="section-header">
            <mat-icon>assessment</mat-icon>
            <h3>التقرير المالي للقسم</h3>
          </div>
          <div class="loading-spinner">
            <mat-spinner diameter="30"></mat-spinner>
            <span>جاري تحميل التقرير المالي...</span>
          </div>
        </div>

        <!-- No Report Message -->
        <div class="info-section financial-report no-report" *ngIf="!reportLoading && departmentData && departmentData.totalGained === 0 && departmentData.totalEnrollmentPayments === 0">
          <div class="section-header">
            <mat-icon>assessment</mat-icon>
            <h3>التقرير المالي للقسم</h3>
          </div>
          <div class="no-report-message">
            <mat-icon>info</mat-icon>
            <span>لا توجد بيانات مالية لهذا القسم</span>
          </div>
        </div>
        
        <!-- Additional Info Section -->
        <div class="info-section" *ngIf="departmentData?.createdOn">
          <div class="section-header">
            <mat-icon>event</mat-icon>
            <h3>معلومات إضافية</h3>
          </div>
          <div class="info-grid">
            <div class="info-item full-width">
              <span class="label">تاريخ الإنشاء:</span>
              <span class="value">{{ departmentData?.createdOn | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="info-item full-width" *ngIf="departmentData?.createdBy?.fullName">
              <span class="label">تم الإنشاء بواسطة:</span>
              <span class="value">{{ departmentData?.createdBy?.fullName }}</span>
            </div>
            <div class="info-item full-width" *ngIf="departmentData?.lastModifiedOn">
              <span class="label">آخر تعديل:</span>
              <span class="value">{{ departmentData?.lastModifiedOn | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="info-item full-width" *ngIf="departmentData?.lastModifiedBy?.fullName">
              <span class="label">آخر تعديل بواسطة:</span>
              <span class="value">{{ departmentData?.lastModifiedBy?.fullName }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <mat-divider></mat-divider>
      
      <div class="modal-actions">
        <button mat-raised-button color="primary" (click)="printDetails()" class="print-btn">
          <mat-icon>print</mat-icon> طباعة التفاصيل
        </button>
        <button mat-raised-button color="primary" [routerLink]="['/departments', departmentData?.id, 'edit']" class="edit-btn" (click)="onClose()">
          <mat-icon>edit</mat-icon> تعديل
        </button>
        <button mat-stroked-button (click)="onClose()" class="close-btn-action">
          <mat-icon>close</mat-icon> إغلاق
        </button>
      </div>
    </div>

    <!-- Loading Template -->
    <ng-template #loadingTemplate>
      <div class="loading-container">
        <mat-spinner diameter="50"></mat-spinner>
        <p>جاري تحميل البيانات...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .modal-container {
      background: white;
      border-radius: 24px;
      overflow: hidden;
      min-width: 550px;
      max-width: 700px;
      direction: rtl;
      animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      color: white;
      transition: background 0.3s;
    }
    
    .modal-header.active {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }
    
    .modal-header.inactive {
      background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
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
      font-weight: 600;
    }
    
    .modal-header .close-btn {
      color: white;
      transition: transform 0.2s;
    }
    
    .modal-header .close-btn:hover {
      transform: rotate(90deg);
      background: rgba(255, 255, 255, 0.1);
    }
    
    .modal-content {
      padding: 20px 24px;
      max-height: 65vh;
      overflow-y: auto;
    }
    
    /* Custom Scrollbar */
    .modal-content::-webkit-scrollbar {
      width: 6px;
    }
    
    .modal-content::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }
    
    .modal-content::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }
    
    .info-section {
      margin-bottom: 24px;
    }
    
    .info-section:last-child {
      margin-bottom: 0;
    }
    
    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }
    
    .section-header mat-icon {
      color: #10b981;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    
    .section-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }
    
    .report-date {
      font-size: 12px;
      color: #64748b;
      font-weight: 400;
      margin-right: auto;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 8px 0;
      border-bottom: 1px solid #f1f5f9;
    }
    
    .info-item.full-width {
      grid-column: 1 / -1;
    }
    
    .info-item .label {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
    }
    
    .info-item .value {
      font-size: 14px;
      color: #1f2937;
      font-weight: 500;
    }
    
    /* Status Badge */
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 30px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .status-badge.active {
      background-color: #d1fae5;
      color: #065f46;
    }
    
    .status-badge.inactive {
      background-color: #fee2e2;
      color: #991b1b;
    }
    
    .status-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }
    
    /* Stats Section */
    .stats-section {
      background: #f8fafc;
      border-radius: 16px;
      padding: 16px;
    }
    
    .stats-section .section-header {
      border-bottom-color: #d1d5db;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    
    .stat-card {
      display: flex;
      align-items: center;
      gap: 12px;
      background: white;
      padding: 14px 16px;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    
    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }
    
    .stat-icon mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
    }
    
    .courses-card .stat-icon {
      background: #dbeafe;
      color: #2563eb;
    }
    
    .students-card .stat-icon {
      background: #d1fae5;
      color: #059669;
    }
    
    .payments-card .stat-icon {
      background: #fef3c7;
      color: #d97706;
    }
    
    .revenue-card .stat-icon {
      background: #ede9fe;
      color: #7c3aed;
    }
    
    .stat-content {
      display: flex;
      flex-direction: column;
    }
    
    .stat-label {
      font-size: 11px;
      color: #64748b;
      font-weight: 500;
    }
    
    .stat-value {
      font-size: 18px;
      font-weight: 700;
      color: #1f2937;
    }
    
    .stat-value.revenue {
      color: #7c3aed;
    }
    
    /* Filter Styles */
    .filter-container {
      background: white;
      border-radius: 12px;
      padding: 16px;
      border: 1px solid #e5e7eb;
    }
    
    .filter-row {
      display: flex;
      align-items: flex-end;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .filter-group label {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
    }
    
    .date-input {
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 13px;
      background: white;
      transition: border-color 0.2s;
      min-width: 140px;
    }
    
    .date-input:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
    
    .clear-filter-btn, .refresh-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      padding: 6px 16px;
      height: 38px;
    }
    
    .refresh-btn {
      background: #10b981;
      color: white;
    }
    
    .refresh-btn:hover {
      background: #059669;
    }
    
    /* Financial Report Styles */
    .financial-report {
      background: #f8fafc;
      border-radius: 16px;
      padding: 16px;
      margin-top: 8px;
    }
    
    .financial-report .section-header {
      border-bottom-color: #d1d5db;
    }
    
    .report-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    
    .report-card {
      display: flex;
      align-items: center;
      gap: 12px;
      background: white;
      padding: 14px 16px;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .report-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    
    .card-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }
    
    .card-icon mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
    }
    
    .students-report-card .card-icon {
      background: #d1fae5;
      color: #059669;
    }
    
    .courses-report-card .card-icon {
      background: #dbeafe;
      color: #2563eb;
    }
    
    .revenue-report-card .card-icon {
      background: #ede9fe;
      color: #7c3aed;
    }
    
    .payments-report-card .card-icon {
      background: #fef3c7;
      color: #d97706;
    }
    
    .card-content {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    
    .card-label {
      font-size: 11px;
      color: #64748b;
      font-weight: 500;
    }
    
    .card-value {
      font-size: 16px;
      font-weight: 700;
      color: #1f2937;
    }
    
    .card-value.revenue {
      color: #7c3aed;
    }
    
    .no-report-message {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px;
      background: white;
      border-radius: 12px;
      border: 1px dashed #d1d5db;
      color: #9ca3af;
    }
    
    .no-report-message mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    
    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 20px;
      color: #64748b;
    }
    
    /* Modal Actions */
    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding: 16px 24px;
      background: #f8fafc;
    }
    
    .modal-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 20px;
      transition: transform 0.2s;
    }
    
    .modal-actions button:hover {
      transform: translateY(-1px);
    }
    
    .print-btn {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
    }
    
    .edit-btn {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
    }
    
    .close-btn-action {
      border-color: #e5e7eb;
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;
      gap: 16px;
      color: #64748b;
      min-width: 400px;
    }
    
    .loading-container p {
      margin: 0;
      font-size: 14px;
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
      .modal-container {
        min-width: 90vw;
        max-width: 90vw;
      }
      
      .info-grid {
        grid-template-columns: 1fr;
        gap: 8px;
      }
      
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .report-cards {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .filter-row {
        flex-direction: column;
        align-items: stretch;
      }
      
      .filter-group {
        width: 100%;
      }
      
      .date-input {
        width: 100%;
        min-width: unset;
      }
      
      .clear-filter-btn, .refresh-btn {
        width: 100%;
        justify-content: center;
      }
      
      .modal-header {
        padding: 16px 20px;
      }
      
      .modal-header h2 {
        font-size: 18px;
      }
      
      .modal-content {
        padding: 16px 20px;
        max-height: 55vh;
      }
      
      .modal-actions {
        flex-direction: column;
        gap: 10px;
      }
      
      .modal-actions button {
        width: 100%;
        justify-content: center;
      }
    }
    
    @media (max-width: 480px) {
      .modal-container {
        min-width: 95vw;
        max-width: 95vw;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .report-cards {
        grid-template-columns: 1fr;
      }
      
      .card-value {
        font-size: 14px;
      }
    }
  `]
})
export class DepartmentDetailsModalComponent implements OnInit {
  departmentData: DepartmentVTO | null = null;
  loading: boolean = true;
  reportLoading: boolean = false;
  
  // Date filters
  fromDate: string | null = null;
  toDate: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<DepartmentDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { departmentId: number },
    private departmentService: DepartmentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDepartmentData();
  }

  /**
   * Load department data from backend with optional date filters
   */
  loadDepartmentData(): void {
    if (!this.data?.departmentId) {
      this.snackBar.open('معرف القسم غير صالح', 'إغلاق', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
      this.loading = false;
      return;
    }

    this.reportLoading = true;
    this.loading = true;

    const params: any = {};
    
    // Add date filters if provided
    if (this.fromDate) {
      params.createdOnFrom = this.fromDate;
    }
    if (this.toDate) {
      params.createdOnTo = this.toDate;
    }

    this.departmentService.getDepartmentById(this.data.departmentId, params).subscribe({
      next: (response: DepartmentVTO) => {
        this.departmentData = response;
        this.loading = false;
        this.reportLoading = false;
      },
      error: (error) => {
        console.error('Error loading department details:', error);
        this.snackBar.open('حدث خطأ أثناء تحميل بيانات القسم', 'إغلاق', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        this.loading = false;
        this.reportLoading = false;
      }
    });
  }

  /**
   * Clear date filters and reload data
   */
  clearDateFilter(): void {
    this.fromDate = null;
    this.toDate = null;
    this.loadDepartmentData();
  }

  /**
   * Refresh report with current filters
   */
  refreshReport(): void {
    this.loadDepartmentData();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  /**
   * Print department details with financial report
   */
  printDetails(): void {
    if (!this.departmentData) {
      this.snackBar.open('لا توجد بيانات للطباعة', 'إغلاق', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
      return;
    }

    const printWindow = window.open('', '_blank', 'width=700,height=800,scrollbars=yes,toolbar=yes,menubar=yes');
    
    if (!printWindow) {
      this.snackBar.open('تعذر فتح نافذة الطباعة. يرجى السماح بالنوافذ المنبثقة.', 'إغلاق', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
      return;
    }
    
    const data = this.departmentData;
    const hasReport = data.totalGained > 0 || data.totalEnrollmentPayments > 0 || data.totalStudents > 0 || data.totalCourses > 0;
    const dateRange = this.fromDate || this.toDate ? 
      ` (${this.fromDate || 'من البداية'} - ${this.toDate || 'حتى الآن'})` : '';
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>تفاصيل القسم - ${data.title}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
          }
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }
          body {
            background: white;
            padding: 20px;
            direction: rtl;
          }
          .container {
            max-width: 700px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border-radius: 12px;
          }
          .header h1 {
            margin: 0;
            font-size: 22px;
          }
          .header p {
            margin: 8px 0 0 0;
            font-size: 11px;
            opacity: 0.9;
          }
          .info-card {
            margin-bottom: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            overflow: hidden;
          }
          .card-title {
            background: #f8fafc;
            padding: 12px 16px;
            font-weight: 600;
            color: #1f2937;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .card-title .icon {
            font-size: 18px;
          }
          .card-title .filter-info {
            font-size: 11px;
            color: #64748b;
            font-weight: 400;
            margin-right: auto;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 16px;
            border-bottom: 1px solid #f1f5f9;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .label {
            font-size: 13px;
            color: #64748b;
          }
          .value {
            font-size: 14px;
            font-weight: 500;
            color: #1f2937;
          }
          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 2px 10px;
            border-radius: 30px;
            font-size: 12px;
            font-weight: 500;
          }
          .status-badge.active {
            background-color: #d1fae5;
            color: #065f46;
          }
          .status-badge.inactive {
            background-color: #fee2e2;
            color: #991b1b;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            padding: 16px;
          }
          .stat-item {
            text-align: center;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }
          .stat-item .label {
            font-size: 11px;
            color: #64748b;
          }
          .stat-item .value {
            font-size: 18px;
            font-weight: 700;
            color: #1f2937;
            margin-top: 4px;
            display: block;
          }
          .stat-item.revenue .value {
            color: #7c3aed;
          }
          .no-report-message {
            padding: 20px;
            text-align: center;
            color: #9ca3af;
            font-size: 14px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding: 16px;
            font-size: 10px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
          }
          .print-btn {
            text-align: center;
            margin-top: 20px;
            padding: 10px;
          }
          .print-btn button {
            padding: 8px 20px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>تفاصيل القسم</h1>
            <p>نظام إدارة الأكاديمية الأولمبية لعلوم الرياضة</p>
            <p style="font-size: 10px; margin-top: 4px;">تاريخ الطباعة: ${new Date().toLocaleDateString('ar-EG')}</p>
          </div>
          
          <div class="info-card">
            <div class="card-title">
              <span class="icon">📋</span> معلومات أساسية
            </div>
            <div class="info-row">
              <span class="label">اسم القسم:</span>
              <span class="value">${data.title}</span>
            </div>
            ${data.description ? `<div class="info-row"><span class="label">الوصف:</span><span class="value">${data.description}</span></div>` : ''}
            <div class="info-row">
              <span class="label">الحالة:</span>
              <span class="value">
                <span class="status-badge ${data.isActive ? 'active' : 'inactive'}">
                  ${data.isActive ? '✅ نشط' : '❌ غير نشط'}
                </span>
              </span>
            </div>
          </div>
          
          <div class="info-card">
            <div class="card-title">
              <span class="icon">📊</span> الإحصائيات
            </div>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="label">الدورات</span>
                <span class="value">${data.totalCourses || 0}</span>
              </div>
              <div class="stat-item">
                <span class="label">الطلاب</span>
                <span class="value">${data.totalStudents || 0}</span>
              </div>
              <div class="stat-item">
                <span class="label">المدفوعات</span>
                <span class="value">${data.totalEnrollmentPayments || 0}</span>
              </div>
              <div class="stat-item revenue">
                <span class="label">الإيرادات</span>
                <span class="value">${(data.totalGained || 0).toLocaleString('ar-EG')} جم</span>
              </div>
            </div>
          </div>
          
          <div class="info-card">
            <div class="card-title">
              <span class="icon">📅</span> معلومات إضافية
              <span class="filter-info">${dateRange}</span>
            </div>
            ${data.createdOn ? `<div class="info-row"><span class="label">تاريخ الإنشاء:</span><span class="value">${new Date(data.createdOn).toLocaleDateString('ar-EG')}</span></div>` : ''}
            ${data.createdBy?.fullName ? `<div class="info-row"><span class="label">تم الإنشاء بواسطة:</span><span class="value">${data.createdBy.fullName}</span></div>` : ''}
            ${data.lastModifiedOn ? `<div class="info-row"><span class="label">آخر تعديل:</span><span class="value">${new Date(data.lastModifiedOn).toLocaleDateString('ar-EG')}</span></div>` : ''}
            ${data.lastModifiedBy?.fullName ? `<div class="info-row"><span class="label">آخر تعديل بواسطة:</span><span class="value">${data.lastModifiedBy.fullName}</span></div>` : ''}
          </div>
          
          ${!hasReport ? `
          <div class="info-card">
            <div class="card-title">
              <span class="icon">ℹ️</span> ملاحظة
            </div>
            <div class="no-report-message">
              لا توجد بيانات مالية مسجلة لهذا القسم حتى الآن
            </div>
          </div>
          ` : ''}
          
          <div class="footer">
            تم التصدير من نظام إدارة الأكاديمية الأولمبية لعلوم الرياضة<br>
            هذا المستند معتمد ويحتوي على جميع بيانات القسم
          </div>
          
          <div class="print-btn no-print">
            <button onclick="window.print();">🖨️ طباعة / حفظ كـ PDF</button>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  }
}