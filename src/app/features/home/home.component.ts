import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from './models/book.model';
import { HomeApiService } from './services/home.api.service';
import { Author } from './models/author.model';
import { CartService } from '../../shared/services/cart.service';
import { LikedService } from '../../shared/services/liked.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  private homeApiService = inject(HomeApiService);
  private cartService = inject(CartService);
  likedService = inject(LikedService);

  featuredBooks: Book[] = [];
  newBooks: Book[] = [];
  authors: Author[] = [];

  private authorNames = new Map<number, string>();

  ngOnInit(): void {
    this.getFeaturedBooks();
    this.getNewBooks();
    this.getAuthors();
  }

  getFeaturedBooks() {
    this.homeApiService.getFeaturedBooks().subscribe({
      next: (data) => (this.featuredBooks = data),
      error: (err) => console.error('Error fetching featured books', err)
    });
  }

  getNewBooks() {
    this.homeApiService.getNewBooks().subscribe({
      next: (data) => (this.newBooks = data),
      error: (err) => console.error('Error fetching new books', err)
    });
  }

  getAuthors() {
    this.homeApiService.getAuthors().subscribe({
      next: (data) => {
        this.authors = data;
        for (const author of data) {
          if (author.id !== undefined) {
            this.authorNames.set(author.id, author.name ?? '');
          }
        }
      },
      error: (err) => console.error('Error fetching authors', err)
    });
  }

  authorName(authorId: number | undefined): string {
    return authorId !== undefined ? this.authorNames.get(authorId) ?? '' : '';
  }

  addToCart(event: Event, book: Book) {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addToCart(book);
  }

  toggleLiked(event: Event, book: Book) {
    event.preventDefault();
    event.stopPropagation();
    this.likedService.toggle(book, this.authorName(book.authorId));
  }

  isLiked(book: Book): boolean {
    return book.id !== undefined && this.likedService.isLiked(book.id);
  }
}
