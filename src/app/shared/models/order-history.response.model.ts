/** One status change of an order: it got this status at this time. */
export class OrderHistoryResponseModel {
  status = '';
  /** UTC time sent by the API, e.g. 2026-10-24T08:15:00. */
  changedAt = '';
}
