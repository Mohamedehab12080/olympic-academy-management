import { Component, OnInit, ViewChild, AfterViewInit, NO_ERRORS_SCHEMA } from '@angular/core';
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
import { RouterLink, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { TraineeService } from '../../../../core/services/trainee.service';
import { ReportService } from '../../../../core/services/report.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { SearchableSelectComponent } from '../../../../shared/components/searchable-select/searchable-select.component';
import { GENDERS } from '../../../../core/models/common.model';

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
  schemas: [NO_ERRORS_SCHEMA],
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
  
  genderOptions: any[] = [];
  statusOptions: any[] = [];
  
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
    private router: Router
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
    this.router.navigate(['/trainees', id]);
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
      'الجنس': t.gender?.title,
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
    
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.setFontSize(18);
    doc.text('قائمة المتدربين', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    
    autoTable(doc, {
      head: [['#', 'الاسم', 'رقم الهوية', 'السنة الدراسية', 'الجنس', 'الحالة']],
      body: this.dataSource.filteredData.map((t: Trainee, i: number) => [
        (i + 1).toString(),
        t.fullName || '-',
        t.nationalId || '-',
        t.academicYear || '-',
        t.gender?.title || '-',
        t.isActive ? 'نشط' : 'غير نشط'
      ]),
      startY: 35,
      styles: { halign: 'right', fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' }
    });
    
    doc.save('trainees-list.pdf');
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }
}