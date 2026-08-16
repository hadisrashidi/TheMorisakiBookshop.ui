export interface OrderLine {
  id: number;
  title: string;
  image: string;
  price: string;
  quantity: number;
}

export type OrderStatus = 'در حال پردازش' | 'در حال ارسال' | 'تحویل شده';

export interface Order {
  id: string;
  /** Jalali date string, e.g. "1403/04/12". */
  date: string;
  itemsCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  lines: OrderLine[];
}
