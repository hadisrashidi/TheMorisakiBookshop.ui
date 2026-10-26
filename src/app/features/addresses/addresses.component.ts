import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AddressesService } from '../../shared/services/addresses.service';
import { AddressResponseModel } from '../../shared/models/address.response.model';
import { SaveAddressRequestModel } from '../../shared/models/save-address.request.model';
import { ToastService } from '../../shared/services/toast.service';


@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.scss'
})
export class AddressesComponent implements OnInit {

  addressesService = inject(AddressesService);
  private toast = inject(ToastService);

  formOpen = signal(false);
  editingId = signal<number | null>(null);
  draft = signal<SaveAddressRequestModel>(new SaveAddressRequestModel());
  error = signal('');
  isSaving = signal(false);

  async ngOnInit() {
    await this.addressesService.load();
  }

  startAdd() {
    this.editingId.set(null);
    // First address added becomes the default automatically.
    const draft = new SaveAddressRequestModel();
    draft.isDefault = this.addressesService.count() === 0;
    this.draft.set(draft);
    this.error.set('');
    this.formOpen.set(true);
  }

  startEdit(address: AddressResponseModel) {
    const draft = new SaveAddressRequestModel();
    Object.assign(draft, address);
    this.editingId.set(address.id);
    this.draft.set(draft);
    this.error.set('');
    this.formOpen.set(true);
  }

  cancel() {
    this.formOpen.set(false);
    this.editingId.set(null);
    this.error.set('');
  }

  onField(field: keyof SaveAddressRequestModel, value: string | boolean) {
    this.draft.update(d => ({ ...d, [field]: value }));
  }

  async save() {
    const d = this.draft();
    if (!d.title.trim() || !d.recipient.trim() || !d.city.trim() || !d.fullAddress.trim()) {
      this.error.set('عنوان، نام گیرنده، شهر و نشانی الزامی است.');
      this.toast.warning('عنوان، نام گیرنده، شهر و نشانی الزامی است.');
      return;
    }

    if (this.isSaving()) {
      return;
    }

    const id = this.editingId();
    this.isSaving.set(true);
    const isSaved = id !== null
      ? await this.addressesService.update(id, d)
      : await this.addressesService.add(d);
    this.isSaving.set(false);

    // On failure the API message is already shown as a toast and the form stays open.
    if (!isSaved) {
      return;
    }

    this.toast.success(id !== null ? 'آدرس ویرایش شد.' : 'آدرس جدید ذخیره شد.');
    this.formOpen.set(false);
    this.editingId.set(null);
    this.error.set('');
  }

  async remove(address: AddressResponseModel) {
    if (await this.addressesService.remove(address.id)) {
      this.toast.info(`آدرس «${address.title}» حذف شد.`);
    }
  }

  async setDefault(address: AddressResponseModel) {
    if (await this.addressesService.setDefault(address.id)) {
      this.toast.success('آدرس پیش‌فرض تغییر کرد.');
    }
  }
}
