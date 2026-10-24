import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
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
}
