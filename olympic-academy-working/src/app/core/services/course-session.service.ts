// course-session.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CourseSessionDTO, CourseSessionVTO, CourseSessionResultSet } from '../models/employee.model';
import { NewRecordVTO } from '../models/common.model';

export interface CourseSessionFilterParams {
  quickSearch?: string;
  courseId?: number;
  trainerId?: number;
  trainersId?: number[];
  placeId?: number;
  status?: string;
  sessionDay?: string;
  sessionDateFrom?: string;
  sessionDateTo?: string;
  startTimeFrom?: string;
  startTimeTo?: string;
  endTimeFrom?: string;
  endTimeTo?: string;
  pageNum?: number;
  pageSize?: number;
  orderDir?: 'ASC' | 'DESC';
  orderBy?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CourseSessionService {
  constructor(private api: ApiService) {}

  /**
   * GET /courses/sessions
   * All sessions across all courses, with optional filters.
   */
  getAllSessionsByFilter(params?: CourseSessionFilterParams): Observable<CourseSessionResultSet> {
    return this.api.get('/courses/sessions', params);
  }

  /**
   * GET /courses/{courseId}/sessions
   * Sessions scoped to one course.
   */
  getAllCourseSessionsByFilter(courseId: number, params?: CourseSessionFilterParams): Observable<CourseSessionResultSet> {
    return this.api.get(`/courses/${courseId}/sessions`, params);
  }

  /**
   * GET /courses/course-session/{courseSessionId}
   * FIXED: backend declares courseSessionId as a @PathVariable on
   * "/courses/course-session", so the id must come AFTER the segment,
   * not before it.
   */
  getCourseSessionById(courseSessionId: number): Observable<CourseSessionVTO> {
    return this.api.get(`/courses/course-session/${courseSessionId}`);
  }

  /**
   * POST /courses/{courseId}/sessions
   */
  createCourseSession(courseId: number, data: CourseSessionDTO): Observable<NewRecordVTO[]> {
    return this.api.post(`/courses/${courseId}/sessions`, data);
  }

  /**
   * PUT /courses/course-session
   * No id in the path — the id travels inside the DTO body.
   */
  updateCourseSession(data: CourseSessionDTO): Observable<NewRecordVTO[]> {
    return this.api.put(`/courses/course-session`, data);
  }

  /**
   * DELETE /courses/course-session/{courseSessionId}
   * FIXED: same path-variable-order issue as getCourseSessionById.
   */
  deleteCourseSession(courseSessionId: number): Observable<void> {
    return this.api.delete(`/courses/course-session/${courseSessionId}`);
  }
}