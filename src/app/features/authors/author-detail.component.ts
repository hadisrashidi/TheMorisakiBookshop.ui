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

@Component({
  selector: 'app-author-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
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

      this.authorsApiService.getAuthorById(id).subscribe({
        next: (data) => (this.author = data),
        error: (err) => console.error('Error loading author', err)
      });

      this.booksApiService.getBooksByAuthor(id).subscribe({
        next: (data) => (this.books = data),
        error: (err) => console.error('Error loading author books', err)
      });

      this.reviewsApiService.getByAuthorId(id).subscribe({
        next: (data) => (this.reviews = data),
        error: (err) => console.error('Error loading author reviews', err)
      });

      this.authorsApiService.getSimilarAuthors(id).subscribe({
        next: (data) => (this.similarAuthors = data),
        error: (err) => console.error('Error loading similar authors', err)
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  addToCart(event: Event, book: Book) {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addToCart(book);
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
