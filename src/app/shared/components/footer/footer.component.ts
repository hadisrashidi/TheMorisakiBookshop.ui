import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  // Shop contact details. The Instagram and Telegram handles are
  // placeholders — swap them for the real accounts. WhatsApp is derived
  // from the shop phone number below (0919… → 98919…, no leading zero).
  readonly phone = '09193757648';
  readonly instagramUrl = 'https://instagram.com/morisaki.bookshop';
  readonly telegramUrl = 'https://t.me/morisaki_bookshop';
  readonly whatsappUrl = 'https://wa.me/989193757648';
}
