// trainee-list.component.ts - COMPLETE UPDATED VERSION

import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
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
import { RouterLink } from '@angular/router';

import { TraineeService } from '../../../../core/services/trainee.service';
import { ReportService } from '../../../../core/services/report.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { FileService } from '../../../../core/services/file.service';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';
import { GENDERS } from '../../../../core/models/common.model';
import { ACADEMIC_YEARS } from '../../../../core/models/trainee.model';
import { TraineeDetailsModalComponent } from '../trainee-details/trainee-details-modal.component';
import { TraineeWizardModalComponent, TraineeWizardData } from '../trainee-wizard/trainee-wizard-modal.component';
import { TraineeListItem } from '../../../../core/models/trainee.model';

// Helper to map enum ID to enum name for backend
enum AcademicYearEnum {
  _1 = '_1',
  _2 = '_2',
  _3 = '_3',
  _4 = '_4'
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
export class TraineeListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['index', 'image', 'fullName', 'nationalId', 'academicYear', 'gender', 'status', 'actions'];
  dataSource = new MatTableDataSource<TraineeListItem>([]);
  allTrainees: TraineeListItem[] = [];
  imageUrls: Map<number, string> = new Map();
  isLoading = false;
  
  // Filters
  searchText = '';
  genderFilter: string | null = null;
  statusFilter: boolean | null = null;
  academicYearFilter: string | null = null;
  
