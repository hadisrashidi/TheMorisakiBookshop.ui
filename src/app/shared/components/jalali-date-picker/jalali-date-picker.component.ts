import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, forwardRef, inject, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  JALALI_MONTHS,
  JALALI_WEEKDAYS,
  JalaliDate,
  firstWeekdayOfJalaliMonth,
  formatJalali,
  jalaliMonthLength,
  parseJalali,
  todayJalali
} from '../../utils/jalali';

@Component({
  selector: 'app-jalali-date-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jalali-date-picker.component.html',
  styleUrl: './jalali-date-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JalaliDatePickerComponent),
      multi: true
    }
  ]
})
export class JalaliDatePickerComponent implements ControlValueAccessor {

  private host = inject(ElementRef<HTMLElement>);

  readonly months = JALALI_MONTHS;
  readonly weekdays = JALALI_WEEKDAYS;

  // Birth dates are decades back, so paging month-by-month is useless —
  // the header offers direct year and month selection instead.
  readonly years: number[] = (() => {
    const thisYear = todayJalali().jy;
    const list: number[] = [];
    for (let y = thisYear; y >= thisYear - 110; y -= 1) {
      list.push(y);
    }
    return list;
  })();

  open = signal(false);
  text = signal('');
  selected = signal<JalaliDate | null>(null);

  // Which month the calendar grid is showing (independent of selection).
  viewYear = signal(todayJalali().jy);
  viewMonth = signal(todayJalali().jm);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  // Leading blanks so the 1st lands in the right weekday column.
  days = signal<(number | null)[]>([]);

  constructor() {
    this.rebuildGrid();
  }

  writeValue(value: string): void {
    this.text.set(value ?? '');
    const parsed = parseJalali(value ?? '');
    this.selected.set(parsed);
    if (parsed) {
      this.viewYear.set(parsed.jy);
      this.viewMonth.set(parsed.jm);
    }
    this.rebuildGrid();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  toggle() {
    this.open.update(v => !v);
    if (this.open()) {
      const current = this.selected() ?? todayJalali();
      this.viewYear.set(current.jy);
      this.viewMonth.set(current.jm);
      this.rebuildGrid();
    }
  }

  // Typing stays allowed — the calendar is a convenience, not the only
  // way in. An unparseable string is kept as-is so the field doesn't
  // fight the user mid-edit.
  onTextInput(value: string) {
    this.text.set(value);
    const parsed = parseJalali(value);
    this.selected.set(parsed);
    if (parsed) {
      this.viewYear.set(parsed.jy);
      this.viewMonth.set(parsed.jm);
      this.rebuildGrid();
    }
    this.onChange(value);
  }

  prevMonth() {
    let m = this.viewMonth() - 1;
    let y = this.viewYear();
    if (m < 1) {
      m = 12;
      y -= 1;
    }
    this.viewMonth.set(m);
    this.viewYear.set(y);
    this.rebuildGrid();
  }

  nextMonth() {
    let m = this.viewMonth() + 1;
    let y = this.viewYear();
    if (m > 12) {
      m = 1;
      y += 1;
    }
    this.viewMonth.set(m);
    this.viewYear.set(y);
    this.rebuildGrid();
  }

  setYear(value: string) {
    this.viewYear.set(Number(value));
    this.rebuildGrid();
  }

  setMonth(value: string) {
    this.viewMonth.set(Number(value));
    this.rebuildGrid();
  }

  jumpToToday() {
    const t = todayJalali();
    this.viewYear.set(t.jy);
    this.viewMonth.set(t.jm);
    this.rebuildGrid();
  }

  pick(day: number | null) {
    if (day === null) {
      return;
    }
    const date: JalaliDate = { jy: this.viewYear(), jm: this.viewMonth(), jd: day };
    this.selected.set(date);
    const formatted = formatJalali(date);
    this.text.set(formatted);
    this.onChange(formatted);
    this.onTouched();
    this.open.set(false);
  }

  isSelected(day: number | null): boolean {
    const s = this.selected();
    return (
      day !== null &&
      s !== null &&
      s.jy === this.viewYear() &&
      s.jm === this.viewMonth() &&
      s.jd === day
    );
  }

  isToday(day: number | null): boolean {
    const t = todayJalali();
    return day !== null && t.jy === this.viewYear() && t.jm === this.viewMonth() && t.jd === day;
  }

  private rebuildGrid() {
    let length: number;
    let offset: number;
    try {
      length = jalaliMonthLength(this.viewYear(), this.viewMonth());
      offset = firstWeekdayOfJalaliMonth(this.viewYear(), this.viewMonth());
    } catch {
      this.days.set([]);
      return;
    }

    const cells: (number | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= length; d += 1) {
      cells.push(d);
    }
    this.days.set(cells);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
      this.onTouched();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.open()) {
      this.open.set(false);
    }
  }
}
