import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfirmOptionsModel } from '../../shared/models/confirm-options.model';
import { ConfirmService } from '../../shared/services/confirm.service';
import { ToastService } from '../../shared/services/toast.service';
import { OrderResponseModel } from '../../shared/models/order.response.model';
import { OrdersService } from '../../shared/services/orders.service';
import { ImageFallbackDirective } from '../../shared/directives/image-fallback.directive';
import { ApiImagePipe } from '../../shared/pipes/api-image.pipe';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [ApiImagePipe, RouterLink, ImageFallbackDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  readonly ordersService = inject(OrdersService);
  private readonly confirmService = inject(ConfirmService);
  private readonly toast = inject(ToastService);

  isLoading = signal(true);

  private readonly expanded = signal<Set<number>>(new Set());

  async ngOnInit() {
    await this.ordersService.load();
    this.isLoading.set(false);
  }

  isExpanded(id: number): boolean {
    return this.expanded().has(id);
  }

  toggle(id: number) {
    this.expanded.update(set => {
      const next = new Set(set);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  /** Asks first, then cancels the order (the API message is shown as a toast). */
  async cancel(order: OrderResponseModel) {
    const options = new ConfirmOptionsModel();
    options.title = `لغو سفارش ${order.id}`;
    options.message = 'سفارش لغو می‌شود و کتاب‌ها به موجودی فروشگاه برمی‌گردند. این کار برگشت‌پذیر نیست.';
    options.confirmText = 'بله، سفارش لغو شود';
    options.cancelText = 'انصراف';
    options.danger = true;

    if (!(await this.confirmService.ask(options))) {
      return;
    }

    const result = await this.ordersService.cancelOrder(order.id);

    if (result.isSuccess) {
      this.toast.success('سفارش لغو شد.');
    }
  }

  /** Copies the tracking code so it can be pasted into the carrier's tracking page. */
  async copyTrackingCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      this.toast.success('کد رهگیری کپی شد.');
    } catch {
      this.toast.warning('کپی انجام نشد. کد را دستی انتخاب کنید.');
    }
  }
}
