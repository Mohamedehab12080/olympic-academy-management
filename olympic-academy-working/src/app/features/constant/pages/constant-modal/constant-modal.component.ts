// components/constant-modal/constant-modal.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface ConstantModalData {
  mode: 'create' | 'edit';
  constant?: any;
}

@Component({
  selector: 'app-constant-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './constant-modal.component.html',
  styleUrls: ['./constant-modal.component.css']
})
export class ConstantModalComponent implements OnInit {
  constantForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ConstantModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConstantModalData
  ) {
    this.constantForm = this.fb.group({
      title: ['', [Validators.required]],
      value: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_]+$')]],
      location: [''],
      position: ['']
    });
  }

  ngOnInit(): void {
    if (this.data.mode === 'edit' && this.data.constant) {
      this.constantForm.patchValue({
        title: this.data.constant.title,
        value: this.data.constant.value,
        location: this.data.constant.location || '',
        position: this.data.constant.position || ''
      });
    }
  }

  save(): void {
    if (this.constantForm.invalid) {
      this.constantForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.constantForm.value;
    
    const result = {
      title: formValue.title,
      value: formValue.value,
      location: formValue.location || undefined,
      position: formValue.position || undefined
    };

    // Simulate loading
    setTimeout(() => {
      this.dialogRef.close(result);
    }, 500);
  }

  close(): void {
    this.dialogRef.close(null);
  }
}