import { OrderStepModel } from '../models/order-step.model';

const STATUS_LABELS: Record<string, string> = {
  PendingPayment: 'در انتظار پرداخت',
  Paid: 'پرداخت‌شده',
  Packed: 'آماده‌سازی شده',
  Shipped: 'ارسال شده',
  Delivered: 'تحویل شده',
  Cancelled: 'لغو شده'
};

/** Persian text of an API order status; unknown values are shown as they are. */
export function orderStatusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

const FLOW_STATUSES: string[] = ['PendingPayment', 'Paid', 'Packed', 'Shipped', 'Delivered'];

const STEP_LABELS: Record<string, string> = {
  PendingPayment: 'ثبت سفارش',
  Paid: 'پرداخت',
  Packed: 'آماده‌سازی',
  Shipped: 'ارسال',
  Delivered: 'تحویل',
  Cancelled: 'لغو شد'
};

/** Jalali date and time of an API UTC time like 2026-10-24T08:15:00. */
export function formatStepDate(utcTime: string): string {
  // The API sends UTC without a "Z"; without it the browser would read the time as local time.
  const utcText = utcTime.endsWith('Z') ? utcTime : utcTime + 'Z';

  return new Date(utcText).toLocaleString('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * The timeline of an order: the normal steps (ثبت، پرداخت، آماده‌سازی، ارسال، تحویل) with the ones already reached marked,
 * or, for a cancelled order, only the steps it passed plus "لغو شد".
 */
export function buildOrderSteps(status: string, history: { status: string; changedAt: string }[]): OrderStepModel[] {
  const dates: Record<string, string> = {};

  for (const entry of history) {
    dates[entry.status] = formatStepDate(entry.changedAt);
  }

  const steps: OrderStepModel[] = [];
  const currentIndex = FLOW_STATUSES.indexOf(status);

  for (let index = 0; index < FLOW_STATUSES.length; index++) {
    const stepStatus = FLOW_STATUSES[index];
    const wasReached = stepStatus in dates || (currentIndex >= 0 && index <= currentIndex);

    if (status === 'Cancelled' && !wasReached) {
      continue;
    }

    const step = new OrderStepModel();
    step.status = stepStatus;
    step.label = STEP_LABELS[stepStatus];
    step.dateText = dates[stepStatus] ?? '';
    step.state = wasReached ? 'done' : 'upcoming';
    steps.push(step);
  }

  if (status === 'Cancelled') {
    const cancelled = new OrderStepModel();
    cancelled.status = 'Cancelled';
    cancelled.label = STEP_LABELS['Cancelled'];
    cancelled.dateText = dates['Cancelled'] ?? '';
    cancelled.state = 'cancelled';
    steps.push(cancelled);
  } else {
    // The last reached step is the "current" one (a finished order has none: everything is done).
    for (let index = steps.length - 1; index >= 0; index--) {
      if (steps[index].state === 'done') {
        if (status !== 'Delivered') {
          steps[index].state = 'current';
        }
        break;
      }
    }
  }

  return steps;
}

/** The carrier's tracking page, worked out from the shipping method name; empty when it is not known. */
export function carrierTrackingUrl(shippingMethodName: string): string {
  if (shippingMethodName.includes('پست')) {
    return 'https://tracking.post.ir/';
  }

  return '';
}
