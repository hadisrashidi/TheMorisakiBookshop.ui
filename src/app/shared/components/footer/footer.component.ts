import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShopInfoResponseModel } from '../../models/shop-info.response.model';
import { ShopInfoApiService } from '../../services/shop-info.api.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  private readonly shopInfoApiService = inject(ShopInfoApiService);

  // The shop's details come from the API (the admin panel edits them). Until they arrive, or when the API cannot be
  // reached, the footer shows the sample details below.
  info = signal<ShopInfoResponseModel>({
    shopName: '',
    phone: '09193757648',
    email: '',
    address: 'تهران، شریعتی',
    instagramUrl: 'https://instagram.com/morisaki.bookshop',
    telegramUrl: 'https://t.me/morisaki_bookshop',
    whatsappUrl: 'https://wa.me/989193757648'
  });

  async ngOnInit(): Promise<void> {
    const result = await this.shopInfoApiService.getShopInfo();

    if (result.isSuccess && result.data) {
      this.info.set(result.data);
    }
  }
}
