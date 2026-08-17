import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

/** Optional inline link, e.g. "به سبد خرید اضافه شد. [مشاهده سبد]". */
export interface ToastAction {
  label: string;
  route: string;
}

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  action?: ToastAction;
}

const DEFAULT_DURATION_MS = 3500;

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private nextId = 1;
  private timers = new Map<number, ReturnType<typeof setTimeout>>();

  private toastsSignal = signal<Toast[]>([]);
  toasts = this.toastsSignal.asReadonly();

  success(message: string, action?: ToastAction, duration?: number) {
    this.show('success', message, action, duration);
  }

  error(message: string, action?: ToastAction, duration?: number) {
    // Errors linger a little longer — they usually need reading.
    this.show('error', message, action, duration ?? 5000);
  }

  warning(message: string, action?: ToastAction, duration?: number) {
    this.show('warning', message, action, duration ?? 4500);
  }

  info(message: string, action?: ToastAction, duration?: number) {
    this.show('info', message, action, duration);
  }

  show(type: ToastType, message: string, action?: ToastAction, duration = DEFAULT_DURATION_MS) {
    const toast: Toast = { id: this.nextId++, type, message, action };
    this.toastsSignal.update(list => [...list, toast]);

    const timer = setTimeout(() => this.dismiss(toast.id), duration);
    this.timers.set(toast.id, timer);
  }

  dismiss(id: number) {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this.toastsSignal.update(list => list.filter(t => t.id !== id));
  }
}
