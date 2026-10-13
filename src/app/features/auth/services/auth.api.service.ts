import { inject, Injectable } from '@angular/core';
import { ApiCallModel } from '@core/models/api/api-call.model';
import { ApiResponse } from '@core/models/api/api.response.model';
import { ApiHelperService } from '@core/services/api/api-helper.service';
import { AuthTokenResponseModel } from '../models/auth-token.response.model';
import { PasswordLoginRequestModel } from '../models/password-login.request.model';
import { RequestOtpRequestModel } from '../models/request-otp.request.model';
import { ResetPasswordRequestModel } from '../models/reset-password.request.model';
import { SetCredentialsRequestModel } from '../models/set-credentials.request.model';
import { VerifyOtpRequestModel } from '../models/verify-otp.request.model';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly apiHelperService = inject(ApiHelperService);

  /**
   * Send a 6-digit login code to the mobile number (one per minute, five per hour).
   * @param data - The mobile number, 09xxxxxxxxx
   */
  requestOtp(data: RequestOtpRequestModel): Promise<ApiResponse<unknown>> {
    const model = new ApiCallModel<RequestOtpRequestModel>();
    model.url = 'Auth/RequestOtp';
    model.data = data;
    return this.apiHelperService.post<unknown>(model);
  }

  /**
   * Check the code; a right code returns the token. A new mobile number creates the account.
   * @param data - Mobile number and the 6-digit code
   */
  verifyOtp(data: VerifyOtpRequestModel): Promise<ApiResponse<AuthTokenResponseModel>> {
    const model = new ApiCallModel<VerifyOtpRequestModel>();
    model.url = 'Auth/VerifyOtp';
    model.data = data;
    return this.apiHelperService.post<AuthTokenResponseModel>(model);
  }

  /**
   * Log in with email and password (only for accounts that added them).
   * @param data - Email and password
   */
  loginWithPassword(data: PasswordLoginRequestModel): Promise<ApiResponse<AuthTokenResponseModel>> {
    const model = new ApiCallModel<PasswordLoginRequestModel>();
    model.url = 'Auth/LoginWithPassword';
    model.data = data;
    return this.apiHelperService.post<AuthTokenResponseModel>(model);
  }

  /**
   * Add or change the email and password of the logged-in account.
   * @param data - Email and password (at least 8 characters)
   */
  setCredentials(data: SetCredentialsRequestModel): Promise<ApiResponse<unknown>> {
    const model = new ApiCallModel<SetCredentialsRequestModel>();
    model.url = 'Auth/SetCredentials';
    model.data = data;
    return this.apiHelperService.post<unknown>(model);
  }

  /**
   * Set a new password after proving the mobile number with a fresh code.
   * @param data - Mobile number, code from requestOtp, new password
   */
  resetPassword(data: ResetPasswordRequestModel): Promise<ApiResponse<unknown>> {
    const model = new ApiCallModel<ResetPasswordRequestModel>();
    model.url = 'Auth/ResetPassword';
    model.data = data;
    return this.apiHelperService.post<unknown>(model);
  }
}
