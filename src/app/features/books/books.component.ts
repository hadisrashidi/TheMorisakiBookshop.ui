import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BooksApiService } from './services/books.api.service';
import { Book } from '../home/models/book.model';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})

export class BooksComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private booksApiService = inject(BooksApiService);
  private cartService = inject(CartService);
  book: Book = new Book();
  relatedBooks: Book[] = [];
  similarBooks: Book[] = [];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getBookDetails(id);
    this.getRelatedBooks(id);
    this.getSimilarBooks(id);
  }

  getBookDetails(id: number) {
    this.booksApiService.getBookById(id).subscribe({
      next: (data) => {
        this.book = data;
      },
      error: (err) => {
        console.error('Error loading book', err);
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

  addToCart() {
    this.cartService.addToCart(this.book);
  }
}
