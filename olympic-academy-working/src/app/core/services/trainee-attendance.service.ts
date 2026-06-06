import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  TraineeAttendanceDTO,
  TraineeAttendanceResultSet,
  TraineeAttendanceVTO,
  DailyAttendanceReport,
  SessionAttendanceReport
} from '../models/trainee-attendance.model';
import { LookupResultSet } from '../../core/models/common.model';

@Injectable({
  providedIn: 'root'
})
export class TraineeAttendanceService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // الحصول على حالات الحضور للـ Lookup
  getAttendanceStatusLookup(): Observable<LookupResultSet> {
    return this.http.get<LookupResultSet>(`${this.apiUrl}/lookup/trainee/attendance/status`);
  }

  // إنشاء سجل حضور
  createAttendance(data: TraineeAttendanceDTO): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${this.apiUrl}/trainee-attendances`, data);
  }

  // إنشاء سجلات حضور جماعية
  batchCreateAttendance(data: TraineeAttendanceDTO[]): Observable<{ id: number }[]> {
    return this.http.post<{ id: number }[]>(`${this.apiUrl}/trainee-attendances/batch`, data);
  }

  // الحصول على جميع سجلات الحضور مع فلترة
  getAllAttendances(params?: {
    traineeId?: number;
    courseId?: number;
    courseSessionId?: number;
    status?: number;
    checkInFrom?: string;
    checkInTo?: string;
    checkOutFrom?: string;
    checkOutTo?: string;
    fromDate?: string;
    toDate?: string;
    pageNum?: number;
    pageSize?: number;
    orderDir?: string;
    orderBy?: string;
  }): Observable<TraineeAttendanceResultSet> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof typeof params];
        if (value !== null && value !== undefined) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }
    return this.http.get<TraineeAttendanceResultSet>(`${this.apiUrl}/trainee-attendances`, { params: httpParams });
  }

  // الحصول على سجل حضور بالمعرف
  getAttendanceById(id: number): Observable<TraineeAttendanceVTO> {
    return this.http.get<TraineeAttendanceVTO>(`${this.apiUrl}/trainee-attendances/${id}`);
  }

  // تحديث سجل حضور
  updateAttendance(id: number, data: TraineeAttendanceDTO): Observable<{ id: number }> {
    return this.http.put<{ id: number }>(`${this.apiUrl}/trainee-attendances/${id}`, data);
  }

  // حذف سجل حضور
  deleteAttendance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/trainee-attendances/${id}`);
  }

  // تقرير الحضور اليومي
  getDailyAttendanceReport(attendanceDate: string): Observable<DailyAttendanceReport> {
    return this.http.get<DailyAttendanceReport>(`${this.apiUrl}/trainees/attendances/reports/daily`, {
      params: { attendanceDate }
    });
  }

  // تقرير حضور جلسة محددة
  getSessionAttendanceReport(sessionId: number): Observable<SessionAttendanceReport> {
    return this.http.get<SessionAttendanceReport>(`${this.apiUrl}/trainee-attendances/session/${sessionId}/report`);
  }
}