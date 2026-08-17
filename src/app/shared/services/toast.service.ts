import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
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

  success(message: string, duration?: number) {
    this.show('success', message, duration);
  }

  error(message: string, duration?: number) {
    // Errors linger a little longer — they usually need reading.
    this.show('error', message, duration ?? 5000);
  }

  warning(message: string, duration?: number) {
    this.show('warning', message, duration ?? 4500);
  }

  info(message: string, duration?: number) {
    this.show('info', message, duration);
  }

  show(type: ToastType, message: string, duration = DEFAULT_DURATION_MS) {
    const toast: Toast = { id: this.nextId++, type, message };
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
