import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface ToastData {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Component({
  selector: 'app-toast',
  standalone: false,
  template: `
    <div class="toast-container" [ngClass]="data.type">
      <mat-icon class="toast-icon">{{ getIcon() }}</mat-icon>
      <span class="toast-message">{{ data.message }}</span>
    </div>
  `,
  styles: [`
    .toast-container {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      border-radius: 8px;
    }
    .toast-icon { font-size: 20px; width: 20px; height: 20px; }
    .toast-message { font-size: 14px; }
    .success { background: #10b981; color: white; }
    .error { background: #ef4444; color: white; }
    .warning { background: #f59e0b; color: white; }
    .info { background: #3b82f6; color: white; }
  `]
})
export class ToastComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: ToastData) {}

  getIcon(): string {
    switch (this.data.type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      default: return 'info';
    }
  }
}