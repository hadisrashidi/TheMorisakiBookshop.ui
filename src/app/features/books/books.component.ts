import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BooksApiService } from './services/books.api.service';
import { Book } from '../home/models/book.model';
import { Author } from '../home/models/author.model';
import { Review } from '../../shared/models/review.model';
import { CartService } from '../../shared/services/cart.service';
import { LikedService } from '../../shared/services/liked.service';
import { AuthorsApiService } from '../authors/services/authors.api.service';
import { ReviewsApiService } from '../../shared/services/reviews.api.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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

  book: Book = new Book();
  author: Author | null = null;
  relatedBooks: Book[] = [];
  similarBooks: Book[] = [];
  reviews: Review[] = [];
  tab: 'specs' | 'reviews' = 'specs';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getBookDetails(id);
    this.getRelatedBooks(id);
    this.getSimilarBooks(id);
    this.getReviews(id);
  }

  getBookDetails(id: number) {
    this.booksApiService.getBookById(id).subscribe({
      next: (data) => {
        this.book = data;
        if (data.authorId !== undefined) {
          this.getAuthor(data.authorId);
        }
      },
      error: (err) => {
        console.error('Error loading book', err);
      }
    });
  }

  getAuthor(authorId: number) {
    this.authorsApiService.getAuthorById(authorId).subscribe({
      next: (data) => {
        this.author = data;
      },
      error: (err) => {
        console.error('Error loading author', err);
      }
    });
  }

  getRelatedBooks(id: number) {
    this.booksApiService.getRelatedBooks(id).subscribe({
      next: (data) => {
        this.relatedBooks = data;
      },
      error: (err) => {
        console.error('Error loading related books', err);
      }
    });
  }

  getSimilarBooks(id: number) {
    this.booksApiService.getSimilarBooks(id).subscribe({
      next: (data) => {
        this.similarBooks = data;
      },
      error: (err) => {
        console.error('Error loading similar books', err);
      }
    });
  }

  getReviews(id: number) {
    this.reviewsApiService.getByBookId(id).subscribe({
      next: (data) => {
        this.reviews = data;
      },
      error: (err) => {
        console.error('Error loading reviews', err);
      }
    });
  }

  addToCart() {
    this.cartService.addToCart(this.book);
  }

  toggleLiked() {
    this.likedService.toggle(this.book, this.author?.name);
  }

  get isLiked(): boolean {
    return this.book.id !== undefined && this.likedService.isLiked(this.book.id);
  }

  stars(rating: number | undefined): string {
    const full = Math.round(rating ?? 0);
    return '★★★★★☆☆☆☆☆'.slice(5 - full, 10 - full);
  }
}
