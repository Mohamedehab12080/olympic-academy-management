// employee-details-modal.component.ts

import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { EmployeeVTO, EmployeeContactVTO, CourseSessionVTO } from '../../../../core/models/employee.model';
import { FileService } from '../../../../core/services/file.service';

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
    MatTooltipModule
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
      <mat-tab-group class="custom-tabs">
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

        <!-- Departments Tab -->
        <mat-tab label="الأقسام">
          <div class="tab-content">
            <div class="departments-list" *ngIf="(employee?.departments?.length ?? 0) > 0; else noDepartments">
              <div class="department-card" *ngFor="let dept of employee?.departments">
                <mat-icon>business</mat-icon>
                <div class="department-info">
                  <h4>{{ dept.title }}</h4>
                </div>
              </div>
            </div>
            <ng-template #noDepartments>
              <div class="empty-state">
                <mat-icon>business</mat-icon>
                <p>لا يوجد أقسام مسندة</p>
              </div>
            </ng-template>
          </div>
        </mat-tab>

        <!-- Courses Tab -->
        <mat-tab *ngIf="employee?.employeeType?.id === 1" label="الدورات المسندة">
          <div class="tab-content">
            <div class="courses-list" *ngIf="(employee?.courses?.length ?? 0) > 0; else noCourses">
              <div class="course-card" *ngFor="let course of employee?.courses">
                <mat-icon>school</mat-icon>
                <div class="course-info">
                  <h4>{{ course.title }}</h4>
                  <p>رقم الدورة: {{ course.id }}</p>
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

    /* Header */
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

    /* Profile Main */
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

    /* Tabs */
    .custom-tabs {
      flex: 1;
      overflow-y: auto;
    }
    .tab-content {
      padding: 20px;
      max-height: 50vh;
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

    /* Financial Cards */
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

    /* Lists */
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

    /* Table */
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

    /* Empty State */
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
  employee: EmployeeVTO;
  contacts: EmployeeContactVTO[] = [];
  sessions: CourseSessionVTO[] = [];
  sessionsDataSource = new MatTableDataSource<CourseSessionVTO>([]);
  sessionsDisplayedColumns: string[] = ['title', 'course', 'place', 'sessionDate', 'startTime', 'endTime', 'status'];
  imageUrl: string | null = null;
  private blobUrl: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<EmployeeDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: EmployeeVTO,
    private router: Router,
    private fileService: FileService
  ) {
    this.employee = data;
    this.contacts = data.contacts || [];
    this.sessions = data.sessions || [];
    this.sessionsDataSource.data = this.sessions;
  }

  ngOnInit(): void {
    this.loadImage();
  }

  ngOnDestroy(): void {
    // Clean up blob URL when component is destroyed
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
    }
  }

  loadImage(): void {
    // Check if imageUrl contains a FID (15 or 18 digits)
    const fid = this.employee.imageUrl;
    if (fid && /^\d{15}(\d{3})?$/.test(fid)) {
      // It's a FID, download the image
      this.fileService.downloadFile(fid).subscribe({
        next: (blob) => {
          // Clean up previous blob URL if exists
          if (this.blobUrl) {
            URL.revokeObjectURL(this.blobUrl);
          }
          // Create new blob URL
          this.blobUrl = URL.createObjectURL(blob);
          this.imageUrl = this.blobUrl;
        },
        error: (error) => {
          console.error('Failed to load image:', error);
          this.imageUrl = null;
        }
      });
    } else if (fid) {
      // If it's already a URL, use it directly
      this.imageUrl = fid;
    } else {
      this.imageUrl = null;
    }
  }

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

  async generatePrintDocument(employee: EmployeeVTO): Promise<void> {
    let imagePreviewUrl: string | null = null;
    
    // Load image if FID exists
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
    printContainer.style.padding = '20px';
    printContainer.style.backgroundColor = 'white';
    printContainer.style.maxWidth = '800px';
    printContainer.style.margin = '0 auto';
    
    const today = new Date().toLocaleDateString('ar-EG');
    const applicationNumber = `EMP-${employee.id}-${new Date().getFullYear()}`;
    
    printContainer.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>طلب توظيف - ${this.escapeHtml(employee.fullName)}</title>
        <style>
          * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; }
          @media print { 
            body { margin: 0; padding: 20px; } 
            .no-print { display: none; }
            .signature-line { border-top: 1px solid #000 !important; }
          }
          .application-container { max-width: 800px; margin: 0 auto; background: white; }
          .header { text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border-radius: 12px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 10px 0 0 0; font-size: 12px; opacity: 0.9; }
          .application-details { display: flex; justify-content: space-between; margin-bottom: 20px; padding: 10px; background: #f9fafb; border-radius: 8px; }
          .photo-section { text-align: center; margin-bottom: 20px; }
          .employee-photo { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid #f59e0b; }
          .placeholder-photo { width: 120px; height: 120px; border-radius: 50%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; margin: 0 auto; border: 3px solid #f59e0b; font-size: 48px; }
          h2 { color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 8px; margin-top: 24px; margin-bottom: 16px; font-size: 18px; }
          .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px; }
          .info-item { border-bottom: 1px solid #e5e7eb; padding: 8px 0; }
          .info-label { font-weight: 600; color: #374151; font-size: 13px; margin-bottom: 4px; }
          .info-value { color: #1f2937; font-size: 14px; }
          .info-value.amount { font-weight: 700; color: #f59e0b; }
          .full-width { grid-column: span 2; }
          .contacts-list { display: flex; flex-direction: column; gap: 8px; }
          .contact-item { display: flex; gap: 8px; padding: 6px 0; border-bottom: 1px solid #f3f4f6; }
          .contact-type { font-weight: 600; color: #f59e0b; min-width: 100px; }
          .department-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
          .dept-chip { background: #f3f4f6; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
          .courses-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
          .course-chip { background: #e0e7ff; color: #4338ca; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
          .declaration { margin: 24px 0; padding: 16px; background: #f9fafb; border-radius: 12px; font-size: 12px; line-height: 1.6; text-align: justify; }
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
            <h1>طلب توظيف</h1>
            <p>نظام إدارة الأكاديمية الأولمبية</p>
          </div>
          
          <div class="application-details">
            <div><strong>رقم الطلب:</strong> ${applicationNumber}</div>
            <div><strong>تاريخ الطلب:</strong> ${today}</div>
          </div>
          
          <div class="photo-section">
            ${imagePreviewUrl 
              ? `<img src="${imagePreviewUrl}" class="employee-photo" alt="صورة الموظف">`
              : '<div class="placeholder-photo">📷</div>'
            }
          </div>
          
          <h2>📋 المعلومات الشخصية</h2>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">الاسم الكامل</div><div class="info-value">${this.escapeHtml(employee.fullName) || '-'}</div></div>
            <div class="info-item"><div class="info-label">رقم الهوية</div><div class="info-value">${this.escapeHtml(employee.nationalId) || '-'}</div></div>
            <div class="info-item"><div class="info-label">تاريخ الميلاد</div><div class="info-value">${employee.birthDate ? new Date(employee.birthDate).toLocaleDateString('ar-EG') : '-'}</div></div>
            <div class="info-item"><div class="info-label">الجنس</div><div class="info-value">${employee.gender?.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">نوع الموظف</div><div class="info-value">${employee.employeeType?.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">تاريخ التوظيف</div><div class="info-value">${employee.hireDate ? new Date(employee.hireDate).toLocaleDateString('ar-EG') : '-'}</div></div>
          </div>
          
          <h2>💰 المعلومات المالية</h2>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">الراتب الأساسي</div><div class="info-value amount">${employee.salary?.toLocaleString('ar-EG') || 0} جم</div></div>
            <div class="info-item"><div class="info-label">الراتب المتبقي</div><div class="info-value">${employee.remainedSalary?.toLocaleString('ar-EG') || 0} جم</div></div>
            <div class="info-item"><div class="info-label">نوع الراتب</div><div class="info-value">${employee.salaryType?.title || '-'}</div></div>
          </div>
          
          <h2>🏢 الأقسام</h2>
          <div class="department-chips">
            ${employee.departments?.map((dept: any) => `<span class="dept-chip">${this.escapeHtml(dept.title)}</span>`).join('') || '<span>- لا يوجد أقسام مسندة -</span>'}
          </div>
          
          ${employee.employeeType?.id === 1 ? `
          <h2>📚 الدورات المسندة</h2>
          <div class="courses-list">
            ${employee.courses?.map((course: any) => `<span class="course-chip">${this.escapeHtml(course.title)}</span>`).join('') || '<span>- لا توجد دورات مسندة -</span>'}
          </div>
          ` : ''}
          
          <h2>📞 جهات الاتصال</h2>
          <div class="contacts-list">
            ${employee.contacts?.map((contact: any) => `
              <div class="contact-item">
                <span class="contact-type">${contact.contactType?.title}:</span>
                <span>${this.escapeHtml(contact.contactValue)}</span>
              </div>
            `).join('') || '<span>- لا توجد جهات اتصال -</span>'}
          </div>
          
          <div class="declaration">
            <strong>إقرار:</strong><br>
            أقر أنا ${this.escapeHtml(employee.fullName)} بأن جميع البيانات المذكورة أعلاه صحيحة ودقيقة، 
            وأتعهد بالالتزام بجميع لوائح وأنظمة الأكاديمية الأولمبية. 
            كما أقر بحقي في الحصول على الراتب المتفق عليه وفقاً لنوع الراتب المحدد أعلاه.
          </div>
          
          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line"></div>
              <div>توقيع الموظف</div>
              <div class="signature-date">التاريخ: ___ / ___ / _____</div>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <div>توقيع مدير الموارد البشرية</div>
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
            هذا المستند معتمد ويحتوي على جميع بيانات الموظف
          </div>
        </div>
        <div class="no-print" style="text-align: center; margin-top: 20px; padding: 10px;">
          <button onclick="window.print();" style="padding: 10px 20px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border: none; border-radius: 5px; cursor: pointer;">
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
    
    // Clean up blob URL
    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      setTimeout(() => {
        if (imagePreviewUrl) {
          URL.revokeObjectURL(imagePreviewUrl);
        }
      }, 1000);
    }
  }

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