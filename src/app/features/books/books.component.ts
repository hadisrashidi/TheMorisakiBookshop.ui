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

  getBookDetails(id: number) {
    this.booksApiService.getBookById(id).subscribe({
      next: (data) => {
        this.book = data;
        this.loadingBook.set(false);
        if (data.authorId !== undefined) {
          this.getAuthor(data.authorId);
        }
      },
      error: (err) => {
        console.error('Error loading book', err);
        this.loadingBook.set(false);
      }
    });
  }

  getAuthor(authorId: number) {
    this.authorsApiService.getAuthorById(authorId).subscribe({
      next: (data) => (this.author = data),
      error: (err) => console.error('Error loading author', err)
    });
  }

  getRelatedBooks(id: number) {
    this.booksApiService.getRelatedBooks(id).subscribe({
      next: (data) => (this.relatedBooks = data),
      error: (err) => console.error('Error loading related books', err)
    });
  }

  getSimilarBooks(id: number) {
    this.booksApiService.getSimilarBooks(id).subscribe({
      next: (data) => (this.similarBooks = data),
      error: (err) => console.error('Error loading similar books', err)
    });
  }

  getReviews(id: number) {
    this.reviewsApiService.getByBookId(id).subscribe({
      next: (data) => (this.reviews = data),
      error: (err) => console.error('Error loading reviews', err)
    });
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
