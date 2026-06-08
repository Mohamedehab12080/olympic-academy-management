import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { EmployeeService } from '../../../../core/services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { EmployeeVTO, EmployeeContactVTO, CourseSessionVTO, EmployeeAttendanceListItem } from '../../../../core/models/employee.model';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  template: `
    <div class="profile-container" *ngIf="!isLoading; else loading">
      <mat-card class="profile-card">
        <!-- Header with actions -->
        <div class="profile-header">
          <div class="header-actions">
            <button mat-raised-button routerLink="/employees" color="primary">
              <mat-icon>arrow_forward</mat-icon> العودة للقائمة
            </button>
            <button mat-raised-button [routerLink]="['/employees', employeeId, 'edit']" color="accent">
              <mat-icon>edit</mat-icon> تعديل الملف
            </button>
          </div>
        </div>

        <!-- Main Profile Info -->
        <div class="profile-main" *ngIf="employee">
          <div class="profile-image">
            <div class="avatar" *ngIf="!employee.imageUrl; else profileImage">
              <mat-icon>person</mat-icon>
            </div>
            <ng-template #profileImage>
              <img [src]="employee.imageUrl" [alt]="employee.fullName">
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
                رقم الهوية: {{ employee.nationalId }}
              </mat-chip>
              <mat-chip *ngIf="employee.gender">
                <mat-icon>{{ employee.gender.title === 'ذكر' ? 'male' : 'female' }}</mat-icon>
                {{ employee.gender.title }}
              </mat-chip>
            </div>
          </div>
        </div>

        <!-- Statistics Cards -->
        <div class="stats-grid" *ngIf="stats">
          <div class="stat-card">
            <mat-icon>work</mat-icon>
            <div class="stat-info">
              <label>عدد الدورات المسندة</label>
              <h3>{{ stats.coursesCount }}</h3>
              <p>دورة</p>
            </div>
          </div>
          <div class="stat-card">
            <mat-icon>schedule</mat-icon>
            <div class="stat-info">
              <label>عدد الجلسات</label>
              <h3>{{ stats.sessionsCount }}</h3>
              <p>جلسة</p>
            </div>
          </div>
          <div class="stat-card success">
            <mat-icon>check_circle</mat-icon>
            <div class="stat-info">
              <label>حضور</label>
              <h3>{{ stats.presentCount }}</h3>
              <p>جلسة</p>
            </div>
          </div>
          <div class="stat-card warning">
            <mat-icon>warning</mat-icon>
            <div class="stat-info">
              <label>غياب</label>
              <h3>{{ stats.absentCount }}</h3>
              <p>جلسة</p>
            </div>
          </div>
          <div class="stat-card info">
            <mat-icon>trending_up</mat-icon>
            <div class="stat-info">
              <label>نسبة الحضور</label>
              <h3>{{ stats.attendancePercentage }}%</h3>
              <p>من إجمالي الجلسات</p>
            </div>
          </div>
        </div>

        <mat-divider></mat-divider>

        <!-- Tabs -->
        <mat-tab-group>
          <!-- Personal Information Tab -->
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
                    <p>{{ employee.birthDate | date:'dd/MM/yyyy' }}</p>
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

          <!-- Courses Tab (for Trainers) - Shows assigned courses from TrainerCourse table -->
          <mat-tab *ngIf="employee?.employeeType?.id === 1" label="الدورات المسندة">
            <div class="tab-content">
              <div class="courses-list" *ngIf="(employee?.courses?.length ?? 0) > 0; else noCourses">
                <div class="course-card" *ngFor="let course of employee?.courses">
                  <mat-icon>school</mat-icon>
                  <div class="course-info">
                    <h4>{{ course.title }}</h4>
                    <p><strong>معرف الدورة:</strong> {{ course.id }}</p>
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

          <!-- Attendance Tab -->
          <mat-tab label="سجل الحضور">
            <div class="tab-content">
              <div class="attendance-summary" *ngIf="attendanceStats">
                <div class="attendance-stat">
                  <div class="stat-circle present">
                    <span>{{ attendanceStats.present }}</span>
                  </div>
                  <p>حاضر</p>
                </div>
                <div class="attendance-stat">
                  <div class="stat-circle absent">
                    <span>{{ attendanceStats.absent }}</span>
                  </div>
                  <p>غائب</p>
                </div>
                <div class="attendance-stat">
                  <div class="stat-circle late">
                    <span>{{ attendanceStats.late }}</span>
                  </div>
                  <p>متأخر</p>
                </div>
                <div class="attendance-stat">
                  <div class="stat-circle excused">
                    <span>{{ attendanceStats.excused }}</span>
                  </div>
                  <p>معتذر</p>
                </div>
              </div>

              <div class="table-container" *ngIf="attendances.length > 0; else noAttendance">
                <table mat-table [dataSource]="attendancesDataSource" class="full-width-table">
                  <ng-container matColumnDef="attendanceDate">
                    <th mat-header-cell *matHeaderCellDef>التاريخ</th>
                    <td mat-cell *matCellDef="let a">{{ a.attendanceDate | date:'dd/MM/yyyy' }}</td>
                  </ng-container>

                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef>الحالة</th>
                    <td mat-cell *matCellDef="let a">
                      <span class="status-badge" [class.present]="a.status?.id===1" [class.absent]="a.status?.id===2" [class.late]="a.status?.id===3" [class.excused]="a.status?.id===4">
                        {{ a.status?.title }}
                      </span>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="checkInTime">
                    <th mat-header-cell *matHeaderCellDef>وقت الدخول</th>
                    <td mat-cell *matCellDef="let a">{{ a.checkInTime || '-' }}</td>
                  </ng-container>

                  <ng-container matColumnDef="checkOutTime">
                    <th mat-header-cell *matHeaderCellDef>وقت الخروج</th>
                    <td mat-cell *matCellDef="let a">{{ a.checkOutTime || '-' }}</td>
                  </ng-container>

                  <ng-container matColumnDef="lateTime">
                    <th mat-header-cell *matHeaderCellDef>وقت التأخير</th>
                    <td mat-cell *matCellDef="let a">{{ a.lateTime ? a.lateTime + ' دقيقة' : '-' }}</td>
                  </ng-container>

                  <ng-container matColumnDef="note">
                    <th mat-header-cell *matHeaderCellDef>ملاحظات</th>
                    <td mat-cell *matCellDef="let a">{{ a.note || '-' }}</td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="attendanceDisplayedColumns"><tr>
                  <tr mat-row *matRowDef="let row; columns: attendanceDisplayedColumns;"></tr>
                </table>
              </div>
              <ng-template #noAttendance>
                <div class="empty-state">
                  <mat-icon>event_busy</mat-icon>
                  <p>لا توجد سجلات حضور</p>
                </div>
              </ng-template>
            </div>
          </mat-tab>
        </mat-tab-group>
      </mat-card>
    </div>

    <ng-template #loading>
      <div class="loading-container">
        <mat-spinner diameter="50"></mat-spinner>
        <p>جاري تحميل بيانات الموظف...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .profile-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .profile-card {
      border-radius: 16px;
      overflow: hidden;
    }

    .profile-header {
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .header-actions {
      display: flex;
      justify-content: space-between;
      gap: 16px;
    }

    .profile-main {
      display: flex;
      gap: 32px;
      padding: 32px;
      background: white;
    }

    .profile-image {
      flex-shrink: 0;
    }

    .avatar {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar mat-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: white;
    }

    .profile-image img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      object-fit: cover;
    }

    .profile-info {
      flex: 1;
    }

    .profile-info h1 {
      margin: 0 0 16px 0;
      font-size: 28px;
      color: #1f2937;
    }

    .info-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 16px;
      padding: 24px 32px;
      background: #f9fafb;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .stat-card mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #667eea;
    }

    .stat-card.success mat-icon { color: #10b981; }
    .stat-card.warning mat-icon { color: #f59e0b; }
    .stat-card.info mat-icon { color: #3b82f6; }

    .stat-info label {
      font-size: 11px;
      color: #6b7280;
    }

    .stat-info h3 {
      margin: 4px 0;
      font-size: 20px;
      font-weight: bold;
    }

    .stat-info p {
      margin: 0;
      font-size: 10px;
      color: #9ca3af;
    }

    .financial-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }

    .financial-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      color: white;
    }

    .financial-card mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
    }

    .financial-card.warning {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }

    .financial-card.info {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    }

    .financial-card label {
      font-size: 12px;
      opacity: 0.9;
    }

    .financial-card h3 {
      margin: 4px 0 0;
      font-size: 24px;
    }

    .tab-content {
      padding: 24px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px;
      background: #f9fafb;
      border-radius: 12px;
      transition: transform 0.2s;
    }

    .info-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .info-item mat-icon {
      color: #667eea;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .info-item div {
      flex: 1;
    }

    .info-item label {
      display: block;
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 4px;
    }

    .info-item p {
      margin: 0;
      font-size: 16px;
      color: #1f2937;
      font-weight: 500;
    }

    .contacts-list,
    .departments-list,
    .courses-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .contact-card,
    .department-card,
    .course-card {
      display: flex;
      gap: 16px;
      padding: 20px;
      background: #f9fafb;
      border-radius: 12px;
      transition: all 0.2s;
    }

    .contact-card:hover,
    .department-card:hover,
    .course-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .contact-card mat-icon,
    .department-card mat-icon,
    .course-card mat-icon {
      color: #667eea;
      font-size: 40px;
      width: 40px;
      height: 40px;
    }

    .contact-info,
    .department-info,
    .course-info {
      flex: 1;
    }

    .contact-info label,
    .department-info h4,
    .course-info h4 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
    }

    .contact-info p,
    .department-info p,
    .course-info p {
      margin: 4px 0;
      color: #6b7280;
      font-size: 14px;
    }

    .table-container {
      overflow-x: auto;
      margin-top: 16px;
    }

    .full-width-table {
      width: 100%;
    }

    .attendance-summary {
      display: flex;
      justify-content: center;
      gap: 40px;
      margin-bottom: 32px;
      padding: 24px;
      background: #f9fafb;
      border-radius: 12px;
    }

    .attendance-stat {
      text-align: center;
    }

    .stat-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
    }

    .stat-circle.present {
      background: #d1fae5;
      color: #065f46;
    }

    .stat-circle.absent {
      background: #fee2e2;
      color: #991b1b;
    }

    .stat-circle.late {
      background: #fef3c7;
      color: #92400e;
    }

    .stat-circle.excused {
      background: #dbeafe;
      color: #1e40af;
    }

    .stat-circle span {
      font-size: 28px;
      font-weight: bold;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 30px;
      font-size: 12px;
      font-weight: 500;
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

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
    }

    .loading-container p {
      margin-top: 20px;
      color: #6b7280;
    }

    @media (max-width: 768px) {
      .profile-main {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .financial-cards {
        grid-template-columns: 1fr;
      }

      .attendance-summary {
        flex-direction: column;
        align-items: center;
      }

      .info-badges {
        justify-content: center;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EmployeeProfileComponent implements OnInit {
  employeeId!: number;
  employee: EmployeeVTO | null = null;
  contacts: EmployeeContactVTO[] = [];
  sessions: CourseSessionVTO[] = [];
  attendances: EmployeeAttendanceListItem[] = [];
  isLoading = true;
  
  sessionsDataSource = new MatTableDataSource<CourseSessionVTO>([]);
  attendancesDataSource = new MatTableDataSource<EmployeeAttendanceListItem>([]);
  
  sessionsDisplayedColumns: string[] = ['title', 'course', 'place', 'sessionDate', 'startTime', 'endTime', 'status'];
  attendanceDisplayedColumns: string[] = ['attendanceDate', 'status', 'checkInTime', 'checkOutTime', 'lateTime', 'note'];
  
  stats = {
    coursesCount: 0,
    sessionsCount: 0,
    presentCount: 0,
    absentCount: 0,
    attendancePercentage: 0
  };
  
  attendanceStats = {
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    total: 0
  };

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.employeeId = Number(this.route.snapshot.params['id']);
    this.loadEmployeeData();
  }

  loadEmployeeData(): void {
    this.isLoading = true;
    
    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (res: EmployeeVTO) => {
        this.employee = res;
        this.contacts = res.contacts || [];
        this.sessions = res.sessions || [];
        this.sessionsDataSource.data = this.sessions;
        
        // Calculate stats
        this.stats.coursesCount = res.courses?.length ?? 0;
        this.stats.sessionsCount = this.sessions.length;
        
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات الموظف');
        this.isLoading = false;
      }
    });
    
    // Load attendance records
    this.employeeService.getAllEmployeeAttendances(this.employeeId).subscribe({
      next: (res: any) => {
        this.attendances = res.items || [];
        this.attendancesDataSource.data = this.attendances;
        this.calculateAttendanceStats();
      },
      error: () => {
        console.error('Error loading attendance');
      }
    });
  }
  
  calculateAttendanceStats(): void {
    const present = this.attendances.filter(a => a.status?.id === 1).length;
    const absent = this.attendances.filter(a => a.status?.id === 2).length;
    const late = this.attendances.filter(a => a.status?.id === 3).length;
    const excused = this.attendances.filter(a => a.status?.id === 4).length;
    const total = this.attendances.length;
    
    this.attendanceStats = {
      present: present,
      absent: absent,
      late: late,
      excused: excused,
      total: total
    };
    
    this.stats.presentCount = present;
    this.stats.absentCount = absent;
    this.stats.attendancePercentage = total > 0 ? Math.round((present / total) * 100) : 0;
  }
  
  getSessionStatusColor(statusId: number): string {
    const colors: { [key: number]: string } = {
      1: 'primary',   // Scheduled
      2: 'accent',    // In Progress
      3: 'primary',   // Completed
      4: 'warn'       // Cancelled
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
}