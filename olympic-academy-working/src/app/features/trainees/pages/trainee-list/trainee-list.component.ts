import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterLink, Router } from '@angular/router';

import { TraineeService } from '../../../../core/services/trainee.service';
import { ReportService } from '../../../../core/services/report.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { SearchableSelectComponent } from '../../../../shared/components/searchable-select/searchable-select.component';
import { GENDERS } from '../../../../core/models/common.model';
import { TraineeDetailsModalComponent } from './../trainee-details/trainee-details-modal.component';
import { TraineeWizardModalComponent } from '../trainee-wizard/trainee-wizard-modal.component';

interface Trainee {
  id: number;
  fullName: string;
  nationalId: string;
  academicYear?: string;
  gender?: { id: number; title: string };
  isActive: boolean;
  certificates?: any[];
  enrollmentsCount?: number;
  address?: string;
  birthDate?: Date;
  contacts?: any[];
  healthConditions?: any[];
}

@Component({
  selector: 'app-trainee-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,
    RouterLink,
    SearchableSelectComponent
  ],
  templateUrl: './trainee-list.component.html',
  styleUrls: ['./trainee-list.component.css']
})
export class TraineeListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['index', 'fullName', 'nationalId', 'academicYear', 'gender', 'status', 'actions'];
  dataSource = new MatTableDataSource<Trainee>([]);
  allTrainees: Trainee[] = [];
  isLoading = false;
  
  searchText = '';
  genderFilter: number | null = null;
  statusFilter: boolean | null = null;
  academicYearFilter: string | null = null;
  
  genderOptions: { value: number | null; label: string }[] = [];
  statusOptions: { value: boolean | null; label: string }[] = [];
  academicYearOptions: { value: string | null; label: string }[] = [
    { value: null, label: 'الكل' },
    { value: 'الأولى', label: 'السنة الأولى' },
    { value: 'الثانية', label: 'السنة الثانية' },
    { value: 'الثالثة', label: 'السنة الثالثة' },
    { value: 'الرابعة', label: 'السنة الرابعة' }
  ];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  get activeCount(): number { 
    return this.allTrainees.filter(t => t.isActive).length; 
  }
  
  get inactiveCount(): number { 
    return this.allTrainees.filter(t => !t.isActive).length; 
  }

  constructor(
    private traineeService: TraineeService,
    private reportService: ReportService,
    private notification: NotificationService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadGenderOptions();
    this.loadStatusOptions();
    this.loadTrainees();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadGenderOptions(): void {
    this.genderOptions = [
      { value: null, label: 'الكل' },
      ...GENDERS.map(g => ({ value: g.id, label: g.title }))
    ];
  }

  loadStatusOptions(): void {
    this.statusOptions = [
      { value: null, label: 'الكل' },
      { value: true, label: 'نشط' },
      { value: false, label: 'غير نشط' }
    ];
  }

  loadTrainees(): void {
    this.isLoading = true;
    this.traineeService.getAllTraineesByFilter().subscribe({
      next: (res: any) => {
        this.allTrainees = res.items || [];
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل المتدربين');
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.allTrainees];
    
    if (this.searchText) {
      const search = this.searchText.toLowerCase();
      filtered = filtered.filter(t => 
        t.fullName?.toLowerCase().includes(search) || 
        t.nationalId?.includes(search) ||
        t.academicYear?.toLowerCase().includes(search)
      );
    }
    
    if (this.genderFilter !== null) {
      filtered = filtered.filter(t => t.gender?.id === this.genderFilter);
    }
    
    if (this.statusFilter !== null) {
      filtered = filtered.filter(t => t.isActive === this.statusFilter);
    }
    
    if (this.academicYearFilter !== null) {
      filtered = filtered.filter(t => t.academicYear === this.academicYearFilter);
    }
    
    this.dataSource.data = filtered;
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  clearFilters(): void {
    this.searchText = '';
    this.genderFilter = null;
    this.statusFilter = null;
    this.academicYearFilter = null;
    this.applyFilters();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  viewTrainee(id: number): void {
    this.traineeService.getTraineeById(id).subscribe({
      next: (trainee) => {
        this.dialog.open(TraineeDetailsModalComponent, {
          data: trainee,
          width: '700px',
          maxWidth: '90vw'
        });
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات المتدرب');
      }
    });
  }
  
editTrainee(id: number): void {
  const dialogRef = this.dialog.open(TraineeWizardModalComponent, {
    data: { traineeId: id },
    width: '900px',
    maxWidth: '90vw'
  });
  
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.loadTrainees();
    }
  });
}

openNewTraineeModal(): void {
  const dialogRef = this.dialog.open(TraineeWizardModalComponent, {
    data: {},
    width: '900px',
    maxWidth: '90vw'
  });
  
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.loadTrainees();
    }
  });
}

  deleteTrainee(trainee: Trainee): void {
    if (confirm(`هل أنت متأكد من حذف المتدرب "${trainee.fullName}"؟`)) {
      this.traineeService.deleteTrainee(trainee.id).subscribe({
        next: () => {
          this.notification.showSuccess('تم حذف المتدرب بنجاح');
          this.loadTrainees();
        },
        error: () => this.notification.showError('حدث خطأ في الحذف')
      });
    }
  }

  exportToExcel(): void {
    if (this.dataSource.filteredData.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }
    
    const data = this.dataSource.filteredData.map((t: Trainee, i: number) => ({
      '#': i + 1,
      'الاسم': t.fullName,
      'رقم الهوية': t.nationalId,
      'السنة الدراسية': t.academicYear || '-',
      'الجنس': t.gender?.title || '-',
      'الحالة': t.isActive ? 'نشط' : 'غير نشط'
    }));
    
    this.reportService.exportToExcel(data, 'trainees-list', 'المتدربين');
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }

  exportToPDF(): void {
    if (this.dataSource.filteredData.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }
    
    this.isLoading = true;

    // Build filter text
    const filterTexts: string[] = [];
    if (this.genderFilter !== null) {
      const gender = GENDERS.find(g => g.id === this.genderFilter);
      if (gender) filterTexts.push(`الجنس: ${gender.title}`);
    }
    if (this.statusFilter !== null) {
      filterTexts.push(`الحالة: ${this.statusFilter ? 'نشط' : 'غير نشط'}`);
    }
    if (this.academicYearFilter) {
      filterTexts.push(`السنة الدراسية: ${this.academicYearFilter}`);
    }
    if (this.searchText) filterTexts.push(`بحث: ${this.searchText}`);

    // Build table rows
    let tableRows = '';
    this.dataSource.filteredData.forEach((t: Trainee, index: number) => {
      const statusClass = t.isActive ? 'active' : 'inactive';
      const statusStyle = t.isActive 
        ? 'background-color: #d1fae5; color: #065f46;' 
        : 'background-color: #fee2e2; color: #991b1b;';
      
      tableRows += `
        <tr>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd; font-weight: bold;">${t.fullName || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${t.nationalId || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${t.academicYear || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${t.gender?.title || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd; ${statusStyle}">${t.isActive ? 'نشط' : 'غير نشط'}</td>
        </tr>
      `;
    });

    // Create print container
    const printContainer = document.createElement('div');
    printContainer.style.direction = 'rtl';
    printContainer.style.fontFamily = 'Cairo, "Segoe UI", Tahoma, sans-serif';
    printContainer.style.padding = '20px';
    printContainer.style.backgroundColor = 'white';
    
    printContainer.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>قائمة المتدربين</title>
        <style>
          * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; }
          @media print {
            body { margin: 0; padding: 20px; }
            .no-print { display: none; }
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 8px;
          }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 10px 0 0 0; font-size: 12px; }
          .filters {
            margin-bottom: 20px;
            padding: 10px;
            background-color: #f3f4f6;
            border-radius: 8px;
            font-size: 12px;
          }
          .stats {
            display: flex;
            gap: 16px;
            margin-bottom: 20px;
            padding: 16px;
            background: #f9fafb;
            border-radius: 8px;
          }
          .stat-item {
            flex: 1;
            text-align: center;
          }
          .stat-label { font-size: 12px; color: #6b7280; }
          .stat-value { font-size: 20px; font-weight: bold; color: #667eea; }
          .stat-value.active { color: #10b981; }
          .stat-value.inactive { color: #f59e0b; }
          table {
            width: 100%;
            border-collapse: collapse;
            direction: rtl;
          }
          th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 10px;
            border: 1px solid #ddd;
            text-align: center;
            font-weight: bold;
          }
          td { padding: 8px; border: 1px solid #ddd; }
          .footer {
            text-align: center;
            margin-top: 20px;
            padding: 10px;
            font-size: 10px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>قائمة المتدربين</h1>
          <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</p>
          <p>عدد السجلات: ${this.dataSource.filteredData.length} متدرب</p>
        </div>
        ${filterTexts.length > 0 ? `<div class="filters"><strong>الفلاتر المطبقة:</strong> ${filterTexts.join(' | ')}</div>` : ''}
        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">${this.allTrainees.length}</div>
            <div class="stat-label">إجمالي المتدربين</div>
          </div>
          <div class="stat-item">
            <div class="stat-value active">${this.activeCount}</div>
            <div class="stat-label">نشط</div>
          </div>
          <div class="stat-item">
            <div class="stat-value inactive">${this.inactiveCount}</div>
            <div class="stat-label">غير نشط</div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>الاسم</th>
              <th>رقم الهوية</th>
              <th>السنة الدراسية</th>
              <th>الجنس</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <div class="footer">
          تم التصدير من نظام إدارة الأكاديمية الأولمبية
        </div>
        <div class="no-print" style="text-align: center; margin-top: 20px; padding: 10px;">
          <button onclick="window.print();" style="padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 5px; cursor: pointer;">
            🖨️ طباعة / حفظ كـ PDF
          </button>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes');
    if (printWindow) {
      printWindow.document.write(printContainer.innerHTML);
      printWindow.document.close();
      this.isLoading = false;
      this.notification.showSuccess('تم فتح التقرير - يمكنك طباعته أو حفظه كـ PDF');
    } else {
      document.body.appendChild(printContainer);
      window.print();
      setTimeout(() => {
        document.body.removeChild(printContainer);
      }, 500);
      this.isLoading = false;
      this.notification.showSuccess('تم فتح التقرير - يمكنك حفظه كـ PDF من نافذة الطباعة');
    }
  }
}