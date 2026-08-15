import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface FaqEntry {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent {

  entries: FaqEntry[] = [
    {
      question: 'چگونه سفارش خود را ثبت کنم؟',
      answer: 'کتاب مورد نظر خود را به سبد خرید اضافه کنید، سپس از صفحه سبد خرید مراحل ثبت سفارش را دنبال کنید.'
    },
    {
      question: 'شیوه‌های پرداخت چیست؟',
      answer: 'پرداخت به‌صورت آنلاین و از طریق درگاه بانکی معتبر انجام می‌شود.'
    },
    {
      question: 'ارسال سفارش چقدر طول می‌کشد؟',
      answer: 'سفارش‌ها معمولاً ظرف ۲ تا ۵ روز کاری برای شهرهای مختلف کشور ارسال می‌شوند.'
    },
    {
      question: 'شرایط بازگشت کالا چیست؟',
      answer: 'در صورت وجود مغایرت یا آسیب‌دیدگی، تا ۷ روز پس از دریافت سفارش امکان بازگشت کالا وجود دارد.'
    },
  ];
}
