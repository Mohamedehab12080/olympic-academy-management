import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { EnrollmentService } from '../../../../core/services/enrollment.service';
import { TraineeService } from '../../../../core/services/trainee.service';
import { CourseService } from '../../../../core/services/course.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportService } from '../../../../core/services/report.service';
import {PAYMENT_STATUSES} from '../../../../core/models/common.model';
import { ENROLLMENT_STATUSES } from '../../../../core/models/enrollment.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-enrollment-list',
  templateUrl: './enrollment-list.component.html',
  styleUrls: ['./enrollment-list.component.css']
})
export class EnrollmentListComponent implements OnInit {
  displayedColumns = ['id', 'trainee', 'course', 'trainer', 'startDate', 'endDate', 'enrollmentStatus', 'paymentStatus', 'amount', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;
  
  trainees: any[] = [];
  courses: any[] = [];
  trainers: any[] = [];
  paymentStatuses = PAYMENT_STATUSES;
  enrollmentStatuses = ENROLLMENT_STATUSES;
  
  filters = {
    traineeId: null as number | null,
    courseId: null as number | null,
    trainerId: null as number | null,
    enrollmentStatus: null as number | null,
    paymentStatus: null as number | null,
    startDateFrom: null as string | null,
    startDateTo: null as string | null,
    endDateFrom: null as string | null,
    endDateTo: null as string | null
  };
  
  quickSearch: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private enrollmentService: EnrollmentService,
    private traineeService: TraineeService,
    private courseService: CourseService,
    private employeeService: EmployeeService,
    private notification: NotificationService,
    private reportService: ReportService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadLookupData();
    this.loadEnrollments();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadLookupData() {
    this.traineeService.getAllTraineesByFilter().subscribe({
      next: (res: any) => { this.trainees = res.items; },
      error: () => { this.notification.showError('حدث خطأ في تحميل المتدربين'); }
    });

    this.courseService.getAllCourses().subscribe({
      next: (res: any) => { this.courses = res.items; },
      error: () => { this.notification.showError('حدث خطأ في تحميل الدورات'); }
    });

    this.employeeService.getAllTrainersLookup().subscribe({
      next: (res: any) => { this.trainers = res.list; },
      error: () => { this.notification.showError('حدث خطأ في تحميل المدربين'); }
    });
  }

  loadEnrollments() {
    this.isLoading = true;
    const params: any = {};
    
    if (this.filters.traineeId) params.traineeId = this.filters.traineeId;
    if (this.filters.courseId) params.courseId = this.filters.courseId;
    if (this.filters.trainerId) params.trainerId = this.filters.trainerId;
    if (this.filters.enrollmentStatus) params.enrollmentStatus = this.filters.enrollmentStatus;
    if (this.filters.paymentStatus) params.paymentStatus = this.filters.paymentStatus;
    if (this.filters.startDateFrom) params.startDateFrom = this.filters.startDateFrom;
    if (this.filters.startDateTo) params.startDateTo = this.filters.startDateTo;
    if (this.filters.endDateFrom) params.endDateFrom = this.filters.endDateFrom;
    if (this.filters.endDateTo) params.endDateTo = this.filters.endDateTo;
    if (this.quickSearch) params.quickSearch = this.quickSearch;

    this.enrollmentService.getAllEnrollmentsByFilter(params).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.items;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل البيانات');
        this.isLoading = false;
      }
    });
  }

  applyQuickSearch(event: Event) {
    this.quickSearch = (event.target as HTMLInputElement).value;
    this.loadEnrollments();
  }

  resetFilters() {
    this.filters = {
      traineeId: null,
      courseId: null,
      trainerId: null,
      enrollmentStatus: null,
      paymentStatus: null,
      startDateFrom: null,
      startDateTo: null,
      endDateFrom: null,
      endDateTo: null
    };
    this.quickSearch = '';
    this.loadEnrollments();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  exportToExcel() {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = this.dataSource.data.map((item, index) => ({
      '#': index + 1,
      'المتدرب': item.trainee?.title,
      'الدورة': item.course?.title,
      'المدرب': item.trainer?.title,
      'تاريخ البدء': item.startDate,
      'تاريخ الانتهاء': item.endDate || '-',
      'حالة التسجيل': item.enrollmentStatus?.title,
      'حالة الدفع': item.paymentStatus?.title,
      'المبلغ': item.finalSubscriptionValue
    }));

    this.reportService.exportToExcel(exportData, 'enrollments-list', 'التسجيلات');
    this.notification.showSuccess('تم تصدير البيانات بنجاح');
  }

  exportToPDF() {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const doc = new jsPDF('l', 'mm', 'a4');
    
    doc.setFontSize(18);
    doc.text('تقرير التسجيلات', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    
    doc.setFontSize(10);
    let yOffset = 25;
    if (this.filters.traineeId) {
      const trainee = this.trainees.find(t => t.id === this.filters.traineeId);
      if (trainee) doc.text(`المتدرب: ${trainee.title}`, 14, yOffset);
      yOffset += 6;
    }
    if (this.filters.courseId) {
      const course = this.courses.find(c => c.id === this.filters.courseId);
      if (course) doc.text(`الدورة: ${course.title}`, 14, yOffset);
      yOffset += 6;
    }
    if (this.filters.startDateFrom) doc.text(`من تاريخ: ${this.filters.startDateFrom}`, 14, yOffset);
    if (this.filters.startDateTo) doc.text(`إلى تاريخ: ${this.filters.startDateTo}`, 14, yOffset + 6);
    
    doc.text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}`, doc.internal.pageSize.getWidth() - 40, 25);
    doc.text(`عدد السجلات: ${this.dataSource.data.length}`, doc.internal.pageSize.getWidth() - 40, 32);

    autoTable(doc, {
      head: [['#', 'المتدرب', 'الدورة', 'المدرب', 'تاريخ البدء', 'تاريخ الانتهاء', 'حالة التسجيل', 'حالة الدفع', 'المبلغ']],
      body: this.dataSource.data.map((item, index) => [
        (index + 1).toString(),
        item.trainee?.title,
        item.course?.title,
        item.trainer?.title,
        item.startDate,
        item.endDate || '-',
        item.enrollmentStatus?.title,
        item.paymentStatus?.title,
        `${item.finalSubscriptionValue} EGP`
      ]),
      startY: yOffset + 15,
      styles: { halign: 'right', fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' },
      alternateRowStyles: { fillColor: [243, 244, 246] }
    });

    doc.save('enrollments-report.pdf');
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }

  viewEnrollment(id: number) {
    this.router.navigate(['/enrollments', id]);
  }

  editEnrollment(id: number) {
    this.router.navigate(['/enrollments', id, 'edit']);
  }
}