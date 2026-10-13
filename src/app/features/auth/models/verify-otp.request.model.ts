export class VerifyOtpRequestModel {
  mobile = '';
  code = '';
  /** true = stay logged in for 30 days instead of 1 hour. */
  rememberMe = false;
}
