import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FinancialService } from '../../../../../../core/services/financial.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { SALARY_TYPES } from '../../../../../../core/models/common.model';

@Component({
  selector: 'app-salary-deduction-list',
  standalone: false,
  template: `
    <div class="container">
      <div class="header">
        <h1>خصومات الموظفين</h1>
        <button mat-raised-button color="primary" routerLink="/financial/salary-deductions/new">
          <mat-icon>add</mat-icon> خصم جديد
        </button>
      </div>

      <mat-card>
        <div class="filters">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>بحث</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="ابحث عن موظف أو سبب">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>نوع الراتب</mat-label>
            <mat-select (selectionChange)="filterBySalaryType($event.value)">
              <mat-option [value]="null">الكل</mat-option>
              <mat-option *ngFor="let type of salaryTypes" [value]="type.id">{{ type.title }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>من تاريخ</mat-label>
            <input matInput [matDatepicker]="fromPicker" [(ngModel)]="dateFrom" (dateChange)="filterByDate()">
            <mat-datepicker-toggle matSuffix [for]="fromPicker"></mat-datepicker-toggle>
            <mat-datepicker #fromPicker></mat-datepicker>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>إلى تاريخ</mat-label>
            <input matInput [matDatepicker]="toPicker" [(ngModel)]="dateTo" (dateChange)="filterByDate()">
            <mat-datepicker-toggle matSuffix [for]="toPicker"></mat-datepicker-toggle>
            <mat-datepicker #toPicker></mat-datepicker>
          </mat-form-field>
        </div>

        <div class="table-container">
          <table mat-table [dataSource]="dataSource" matSort>
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>#</th>
              <td mat-cell *matCellDef="let item">{{ item.id }}</td>
            </ng-container>

            <ng-container matColumnDef="employee">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>الموظف</th>
              <td mat-cell *matCellDef="let item">{{ item.employee?.title }}</td>
            </ng-container>

            <ng-container matColumnDef="amountDeducted">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>المبلغ</th>
              <td mat-cell *matCellDef="let item">{{ item.amountDeducted | currency:'SAR ' }}</td>
            </ng-container>

            <ng-container matColumnDef="deductionDate">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>تاريخ الخصم</th>
              <td mat-cell *matCellDef="let item">{{ item.deductionDate | date }}</td>
            </ng-container>

            <ng-container matColumnDef="reason">
              <th mat-header-cell *matHeaderCellDef>السبب</th>
              <td mat-cell *matCellDef="let item">{{ item.reason || '-' }}</td>
            </ng-container>

            <ng-container matColumnDef="salaryType">
              <th mat-header-cell *matHeaderCellDef>نوع الراتب</th>
              <td mat-cell *matCellDef="let item">{{ item.salaryType?.title || '-' }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>الإجراءات</th>
              <td mat-cell *matCellDef="let item">
                <button mat-icon-button color="primary" [routerLink]="['/financial/salary-deductions', item.id, 'edit']">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteItem(item)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          <mat-paginator [pageSize]="10" [pageSizeOptions]="[5,10,25,50]" showFirstLastButtons></mat-paginator>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { padding: 24px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .filters { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 20px; }
    .filters mat-form-field { flex: 1; min-width: 150px; }
    .search-field { flex: 2; }
    .table-container { overflow-x: auto; }
  `]
})
export class SalaryDeductionListComponent implements OnInit {
  displayedColumns = ['id', 'employee', 'amountDeducted', 'deductionDate', 'reason', 'salaryType', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  salaryTypes = SALARY_TYPES;
  dateFrom: string = '';
  dateTo: string = '';
  allData: any[] = [];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private financialService: FinancialService,
    private notification: NotificationService
  ) {}

  ngOnInit() { this.loadData(); }
  
  ngAfterViewInit() { 
    this.dataSource.paginator = this.paginator; 
    this.dataSource.sort = this.sort; 
  }

  loadData() {
    this.financialService.getAllSalaryDeductionsByFilter().subscribe({
      next: (res: any) => { 
        this.allData = res.items; 
        this.dataSource.data = this.allData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => { this.notification.showError('حدث خطأ في تحميل البيانات'); }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterBySalaryType(salaryTypeId: number | null) {
    if (salaryTypeId) {
      this.financialService.getAllSalaryDeductionsByFilter({ salaryType: salaryTypeId }).subscribe({
        next: (res: any) => { this.dataSource.data = res.items; },
        error: () => { this.notification.showError('حدث خطأ'); }
      });
    } else {
      this.loadData();
    }
  }

  filterByDate() {
    const params: any = {};
    if (this.dateFrom) params.deductionDateFrom = this.dateFrom;
    if (this.dateTo) params.deductionDateTo = this.dateTo;
    
    if (this.dateFrom || this.dateTo) {
      this.financialService.getAllSalaryDeductionsByFilter(params).subscribe({
        next: (res: any) => { this.dataSource.data = res.items; },
        error: () => { this.notification.showError('حدث خطأ'); }
      });
    } else {
      this.loadData();
    }
  }

  deleteItem(item: any) {
    if (confirm(`هل أنت متأكد من حذف خصم الموظف "${item.employee?.title}"؟`)) {
      this.financialService.deleteSalaryDeduction(item.id).subscribe({
        next: () => { 
          this.notification.showSuccess('تم الحذف بنجاح'); 
          this.loadData(); 
        },
        error: () => { this.notification.showError('حدث خطأ في الحذف'); }
      });
    }
  }
}