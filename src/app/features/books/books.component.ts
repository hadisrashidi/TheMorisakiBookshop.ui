import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BooksApiService } from './services/books.api.service';
import { Book } from '../home/models/book.model';

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
  book: Book = new Book();

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getBookDetails(id);
 
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

specs = [
  { label: 'تعداد صفحات', value: '689' },
  { label: 'تعداد جلد', value: '1' },
  { label: 'زبان کتاب', value: 'انگلیسی' },
  { label: 'شابک / ISBN', value: '9781292241580' },
  { label: 'قطع', value: 'رقعی' },
  { label: 'ناشر', value: 'Forever' },
  { label: 'نوع جلد', value: 'نرم' },
  { label: 'نوع چاپ', value: 'سیاه و سفید' },
  { label: 'نوع کاغذ', value: 'بالک' },
  { label: 'نویسنده / نویسندگان', value: 'Callie Hart' },
  { label: 'ژانر', value: 'عاشقانه فانتزی' },
];
relatedBooks = [
  { title: 'کتاب ۱', price: 70000, image: 'https://picsum.photos/50/70?1' },
  { title: 'کتاب ۲', price: 86000, image: 'https://picsum.photos/50/70?2' },
  { title: 'کتاب ۳', price: 86000, image: 'https://picsum.photos/50/70?2' },

];

similarBooks = [
  { title: 'کتاب مشابه ۱', price: 240000, image: 'https://picsum.photos/200/300?1' },
  { title: 'کتاب مشابه ۲', price: 240000, image: 'https://picsum.photos/200/300?2' },
  { title: 'کتاب مشابه ۳', price: 240000, image: 'https://picsum.photos/200/300?3' },
];
}
