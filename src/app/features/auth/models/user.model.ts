export class UserModel {
  id = 0;
  mobile = '';
  email: string | null = null;
  name: string | null = null;
  /** Jalali date like 1372/05/12. */
  birthdate: string | null = null;
  hasPassword = false;
  role = '';
}
