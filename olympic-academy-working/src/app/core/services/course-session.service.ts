// course-session.service.ts

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

  // Get all sessions by filter
  getAllSessionsByFilter(params?: any): Observable<CourseSessionResultSet> {
    return this.api.get('/courses/sessions', params);
  }

  // Get sessions for a specific course
  getAllCourseSessionsByFilter(courseId: number, params?: any): Observable<CourseSessionResultSet> {
    return this.api.get(`/courses/${courseId}/sessions`, params);
  }

  // Get session by ID - FIXED: courseId is required in the path
  getCourseSessionById(courseSessionId: number): Observable<CourseSessionVTO> {
    return this.api.get(`/courses/${courseSessionId}/course-session`);
  }

  // Create new session
  createCourseSession(courseId: number, data: CourseSessionDTO): Observable<NewRecordVTO[]> {
    return this.api.post(`/courses/${courseId}/sessions`, data);
  }

  // Update session
  updateCourseSession(courseSessionId: number, data: CourseSessionDTO): Observable<NewRecordVTO[]> {
    return this.api.put(`/courses/${courseSessionId}/course-session`, data);
  }

  // Delete session - FIXED: courseId and sessionId are in the path
  deleteCourseSession(courseSessionId: number): Observable<void> {
    return this.api.delete(`/courses/${courseSessionId}/course-session`);
  }
}