import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from './models/book.model';
import { HomeApiService } from './services/home.api.service';
import { Author } from './models/author.model';
import { CartService } from '../../shared/services/cart.service';
import { LikedService } from '../../shared/services/liked.service';
import { ToastService } from '../../shared/services/toast.service';
import { ImageFallbackDirective } from '../../shared/directives/image-fallback.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ImageFallbackDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  private homeApiService = inject(HomeApiService);
  private cartService = inject(CartService);
  likedService = inject(LikedService);
  private toast = inject(ToastService);

  featuredBooks: Book[] = [];
  newBooks: Book[] = [];
  authors: Author[] = [];

  // Each section loads independently, so they reveal as their data lands
  // rather than the whole page waiting on the slowest call.
  loadingFeatured = signal(true);
  loadingNew = signal(true);
  loadingAuthors = signal(true);

  // Fixed-length arrays purely to repeat skeleton cards in the template.
  readonly skeletonCards = Array.from({ length: 4 });
  readonly skeletonRow = Array.from({ length: 6 });

  private authorNames = new Map<number, string>();

  ngOnInit(): void {
    this.getFeaturedBooks();
    this.getNewBooks();
    this.getAuthors();
  }

  getFeaturedBooks() {
    this.homeApiService.getFeaturedBooks().subscribe({
      next: (data) => {
        this.featuredBooks = data;
        this.loadingFeatured.set(false);
      },
      error: (err) => {
        console.error('Error fetching featured books', err);
        this.loadingFeatured.set(false);
      }
    });
  }

  getNewBooks() {
    this.homeApiService.getNewBooks().subscribe({
      next: (data) => {
        this.newBooks = data;
        this.loadingNew.set(false);
      },
      error: (err) => {
        console.error('Error fetching new books', err);
        this.loadingNew.set(false);
      }
    });
  }

  getAuthors() {
    this.homeApiService.getAuthors().subscribe({
      next: (data) => {
        this.authors = data;
        this.loadingAuthors.set(false);
        for (const author of data) {
          if (author.id !== undefined) {
            this.authorNames.set(author.id, author.name ?? '');
          }
        }
      },
      error: (err) => {
        console.error('Error fetching authors', err);
        this.loadingAuthors.set(false);
      }
    });
  }

  authorName(authorId: number | undefined): string {
    return authorId !== undefined ? this.authorNames.get(authorId) ?? '' : '';
  }

  addToCart(event: Event, book: Book) {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addToCart(book);
    this.toast.success('به سبد خرید اضافه شد.', { label: 'مشاهده سبد', route: '/cart' });
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
