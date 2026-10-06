# API & Services Reference

## The Rule

ALL HTTP calls go through `ApiHelperService` via `ApiCallModel`.
Never use `HttpClient` directly. Always return `Promise<T>`.

## API Service Pattern

```typescript
// features/customer/services/customer-query-api.service.ts
import { inject, Injectable } from '@angular/core';
import { ApiHelperService } from '@core/services/api/api-helper.service';
import { ApiCallModel } from '@core/models/api/api-call.model';
import { ApiResponse } from '@core/models/api/api.response.model';
import { CustomerRequestModel } from '../models/customer.request.model';
import { CustomerInfoModel } from '../models/customer-info.model';

@Injectable({ providedIn: 'root' })
export class CustomerQueryApiService {
  private readonly apiHelperService = inject(ApiHelperService);

  /**
   * Query customer information
   * @param data - Request payload
   * @returns Promise resolving to ApiResponse<CustomerInfoModel>
   */
  queryCustomerInfo(data: CustomerRequestModel): Promise<ApiResponse<CustomerInfoModel>> {
    const model = new ApiCallModel<CustomerRequestModel>();
    model.url = 'Customer/QueryCustomerInfo';
    model.data = data;
    return this.apiHelperService.post<CustomerInfoModel>(model);
  }
}
```

**Rules:**
- One file per API service, one method per endpoint
- JSDoc on every method
- No state, no BehaviorSubject, no orchestration in API services

## Calling an API Service (in components)

```typescript
async loadCustomer(id: string): Promise<void> {
  this.loading.set(true);
  try {
    const result = await this.customerApiService.queryCustomerInfo({ id });
    if (result.isSuccess) {
      this.customer.set(result.data);
    }
  } catch (error) {
    // optional local handling — ApiHelperService already handles HTTP errors
  } finally {
    this.loading.set(false);
  }
}
```

## ApiCallModel Optional Fields

```typescript
// Error display
model.showErrorAlert = true;
model.errorAlertType = AngularAlertType.Toast;        // non-blocking
model.errorAlertType = AngularAlertType.Swal;         // blocking dialog
model.errorAlertType = AngularAlertType.RedirectToPage; // redirect to error pages

// Success
model.showSuccessAlert = true;
model.successAlertType = AngularAlertType.Swal;

// Confirmation before call
model.showConfirmAlert = true;
model.confirmAlertText = 'Are you sure?';

// Loading
model.showLoading = true;
model.loadingTargets = ['#my-button'];   // CSS selectors to block

// Specific error page redirects
model.redirectToErrorPageOn403 = true;
model.redirectToErrorPageOn500 = true;

// HTTP method (default is POST)
model.method = 'GET';

// File downloads
model.responseType = 'blob';

// Cancellation
model.cancelKey = 'search-request';
model.autoCancelOnNavigation = true;  // default true
```

## Error Status Defaults

| Status | Default Behavior |
|--------|-----------------|
| 401 | Auto logout |
| 403 | SweetAlert dialog |
| 404 | Toast (if showErrorAlert = true) |
| 500 | Toast (if showErrorAlert = true) |

## Calling Infrastructure Directly (Allowed)

Presentations can call Infrastructure directly when it's a fully isolated service
and wrapping it in a feature/flow would be overkill (e.g., captcha, file download util).
