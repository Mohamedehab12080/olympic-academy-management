// shared/components/file-upload/file-upload.component.ts

import { Component, Input, Output, EventEmitter, forwardRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FileService } from '../../../core/services/file.service';
import { FileDomain ,FileVTO} from '../../../core/models/file.model';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  template: `
    <div class="file-upload-container">
      <div class="upload-area" 
           [class.drag-over]="dragOver"
           (dragover)="onDragOver($event)"
           (dragleave)="onDragLeave($event)"
           (drop)="onDrop($event)"
           (click)="fileInput.click()">
        
        <input type="file" 
               #fileInput 
               [accept]="acceptedTypes"
               (change)="onFileSelected($event)"
               style="display: none">
        
        <div *ngIf="!uploading && !fid">
          <mat-icon class="upload-icon">cloud_upload</mat-icon>
          <p>{{ label || 'اضغط أو اسحب الملف هنا للرفع' }}</p>
          <small *ngIf="acceptedTypes && acceptedTypes !== '*/*' && acceptedTypes !== ''">{{ acceptedTypesDisplay }}</small>
          <small *ngIf="maxSizeMB > 0">الحد الأقصى: {{ maxSizeMB }} MB</small>
        </div>

        <div *ngIf="uploading" class="upload-progress">
          <mat-icon>cloud_upload</mat-icon>
          <p>جاري الرفع... {{ uploadProgress }}%</p>
          <mat-progress-bar mode="determinate" [value]="uploadProgress"></mat-progress-bar>
        </div>

        <div *ngIf="fid && !uploading" class="uploaded-file">
          <mat-icon class="file-icon">{{ getFileIcon() }}</mat-icon>
          <div class="file-info">
            <p class="file-name">{{ fileName || getDefaultFileName() }}</p>
            <small class="file-size">{{ fileSize || '' }}</small>
            <small class="file-meta" *ngIf="showMetadata && fileMetadata">
              تم الرفع: {{ fileMetadata.createdOn | date:'dd/MM/yyyy' }}
              <span *ngIf="fileMetadata.extension"> | {{ fileMetadata.extension.toUpperCase() }}</span>
            </small>
          </div>
          <div class="file-actions">
            <button mat-icon-button type="button" (click)="previewFile($event)" matTooltip="معاينة">
              <mat-icon>visibility</mat-icon>
            </button>
            <button mat-icon-button type="button" (click)="removeFile($event)" matTooltip="حذف">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .file-upload-container {
      width: 100%;
    }
    .upload-area {
      border: 2px dashed #d1d5db;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #f9fafb;
    }
    .upload-area:hover {
      border-color: #667eea;
      background: #f3f4f6;
    }
    .upload-area.drag-over {
      border-color: #667eea;
      background: #eef2ff;
    }
    .upload-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #9ca3af;
      margin-bottom: 12px;
    }
    .upload-area p {
      margin: 8px 0;
      color: #374151;
    }
    .upload-area small {
      color: #6b7280;
      font-size: 12px;
    }
    .upload-progress {
      text-align: center;
    }
    .upload-progress mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #667eea;
      margin-bottom: 12px;
    }
    .uploaded-file {
      display: flex;
      align-items: center;
      gap: 16px;
      text-align: left;
    }
    .file-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
    }
    .file-info {
      flex: 1;
      text-align: left;
    }
    .file-name {
      margin: 0;
      font-weight: 500;
      color: #1f2937;
    }
    .file-size {
      color: #6b7280;
      font-size: 12px;
    }
    .file-meta {
      color: #9ca3af;
      font-size: 11px;
      display: block;
    }
    .file-actions {
      display: flex;
      gap: 8px;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor, OnInit {
  @Input() domainId!: FileDomain;
  @Input() label: string = '';
  @Input() acceptedTypes: string = '*/*'; // ✅ Change default to accept all
  @Input() maxSizeMB: number = 0; // ✅ Default to 0 = no limit
  @Input() showMetadata: boolean = true;
  @Output() fileUploaded = new EventEmitter<string>();
  @Output() fileRemoved = new EventEmitter<void>();
  @Output() metadataLoaded = new EventEmitter<FileVTO>();

  fid: string | null = null;
  fileName: string | null = null;
  fileSize: string | null = null;
  fileMetadata: FileVTO | null = null;
  uploading = false;
  uploadProgress = 0;
  dragOver = false;
  private previewUrl: string | null = null;

  private onChange: any = () => {};
  private onTouched: any = () => {};

  get acceptedTypesDisplay(): string {
    if (!this.acceptedTypes || this.acceptedTypes === '*/*') {
      return 'جميع أنواع الملفات';
    }
    const types = this.acceptedTypes.split(',');
    const display = types.map(t => {
      if (t.includes('image')) return 'صور';
      if (t.includes('pdf')) return 'PDF';
      return t;
    }).join('، ');
    return `الملفات المسموحة: ${display}`;
  }

  constructor(
    private fileService: FileService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    if (this.fid) {
      this.loadMetadata();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
      console.log('Domain ID being used:', this.domainId);
      this.uploadFile(file);
    }
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length) {
      const file = files[0];
      console.log('File dropped:', file.name, 'Size:', file.size, 'Type:', file.type);
      this.uploadFile(file);
    }
  }

  uploadFile(file: File): void {
    // ✅ SKIP ALL FRONTEND VALIDATIONS - Let backend handle everything
    // No file type validation
    // No file size validation
    
    this.uploading = true;
    this.uploadProgress = 0;
    this.fileName = file.name;
    this.fileSize = FileService.formatFileSize(file.size);

    console.log('Starting upload for domain:', this.domainId, 'File:', file.name);

    this.fileService.uploadFile(this.domainId, file, (progress) => {
      this.uploadProgress = progress;
      console.log('Upload progress:', progress + '%');
    }).subscribe({
      next: (response) => {
        console.log('Upload success, received FID:', response.fid);
        this.fid = response.fid;
        this.uploading = false;
        this.onChange(this.fid);
        this.fileUploaded.emit(this.fid);
        this.loadMetadata();
        this.notification.showSuccess('تم رفع الملف بنجاح');
      },
      error: (error) => {
        console.error('Upload error:', error);
        this.uploading = false;
        this.uploadProgress = 0;
        
        // Extract error message from backend ErrorVTO format
        let errorMessage = 'فشل رفع الملف';
        
        if (error.error) {
          if (error.error.messageEn) {
            errorMessage = error.error.messageEn;
          } else if (error.error.message) {
            errorMessage = error.error.message;
          } else if (typeof error.error === 'string') {
            try {
              const parsedError = JSON.parse(error.error);
              if (parsedError.messageEn) {
                errorMessage = parsedError.messageEn;
              } else if (parsedError.message) {
                errorMessage = parsedError.message;
              } else {
                errorMessage = error.error;
              }
            } catch (e) {
              errorMessage = error.error;
            }
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.notification.showError(errorMessage);
      }
    });
  }

  loadMetadata(): void {
    if (!this.fid) return;
    
    this.fileService.getFileMetadata(this.fid).subscribe({
      next: (metadata) => {
        console.log('File metadata loaded:', metadata);
        this.fileMetadata = metadata;
        if (!this.fileName && metadata.extension) {
          this.fileName = `file.${metadata.extension}`;
        }
        this.metadataLoaded.emit(metadata);
      },
      error: (error) => {
        console.error('Failed to load metadata:', error);
      }
    });
  }

  previewFile(event: Event): void {
    event.stopPropagation();
    if (this.fid) {
      this.fileService.openFileInNewTab(this.fid, this.fileName || undefined);
    }
  }

  removeFile(event: Event): void {
    event.stopPropagation();
    if (this.fid) {
      this.fileService.deleteFile(this.fid).subscribe({
        next: () => {
          this.clearFileData();
          this.onChange(null);
          this.fileRemoved.emit();
        },
        error: (error) => {
          console.error('Delete error:', error);
          let errorMessage = 'فشل حذف الملف';
          if (error.error?.messageEn) {
            errorMessage = error.error.messageEn;
          } else if (error.message) {
            errorMessage = error.message;
          }
          this.notification.showError(errorMessage);
        }
      });
    } else {
      this.clearFileData();
      this.onChange(null);
      this.fileRemoved.emit();
    }
  }

  private clearFileData(): void {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }
    this.fid = null;
    this.fileName = null;
    this.fileSize = null;
    this.fileMetadata = null;
  }

  getFileIcon(): string {
    if (this.fileMetadata?.extension) {
      return FileService.getFileIcon(this.fileMetadata.extension);
    }
    if (this.fileName) {
      const ext = FileService.getFileExtension(this.fileName);
      return FileService.getFileIcon(ext);
    }
    return 'insert_drive_file';
  }

  getDefaultFileName(): string {
    if (this.fileMetadata?.fid) {
      return `${this.fileMetadata.fid}.${this.fileMetadata.extension || 'file'}`;
    }
    return 'ملف';
  }

  // ControlValueAccessor methods
  writeValue(value: string): void {
    this.fid = value;
    if (value) {
      console.log('Received existing FID:', value);
      this.loadMetadata();
    } else {
      this.clearFileData();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handle disabled state if needed
  }
}