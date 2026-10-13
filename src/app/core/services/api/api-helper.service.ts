import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../shared/services/toast.service';
import { ApiCallModel, ApiParams } from '../../models/api/api-call.model';
import { ApiResponse } from '../../models/api/api.response.model';

const NETWORK_ERROR_MESSAGE = 'ارتباط با سرور برقرار نشد.';
const UNEXPECTED_ERROR_MESSAGE = 'خطای غیرمنتظره‌ای رخ داد.';

/**
 * The only place that talks to HttpClient. Always resolves (never throws) with an
 * ApiResponse: failures come back as isSuccess = false, and a toast is shown.
 */
@Injectable({ providedIn: 'root' })
export class ApiHelperService {
  private readonly http = inject(HttpClient);
  private readonly toastService = inject(ToastService);

  get<T>(model: ApiCallModel): Promise<ApiResponse<T>> {
    model.method = 'GET';
    return this.send<T>(model);
  }

  post<T>(model: ApiCallModel): Promise<ApiResponse<T>> {
    model.method = 'POST';
    return this.send<T>(model);
  }

  private async send<T>(model: ApiCallModel): Promise<ApiResponse<T>> {
    const url = `${environment.apiUrl}/${model.url}`;
    const params = this.buildParams(model.params);

    try {
      const request = model.method === 'POST'
        ? this.http.post<ApiResponse<T>>(url, model.data, { params })
        : this.http.get<ApiResponse<T>>(url, { params });

      const response = await firstValueFrom(request);

      if (!response.isSuccess && model.showErrorAlert) {
        this.toastService.error(response.message ?? UNEXPECTED_ERROR_MESSAGE);
      }

      return response;
    } catch (error) {
      return this.handleHttpError<T>(error, model);
    }
  }

  // 400 / 500 from the API carry the same envelope; status 0 = API not reachable.
  private handleHttpError<T>(error: unknown, model: ApiCallModel): ApiResponse<T> {
    const result = new ApiResponse<T>();
    result.message = UNEXPECTED_ERROR_MESSAGE;

    if (error instanceof HttpErrorResponse) {
      console.error('API call failed', model.url, error);

      if (error.status === 0) {
        result.message = NETWORK_ERROR_MESSAGE;
      } else if (error.error && typeof error.error.message === 'string') {
        result.message = error.error.message;
        result.errors = error.error.errors ?? [];
      }
    }

    // 401: the auth interceptor already told the person to log in again.
    const isUnauthorized = error instanceof HttpErrorResponse && error.status === 401;

    if (model.showErrorAlert && !isUnauthorized) {
      this.toastService.error(result.message ?? UNEXPECTED_ERROR_MESSAGE);
    }

    return result;
  }

  private buildParams(values: ApiParams): HttpParams {
    let params = new HttpParams();

    for (const key of Object.keys(values)) {
      const value = values[key];

      if (Array.isArray(value)) {
        for (const item of value) {
          params = params.append(key, item);
        }
      } else {
        params = params.set(key, String(value));
      }
    }

    return params;
  }
}
