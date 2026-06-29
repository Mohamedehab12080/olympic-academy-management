// pages/constant-list/constant-list.component.ts
import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

import { ConstantService } from '../../../../core/services/constant.service';
import { ConstantListItem, ConstantFilterParams } from '../../../../core/models/constant.model';
import { ConstantModalComponent, ConstantModalData } from '../constant-modal/constant-modal.component';
import { ErrorVTO } from '../../../../core/models/common.model';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-constant-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatTooltipModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatDividerModule
  ],
  templateUrl: './constant-list.component.html',
  styleUrls: ['./constant-list.component.css']
})
export class ConstantListComponent implements OnInit, AfterViewInit {
  // Display columns
  displayedColumns: string[] = ['id', 'title', 'value', 'location', 'position', 'actions'];

  // Data
  dataSource = new MatTableDataSource<ConstantListItem>([]);
  constants: ConstantListItem[] = [];
  totalItems: number = 0;
  isLoading: boolean = false;

  // Filters
  filters: ConstantFilterParams = {
    pageNum: 0,
    pageSize: 25,
    orderBy: 'id',
    orderDir: 'ASC'
  };
  searchTerm: string = '';
  valueFilter: string = ''; // Value filter field
  pageSize: number = 25;

  // View children
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private constantService: ConstantService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadConstants();
  }

  ngAfterViewInit(): void {
    // Setup sorting
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.filters.orderBy = this.sort.active;
        this.filters.orderDir = this.sort.direction.toUpperCase() as 'ASC' | 'DESC';
        this.loadConstants();
      });
    }
  }

  // ==========================================================================
  // LOAD CONSTANTS
  // ==========================================================================

  loadConstants(): void {
    this.isLoading = true;
    this.constantService.getAllConstantsByFilter(this.filters).subscribe({
      next: (result) => {
        this.constants = result.items || [];
        this.totalItems = result.total || 0;
        this.dataSource.data = this.constants;
        this.isLoading = false;
        this.updatePaginator();
        this.cdr.detectChanges();
      },
      error: (err: ErrorVTO) => {
        console.error('Error loading constants:', err);
        this.notification.showError(err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updatePaginator(): void {
    if (this.paginator) {
      this.paginator.length = this.totalItems;
      this.paginator.pageIndex = this.filters.pageNum || 0;
      this.paginator.pageSize = this.filters.pageSize || 25;
    }
  }

  // ========== FILTERS ==========
  applyFilters(): void {
    // Set value filter
    if (this.valueFilter.trim()) {
      this.filters.value = this.valueFilter.trim();
    } else {
      delete this.filters.value;
    }
    
    // Set location filter
    if (this.filters.location && !this.filters.location.trim()) {
      delete this.filters.location;
    }
    
    // Set position filter
    if (this.filters.position && !this.filters.position.trim()) {
      delete this.filters.position;
    }
    
    this.filters.pageNum = 0;
    this.loadConstants();
  }

  applySearch(): void {
    if (this.searchTerm.trim()) {
      this.filters.quickSearch = this.searchTerm.trim();
    } else {
      delete this.filters.quickSearch;
    }
    this.filters.pageNum = 0;
    this.loadConstants();
  }

  // Apply filters on Enter key press - Fixed: accept Event type
  onFilterKeydown(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      event.preventDefault();
      this.applyFilters();
    }
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.valueFilter = '';
    this.filters = {
      pageNum: 0,
      pageSize: this.filters.pageSize || 25,
      orderBy: 'id',
      orderDir: 'ASC'
    };
    this.loadConstants();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  // ========== PAGINATION ==========
  onPageChange(event: any): void {
    this.filters.pageNum = event.pageIndex;
    this.filters.pageSize = event.pageSize;
    this.pageSize = event.pageSize;
    this.loadConstants();
  }

  // ========== MODALS ==========
  openCreateModal(): void {
    const dialogRef = this.dialog.open(ConstantModalComponent, {
      width: '580px',
      maxWidth: '95vw',
      disableClose: true,
      data: { mode: 'create' } as ConstantModalData
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createConstant(result);
      }
    });
  }

  openEditModal(constant: ConstantListItem): void {
    const dialogRef = this.dialog.open(ConstantModalComponent, {
      width: '580px',
      maxWidth: '95vw',
      disableClose: true,
      data: { 
        mode: 'edit',
        constant: constant
      } as ConstantModalData
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateConstant(constant.id, result);
      }
    });
  }

  // ========== CRUD OPERATIONS ==========
  createConstant(data: any): void {
    this.constantService.createConstant(data).subscribe({
      next: () => {
        this.notification.showSuccess('تم إضافة الثابت بنجاح');
        this.loadConstants();
      },
      error: (err: ErrorVTO) => {
        console.error('Error creating constant:', err);
        this.notification.showError(err);
      }
    });
  }

  updateConstant(id: number, data: any): void {
    this.constantService.updateConstantById(id, data).subscribe({
      next: () => {
        this.notification.showSuccess('تم تحديث الثابت بنجاح');
        this.loadConstants();
      },
      error: (err: ErrorVTO) => {
        console.error('Error updating constant:', err);
        this.notification.showError(err);
      }
    });
  }

  deleteConstant(id: number): void {
    const confirmDelete = confirm('هل أنت متأكد من حذف هذا الثابت؟');
    if (!confirmDelete) return;

    this.constantService.deleteConstantById(id).subscribe({
      next: () => {
        this.notification.showSuccess('تم حذف الثابت بنجاح');
        this.loadConstants();
      },
      error: (err: ErrorVTO) => {
        console.error('Error deleting constant:', err);
        this.notification.showError(err);
      }
    });
  }

  // ========== STATS HELPERS ==========
  getLocationCount(): number {
    const locations = new Set(this.constants.map(c => c.location).filter(Boolean));
    return locations.size;
  }

  getPositionCount(): number {
    const positions = new Set(this.constants.map(c => c.position).filter(Boolean));
    return positions.size;
  }
}