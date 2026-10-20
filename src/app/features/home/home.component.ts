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
import { ApiImagePipe } from '../../shared/pipes/api-image.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ApiImagePipe, CommonModule, RouterLink, ImageFallbackDirective],
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

  async getFeaturedBooks(): Promise<void> {
    const result = await this.homeApiService.getFeaturedBooks();
    if (result.isSuccess && result.data) {
      this.featuredBooks = result.data;
    }
    this.loadingFeatured.set(false);
  }

  async getNewBooks(): Promise<void> {
    const result = await this.homeApiService.getNewBooks();
    if (result.isSuccess && result.data) {
      this.newBooks = result.data;
    }
    this.loadingNew.set(false);
  }

  async getAuthors(): Promise<void> {
    const result = await this.homeApiService.getAuthors();
    if (result.isSuccess && result.data) {
      this.authors = result.data;
      for (const author of result.data) {
        if (author.id !== undefined) {
          this.authorNames.set(author.id, author.name ?? '');
        }
      }
    }
    this.loadingAuthors.set(false);
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
