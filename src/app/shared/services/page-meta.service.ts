import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export const SITE_NAME = 'کتابفروشی موریساکی';
export const DEFAULT_DESCRIPTION = 'کتابفروشی موریساکی، خانه‌ای برای کتاب‌های محبوب شما.';
const MAX_DESCRIPTION_LENGTH = 160;

@Injectable({
  providedIn: 'root'
})
export class PageMetaService {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);

  /**
   * Sets the browser tab title and the search-engine description of the current page.
   * @param title - Page title; the shop name is added after it
   * @param description - Optional short text, cut to 160 characters; the shop description is used when empty
   */
  set(title: string, description?: string): void {
    this.titleService.setTitle(title + ' | ' + SITE_NAME);

    const text = description ? description.trim() : '';
    const shortDescription = text.slice(0, MAX_DESCRIPTION_LENGTH);
    this.metaService.updateTag({ name: 'description', content: shortDescription || DEFAULT_DESCRIPTION });
  }

  /** The title of the home page and the fallback description. */
  setDefault(): void {
    this.titleService.setTitle(SITE_NAME);
    this.metaService.updateTag({ name: 'description', content: DEFAULT_DESCRIPTION });
  }
}
