import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LikedService } from '../../shared/services/liked.service';
import { CartService } from '../../shared/services/cart.service';
import { LikedItem } from '../../shared/models/liked-item.model';
import { Book } from '../home/models/book.model';

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

  remove(id: number) {
    this.likedService.remove(id);
  }

  addToCart(item: LikedItem) {
    const book: Book = {
      id: item.id,
      title: item.title,
      image: item.image,
      price: item.price,
      oldPrice: undefined,
      authorId: undefined,
      genre: undefined,
      language: undefined,
      specs: undefined
    };
    this.cartService.addToCart(book);
  }
}
