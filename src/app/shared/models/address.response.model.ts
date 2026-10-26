export class AddressResponseModel {
  id = 0;
  title = '';
  recipient = '';
  /** 09xxxxxxxxx or empty. */
  phone = '';
  city = '';
  fullAddress = '';
  /** 10 digits or empty. */
  postalCode = '';
  isDefault = false;
}
