import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CourseSessionDTO, CourseSessionVTO, CourseSessionResultSet } from '../models/employee.model';
import { NewRecordVTO } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class CourseSessionService {
  constructor(private api: ApiService) {}

  // Get all sessions by filter (across all courses)
  getAllSessionsByFilter(params?: any): Observable<CourseSessionResultSet> {
    return this.api.get('/courses/sessions', params);
  }

  // Get sessions for a specific course
  getAllCourseSessionsByFilter(courseId: number, params?: any): Observable<CourseSessionResultSet> {
    return this.api.get(`/courses/${courseId}/sessions`, params);
  }

  // Get session by ID
  getCourseSessionById(courseId: number, sessionId: number): Observable<CourseSessionVTO> {
    return this.api.get(`/courses/${courseId}/sessions/${sessionId}`);
  }

  // Create new session
  createCourseSession(courseId: number, data: CourseSessionDTO): Observable<NewRecordVTO> {
    return this.api.post(`/courses/${courseId}/sessions`, data);
  }

  // Update session
  updateCourseSession(courseId: number, sessionId: number, data: CourseSessionDTO): Observable<NewRecordVTO> {
    return this.api.put(`/courses/${courseId}/sessions/${sessionId}`, data);
  }

  // Delete session
  deleteCourseSession(courseId: number, sessionId: number): Observable<void> {
    return this.api.delete(`/courses/${courseId}/sessions/${sessionId}`);
  }
}