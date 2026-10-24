import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LikedService } from '../../shared/services/liked.service';
import { CartService } from '../../shared/services/cart.service';
import { LikedItem } from '../../shared/models/liked-item.model';
import { Book } from '../home/models/book.model';
import { ImageFallbackDirective } from '../../shared/directives/image-fallback.directive';
import { ApiImagePipe } from '../../shared/pipes/api-image.pipe';

@Component({
  selector: 'app-liked',
  standalone: true,
  imports: [ApiImagePipe, CommonModule, RouterLink, ImageFallbackDirective],
  templateUrl: './liked.component.html',
  styleUrl: './liked.component.scss'
})
export class LikedComponent {

  likedService = inject(LikedService);
  private cartService = inject(CartService);

  remove(event: Event, id: number) {
    event.preventDefault();
    event.stopPropagation();
    this.likedService.remove(id);
  }

  async addToCart(event: Event, item: LikedItem) {
    event.preventDefault();
    event.stopPropagation();

    const book: Book = {
      id: item.id,
      title: item.title,
      image: item.image,
      price: Number(item.price) || 0,
      inStock: item.inStock ?? true,
      stock: undefined,
      description: undefined,
      oldPrice: undefined,
      authorId: undefined,
      genre: undefined,
      language: undefined,
      specs: undefined
    };
    await this.cartService.addCheckedToCart(book);
  }
}
