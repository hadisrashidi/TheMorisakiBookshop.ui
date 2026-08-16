import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrdersService } from '../../shared/services/orders.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {

  ordersService = inject(OrdersService);

  private expanded = signal<Set<string>>(new Set());

  isExpanded(id: string): boolean {
    return this.expanded().has(id);
  }

  toggle(id: string) {
    this.expanded.update(set => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
}