  // Options for selects
  genderOptions: SelectOption[] = [];
  statusOptions: SelectOption[] = [];
  academicYearOptions: SelectOption[] = [];
  
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
    private dialog: MatDialog,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.loadSelectOptions();
    this.loadTrainees();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    // Clean up all blob URLs to prevent memory leaks
    this.imageUrls.forEach(url => {
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    this.imageUrls.clear();
  }

  loadSelectOptions(): void {
    // Gender Options - map to enum names
    this.genderOptions = [
      { value: null, label: 'الكل' },
      ...GENDERS.map(g => ({ 
        value: this.getGenderEnumName(g.id), 
        label: g.title 
      }))
    ];

    // Status Options
    this.statusOptions = [
      { value: null, label: 'الكل' },
      { value: true, label: 'نشط' },
      { value: false, label: 'غير نشط' }
    ];

    // Academic Year Options - map to enum names
    this.academicYearOptions = [
      { value: null, label: 'الكل' },
      ...ACADEMIC_YEARS.map(y => ({ 
        value: this.getAcademicYearEnumName(y.id), 
        label: y.title 
      }))
    ];
  }

  // Helper to map gender ID to enum name
  private getGenderEnumName(id: number): string {
    const genderMap: { [key: number]: string } = {
      1: 'MALE',
      2: 'FEMALE'
    };
    return genderMap[id] || '';
  }

  // Helper to map academic year ID to enum name
  private getAcademicYearEnumName(id: number): string {
    const yearMap: { [key: number]: string } = {
      1: '_1',
      2: '_2',
      3: '_3',
      4: '_4'
    };
    return yearMap[id] || '';
  }

  loadTrainees(): void {
    this.isLoading = true;
    const params: any = {};
    
    if (this.searchText) params.quickSearch = this.searchText;
    if (this.genderFilter) params.gender = this.genderFilter;
    if (this.statusFilter !== null) params.isActive = this.statusFilter;
    if (this.academicYearFilter) params.academicYear = this.academicYearFilter;

    this.traineeService.getAllTraineesByFilter(params).subscribe({
      next: (res: any) => {
        this.allTrainees = res.items || [];
        this.loadAllImages();
        this.dataSource.data = this.allTrainees;
        this.isLoading = false;
        console.log('Loaded trainees:', this.allTrainees);
      },
      error: (err: any) => {
        console.error('Error loading trainees:', err);
        this.notification.showError('حدث خطأ في تحميل المتدربين');
        this.isLoading = false;
      }
    });
  }

  loadAllImages(): void {
    // Clear existing image URLs
    this.imageUrls.forEach(url => {
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    this.imageUrls.clear();

    // Load images for trainees that have imageUrl (FID)
    this.allTrainees.forEach(trainee => {
      this.loadImage(trainee);
    });
  }

  loadImage(trainee: TraineeListItem): void {
    const fid = trainee.imageUrl;
    if (fid) {
      // Check if fid is a valid FID (15 or 18 digits)
      if (/^\d{15}(\d{3})?$/.test(fid)) {
        this.fileService.downloadFile(fid).subscribe({
          next: (blob) => {
            // Clean up previous blob URL if exists
            const existingUrl = this.imageUrls.get(trainee.id);
            if (existingUrl && existingUrl.startsWith('blob:')) {
              URL.revokeObjectURL(existingUrl);
            }
            // Create new blob URL
            const blobUrl = URL.createObjectURL(blob);
            this.imageUrls.set(trainee.id, blobUrl);
            // Refresh the table data to show the image
            this.dataSource.data = [...this.dataSource.data];
          },
          error: (error) => {
            console.error(`Failed to load image for trainee ${trainee.id}:`, error);
            this.imageUrls.set(trainee.id, '');
            this.dataSource.data = [...this.dataSource.data];
          }
        });
      } else {
        // If it's already a URL, use it directly
        this.imageUrls.set(trainee.id, fid);
      }
    } else {
      this.imageUrls.set(trainee.id, '');
    }
  }

  getImageUrl(traineeId: number): string | null {
    const url = this.imageUrls.get(traineeId);
    return url && url.startsWith('blob:') ? url : null;
  }

  // Filter methods - all call server-side
  onSearchChange(): void {
    this.loadTrainees();
  }

  onGenderChange(value: string | null): void {
    this.genderFilter = value;
    this.loadTrainees();
  }

  onStatusChange(value: boolean | null): void {
    this.statusFilter = value;
    this.loadTrainees();
  }

  onAcademicYearChange(value: string | null): void {
    this.academicYearFilter = value;
    this.loadTrainees();
  }

  clearFilters(): void {
    this.searchText = '';
    this.genderFilter = null;
    this.statusFilter = null;
    this.academicYearFilter = null;
    this.loadTrainees();
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
  
  /**
   * Edit trainee - passes full trainee data to the wizard
   */
editTrainee(id: number): void {
  // Find the trainee from the list
  const trainee = this.allTrainees.find(t => t.id === id);
  
  console.log('🔍 Edit trainee - ID:', id);
  console.log('🔍 Edit trainee - Found trainee:', trainee);
  
  // Open the wizard with the trainee data
  const dialogRef = this.dialog.open(TraineeWizardModalComponent, {
    data: { 
      traineeId: id,
      traineeData: trainee // Pass the full trainee data
    },
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

  deleteTrainee(trainee: TraineeListItem): void {
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

  /**
   * Print multiple trainee cards (بطاقات المتدربين) - Optimized for maximum cards per page
   */
  printTraineeCards(): void {
    if (this.dataSource.filteredData.length === 0) {
      this.notification.showWarning('لا توجد بيانات لطباعة البطاقات');
      return;
    }

    this.isLoading = true;

    // Collect all image URLs for the trainees
    const traineeImagePromises = this.dataSource.filteredData.map((trainee) => {
      return new Promise<string>((resolve) => {
        const fid = trainee.imageUrl;
        if (fid && /^\d{15}(\d{3})?$/.test(fid)) {
          this.fileService.downloadFile(fid).subscribe({
            next: (blob) => {
              const blobUrl = URL.createObjectURL(blob);
              resolve(blobUrl);
            },
            error: () => {
              resolve('');
            }
          });
        } else if (fid) {
          resolve(fid);
        } else {
          resolve('');
        }
      });
    });

    Promise.all(traineeImagePromises).then((imageUrls) => {
      this.generateCardsPrintOptimized(this.dataSource.filteredData, imageUrls);
      this.isLoading = false;
      this.notification.showSuccess('تم فتح بطاقات المتدربين للطباعة');
    });
  }

  /**
   * Generate print document with multiple trainee cards - Optimized for maximum cards per page
   */
  private generateCardsPrintOptimized(trainees: TraineeListItem[], imageUrls: string[]): void {
    const printWindow = window.open('', '_blank', 'width=800,height=800,scrollbars=yes');
    if (!printWindow) {
      this.notification.showError('تعذر فتح نافذة الطباعة');
      return;
    }

    const today = new Date().toLocaleDateString('ar-EG');
    let cardsHtml = '';

    trainees.forEach((trainee, index) => {
      const imageUrl = imageUrls[index] || '';
      const genderDisplay = trainee.gender?.title || '-';
      const academicYearDisplay = trainee.academicYear?.title || '-';
      const isActive = trainee.isActive;

      cardsHtml += `
        <div class="card-wrapper">
          <div class="card">
            <div class="card-header">
              <div class="academy-name">الأكاديمية الأولمبية</div>
              <div class="card-title">بطاقة هوية</div>
            </div>
            <div class="card-body">
              <div class="card-photo">
                ${imageUrl ? `<img src="${imageUrl}" alt="${trainee.fullName}">` : '<div class="placeholder-photo">📷</div>'}
              </div>
              <div class="card-info">
                <div class="card-name">${trainee.fullName}</div>
                <div class="card-id">${trainee.nationalId}</div>
                <div class="card-details">
                  <div class="detail-row">
                    <span class="detail-label">الجنس:</span>
                    <span class="detail-value">${genderDisplay}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">السنة:</span>
                    <span class="detail-value">${academicYearDisplay}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">الحالة:</span>
                    <span class="detail-value status ${isActive ? 'active' : 'inactive'}">${isActive ? 'نشط' : 'غير نشط'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <div class="card-barcode">
                <svg id="barcode-${index}" class="barcode-svg"></svg>
              </div>
              <div class="card-signature">
                <div class="signature-line"></div>
                <div class="signature-label">توقيع المتدرب</div>
              </div>
              <div class="card-signature">
                <div class="signature-line"></div>
                <div class="signature-label">ختم الأكاديمية</div>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>بطاقات المتدربين</title>
        <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"><\/script>
        <style>
          * { 
            font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; 
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          /* Print optimization - maximum cards per page */
          @media print {
            body { 
              margin: 0; 
              padding: 4px; 
              background: white; 
            }
            .no-print { display: none; }
            .card-wrapper { 
              page-break-after: avoid;
              display: inline-block;
              width: 50%;
              padding: 3px;
            }
            .card {
              box-shadow: none !important;
              border: 1px solid #ddd !important;
              border-radius: 4px !important;
              min-height: 220px;
              padding: 8px 10px;
            }
            .card-header {
              margin-bottom: 4px;
              padding-bottom: 4px;
            }
            .academy-name {
              font-size: 10px;
            }
            .card-title {
              font-size: 8px;
            }
            .card-body {
              gap: 6px;
              margin-bottom: 4px;
            }
            .card-photo img, .placeholder-photo {
              width: 50px;
              height: 50px;
            }
            .card-name {
              font-size: 11px;
            }
            .card-id {
              font-size: 9px;
            }
            .card-details {
              font-size: 8px;
            }
            .detail-row {
              padding: 1px 0;
            }
            .card-footer {
              padding-top: 4px;
              margin-top: 2px;
            }
            .card-barcode svg {
              height: 25px;
            }
            .card-signature {
              width: 42%;
            }
            .signature-label {
              font-size: 6px;
            }
            .signature-line {
              margin: 2px 0;
            }
            .card-issue-date {
              display: none;
            }
          }
          
          /* Screen view - show cards in grid */
          @media screen {
            body { 
              margin: 0; 
              padding: 20px; 
              background: #f0f2f5; 
              display: flex;
              flex-wrap: wrap;
              gap: 16px;
              justify-content: center;
            }
            .card-wrapper { 
              flex: 0 0 auto;
              margin: 0;
            }
            .card-issue-date {
              text-align: center;
              font-size: 8px;
              color: #94a3b8;
              margin-top: 6px;
              padding-top: 4px;
              border-top: 1px dashed #e2e8f0;
            }
          }
          
          .card-wrapper {
            display: inline-block;
          }
          .card {
            width: 100%;
            max-width: 280px;
            min-width: 220px;
            height: auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #e2e8f0;
            direction: rtl;
            padding: 12px 14px;
          }
          .card-header {
            text-align: center;
            border-bottom: 2px solid #667eea;
            padding-bottom: 6px;
            margin-bottom: 8px;
          }
          .academy-name {
            font-size: 12px;
            font-weight: 700;
            color: #1a1a2e;
          }
          .card-title {
            font-size: 9px;
            color: #667eea;
            font-weight: 600;
            margin-top: 1px;
          }
          .card-body {
            display: flex;
            gap: 10px;
            margin-bottom: 8px;
          }
          .card-photo {
            flex-shrink: 0;
          }
          .card-photo img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #667eea;
          }
          .placeholder-photo {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            color: white;
          }
          .card-info {
            flex: 1;
            min-width: 0;
          }
          .card-name {
            font-size: 13px;
            font-weight: 700;
            color: #1a1a2e;
            margin-bottom: 1px;
          }
          .card-id {
            font-size: 10px;
            color: #64748b;
            margin-bottom: 4px;
          }
          .card-details {
            font-size: 9px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 1px 0;
            border-bottom: 1px dashed #f1f5f9;
          }
          .detail-label {
            color: #64748b;
          }
          .detail-value {
            color: #1e293b;
            font-weight: 500;
          }
          .detail-value.status.active {
            color: #10b981;
          }
          .detail-value.status.inactive {
            color: #ef4444;
          }
          .card-footer {
            border-top: 2px solid #667eea;
            padding-top: 6px;
            margin-top: 4px;
          }
          .card-barcode {
            text-align: center;
            margin-bottom: 4px;
          }
          .card-barcode svg {
            max-width: 100%;
            height: 30px;
          }
          .card-signature {
            display: inline-block;
            width: 44%;
            text-align: center;
            vertical-align: top;
          }
          .card-signature:last-child {
            margin-right: 5%;
          }
          .signature-line {
            border-top: 1px solid #94a3b8;
            margin: 3px 0 2px;
          }
          .signature-label {
            font-size: 7px;
            color: #94a3b8;
          }
          
          @media (max-width: 600px) {
            .card {
              max-width: 100%;
            }
          }
        </style>
      </head>
      <body>
        ${cardsHtml}
        <div class="no-print" style="text-align: center; margin-top: 20px; width: 100%;">
          <button onclick="window.print();" style="padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">🖨️ طباعة / حفظ كـ PDF</button>
        </div>
        <script>
          // Generate barcodes after page load
          window.onload = function() {
            setTimeout(function() {
              const trainees = ${JSON.stringify(trainees.map(t => t.nationalId))};
              trainees.forEach(function(nationalId, index) {
                try {
                  JsBarcode('#barcode-' + index, nationalId || '000000', {
                    format: 'CODE128',
                    lineColor: '#000000',
                    width: 1,
                    height: 25,
                    displayValue: true,
                    fontSize: 7,
                    font: 'monospace',
                    textAlign: 'center',
                    margin: 1
                  });
                } catch(e) {
                  console.error('Barcode error for index', index, e);
                }
              });
            }, 300);
          };
        <\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  exportToExcel(): void {
    if (this.dataSource.filteredData.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }
    
    const data = this.dataSource.filteredData.map((t: TraineeListItem, i: number) => ({
      '#': i + 1,
      'الاسم': t.fullName,
      'رقم الهوية': t.nationalId,
      'السنة الدراسية': t.academicYear?.title || '-',
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

    const filterTexts: string[] = [];
    if (this.genderFilter) {
      const gender = GENDERS.find(g => this.getGenderEnumName(g.id) === this.genderFilter);
      if (gender) filterTexts.push(`الجنس: ${gender.title}`);
    }
    if (this.statusFilter !== null) {
      filterTexts.push(`الحالة: ${this.statusFilter ? 'نشط' : 'غير نشط'}`);
    }
    if (this.academicYearFilter) {
      const year = ACADEMIC_YEARS.find(y => this.getAcademicYearEnumName(y.id) === this.academicYearFilter);
      if (year) filterTexts.push(`السنة الدراسية: ${year.title}`);
    }
    if (this.searchText) filterTexts.push(`بحث: ${this.searchText}`);

    let tableRows = '';
    this.dataSource.filteredData.forEach((t: TraineeListItem, index: number) => {
      const statusStyle = t.isActive 
        ? 'background-color: #d1fae5; color: #065f46;' 
        : 'background-color: #fee2e2; color: #991b1b;';
      
      tableRows += `
        <tr>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd; font-weight: bold;">${t.fullName || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${t.nationalId || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${t.academicYear?.title || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${t.gender?.title || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd; ${statusStyle}">${t.isActive ? 'نشط' : 'غير نشط'}</td>
        </tr>
      `;
    });

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
          @media print { body { margin: 0; padding: 20px; } .no-print { display: none; } }
          .header { text-align: center; margin-bottom: 20px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 10px 0 0 0; font-size: 12px; }
          .filters { margin-bottom: 20px; padding: 10px; background-color: #f3f4f6; border-radius: 8px; font-size: 12px; }
          .stats { display: flex; gap: 16px; margin-bottom: 20px; padding: 16px; background: #f9fafb; border-radius: 8px; }
          .stat-item { flex: 1; text-align: center; }
          .stat-label { font-size: 12px; color: #6b7280; }
          .stat-value { font-size: 20px; font-weight: bold; color: #667eea; }
          .stat-value.active { color: #10b981; }
          .stat-value.inactive { color: #f59e0b; }
          table { width: 100%; border-collapse: collapse; direction: rtl; }
          th { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; }
          td { padding: 8px; border: 1px solid #ddd; }
          .footer { text-align: center; margin-top: 20px; padding: 10px; font-size: 10px; color: #666; }
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
          <div class="stat-item"><div class="stat-value">${this.allTrainees.length}</div><div class="stat-label">إجمالي المتدربين</div></div>
          <div class="stat-item"><div class="stat-value active">${this.activeCount}</div><div class="stat-label">نشط</div></div>
          <div class="stat-item"><div class="stat-value inactive">${this.inactiveCount}</div><div class="stat-label">غير نشط</div></div>
        </div>
        <table>
          <thead>
            <tr><th>#</th><th>الاسم</th><th>رقم الهوية</th><th>السنة الدراسية</th><th>الجنس</th><th>الحالة</th></tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
        <div class="footer">تم التصدير من نظام إدارة الأكاديمية الأولمبية</div>
        <div class="no-print" style="text-align: center; margin-top: 20px; padding: 10px;">
          <button onclick="window.print();" style="padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 5px; cursor: pointer;">🖨️ طباعة / حفظ كـ PDF</button>
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
      setTimeout(() => { document.body.removeChild(printContainer); }, 500);
      this.isLoading = false;
      this.notification.showSuccess('تم فتح التقرير - يمكنك حفظه كـ PDF من نافذة الطباعة');
    }
  }
}