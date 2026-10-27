import { inject, Injectable } from '@angular/core';
import { ApiCallModel } from '@core/models/api/api-call.model';
import { ApiResponse } from '@core/models/api/api.response.model';
import { ApiHelperService } from '@core/services/api/api-helper.service';
import { AddressResponseModel } from '../models/address.response.model';
import { SaveAddressRequestModel } from '../models/save-address.request.model';

@Injectable({
  providedIn: 'root'
})
export class AddressesApiService {
  private readonly apiHelperService = inject(ApiHelperService);

  /** The saved addresses of the logged-in person, default first. */
  getMyAddresses(): Promise<ApiResponse<AddressResponseModel[]>> {
    const model = new ApiCallModel();
    model.url = 'Addresses/GetMyAddresses';
    return this.apiHelperService.get<AddressResponseModel[]>(model);
  }

  /** @returns The id of the new address */
  addAddress(data: SaveAddressRequestModel): Promise<ApiResponse<number>> {
    const model = new ApiCallModel<SaveAddressRequestModel>();
    model.url = 'Addresses/AddAddress';
    model.data = data;
    return this.apiHelperService.post<number>(model);
  }

  updateAddress(id: number, data: SaveAddressRequestModel): Promise<ApiResponse<void>> {
    const model = new ApiCallModel<SaveAddressRequestModel>();
    model.url = 'Addresses/UpdateAddress';
    model.params = { id };
    model.data = data;
    return this.apiHelperService.post<void>(model);
  }

  deleteAddress(id: number): Promise<ApiResponse<void>> {
    const model = new ApiCallModel();
    model.url = 'Addresses/DeleteAddress';
    model.params = { id };
    return this.apiHelperService.post<void>(model);
  }

  setDefaultAddress(id: number): Promise<ApiResponse<void>> {
    const model = new ApiCallModel();
    model.url = 'Addresses/SetDefaultAddress';
    model.params = { id };
    return this.apiHelperService.post<void>(model);
  }
}
