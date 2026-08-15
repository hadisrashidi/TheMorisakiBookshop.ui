import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Order {
  id: string;
  date: string;
  itemsCount: number;
  total: string;
  status: string;
}

// No auth exists yet (see the API's Program.cs note on Management
// endpoints), so this page has nothing real to load — it's a static
// placeholder matching the approved design, ready to be wired to a real
// account once login exists.
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  user = {
    name: 'حدیث رشیدی',
    phone: '0919 375 7648',
    email: 'hadis@example.com',
    birthdate: '1372/05/12',
    avatar: 'https://picsum.photos/seed/profile-avatar/160/160'
  };

  orders: Order[] = [
    { id: '#10234', date: '1403/04/12', itemsCount: 3, total: '615,000', status: 'تحویل شده' },
    { id: '#10198', date: '1403/03/02', itemsCount: 1, total: '150,000', status: 'در حال ارسال' },
    { id: '#10122', date: '1403/01/20', itemsCount: 2, total: '310,000', status: 'تحویل شده' },
  ];

  saved = false;

  save() {
    this.saved = true;
  }
}
