// searchable-select.component.ts - COMPLETE PROFESSIONAL VERSION (FIXED)

import { Component, Input, forwardRef, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
  icon?: string;
  subLabel?: string;
  color?: string;
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
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableSelectComponent),
      multi: true
    }
  ],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ],
  template: `
    <div class="searchable-select-container" dir="rtl">
      <mat-form-field 
        appearance="outline" 
        class="full-width"
        [class.has-error]="hasError"
        [class.has-value]="hasValue"
        [class.disabled]="disabled">
        
        <mat-label>{{ label }}</mat-label>
        
        <mat-select
          #select
          [(ngModel)]="selectedValue"
          [multiple]="multiple"
          [required]="required"
          [disabled]="disabled"
          (selectionChange)="onSelectionChange($event)"
          (openedChange)="onOpenedChange($event)"
          panelClass="searchable-select-panel"
          [compareWith]="compareWith">
          
          <!-- Search Header -->
          <div class="search-select-header" (click)="$event.stopPropagation()">
            <div class="search-wrapper">
              <mat-icon class="search-icon">search</mat-icon>
              <input
                type="text"
                class="search-select-input"
                placeholder="بحث..."
                [(ngModel)]="searchTerm"
                (ngModelChange)="filterOptions()"
                (click)="$event.stopPropagation()"
                (keydown)="$event.stopPropagation()"
                autocomplete="off">
              <button 
                *ngIf="searchTerm" 
                class="clear-search-btn" 
                (click)="clearSearch($event)"
                matTooltip="مسح البحث">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <div class="search-stats" *ngIf="showStats">
              <span>{{ filteredOptions.length }}</span>
              <span>نتيجة</span>
            </div>
          </div>
          
          <!-- Loading State -->
          <mat-option *ngIf="isLoading" disabled class="loading-option">
            <div class="loading-container">
              <mat-spinner diameter="24"></mat-spinner>
              <span>جاري التحميل...</span>
            </div>
          </mat-option>
          
          <!-- Options -->
          <div class="options-scroll-container" *ngIf="!isLoading">
            <mat-option 
              *ngFor="let option of filteredOptions" 
              [value]="option.value" 
              [disabled]="option.disabled"
              (click)="$event.stopPropagation()"
              [class.selected-option]="isSelected(option.value)"
              [class.disabled-option]="option.disabled"
              @fadeInOut>
              
              <div class="option-content">
                <mat-icon *ngIf="option.icon" class="option-icon">{{ option.icon }}</mat-icon>
                <div class="option-text-wrapper">
                  <span class="option-text">{{ option.label }}</span>
                  <span class="option-sub-label" *ngIf="option.subLabel">{{ option.subLabel }}</span>
                </div>
                <span class="check-mark" *ngIf="isSelected(option.value)">✓</span>
                <span class="option-color-indicator" *ngIf="option.color" [style.background-color]="option.color"></span>
              </div>
            </mat-option>
          </div>
          
          <!-- No Results -->
          <mat-option *ngIf="filteredOptions.length === 0 && searchTerm && !isLoading" disabled class="no-results">
            <div class="no-results-content">
              <mat-icon>search_off</mat-icon>
              <span>لا توجد نتائج لـ "{{ searchTerm }}"</span>
            </div>
          </mat-option>
          
          <!-- No Options -->
          <mat-option *ngIf="options.length === 0 && !isLoading" disabled class="no-options">
            <div class="no-options-content">
              <mat-icon>info</mat-icon>
              <span>لا توجد خيارات متاحة</span>
            </div>
          </mat-option>
        </mat-select>
        
        <!-- Clear Button -->
        <button 
          *ngIf="clearable && hasValue && !disabled" 
          mat-icon-button 
          matSuffix 
          class="clear-button"
          (click)="clearSelection($event)"
          matTooltip="مسح التحديد">
          <mat-icon>close</mat-icon>
        </button>
        
        <!-- Error Messages -->
        <mat-error *ngIf="hasError && errorMessage">
          {{ errorMessage }}
        </mat-error>
        <mat-error *ngIf="hasError && !errorMessage">
          {{ required ? 'هذا الحقل مطلوب' : 'قيمة غير صالحة' }}
        </mat-error>
        
        <!-- Hint -->
        <mat-hint *ngIf="hint" class="hint-text">
          <mat-icon *ngIf="hintIcon">{{ hintIcon }}</mat-icon>
          {{ hint }}
        </mat-hint>
      </mat-form-field>
    </div>
  `,
  styles: [`
    .searchable-select-container {
      width: 100%;
      position: relative;
    }

    .full-width {
      width: 100%;
    }

    /* ========== SEARCH HEADER ========== */
    .search-select-header {
      position: sticky;
      top: 0;
      background: white;
      z-index: 10;
      padding: 8px 12px 6px 12px;
      border-bottom: 1px solid #e5e7eb;
      margin-bottom: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
    }

    .search-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      transition: all 0.2s;
    }

    .search-wrapper:focus-within {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.12);
      background: white;
    }

    .search-icon {
      position: absolute;
      right: 10px;
      color: #94a3b8;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .search-select-input {
      width: 100%;
      padding: 8px 36px 8px 12px;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      background: transparent;
      color: #1e293b;
      direction: rtl;
      outline: none;
      font-family: inherit;
    }

    .search-select-input::placeholder {
      color: #94a3b8;
    }

    .clear-search-btn {
      position: absolute;
      left: 6px;
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      border-radius: 50%;
      transition: all 0.2s;
    }

    .clear-search-btn:hover {
      background: #f1f5f9;
      color: #64748b;
    }

    .clear-search-btn mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .search-stats {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: #94a3b8;
      padding: 0 8px;
      white-space: nowrap;
    }

    .search-stats span:first-child {
      font-weight: 600;
      color: #64748b;
    }

    /* ========== OPTIONS SCROLL CONTAINER ========== */
    .options-scroll-container {
      max-height: 260px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .options-scroll-container::-webkit-scrollbar {
      width: 5px;
    }

    .options-scroll-container::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }

    .options-scroll-container::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
      transition: background 0.2s;
    }

    .options-scroll-container::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    /* ========== OPTION STYLES ========== */
    .option-content {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 2px 0;
    }

    .option-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #64748b;
    }

    .option-text-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1px;
      min-width: 0;
    }

    .option-text {
      font-size: 13px;
      color: #1e293b;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .option-sub-label {
      font-size: 11px;
      color: #94a3b8;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .check-mark {
      color: #667eea;
      font-weight: 700;
      font-size: 16px;
      flex-shrink: 0;
    }

    .option-color-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex-shrink: 0;
      border: 1px solid rgba(0, 0, 0, 0.06);
    }

    /* ========== SELECTED OPTION ========== */
    .selected-option {
      background-color: #eff6ff !important;
    }

    .selected-option .option-text {
      color: #667eea !important;
    }

    /* ========== DISABLED OPTION ========== */
    .disabled-option {
      opacity: 0.5;
      cursor: not-allowed !important;
    }

    /* ========== LOADING STATE ========== */
    .loading-option {
      padding: 16px !important;
    }

    .loading-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      width: 100%;
      color: #64748b;
      font-size: 13px;
    }

    /* ========== NO RESULTS ========== */
    .no-results,
    .no-options {
      padding: 20px !important;
    }

    .no-results-content,
    .no-options-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      color: #94a3b8;
      font-size: 13px;
    }

    .no-results-content mat-icon,
    .no-options-content mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    /* ========== CLEAR BUTTON ========== */
    .clear-button {
      position: absolute;
      left: 4px;
      top: 50%;
      transform: translateY(-50%);
      width: 28px;
      height: 28px;
      line-height: 28px;
      color: #94a3b8;
      transition: all 0.2s;
      z-index: 1;
    }

    .clear-button:hover {
      color: #ef4444;
      transform: translateY(-50%) scale(1.1);
    }

    .clear-button mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* ========== FORM FIELD STATES ========== */
    .has-error .mat-form-field-outline {
      color: #ef4444 !important;
    }

    .has-value .mat-form-field-label {
      color: #667eea !important;
    }

    .disabled {
      opacity: 0.6;
    }

    /* ========== HINT STYLES ========== */
    .hint-text {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: #94a3b8;
    }

    .hint-text mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    /* ========== DROPDOWN PANEL OVERRIDES ========== */
    ::ng-deep .searchable-select-panel {
      margin-top: 30px !important;
      max-height: 400px !important;
      border-radius: 12px !important;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12) !important;
      overflow: hidden !important;
    }

    ::ng-deep .searchable-select-panel .mat-select-content {
      padding: 0 !important;
    }

    ::ng-deep .searchable-select-panel .mat-option {
      line-height: 2.8 !important;
      height: auto !important;
      min-height: 48px !important;
      padding: 0 16px !important;
      border-bottom: 1px solid #f1f5f9 !important;
      transition: background 0.15s !important;
    }

    ::ng-deep .searchable-select-panel .mat-option:last-child {
      border-bottom: none !important;
    }

    ::ng-deep .searchable-select-panel .mat-option:hover:not(.mat-option-disabled):not(.selected-option) {
      background-color: #f8fafc !important;
    }

    ::ng-deep .searchable-select-panel .mat-option.mat-selected {
      background-color: #eff6ff !important;
    }

    ::ng-deep .searchable-select-panel .mat-option.mat-selected .option-text {
      color: #667eea !important;
    }

    /* ========== RESPONSIVE ========== */
    @media (max-width: 768px) {
      .search-select-header {
        padding: 6px 8px 4px 8px;
      }

      .search-select-input {
        font-size: 12px;
        padding: 6px 32px 6px 8px;
      }

      .option-text {
        font-size: 12px;
      }

      .option-sub-label {
        font-size: 10px;
      }

      ::ng-deep .searchable-select-panel {
        max-height: 320px !important;
      }

      .options-scroll-container {
        max-height: 200px;
      }
    }

    @media (max-width: 480px) {
      ::ng-deep .searchable-select-panel {
        max-height: 280px !important;
        border-radius: 8px !important;
      }

      .options-scroll-container {
        max-height: 160px;
      }

      .search-stats {
        font-size: 10px;
      }
    }
  `]
})
export class SearchableSelectComponent implements ControlValueAccessor, OnInit, OnChanges, AfterViewInit {
  @Input() label: string = '';
  @Input() placeholder: string = 'بحث...';
  @Input() options: SelectOption[] = [];
  @Input() multiple: boolean = false;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() clearable: boolean = true;
  @Input() showStats: boolean = true;
  @Input() isLoading: boolean = false;
  @Input() hint: string = '';
  @Input() hintIcon: string = '';
  @Input() errorMessage: string = '';
  @Input() hasError: boolean = false;
  @Input() maxDisplayItems: number = 1000;
  @Input() compareWith: (val1: any, val2: any) => boolean = (val1, val2) => val1 === val2;
  
