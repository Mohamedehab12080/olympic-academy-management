// core/services/api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpEventType, HttpEvent } from '@angular/common/http';
import { Observable, map, last } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    console.log('API Base URL:', this.baseUrl); // Debug: Check if baseUrl is correct
  }

  get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    const url = `${this.baseUrl}${endpoint}`;
    console.log('GET Request:', url); // Debug: Check the full URL
    return this.http.get<T>(url, { params: httpParams });
  }

  getBlob(endpoint: string, params?: any): Observable<Blob> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    const url = `${this.baseUrl}${endpoint}`;
    console.log('GET Blob Request:', url);
    return this.http.get(url, {
      params: httpParams,
      responseType: 'blob'
    });
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('POST Request:', url, data);
    return this.http.post<T>(url, data);
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('PUT Request:', url);
    return this.http.put<T>(url, data);
  }

  delete<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('DELETE Request:', url);
    return this.http.delete<T>(url);
  }

  /**
   * Upload file with progress tracking
   */
  uploadFile(endpoint: string, formData: FormData, onProgress?: (progress: number) => void): Observable<any> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    console.log('Upload File URL:', fullUrl);
    console.log('FormData contents:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    
    return this.http.post(fullUrl, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map((event: HttpEvent<any>) => {
        if (onProgress && event.type === HttpEventType.UploadProgress && event.total) {
          const progress = Math.round(100 * event.loaded / event.total);
          onProgress(progress);
          console.log('Upload progress:', progress + '%');
        }
        return event;
      }),
      last(),
      map((event: HttpEvent<any>) => {
        console.log('Upload complete, response:', event);
        return (event as any).body;
      })
    );
  }
}