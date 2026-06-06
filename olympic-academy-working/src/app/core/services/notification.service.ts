import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent, ToastData } from '../../shared/components/toast/toast.component';

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

  // إشعار نجاح
  showSuccess(message: string, options?: NotificationOptions): void {
    this.showToast(message, 'success', options);
  }

  // إشعار خطأ
  showError(message: string, options?: NotificationOptions): void {
    this.showToast(message, 'error', options);
  }

  // إشعار تحذير
  showWarning(message: string, options?: NotificationOptions): void {
    this.showToast(message, 'warning', options);
  }

  // إشعار معلومات
  showInfo(message: string, options?: NotificationOptions): void {
    this.showToast(message, 'info', options);
  }

  // استخدام Toast Component المخصص
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

  // إشعار دائم لا يختفي تلقائياً
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

  // إشعار مع زر إجراء (نسخة بسيطة)
  showWithAction(message: string, actionText: string, actionCallback: () => void, type: NotificationType = 'info'): void {
    // استخدام الـ SnackBar العادي للأكشن
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

  // إغلاق جميع الإشعارات
  dismiss(): void {
    this.snackBar.dismiss();
  }

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