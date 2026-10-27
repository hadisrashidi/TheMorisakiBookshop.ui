import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BooksApiService } from './services/books.api.service';
import { Book } from '../home/models/book.model';
import { Author } from '../home/models/author.model';
import { Review } from '../../shared/models/review.model';
import { CartService } from '../../shared/services/cart.service';
import { LikedService } from '../../shared/services/liked.service';
import { AuthorsApiService } from '../authors/services/authors.api.service';
import { ReviewsApiService } from '../../shared/services/reviews.api.service';
import { PageMetaService } from '../../shared/services/page-meta.service';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';
import { SaveReviewRequestModel } from '../../shared/models/save-review.request.model';
import { ImageFallbackDirective } from '../../shared/directives/image-fallback.directive';
import { ApiImagePipe } from '../../shared/pipes/api-image.pipe';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [ApiImagePipe, CommonModule, FormsModule, RouterLink, ImageFallbackDirective],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})

export class BooksComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private booksApiService = inject(BooksApiService);
  private authorsApiService = inject(AuthorsApiService);
  private reviewsApiService = inject(ReviewsApiService);
  private router = inject(Router);
  private pageMetaService = inject(PageMetaService);
  private toastService = inject(ToastService);
  authService = inject(AuthService);
  cartService = inject(CartService);
  likedService = inject(LikedService);

  book: Book = new Book();
  author: Author | null = null;
  relatedBooks: Book[] = [];
  similarBooks: Book[] = [];
  reviews: Review[] = [];
  tab: 'description' | 'reviews' = 'description';
  // The review form: filled with the person's old review when they already wrote one.
  myRating = 0;
  myText = '';
  hasMyReview = false;
  isSavingReview = signal(false);
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
    this.myRating = 0;
    this.myText = '';
    this.hasMyReview = false;
    this.tab = 'description';
  }

  async getBookDetails(id: number): Promise<void> {
    const result = await this.booksApiService.getBookById(id);
    if (result.isSuccess && result.data) {
      this.book = result.data;
      this.pageMetaService.set(result.data.title ?? 'کتاب', result.data.description);
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
    await this.getMyReview(id);
  }

  async getMyReview(id: number): Promise<void> {
    if (!this.authService.isLoggedIn()) {
      return;
    }
    const result = await this.reviewsApiService.getMyReview(id);
    if (result.isSuccess && result.data) {
      this.myRating = result.data.rating ?? 0;
      this.myText = result.data.text ?? '';
      this.hasMyReview = true;
    }
  }

  goToLoginForReview(): void {
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
  }

  async saveReview(): Promise<void> {
    if (this.myRating < 1) {
      this.toastService.warning('لطفاً امتیاز را انتخاب کنید.');
      return;
    }
    if (this.myText.trim().length < 3) {
      this.toastService.warning('متن نظر را بنویسید.');
      return;
    }
    if (this.book.id === undefined) {
      return;
    }

    const request = new SaveReviewRequestModel();
    request.bookId = this.book.id;
    request.rating = this.myRating;
    request.text = this.myText.trim();

    this.isSavingReview.set(true);
    const result = await this.reviewsApiService.saveReview(request);
    this.isSavingReview.set(false);

    if (result.isSuccess) {
      this.toastService.success('نظر شما ثبت شد.');
      this.hasMyReview = true;
      await this.getReviews(this.book.id);
    }
  }

  async addToCart() {
    await this.cartService.addCheckedToCart(this.book);
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
