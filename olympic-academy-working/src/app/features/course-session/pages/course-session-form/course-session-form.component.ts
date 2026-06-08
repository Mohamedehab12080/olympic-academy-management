import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CourseSessionService } from '../../../../core/services/course-session.service';
import { CourseService } from '../../../../core/services/course.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { PlaceService } from '../../../../core/services/place.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';
import { SESSION_STATUSES } from '../../../../core/models/employee.model';

@Component({
  selector: 'app-course-session-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    SearchableSelectComponent
  ],
  templateUrl: './course-session-form.component.html',
  styleUrls: ['./course-session-form.component.css']
})
export class CourseSessionFormComponent implements OnInit {
  sessionForm: FormGroup;
  isEditMode = false;
  sessionId?: number;
  courseId?: number;
  isLoading = false;

  courses: any[] = [];
  trainers: any[] = [];
  places: any[] = [];
  sessionStatuses = SESSION_STATUSES;

  // Options for searchable selects
  courseOptions: SelectOption[] = [];
  trainerOptions: SelectOption[] = [];
  placeOptions: SelectOption[] = [];
  statusOptions: SelectOption[] = [];

  constructor(
    private fb: FormBuilder,
    private sessionService: CourseSessionService,
    private courseService: CourseService,
    private employeeService: EmployeeService,
    private placeService: PlaceService,
    private notification: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.sessionForm = this.fb.group({
      title: ['', Validators.required],
      courseId: [null, Validators.required],
      trainerId: [null, Validators.required],
      placeId: [null, Validators.required],
      sessionDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      status: [null],
      note: ['']
    });
  }

  ngOnInit(): void {
    this.loadSelectOptions();
    this.loadLookupData();
    
    this.sessionId = this.route.snapshot.params['id'];
    if (this.sessionId) {
      this.isEditMode = true;
      this.loadSession();
    }
  }

  loadSelectOptions(): void {
    this.statusOptions = this.sessionStatuses.map(s => ({ value: s, label: s.title }));
  }

  loadLookupData(): void {
    // Load courses
    this.courseService.getAllCourses().subscribe({
      next: (res: any) => {
        this.courses = res.items || [];
        this.courseOptions = this.courses.map(c => ({ value: c.id, label: c.title }));
      },
      error: () => this.notification.showError('حدث خطأ في تحميل الدورات')
    });

    // Load trainers
    this.employeeService.getAllTrainersLookup().subscribe({
      next: (res: any) => {
        this.trainers = res.list || [];
        this.trainerOptions = this.trainers.map(t => ({ value: t.id, label: t.title }));
      },
      error: () => this.notification.showError('حدث خطأ في تحميل المدربين')
    });

    // Load places
    this.placeService.getAllPlacesLookup().subscribe({
      next: (res: any) => {
        this.places = res.list || [];
        this.placeOptions = this.places.map(p => ({ value: p.id, label: p.title }));
      },
      error: () => this.notification.showError('حدث خطأ في تحميل الأماكن')
    });
  }

  loadSession(): void {
    this.isLoading = true;
    // First get the session to know which course
    this.sessionService.getAllSessionsByFilter().subscribe({
      next: (res: any) => {
        const session = res.items?.find((s: any) => s.id === this.sessionId);
        if (session) {
          this.courseId = session.course?.id;
          this.sessionForm.patchValue({
            title: session.title,
            courseId: session.course?.id,
            trainerId: session.trainer?.id,
            placeId: session.place?.id,
            sessionDate: session.sessionDate,
            startTime: session.startTime,
            endTime: session.endTime,
            status: session.status,
            note: session.note
          });
        }
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات الجلسة');
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.sessionForm.invalid) {
      this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    this.isLoading = true;
    const formData = this.sessionForm.value;
    const courseId = formData.courseId;

    if (this.isEditMode && this.sessionId && this.courseId) {
      this.sessionService.updateCourseSession(this.courseId, this.sessionId, formData).subscribe({
        next: () => {
          this.notification.showSuccess('تم تحديث الجلسة بنجاح');
          this.router.navigate(['/sessions']);
          this.isLoading = false;
        },
        error: (err) => {
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في تحديث الجلسة');
          this.isLoading = false;
        }
      });
    } else {
      this.sessionService.createCourseSession(courseId, formData).subscribe({
        next: () => {
          this.notification.showSuccess('تم إضافة الجلسة بنجاح');
          this.router.navigate(['/sessions']);
          this.isLoading = false;
        },
        error: (err) => {
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في إضافة الجلسة');
          this.isLoading = false;
        }
      });
    }
  }
}