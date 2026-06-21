// notification.service.ts
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent, ToastData } from '../../shared/components/toast/toast.component';
import { ErrorVTO } from '../models/common.model';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationOptions {
  duration?: number;
  horizontalPosition?: 'start' | 'center' | 'end' | 'left' | 'right';
  verticalPosition?: 'top' | 'bottom';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);
  private defaultDuration = 4000;

  // ==========================================================================
  // SUCCESS
  // ==========================================================================

  showSuccess(message: string, options?: NotificationOptions): void {
    this.showToast(message, 'success', options);
  }

  // ==========================================================================
  // ERROR - Handles both string and ErrorVTO
  // ==========================================================================

  /**
   * Show error message - supports both string and ErrorVTO
   */
  showError(error: string | ErrorVTO | any, options?: NotificationOptions): void {
    let message = 'حدث خطأ غير متوقع';
    
    // Handle ErrorVTO object
    if (error && typeof error === 'object') {
      // Check for ErrorVTO structure
      if (error.messageEn) {
        message = error.messageEn;
        // If there are field errors, append them
        if (error.reqBodyErrors && error.reqBodyErrors.length > 0) {
          message += ': ' + error.reqBodyErrors.join(', ');
        }
      } 
      // Check for nested error
      else if (error.error?.messageEn) {
        message = error.error.messageEn;
        if (error.error.reqBodyErrors && error.error.reqBodyErrors.length > 0) {
          message += ': ' + error.error.reqBodyErrors.join(', ');
        }
      }
      // Check for error with message property
      else if (error.message) {
        message = error.message;
      }
      // Check for error with messageEn directly
      else if (error.messageEn) {
        message = error.messageEn;
      }
    } 
    // Handle string error
    else if (typeof error === 'string') {
      message = error;
    }

    this.showToast(message, 'error', { ...options, duration: options?.duration || 6000 });
  }

  // ==========================================================================
  // WARNING
  // ==========================================================================

  showWarning(message: string, options?: NotificationOptions): void {
    this.showToast(message, 'warning', options);
  }

  // ==========================================================================
  // INFO
  // ==========================================================================

  showInfo(message: string, options?: NotificationOptions): void {
    this.showToast(message, 'info', options);
  }

  // ==========================================================================
  // TOAST
  // ==========================================================================

  showToast(message: string, type: NotificationType = 'info', options?: NotificationOptions): void {
    const duration = options?.duration || this.defaultDuration;
    const horizontalPosition = options?.horizontalPosition || 'left';
    const verticalPosition = options?.verticalPosition || 'top';

    this.snackBar.openFromComponent(ToastComponent, {
      data: { message, type } as ToastData,
      duration,
      horizontalPosition,
      verticalPosition,
      panelClass: ['custom-toast'],
      direction: 'rtl'
    });
  }

  // ==========================================================================
  // PERSISTENT
  // ==========================================================================

  showPersistent(message: string, type: NotificationType = 'info'): void {
    this.snackBar.openFromComponent(ToastComponent, {
      data: { message, type } as ToastData,
      duration: undefined,
      horizontalPosition: 'left',
      verticalPosition: 'top',
      panelClass: ['custom-toast'],
      direction: 'rtl'
    });
  }

  // ==========================================================================
  // WITH ACTION
  // ==========================================================================

  showWithAction(message: string, actionText: string, actionCallback: () => void, type: NotificationType = 'info'): void {
    const panelClass = this.getPanelClass(type);
    const snackBarRef = this.snackBar.open(message, actionText, {
      duration: 6000,
      horizontalPosition: 'left',
      verticalPosition: 'top',
      panelClass: ['notification-snackbar', panelClass],
      direction: 'rtl'
    });

    snackBarRef.onAction().subscribe(() => {
      actionCallback();
    });
  }

  // ==========================================================================
  // DISMISS
  // ==========================================================================

  dismiss(): void {
    this.snackBar.dismiss();
  }

  // ==========================================================================
  // PRIVATE HELPERS
  // ==========================================================================

  private getPanelClass(type: NotificationType): string {
    switch (type) {
      case 'success': return 'notification-success';
      case 'error': return 'notification-error';
      case 'warning': return 'notification-warning';
      case 'info': return 'notification-info';
      default: return 'notification-info';
    }
  }
}