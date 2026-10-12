import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Author } from '../home/models/author.model';
import { Book } from '../home/models/book.model';
import { Review } from '../../shared/models/review.model';
import { AuthorsApiService } from './services/authors.api.service';
import { BooksApiService } from '../books/services/books.api.service';
import { ReviewsApiService } from '../../shared/services/reviews.api.service';
import { CartService } from '../../shared/services/cart.service';
import { LikedService } from '../../shared/services/liked.service';
import { ToastService } from '../../shared/services/toast.service';
import { ImageFallbackDirective } from '../../shared/directives/image-fallback.directive';

@Component({
  selector: 'app-author-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ImageFallbackDirective],
  templateUrl: './author-detail.component.html',
  styleUrl: './author-detail.component.scss'
})
export class AuthorDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private authorsApiService = inject(AuthorsApiService);
  private booksApiService = inject(BooksApiService);
  private reviewsApiService = inject(ReviewsApiService);
  private cartService = inject(CartService);
  likedService = inject(LikedService);
  private toast = inject(ToastService);

  author: Author | null = null;
  books: Book[] = [];
  reviews: Review[] = [];
  similarAuthors: Author[] = [];
  tab: 'books' | 'reviews' = 'books';

  ngOnInit(): void {
    // paramMap (not snapshot) — the "similar authors" row navigates
    // between authors on this same route, reusing this component.
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (!id) {
        return;
      }

      this.author = null;
      this.books = [];
      this.reviews = [];
      this.similarAuthors = [];
      this.tab = 'books';

      this.loadAuthor(id);
      this.loadBooks(id);
      this.loadReviews(id);
      this.loadSimilarAuthors(id);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  private async loadAuthor(id: number): Promise<void> {
    const result = await this.authorsApiService.getAuthorById(id);
    if (result.isSuccess && result.data) {
      this.author = result.data;
    }
  }

  private async loadBooks(id: number): Promise<void> {
    const result = await this.booksApiService.getBooksByAuthor(id);
    if (result.isSuccess && result.data) {
      this.books = result.data;
    }
  }

  private async loadReviews(id: number): Promise<void> {
    const result = await this.reviewsApiService.getByAuthorId(id);
    if (result.isSuccess && result.data) {
      this.reviews = result.data;
    }
  }

  private async loadSimilarAuthors(id: number): Promise<void> {
    const result = await this.authorsApiService.getSimilarAuthors(id);
    if (result.isSuccess && result.data) {
      this.similarAuthors = result.data;
    }
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
    this.likedService.toggle(book, this.author?.name);
  }

  isLiked(book: Book): boolean {
    return book.id !== undefined && this.likedService.isLiked(book.id);
  }

  stars(rating: number | undefined): string {
    const full = Math.round(rating ?? 0);
    return '★★★★★☆☆☆☆☆'.slice(5 - full, 10 - full);
  }
}
