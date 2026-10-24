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
