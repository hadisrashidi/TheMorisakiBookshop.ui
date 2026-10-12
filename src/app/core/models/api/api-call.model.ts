export type ApiMethod = 'GET' | 'POST';

export type ApiParams = Record<string, string | number | boolean | string[]>;

export class ApiCallModel<TRequest = unknown> {
  /** Path after the API base URL, e.g. 'Books/GetBookById'. */
  url = '';
  method: ApiMethod = 'GET';
  /** Query string values. Arrays repeat the key: genres=a&genres=b. */
  params: ApiParams = {};
  /** JSON body (POST only). */
  data: TRequest | undefined;
  /** Show a toast when the call fails (HTTP error or isSuccess = false). */
  showErrorAlert = true;
}
