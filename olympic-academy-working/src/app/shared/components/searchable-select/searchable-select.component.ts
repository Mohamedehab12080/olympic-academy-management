import { Component, Input, forwardRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  value: any;
  label: string;
}

@Component({
  selector: 'app-searchable-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableSelectComponent),
      multi: true
    }
  ],
  template: `
    <mat-form-field appearance="outline" class="full-width" dir="rtl">
      <mat-label>{{ label }}</mat-label>
      <mat-select
        [(ngModel)]="value"
        [multiple]="multiple"
        [required]="required"
        [disabled]="disabled"
        (selectionChange)="onSelectionChange($event)"
        panelClass="searchable-select-panel">
        
        <!-- Search Header -->
        <div class="search-select-header" (click)="$event.stopPropagation()">
          <div class="search-relative">
            <input
              type="text"
              class="search-select-input"
              placeholder="🔍 ابحث..."
              [(ngModel)]="searchTerm"
              (ngModelChange)="filterOptions()"
              (click)="$event.stopPropagation()">
          </div>
        </div>
        
        <!-- Options - بدون checkbox -->
        <mat-option 
          *ngFor="let option of filteredOptions" 
          [value]="option.value" 
          (click)="$event.stopPropagation()"
          [class.selected-option]="isSelected(option.value)">
          <span class="option-text">{{ option.label }}</span>
          <span class="check-mark" *ngIf="isSelected(option.value)">✓</span>
        </mat-option>
        
        <!-- No Results -->
        <mat-option *ngIf="filteredOptions.length === 0 && searchTerm" disabled>
          لا توجد نتائج مطابقة لـ "{{ searchTerm }}"
        </mat-option>
        
        <!-- No Options -->
        <mat-option *ngIf="options.length === 0" disabled>
          لا توجد خيارات متاحة
        </mat-option>
      </mat-select>
    </mat-form-field>
  `,
  styles: [`
    .full-width { width: 100%; }
    .search-select-header {
      position: sticky;
      top: 0;
      background: white;
      z-index: 10;
      padding: 8px 12px;
      border-bottom: 1px solid #e5e7eb;
      margin-bottom: 4px;
    }
    .search-select-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      box-sizing: border-box;
      direction: rtl;
    }
    .search-select-input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
    }
    .search-relative { position: relative; }
    ::ng-deep .searchable-select-panel { margin-top: 30px !important; }
    
    .selected-option {
      background-color: #eff6ff !important;
      color: #2563eb !important;
    }
    
    .option-text {
      flex: 1;
    }
    
    .check-mark {
      color: #2563eb;
      font-weight: bold;
      margin-right: 8px;
    }
  `]
})
export class SearchableSelectComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() label: string = '';
  @Input() options: SelectOption[] = [];
  @Input() multiple: boolean = false;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  
  value: any = null;
  searchTerm: string = '';
  filteredOptions: SelectOption[] = [];
  
  private onChange: any = () => {};
  private onTouched: any = () => {};

  ngOnInit() {
    this.filteredOptions = [...this.options];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
      this.filteredOptions = [...this.options];
      this.filterOptions();
    }
  }

  filterOptions() {
    if (!this.searchTerm) {
      this.filteredOptions = [...this.options];
    } else {
      this.filteredOptions = this.options.filter(option =>
        option.label.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  isSelected(value: any): boolean {
    if (this.multiple && Array.isArray(this.value)) {
      return this.value.includes(value);
    }
    return this.value === value;
  }

  onSelectionChange(event: any) {
    this.value = event.value;
    this.onChange(this.value);
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}