  @Output() searchChange = new EventEmitter<string>();
  @Output() openedChange = new EventEmitter<boolean>();
  @Output() selectionChange = new EventEmitter<any>();
  @Output() clear = new EventEmitter<void>();
  
  @ViewChild('select') select!: any;
  
  selectedValue: any = null;
  searchTerm: string = '';
  filteredOptions: SelectOption[] = [];
  isOpen: boolean = false;
  
  private onChange: any = () => {};
  private onTouched: any = () => {};

  constructor() {}

  ngOnInit() {
    this.filteredOptions = [...this.options];
  }

  ngAfterViewInit() {
    // Any post-view initialization
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
      this.filteredOptions = [...this.options];
      this.filterOptions();
    }
    if (changes['isLoading'] && !this.isLoading) {
      // Re-filter when loading completes
      this.filterOptions();
    }
  }

  get hasValue(): boolean {
    if (this.multiple && Array.isArray(this.selectedValue)) {
      return this.selectedValue.length > 0;
    }
    return this.selectedValue !== null && this.selectedValue !== undefined && this.selectedValue !== '';
  }

  filterOptions() {
    this.searchChange.emit(this.searchTerm);
    
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredOptions = [...this.options];
    } else {
      const term = this.searchTerm.trim().toLowerCase();
      this.filteredOptions = this.options.filter(option => {
        const label = option.label ? option.label.toLowerCase() : '';
        const subLabel = option.subLabel ? option.subLabel.toLowerCase() : '';
        return label.includes(term) || subLabel.includes(term);
      });
    }
    
    // Apply max display limit
    if (this.filteredOptions.length > this.maxDisplayItems) {
      this.filteredOptions = this.filteredOptions.slice(0, this.maxDisplayItems);
    }
  }

  isSelected(value: any): boolean {
    if (this.multiple && Array.isArray(this.selectedValue)) {
      return this.selectedValue.some(v => this.compareWith(v, value));
    }
    return this.compareWith(this.selectedValue, value);
  }

  onSelectionChange(event: any) {
    const value = event.value;
    
    if (value === null || value === undefined || value === 'null' || value === '') {
      this.selectedValue = null;
    } else {
      this.selectedValue = value;
    }
    
    this.onChange(this.selectedValue);
    this.onTouched();
    this.selectionChange.emit(this.selectedValue);
  }

  onOpenedChange(isOpen: boolean) {
    this.isOpen = isOpen;
    if (isOpen) {
      this.filterOptions();
      // Reset search when opening
      this.searchTerm = '';
      this.filterOptions();
    }
    this.openedChange.emit(isOpen);
  }

  clearSelection(event: Event) {
    event.stopPropagation();
    this.selectedValue = null;
    this.onChange(null);
    this.onTouched();
    this.clear.emit();
    
    // Update the select
    if (this.select) {
      this.select.writeValue(null);
    }
  }

  clearSearch(event: Event) {
    event.stopPropagation();
    this.searchTerm = '';
    this.filterOptions();
    // Focus the input - Fixed version
    const target = event.target as HTMLElement;
    if (target) {
      const wrapper = target.closest('.search-wrapper');
      if (wrapper) {
        const input = wrapper.querySelector('input');
        if (input) {
          setTimeout(() => input.focus(), 50);
        }
      }
    }
  }

  writeValue(value: any): void {
    if (value === null || value === undefined || value === 'null' || value === '') {
      this.selectedValue = null;
    } else {
      this.selectedValue = value;
    }
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