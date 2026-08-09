import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from './models/book.model';
import { HttpClientModule } from '@angular/common/http';
import { HomeApiService } from './services/home.api.service';
import { Author } from './models/author.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  private router = inject(Router);
  private homeApiService = inject(HomeApiService)
  featuredBooks: Book[] = [];

  newBooks: Book[] = [];

  authors: Author[] = [];
  ngOnInit(): void {
    this.getBooks();
    this.getNewBooks();
    this.getAuthors();

  }
 goToBookDetail(id: number | undefined) {
  this.router.navigate(['/books', id]);
}
  getBooks() {
    this.homeApiService.getBooks().subscribe(
      (data) => {
        this.featuredBooks = data;
      },
      (error) => {
        console.error('Error fetching books', error);
      }
    );
  }
    getAuthors() {
    this.homeApiService.getAuthors().subscribe(
      (data) => {
        this.authors = data;
      },
      (error) => {
        console.error('Error fetching books', error);
      }
    );
  }
   getNewBooks() {
    this.homeApiService.getNewBooks().subscribe(
      (data) => {
        this.newBooks = data;
      },
      (error) => {
        console.error('Error fetching books', error);
      }
    );
  }
}
