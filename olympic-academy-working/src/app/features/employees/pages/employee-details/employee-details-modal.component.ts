// employee-details-modal.component.ts - COMPACT SINGLE-PAGE PRINT
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule, MatTabGroup } from '@angular/material/tabs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { EmployeeVTO, EmployeeContactVTO, CourseSessionVTO, TrainerDepartmentVTO, TrainerCourseVTO } from '../../../../core/models/employee.model';
import { FileService } from '../../../../core/services/file.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-employee-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatTabsModule,
    MatTableModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="modal-container" dir="rtl">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <mat-icon>person</mat-icon>
          <h2>ملف الموظف</h2>
        </div>
        <div class="header-actions">
          <button mat-icon-button (click)="printEmployeeDocument()" matTooltip="طباعة الملف">
            <mat-icon>print</mat-icon>
          </button>
          <button mat-icon-button mat-dialog-close class="close-btn">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>
      
      <mat-divider></mat-divider>
      
      <!-- Main Profile Info -->
      <div class="profile-main" *ngIf="employee">
        <div class="profile-image">
          <div class="avatar" *ngIf="!imageUrl; else profileImage">
            <mat-icon>person</mat-icon>
          </div>
          <ng-template #profileImage>
            <img [src]="imageUrl" [alt]="employee.fullName">
          </ng-template>
        </div>

        <div class="profile-info">
          <h1>{{ employee.fullName }}</h1>
          <div class="info-badges">
            <mat-chip [color]="employee.isActive ? 'primary' : 'warn'" selected>
              {{ employee.isActive ? 'نشط' : 'غير نشط' }}
            </mat-chip>
            <mat-chip color="accent" selected>
              {{ employee.employeeType?.title }}
            </mat-chip>
            <mat-chip>
              <mat-icon>badge</mat-icon>
              {{ employee.nationalId }}
            </mat-chip>
            <mat-chip *ngIf="employee.gender">
              <mat-icon>{{ employee.gender.title === 'ذكر' ? 'male' : 'female' }}</mat-icon>
              {{ employee.gender.title }}
            </mat-chip>
          </div>
        </div>
      </div>
      
      <mat-divider></mat-divider>
      
      <!-- Tabs -->
      <mat-tab-group class="custom-tabs" #tabGroup (selectedTabChange)="onTabChange($event)">
        <!-- Personal Info Tab -->
        <mat-tab label="المعلومات الشخصية">
          <div class="tab-content" *ngIf="employee">
            <div class="info-grid">
              <div class="info-item">
                <mat-icon>person</mat-icon>
                <div>
                  <label>الاسم الكامل</label>
                  <p>{{ employee.fullName }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>badge</mat-icon>
                <div>
                  <label>رقم الهوية</label>
                  <p>{{ employee.nationalId }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>cake</mat-icon>
                <div>
                  <label>تاريخ الميلاد</label>
                  <p>{{ (employee.birthDate | date:'dd/MM/yyyy') || '-' }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>{{ employee.gender?.title === 'ذكر' ? 'male' : 'female' }}</mat-icon>
                <div>
                  <label>الجنس</label>
                  <p>{{ employee.gender?.title || '-' }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>business</mat-icon>
                <div>
                  <label>نوع الموظف</label>
                  <p>{{ employee.employeeType?.title }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>event</mat-icon>
                <div>
                  <label>تاريخ التوظيف</label>
                  <p>{{ employee.hireDate | date:'dd/MM/yyyy' }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>event</mat-icon>
                <div>
                  <label>تاريخ التسجيل</label>
                  <p>{{ employee.createdOn | date:'dd/MM/yyyy' }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>person_add</mat-icon>
                <div>
                  <label>تمت الإضافة بواسطة</label>
                  <p>{{ employee.createdBy?.fullName || '-' }}</p>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Financial Info Tab -->
        <mat-tab label="المعلومات المالية">
          <div class="tab-content" *ngIf="employee">
            <div class="financial-cards">
              <div class="financial-card">
                <mat-icon>attach_money</mat-icon>
                <div>
                  <label>الراتب الأساسي</label>
                  <h3>{{ employee.salary | currency:'EGP' }}</h3>
                </div>
              </div>
              <div class="financial-card warning">
                <mat-icon>account_balance_wallet</mat-icon>
                <div>
                  <label>الراتب المتبقي</label>
                  <h3>{{ employee.remainedSalary | currency:'EGP' }}</h3>
                </div>
              </div>
              <div class="financial-card info">
                <mat-icon>trending_up</mat-icon>
                <div>
                  <label>نوع الراتب</label>
                  <h3>{{ employee.salaryType?.title || '-' }}</h3>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Contacts Tab -->
        <mat-tab label="جهات الاتصال">
          <div class="tab-content">
            <div class="contacts-list" *ngIf="contacts.length > 0; else noContacts">
              <div class="contact-card" *ngFor="let contact of contacts">
                <mat-icon>{{ getContactIcon(contact.contactType?.title || '') }}</mat-icon>
                <div class="contact-info">
                  <label>{{ contact.contactType?.title || 'جهة اتصال' }}</label>
                  <p>{{ contact.contactValue }}</p>
                </div>
              </div>
            </div>
            <ng-template #noContacts>
              <div class="empty-state">
                <mat-icon>contact_phone</mat-icon>
                <p>لا توجد جهات اتصال مسجلة</p>
              </div>
            </ng-template>
          </div>
        </mat-tab>

        <!-- Departments Tab - Loaded from API -->
        <mat-tab label="الأقسام">
          <div class="tab-content">
            <div *ngIf="isLoadingDepartments" class="loading-container">
              <mat-spinner diameter="30"></mat-spinner>
              <p>جاري تحميل الأقسام...</p>
            </div>
            <div class="departments-list" *ngIf="!isLoadingDepartments && trainerDepartments.length > 0; else noDepartments">
              <div class="department-card" *ngFor="let dept of trainerDepartments">
                <mat-icon>business</mat-icon>
                <div class="department-info">
                  <h4>{{ dept.department?.title }}</h4>
                  <p *ngIf="dept.createdOn">تاريخ الإسناد: {{ dept.createdOn | date:'dd/MM/yyyy' }}</p>
                </div>
              </div>
            </div>
            <ng-template #noDepartments>
              <div class="empty-state">
                <mat-icon>business</mat-icon>
                <p>لا يوجد أقسام مسندة لهذا المدرب</p>
              </div>
            </ng-template>
          </div>
        </mat-tab>

        <!-- Courses Tab - Loaded from API -->
        <mat-tab *ngIf="employee?.employeeType?.id === 1" label="الدورات المسندة">
          <div class="tab-content">
            <div *ngIf="isLoadingCourses" class="loading-container">
              <mat-spinner diameter="30"></mat-spinner>
              <p>جاري تحميل الدورات...</p>
            </div>
            <div class="courses-list" *ngIf="!isLoadingCourses && trainerCourses.length > 0; else noCourses">
              <div class="course-card" *ngFor="let course of trainerCourses">
                <mat-icon>school</mat-icon>
                <div class="course-info">
                  <h4>{{ course.course?.title }}</h4>
                  <p *ngIf="course.createdOn">تاريخ الإسناد: {{ course.createdOn | date:'dd/MM/yyyy' }}</p>
                </div>
              </div>
            </div>
            <ng-template #noCourses>
              <div class="empty-state">
                <mat-icon>school</mat-icon>
                <p>لا توجد دورات مسندة لهذا المدرب</p>
              </div>
            </ng-template>
          </div>
        </mat-tab>

        <!-- Sessions Tab -->
        <mat-tab label="الجلسات">
          <div class="tab-content">
            <div class="table-container" *ngIf="sessions.length > 0; else noSessions">
              <table mat-table [dataSource]="sessionsDataSource" class="full-width-table">
                <ng-container matColumnDef="title">
                  <th mat-header-cell *matHeaderCellDef>عنوان الجلسة</th>
                  <td mat-cell *matCellDef="let session">{{ session.title }}</td>
                </ng-container>

                <ng-container matColumnDef="course">
                  <th mat-header-cell *matHeaderCellDef>الدورة</th>
                  <td mat-cell *matCellDef="let session">{{ session.course?.title }}</td>
                </ng-container>

                <ng-container matColumnDef="place">
                  <th mat-header-cell *matHeaderCellDef>المكان</th>
                  <td mat-cell *matCellDef="let session">{{ session.place?.title }}</td>
                </ng-container>

                <ng-container matColumnDef="sessionDate">
                  <th mat-header-cell *matHeaderCellDef>التاريخ</th>
                  <td mat-cell *matCellDef="let session">{{ session.sessionDate | date:'dd/MM/yyyy' }}</td>
                </ng-container>

                <ng-container matColumnDef="startTime">
                  <th mat-header-cell *matHeaderCellDef>وقت البدء</th>
                  <td mat-cell *matCellDef="let session">{{ session.startTime }}</td>
                </ng-container>

                <ng-container matColumnDef="endTime">
                  <th mat-header-cell *matHeaderCellDef>وقت الانتهاء</th>
                  <td mat-cell *matCellDef="let session">{{ session.endTime }}</td>
                </ng-container>

                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>الحالة</th>
                  <td mat-cell *matCellDef="let session">
                    <mat-chip [color]="getSessionStatusColor(session.status?.id)" selected>
                      {{ session.status?.title }}
                    </mat-chip>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="sessionsDisplayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: sessionsDisplayedColumns;"></tr>
              </table>
            </div>
            <ng-template #noSessions>
              <div class="empty-state">
                <mat-icon>event</mat-icon>
                <p>لا توجد جلسات مسجلة</p>
              </div>
            </ng-template>
          </div>
        </mat-tab>

        <!-- Creation Info Tab -->
        <mat-tab label="معلومات النظام">
          <div class="tab-content" *ngIf="employee">
            <div class="info-grid">
              <div class="info-item">
                <mat-icon>person_add</mat-icon>
                <div>
                  <label>تم الإنشاء بواسطة</label>
                  <p>{{ employee.createdBy?.fullName || '-' }}</p>
                </div>
              </div>
              <div class="info-item">
                <mat-icon>schedule</mat-icon>
                <div>
                  <label>تاريخ الإنشاء</label>
                  <p>{{ employee.createdOn | date:'dd/MM/yyyy HH:mm' }}</p>
                </div>
              </div>
              <div class="info-item" *ngIf="employee.lastModifiedBy">
                <mat-icon>edit</mat-icon>
                <div>
                  <label>تم التعديل بواسطة</label>
                  <p>{{ employee.lastModifiedBy?.fullName}}</p>
                </div>
              </div>
              <div class="info-item" *ngIf="employee.lastModifiedOn">
                <mat-icon>update</mat-icon>
                <div>
                  <label>تاريخ التعديل</label>
                  <p>{{ employee.lastModifiedOn | date:'dd/MM/yyyy HH:mm' }}</p>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
      
      <mat-divider></mat-divider>
      
      <!-- Modal Actions -->
      <div class="modal-actions">
        <button mat-raised-button color="accent" (click)="printEmployeeDocument()" matTooltip="طباعة الملف">
          <mat-icon>print</mat-icon>
          طباعة الملف
        </button>
        <button mat-raised-button color="primary" (click)="editEmployee()">
          <mat-icon>edit</mat-icon>
          تعديل الملف
        </button>
        <button mat-raised-button color="warn" (click)="deleteEmployee()">
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
      min-width: 700px;
      max-width: 900px;
      max-height: 90vh;
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
      padding: 20px 24px;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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
      font-weight: 600;
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

    .profile-main {
      display: flex;
      gap: 24px;
      padding: 24px;
      background: white;
    }
    .profile-image {
      flex-shrink: 0;
    }
    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .avatar mat-icon {
      font-size: 50px;
      width: 50px;
      height: 50px;
      color: white;
    }
    .profile-image img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
    }
    .profile-info {
      flex: 1;
    }
    .profile-info h1 {
      margin: 0 0 12px 0;
      font-size: 24px;
      color: #1f2937;
    }
    .info-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .custom-tabs {
      flex: 1;
      overflow-y: auto;
    }
    .tab-content {
      padding: 20px;
      max-height: 50vh;
      overflow-y: auto;
    }

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
      color: #f59e0b;
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

    .financial-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    .financial-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      border-radius: 12px;
      color: white;
    }
    .financial-card mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }
    .financial-card.warning {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    }
    .financial-card.info {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    }
    .financial-card label {
      font-size: 11px;
      opacity: 0.9;
    }
    .financial-card h3 {
      margin: 4px 0 0;
      font-size: 18px;
    }

    .contacts-list,
    .departments-list,
    .courses-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .contact-card,
    .department-card,
    .course-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: #f9fafb;
      border-radius: 12px;
    }
    .contact-card mat-icon,
    .department-card mat-icon,
    .course-card mat-icon {
      color: #f59e0b;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    .contact-info label,
    .department-info h4,
    .course-info h4 {
      margin: 0 0 4px 0;
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
    }
    .contact-info p,
    .department-info p,
    .course-info p {
      margin: 0;
      font-size: 12px;
      color: #6b7280;
    }

    .table-container {
      overflow-x: auto;
    }
    .full-width-table {
      width: 100%;
    }
    .full-width-table th {
      background: #f8fafc;
      color: #1e293b;
      font-weight: 600;
      font-size: 12px;
      padding: 10px;
    }
    .full-width-table td {
      padding: 8px;
      font-size: 12px;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #9ca3af;
    }
    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 12px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 40px;
      color: #64748b;
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

    @media (max-width: 768px) {
      .modal-container {
        min-width: 90vw;
        max-width: 90vw;
      }
      .profile-main {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      .info-grid {
        grid-template-columns: 1fr;
      }
      .financial-cards {
        grid-template-columns: 1fr;
      }
      .contacts-list,
      .departments-list,
      .courses-list {
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
export class EmployeeDetailsModalComponent implements OnInit, OnDestroy {
  // Employee Data
  employee: EmployeeVTO;
  contacts: EmployeeContactVTO[] = [];
  sessions: CourseSessionVTO[] = [];
  sessionsDataSource = new MatTableDataSource<CourseSessionVTO>([]);
  sessionsDisplayedColumns: string[] = ['title', 'course', 'place', 'sessionDate', 'startTime', 'endTime', 'status'];
  
  // Image
  imageUrl: string | null = null;
  private blobUrl: string | null = null;

  // Trainer Departments
  trainerDepartments: TrainerDepartmentVTO[] = [];
  isLoadingDepartments: boolean = false;
  private departmentsLoaded: boolean = false;

  // Trainer Courses
  trainerCourses: TrainerCourseVTO[] = [];
  isLoadingCourses: boolean = false;
  private coursesLoaded: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<EmployeeDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: EmployeeVTO,
    private router: Router,
    private fileService: FileService,
    private employeeService: EmployeeService,
    private notification: NotificationService
  ) {
    this.employee = data;
    this.contacts = data.contacts || [];
    this.sessions = data.sessions || [];
    this.sessionsDataSource.data = this.sessions;
  }

  ngOnInit(): void {
    this.loadImage();
    
    if (this.employee.employeeType?.id === 1) {
      console.log('Employee is a trainer, loading departments and courses...');
      this.loadTrainerDepartments();
      this.loadTrainerCourses();
    } else {
      console.log('Employee is not a trainer, skipping departments and courses load');
    }
  }

  ngOnDestroy(): void {
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
    }
  }

  // ==================== Tab Change Handler ====================
  onTabChange(event: any): void {
    const tabIndex = event.index;
    console.log('Tab changed to index:', tabIndex);
    
    if (tabIndex === 3 && this.employee.employeeType?.id === 1) {
      console.log('Departments tab selected, loading departments...');
      this.loadTrainerDepartments();
    }
    
    if (event.tab && event.tab.textLabel === 'الدورات المسندة') {
      console.log('Courses tab selected, loading courses...');
      this.loadTrainerCourses();
    }
  }

  // ==================== Image Loading ====================
  loadImage(): void {
    const fid = this.employee.imageUrl;
    if (fid && /^\d{15}(\d{3})?$/.test(fid)) {
      this.fileService.downloadFile(fid).subscribe({
        next: (blob) => {
          if (this.blobUrl) {
            URL.revokeObjectURL(this.blobUrl);
          }
          this.blobUrl = URL.createObjectURL(blob);
          this.imageUrl = this.blobUrl;
        },
        error: (error) => {
          console.error('Failed to load image:', error);
          this.imageUrl = null;
        }
      });
    } else if (fid) {
      this.imageUrl = fid;
    } else {
      this.imageUrl = null;
    }
  }

  // ==================== Load Trainer Departments ====================
  loadTrainerDepartments(): void {
    if (this.departmentsLoaded) {
      console.log('Departments already loaded, skipping...');
      return;
    }
    
    if (this.employee.employeeType?.id !== 1) {
      console.log('Employee is not a trainer, skipping departments load');
      return;
    }

    console.log('Loading trainer departments for employee:', this.employee.id);
    this.isLoadingDepartments = true;
    this.employeeService.getTrainerDepartments({
      trainerId: this.employee.id,
      pageSize: 100
    }).subscribe({
      next: (result) => {
        console.log('Departments loaded successfully:', result);
        this.trainerDepartments = result.items || [];
        this.departmentsLoaded = true;
        this.isLoadingDepartments = false;
      },
      error: (err) => {
        console.error('Error loading trainer departments:', err);
        this.notification.showError('حدث خطأ في تحميل أقسام المدرب');
        this.isLoadingDepartments = false;
      }
    });
  }

  // ==================== Load Trainer Courses ====================
  loadTrainerCourses(): void {
    if (this.coursesLoaded) {
      console.log('Courses already loaded, skipping...');
      return;
    }
    
    if (this.employee.employeeType?.id !== 1) {
      console.log('Employee is not a trainer, skipping courses load');
      return;
    }

    console.log('Loading trainer courses for employee:', this.employee.id);
    this.isLoadingCourses = true;
    this.employeeService.getTrainerCourses({
      trainerId: this.employee.id,
      pageSize: 100
    }).subscribe({
      next: (result) => {
        console.log('Courses loaded successfully:', result);
        this.trainerCourses = result.items || [];
        this.coursesLoaded = true;
        this.isLoadingCourses = false;
      },
      error: (err) => {
        console.error('Error loading trainer courses:', err);
        this.notification.showError('حدث خطأ في تحميل دورات المدرب');
        this.isLoadingCourses = false;
      }
    });
  }

  // ==================== Helper Functions ====================
  getSessionStatusColor(statusId: number): string {
    const colors: { [key: number]: string } = {
      1: 'primary',
      2: 'accent',
      3: 'primary',
      4: 'warn'
    };
    return colors[statusId] || 'default';
  }

  getContactIcon(contactType: string): string {
    const icons: { [key: string]: string } = {
      'جوال': 'phone_android',
      'هاتف': 'phone',
      'بريد إلكتروني': 'email',
      'واتساب': 'chat',
      'فيسبوك': 'facebook',
      'تويتر': 'twitter',
      'انستجرام': 'instagram'
    };
    return icons[contactType] || 'contact_phone';
  }

  // ==================== Actions ====================
  editEmployee(): void {
    this.dialogRef.close();
    this.router.navigate(['/employees', this.employee.id, 'edit']);
  }

  deleteEmployee(): void {
    this.dialogRef.close({ action: 'delete', employee: this.employee });
  }

  printEmployeeDocument(): void {
    this.generatePrintDocument(this.employee);
  }

  // ==================== Compact Single-Page Print Function ====================
  async generatePrintDocument(employee: EmployeeVTO): Promise<void> {
    let imagePreviewUrl: string | null = null;
    
    if (employee.imageUrl && /^\d{15}(\d{3})?$/.test(employee.imageUrl)) {
      try {
        const blob = await this.fileService.downloadFile(employee.imageUrl).toPromise();
        if (blob) {
          imagePreviewUrl = URL.createObjectURL(blob);
        }
      } catch (error) {
        console.error('Failed to load image for print:', error);
      }
    } else if (employee.imageUrl) {
      imagePreviewUrl = employee.imageUrl;
    }
    
    const printContainer = document.createElement('div');
    printContainer.style.direction = 'rtl';
    printContainer.style.fontFamily = 'Cairo, "Segoe UI", Tahoma, sans-serif';
    printContainer.style.padding = '0';
    printContainer.style.margin = '0';
    printContainer.style.backgroundColor = 'white';
    
    const today = new Date().toLocaleDateString('ar-EG');
    const applicationNumber = `EMP-${employee.id}-${new Date().getFullYear()}`;
    
    // Prepare departments HTML
    const departmentsHtml = this.trainerDepartments.length > 0
      ? this.trainerDepartments.map((dept: any) => 
          `<span class="chip dept">${this.escapeHtml(dept.department?.title || dept.title)}</span>`
        ).join('')
      : '<span class="chip empty">لا يوجد</span>';

    // Prepare courses HTML
    const coursesHtml = this.trainerCourses.length > 0
      ? this.trainerCourses.map((course: any) => 
          `<span class="chip course">${this.escapeHtml(course.course?.title || course.title)}</span>`
        ).join('')
      : '<span class="chip empty">لا يوجد</span>';

    // Prepare contacts HTML
    const contactsHtml = employee.contacts && employee.contacts.length > 0
      ? employee.contacts.map((contact: any) => `
          <div class="contact-item">
            <span class="contact-type">${contact.contactType?.title}:</span>
            <span>${this.escapeHtml(contact.contactValue)}</span>
          </div>
        `).join('')
      : '<div class="contact-item"><span>لا توجد جهات اتصال</span></div>';

    // Prepare sessions HTML - compact table
    const sessionsHtml = this.sessions && this.sessions.length > 0
      ? this.sessions.map((session: any) => {
          const statusColor = session.status?.id === 1 ? '#2563eb' : 
                              session.status?.id === 2 ? '#16a34a' : 
                              session.status?.id === 3 ? '#16a34a' : '#dc2626';
          return `
            <tr>
              <td>${this.escapeHtml(session.title) || '-'}</td>
              <td>${session.course?.title || '-'}</td>
              <td>${session.sessionDate ? new Date(session.sessionDate).toLocaleDateString('ar-EG') : '-'}</td>
              <td><span style="color:${statusColor};font-weight:600;">${session.status?.title || '-'}</span></td>
            </tr>
          `;
        }).join('')
      : '';

    const sessionsTableHtml = this.sessions && this.sessions.length > 0 ? `
      <div class="section">
        <div class="section-title">📅 الجلسات</div>
        <table class="sessions-table">
          <thead>
            <tr><th>العنوان</th><th>الدورة</th><th>التاريخ</th><th>الحالة</th></tr>
          </thead>
          <tbody>${sessionsHtml}</tbody>
        </table>
      </div>
    ` : '';

    // Check if trainer to show courses section
    const isTrainer = employee.employeeType?.id === 1;

    printContainer.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <titleملف موظف- ${this.escapeHtml(employee.fullName)}</title>
        <style>
          /* Reset & Base */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
          }
          
          body {
            background: white;
            padding: 10px;
            direction: rtl;
            font-size: 11px;
            line-height: 1.4;
          }
          
          @media print {
            body { padding: 8px; }
            .no-print { display: none !important; }
            .print-container { box-shadow: none !important; }
            .sessions-table thead th {
              background: #f1f5f9 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
          
          .print-container {
            max-width: 100%;
            margin: 0 auto;
            background: white;
          }
          
          /* Header - Compact */
          .print-header {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            padding: 8px 16px;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 6px;
            margin-bottom: 8px;
          }
          
          .print-header h1 {
            font-size: 16px;
            font-weight: 700;
            margin: 0;
          }
          
          .print-header .subtitle {
            font-size: 10px;
            opacity: 0.85;
          }
          
          .print-header .badge {
            background: rgba(255,255,255,0.2);
            padding: 2px 10px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 600;
          }
          
          /* Photo - Compact */
          .photo-section {
            text-align: center;
            padding: 4px 0;
            margin-bottom: 4px;
          }
          
          .employee-photo {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #f59e0b;
          }
          
          .placeholder-photo {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #f1f5f9;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #f59e0b;
            font-size: 28px;
            color: #94a3b8;
          }
          
          /* Grid Layout - Compact */
          .print-body {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px 16px;
          }
          
          .section {
            margin-bottom: 4px;
          }
          
          .section-title {
            font-size: 12px;
            font-weight: 700;
            color: #0f172a;
            border-bottom: 1.5px solid #f59e0b;
            padding-bottom: 2px;
            margin-bottom: 4px;
          }
          
          /* Info Grid - Compact */
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1px 12px;
          }
          
          .info-item {
            display: flex;
            justify-content: space-between;
            padding: 1px 0;
            border-bottom: 1px solid #f1f5f9;
            font-size: 10px;
          }
          
          .info-item .label {
            font-weight: 600;
            color: #475569;
          }
          
          .info-item .value {
            color: #0f172a;
            font-weight: 500;
          }
          
          .info-item .value.amount {
            color: #f59e0b;
            font-weight: 700;
          }
          
          /* Chips - Compact */
          .chip-container {
            display: flex;
            flex-wrap: wrap;
            gap: 3px;
            margin-top: 2px;
          }
          
          .chip {
            padding: 1px 8px;
            border-radius: 12px;
            font-size: 9px;
            font-weight: 500;
            display: inline-block;
          }
          
          .chip.dept {
            background: #f1f5f9;
            color: #1e293b;
          }
          
          .chip.course {
            background: #dbeafe;
            color: #1e40af;
          }
          
          .chip.empty {
            background: #f8fafc;
            color: #94a3b8;
          }
          
          /* Contacts - Compact */
          .contacts-list {
            display: flex;
            flex-direction: column;
            gap: 1px;
          }
          
          .contact-item {
            display: flex;
            gap: 6px;
            padding: 1px 0;
            border-bottom: 1px solid #f1f5f9;
            font-size: 10px;
          }
          
          .contact-type {
            font-weight: 600;
            color: #f59e0b;
            min-width: 60px;
          }
          
          /* Sessions Table - Compact */
          .sessions-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9px;
          }
          
          .sessions-table thead th {
            background: #f8fafc;
            color: #1e293b;
            padding: 3px 6px;
            text-align: center;
            font-weight: 600;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .sessions-table tbody td {
            padding: 2px 6px;
            text-align: center;
            border-bottom: 1px solid #f1f5f9;
            color: #334155;
          }
          
          /* Declaration - Compact */
          .declaration {
            background: #f8fafc;
            padding: 4px 8px;
            border-radius: 4px;
            border-right: 2px solid #f59e0b;
            font-size: 9px;
            line-height: 1.5;
            color: #334155;
            margin: 4px 0;
            grid-column: span 2;
          }
          
          .declaration strong {
            color: #0f172a;
          }
          
          /* Signature - Compact */
          .signature-section {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            margin-top: 4px;
            padding-top: 4px;
            border-top: 1px solid #e5e7eb;
            grid-column: span 2;
          }
          
          .signature-box {
            flex: 1;
            text-align: center;
          }
          
          .signature-line {
            border-top: 1px solid #1e293b;
            margin-top: 16px;
            padding-top: 2px;
            font-size: 9px;
            color: #475569;
          }
          
          .signature-date {
            font-size: 8px;
            color: #94a3b8;
            margin-top: 2px;
          }
          
          /* Footer - Compact */
          .print-footer {
            text-align: center;
            padding: 4px;
            font-size: 8px;
            color: #94a3b8;
            border-top: 1px solid #e5e7eb;
            margin-top: 6px;
            grid-column: span 2;
          }
          
          /* Print Button */
          .print-btn {
            display: inline-block;
            padding: 6px 20px;
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
          }
          
          .print-btn:hover {
            opacity: 0.9;
          }
          
          /* Responsive */
          @media (max-width: 640px) {
            .print-body {
              grid-template-columns: 1fr;
              gap: 4px;
            }
            .info-grid {
              grid-template-columns: 1fr;
            }
            .signature-section {
              flex-direction: column;
              gap: 12px;
            }
            .print-header {
              flex-direction: column;
              text-align: center;
              gap: 4px;
              padding: 6px 12px;
            }
            .declaration {
              grid-column: span 1;
            }
            .signature-section {
              grid-column: span 1;
            }
            .print-footer {
              grid-column: span 1;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <!-- Header -->
          <div class="print-header">
            <div>
              <h1>ملف موظف</h1>
              <div class="subtitle">الأكاديمية الأولمبية</div>
            </div>
            <div>
              <span class="badge">${employee.isActive ? '✅ نشط' : '⛔ غير نشط'}</span>
              <div style="font-size:9px;margin-top:2px;">#${applicationNumber}</div>
            </div>
          </div>
          
          <!-- Photo -->
          <div class="photo-section">
            ${imagePreviewUrl 
              ? `<img src="${imagePreviewUrl}" class="employee-photo" alt="صورة الموظف">`
              : `<div class="placeholder-photo">👤</div>`
            }
          </div>
          
          <!-- Body - Grid Layout -->
          <div class="print-body">
            <!-- Personal Info -->
            <div class="section">
              <div class="section-title">📋 المعلومات الشخصية</div>
              <div class="info-grid">
                <div class="info-item"><span class="label">الاسم</span><span class="value">${this.escapeHtml(employee.fullName) || '-'}</span></div>
                <div class="info-item"><span class="label">الهوية</span><span class="value">${this.escapeHtml(employee.nationalId) || '-'}</span></div>
                <div class="info-item"><span class="label">الميلاد</span><span class="value">${employee.birthDate ? new Date(employee.birthDate).toLocaleDateString('ar-EG') : '-'}</span></div>
                <div class="info-item"><span class="label">الجنس</span><span class="value">${employee.gender?.title || '-'}</span></div>
                <div class="info-item"><span class="label">النوع</span><span class="value">${employee.employeeType?.title || '-'}</span></div>
                <div class="info-item"><span class="label">التوظيف</span><span class="value">${employee.hireDate ? new Date(employee.hireDate).toLocaleDateString('ar-EG') : '-'}</span></div>
              </div>
            </div>
            
            <!-- Financial Info -->
            <div class="section">
              <div class="section-title">💰 المالية</div>
              <div class="info-grid">
                <div class="info-item"><span class="label">الراتب</span><span class="value amount">${employee.salary?.toLocaleString('ar-EG') || 0} جم</span></div>
                <div class="info-item"><span class="label">المتبقي</span><span class="value">${employee.remainedSalary?.toLocaleString('ar-EG') || 0} جم</span></div>
                <div class="info-item"><span class="label">النوع</span><span class="value">${employee.salaryType?.title || '-'}</span></div>
              </div>
            </div>
            
            <!-- Departments -->
            <div class="section">
              <div class="section-title">🏢 الأقسام</div>
              <div class="chip-container">${departmentsHtml}</div>
            </div>
            
            <!-- Courses (Trainer only) -->
            ${isTrainer ? `
            <div class="section">
              <div class="section-title">📚 الدورات</div>
              <div class="chip-container">${coursesHtml}</div>
            </div>
            ` : ''}
            
            <!-- Sessions -->
            ${sessionsTableHtml}
            
            <!-- Contacts -->
            <div class="section" style="grid-column: span 2;">
              <div class="section-title">📞 جهات الاتصال</div>
              <div class="contacts-list">${contactsHtml}</div>
            </div>
            
            <!-- Declaration -->
            <div class="declaration">
              <strong>إقرار:</strong> أقر أنا <strong>${this.escapeHtml(employee.fullName)}</strong> بأن جميع البيانات المذكورة صحيحة ودقيقة، وأتعهد بالالتزام بلوائح الأكاديمية الأولمبية.
            </div>
            
            <!-- Signatures -->
            <div class="signature-section">
              <div class="signature-box">
                <div class="signature-line">توقيع الموظف</div>
                <div class="signature-date">التاريخ: ___ / ___ / _____</div>
              </div>
              <div class="signature-box">
                <div class="signature-line">توقيع مدير الموارد البشرية</div>
                <div class="signature-date">التاريخ: ___ / ___ / _____</div>
              </div>
              <div class="signature-box">
                <div class="signature-line">ختم الأكاديمية</div>
                <div class="signature-date">التاريخ: ___ / ___ / _____</div>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="print-footer">
              تم التصدير من نظام إدارة الأكاديمية الأولمبية &bull; ${today}
            </div>
          </div>
        </div>
        
        <!-- Print Button -->
        <div class="no-print" style="text-align: center; margin-top: 12px;">
          <button class="print-btn" onclick="window.print();">
            🖨️ طباعة / حفظ كـ PDF
          </button>
        </div>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank', 'width=900,height=800,scrollbars=yes');
    if (printWindow) {
      printWindow.document.write(printContainer.innerHTML);
      printWindow.document.close();
    } else {
      document.body.appendChild(printContainer);
      window.print();
      setTimeout(() => { document.body.removeChild(printContainer); }, 500);
    }
    
    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      setTimeout(() => {
        if (imagePreviewUrl) {
          URL.revokeObjectURL(imagePreviewUrl);
        }
      }, 1000);
    }
  }

  // ==================== Utility Function ====================
  private escapeHtml(str: string | null | undefined): string {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}