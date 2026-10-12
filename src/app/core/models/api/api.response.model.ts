/** Same shape as the API's CustomActionResult<T>. */
export class ApiResponse<T> {
  isSuccess = false;
  data: T | undefined;
  message: string | null = null;
  errors: string[] = [];
}
