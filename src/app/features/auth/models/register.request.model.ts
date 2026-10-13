export class RegisterRequestModel {
  mobile = '';
  code = '';
  name = '';
  email = '';
  password = '';
  /** true = stay logged in for 30 days instead of 1 hour. */
  rememberMe = false;
}
