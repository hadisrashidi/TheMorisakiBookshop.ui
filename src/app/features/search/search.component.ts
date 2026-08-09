import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../home/models/book.model';
import { SearchApiService } from './services/search.api.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private searchApiService = inject(SearchApiService);

  query = '';
  results: Book[] = [];
  loading = false;

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.query = params.get('q') ?? '';
      this.search();
    });
  }

  search() {
    this.loading = true;
    this.searchApiService.searchBooks(this.query).subscribe({
      next: (data) => {
        this.results = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error searching books', err);
        this.loading = false;
      }
    });
  }

  goToBookDetail(id: number | undefined) {
    this.router.navigate(['/books', id]);
  }
}
