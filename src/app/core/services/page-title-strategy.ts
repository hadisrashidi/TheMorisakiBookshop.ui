import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { PageMetaService } from '../../shared/services/page-meta.service';

// Runs after every navigation: sets the tab title from the route's `title`
// (the home page has none) and resets the description. Pages that load data
// (book, author) call PageMetaService again when their data arrives.
@Injectable({
  providedIn: 'root'
})
export class PageTitleStrategy extends TitleStrategy {
  private readonly pageMetaService = inject(PageMetaService);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot);

    if (title) {
      this.pageMetaService.set(title, this.findDescription(snapshot));
    } else {
      this.pageMetaService.setDefault();
    }
  }

  // A route may carry a description in its data: { description: '...' }.
  private findDescription(snapshot: RouterStateSnapshot): string {
    let route: ActivatedRouteSnapshot | null = snapshot.root;
    let description = '';

    while (route) {
      if (route.data['description']) {
        description = route.data['description'];
      }
      route = route.firstChild;
    }

    return description;
  }
}
