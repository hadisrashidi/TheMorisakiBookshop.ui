/** One step of the tracking timeline shown on the orders page. */
export class OrderStepModel {
  status = '';
  label = '';
  /** done = reached, current = the last reached step, upcoming = not yet, cancelled = the order was cancelled. */
  state: 'done' | 'current' | 'upcoming' | 'cancelled' = 'upcoming';
  /** Jalali date and time of the step; empty when it was not recorded. */
  dateText = '';
}
