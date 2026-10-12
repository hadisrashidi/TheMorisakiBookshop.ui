import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BooksApiService } from './services/books.api.service';
import { Book } from '../home/models/book.model';
import { Author } from '../home/models/author.model';
import { Review } from '../../shared/models/review.model';
import { CartService } from '../../shared/services/cart.service';
import { LikedService } from '../../shared/services/liked.service';
import { AuthorsApiService } from '../authors/services/authors.api.service';
import { ReviewsApiService } from '../../shared/services/reviews.api.service';
import { ToastService } from '../../shared/services/toast.service';
import { ImageFallbackDirective } from '../../shared/directives/image-fallback.directive';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, RouterLink, ImageFallbackDirective],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})

export class BooksComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private booksApiService = inject(BooksApiService);
  private authorsApiService = inject(AuthorsApiService);
  private reviewsApiService = inject(ReviewsApiService);
  cartService = inject(CartService);
  likedService = inject(LikedService);
  private toast = inject(ToastService);

  book: Book = new Book();
  author: Author | null = null;
  relatedBooks: Book[] = [];
  similarBooks: Book[] = [];
  reviews: Review[] = [];
  tab: 'description' | 'reviews' = 'description';
  loadingBook = signal(true);

  ngOnInit(): void {
    // paramMap (not snapshot) — navigating between books via the related
    // or recommendation cards reuses this component instance, so a
    // snapshot read would leave the page showing the previous book.
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (!id) {
        return;
      }

      this.resetForNavigation();
      this.loadingBook.set(true);
      this.getBookDetails(id);
      this.getRelatedBooks(id);
      this.getSimilarBooks(id);
      this.getReviews(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  private resetForNavigation() {
    this.book = new Book();
    this.author = null;
    this.relatedBooks = [];
    this.similarBooks = [];
    this.reviews = [];
    this.tab = 'description';
  }

  async getBookDetails(id: number): Promise<void> {
    const result = await this.booksApiService.getBookById(id);
    if (result.isSuccess && result.data) {
      this.book = result.data;
      if (result.data.authorId !== undefined) {
        this.getAuthor(result.data.authorId);
      }
    }
    this.loadingBook.set(false);
  }

  async getAuthor(authorId: number): Promise<void> {
    const result = await this.authorsApiService.getAuthorById(authorId);
    if (result.isSuccess && result.data) {
      this.author = result.data;
    }
  }

  async getRelatedBooks(id: number): Promise<void> {
    const result = await this.booksApiService.getRelatedBooks(id);
    if (result.isSuccess && result.data) {
      this.relatedBooks = result.data;
    }
  }

  async getSimilarBooks(id: number): Promise<void> {
    const result = await this.booksApiService.getSimilarBooks(id);
    if (result.isSuccess && result.data) {
      this.similarBooks = result.data;
    }
  }

  async getReviews(id: number): Promise<void> {
    const result = await this.reviewsApiService.getByBookId(id);
    if (result.isSuccess && result.data) {
      this.reviews = result.data;
    }
  }

  addToCart() {
    this.cartService.addToCart(this.book);
    this.toast.success('به سبد خرید اضافه شد.', { label: 'مشاهده سبد', route: '/cart' });
  }

  toggleLiked() {
    this.likedService.toggle(this.book, this.author?.name);
  }

  get isLiked(): boolean {
    return this.book.id !== undefined && this.likedService.isLiked(this.book.id);
  }

  get averageRating(): number {
    if (this.reviews.length === 0) {
      return 0;
    }
    const sum = this.reviews.reduce((acc, r) => acc + (r.rating ?? 0), 0);
    return Math.round((sum / this.reviews.length) * 10) / 10;
  }

  stars(rating: number | undefined): string {
    const full = Math.round(rating ?? 0);
    return '★★★★★☆☆☆☆☆'.slice(5 - full, 10 - full);
  }
}
