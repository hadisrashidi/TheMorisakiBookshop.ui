import { UserModel } from './user.model';

export class AuthTokenResponseModel {
  token = '';
  /** UTC time the token stops working. */
  expiresAt = '';
  user = new UserModel();
}
