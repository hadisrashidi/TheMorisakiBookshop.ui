import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { LegalSectionModel } from '../../shared/models/legal-page.model';
import { ShippingMethodResponseModel } from '../../shared/models/shipping-method.response.model';
import { ShippingApiService } from '../../shared/services/shipping.api.service';
import { LEGAL_PAGES } from '../legal/legal-pages';

@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shipping.component.html',
  styleUrl: './shipping.component.scss'
})
export class ShippingComponent implements OnInit {
  private readonly shippingApiService = inject(ShippingApiService);

  methods = signal<ShippingMethodResponseModel[]>([]);
  loading = signal(true);

  // The fixed explanations (processing time, delivery) are texts in the code; prices come from the database.
  readonly notes: LegalSectionModel[] = LEGAL_PAGES['shipping'].sections;

  async ngOnInit(): Promise<void> {
    const result = await this.shippingApiService.getShippingMethods(null, '');

    if (result.isSuccess && result.data) {
      this.methods.set(result.data);
    }

    this.loading.set(false);
  }
}
