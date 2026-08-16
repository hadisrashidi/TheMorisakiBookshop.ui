import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AddressesService } from '../../shared/services/addresses.service';
import { Address } from '../../shared/models/address.model';

type AddressDraft = Omit<Address, 'id'>;

const EMPTY_DRAFT: AddressDraft = {
  title: '',
  recipient: '',
  phone: '',
  city: '',
  fullAddress: '',
  postalCode: '',
  isDefault: false
};

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.scss'
})
export class AddressesComponent {

  addressesService = inject(AddressesService);

  formOpen = signal(false);
  editingId = signal<string | null>(null);
  draft = signal<AddressDraft>({ ...EMPTY_DRAFT });
  error = signal('');

  startAdd() {
    this.editingId.set(null);
    // First address added becomes the default automatically.
    this.draft.set({ ...EMPTY_DRAFT, isDefault: this.addressesService.count() === 0 });
    this.error.set('');
    this.formOpen.set(true);
  }

  startEdit(address: Address) {
    const { id, ...rest } = address;
    this.editingId.set(id);
    this.draft.set({ ...rest });
    this.error.set('');
    this.formOpen.set(true);
  }

  cancel() {
    this.formOpen.set(false);
    this.editingId.set(null);
    this.error.set('');
  }

  onField(field: keyof AddressDraft, value: string | boolean) {
    this.draft.update(d => ({ ...d, [field]: value }));
  }

  save() {
    const d = this.draft();
    if (!d.title.trim() || !d.recipient.trim() || !d.city.trim() || !d.fullAddress.trim()) {
      this.error.set('عنوان، نام گیرنده، شهر و نشانی الزامی است.');
      return;
    }

    const id = this.editingId();
    if (id) {
      this.addressesService.update(id, d);
    } else {
      this.addressesService.add(d);
    }

    this.formOpen.set(false);
    this.editingId.set(null);
    this.error.set('');
  }

  remove(address: Address) {
    this.addressesService.remove(address.id);
  }

  setDefault(address: Address) {
    this.addressesService.setDefault(address.id);
  }
}
