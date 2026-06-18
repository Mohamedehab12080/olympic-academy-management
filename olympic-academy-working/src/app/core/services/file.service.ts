// core/services/file.service.ts

import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { NotificationService } from './notification.service';
import { 
  UploadFileResponse, 
  FileVTO, 
  FileDomain 
} from '../models/file.model';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private api = inject(ApiService);
  private notification = inject(NotificationService);

  /**
   * Upload a file to a specific domain (with progress callback)
   * @param domainId Domain ID (5002=TRAINEE, 5003=CERTIFICATE, etc.)
   * @param file The file to upload
   * @param onProgress Optional progress callback
   * @returns Observable with UploadFileResponse containing the fid
   */
    uploadFile(domainId: FileDomain, file: File, onProgress?: (progress: number) => void): Observable<UploadFileResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    console.log('FileService - Uploading to domain:', domainId);
    console.log('FileService - File details:', { name: file.name, size: file.size, type: file.type });
    console.log('FileService - Full endpoint:', `/domains/${domainId}/upload`);

    return this.api.uploadFile(`/domains/${domainId}/upload`, formData, onProgress).pipe(
        map((response: any) => {
        console.log('FileService - Upload response:', response);
        return response as UploadFileResponse;
        })
    );
    }

  /**
   * Upload file without progress tracking
   */
  uploadFileSimple(domainId: FileDomain, file: File): Observable<UploadFileResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.post<UploadFileResponse>(`/domains/${domainId}/upload`, formData);
  }

  /**
   * Download a file by its FID (returns blob)
   * @param fid File identifier (15 or 18 digits)
   */
  downloadFile(fid: string): Observable<Blob> {
    return this.api.getBlob(`/files/${fid}/download`);
  }

  /**
   * Get file metadata by FID
   * @param fid File identifier (15 or 18 digits)
   */
  getFileMetadata(fid: string): Observable<FileVTO> {
    return this.api.get<FileVTO>(`/files/${fid}`);
  }

  /**
   * Delete a file by FID
   * @param fid File identifier (15 or 18 digits)
   */
  deleteFile(fid: string): Observable<void> {
    return this.api.delete<void>(`/files/${fid}`).pipe(
      map(() => {
        this.notification.showSuccess('تم حذف الملف بنجاح');
      })
    );
  }

  /**
   * Upload a new version of an existing file
   * @param fid Base file identifier (15 digits)
   * @param file New version file
   * @param onProgress Optional progress callback
   */
  uploadNewVersion(fid: string, file: File, onProgress?: (progress: number) => void): Observable<UploadFileResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.api.uploadFile(`/files/${fid}/versions/upload`, formData, onProgress).pipe(
      map((response: any) => response as UploadFileResponse)
    );
  }

  /**
   * Get all versions of a file
   * @param fid Base file identifier (15 digits)
   */
  getAllVersions(fid: string): Observable<FileVTO[]> {
    // Extract base FID (first 15 digits) if 18-digit FID provided
    const baseFid = fid.length === 18 ? fid.substring(0, 15) : fid;
    return this.api.get<FileVTO[]>(`/files/${baseFid}/versions`);
  }

  /**
   * Get file preview URL for displaying in img src
   * Note: This creates a blob URL that needs to be revoked
   */
  getFilePreviewUrl(fid: string): Observable<string> {
    return this.downloadFile(fid).pipe(
      map(blob => URL.createObjectURL(blob))
    );
  }

  /**
   * Open file in new tab
   */
  openFileInNewTab(fid: string, fileName?: string): void {
    this.downloadFile(fid).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 100);
      },
      error: (error) => {
        console.error('Open file error:', error);
        this.notification.showError('لا يمكن فتح الملف');
      }
    });
  }

  /**
   * Download and save file to disk
   */
  saveFile(fid: string, fileName: string): void {
    this.downloadFile(fid).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.notification.showSuccess('تم تحميل الملف بنجاح');
      },
      error: (error) => {
        console.error('Save file error:', error);
        this.notification.showError('فشل تحميل الملف');
      }
    });
  }

  // ==================== Helper Methods ====================

  /**
   * Validate file type
   */
  static isValidFileType(file: File, allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']): boolean {
    return allowedTypes.includes(file.type);
  }

  /**
   * Validate file size (max size in MB)
   */
  static isValidFileSize(file: File, maxSizeMB: number = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  /**
   * Get file extension
   */
  static getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get icon name based on file extension
   */
  static getFileIcon(extension: string): string {
    const ext = extension.toLowerCase();
    if (ext === 'pdf') return 'picture_as_pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext)) return 'image';
    if (['doc', 'docx'].includes(ext)) return 'description';
    if (['xls', 'xlsx', 'csv'].includes(ext)) return 'table_chart';
    if (['ppt', 'pptx'].includes(ext)) return 'slideshow';
    if (['txt', 'rtf'].includes(ext)) return 'article';
    if (['zip', 'rar', '7z'].includes(ext)) return 'folder_zip';
    return 'insert_drive_file';
  }

  /**
   * Check if FID is valid (15 or 18 digits)
   */
  static isValidFid(fid: string): boolean {
    return /^\d{15}(\d{3})?$/.test(fid);
  }

  /**
   * Extract base FID (first 15 digits) from 18-digit FID
   */
  static getBaseFid(fid: string): string {
    return fid.length === 18 ? fid.substring(0, 15) : fid;
  }
}