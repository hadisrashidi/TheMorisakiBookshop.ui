import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LikedService } from '../../shared/services/liked.service';
import { CartService } from '../../shared/services/cart.service';
import { LikedItem } from '../../shared/models/liked-item.model';
import { Book } from '../home/models/book.model';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-liked',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './liked.component.html',
  styleUrl: './liked.component.scss'
})
export class LikedComponent {

  likedService = inject(LikedService);
  private cartService = inject(CartService);
  private toast = inject(ToastService);

  remove(event: Event, id: number) {
    event.preventDefault();
    event.stopPropagation();
    this.likedService.remove(id);
    this.toast.info('از علاقه‌مندی‌ها حذف شد.');
  }

  addToCart(event: Event, item: LikedItem) {
    event.preventDefault();
    event.stopPropagation();

    const book: Book = {
      id: item.id,
      title: item.title,
      image: item.image,
      price: item.price,
      inStock: item.inStock ?? true,
      description: undefined,
      oldPrice: undefined,
      authorId: undefined,
      genre: undefined,
      language: undefined,
      specs: undefined
    };
    this.cartService.addToCart(book);
    this.toast.success('به سبد خرید اضافه شد.', { label: 'مشاهده سبد', route: '/cart' });
  }
}
