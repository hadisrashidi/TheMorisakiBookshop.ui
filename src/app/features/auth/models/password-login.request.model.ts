export class PasswordLoginRequestModel {
  email = '';
  password = '';
  /** true = stay logged in for 30 days instead of 1 hour. */
  rememberMe = false;
}
