import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LegalPageModel } from '../../shared/models/legal-page.model';
import { LEGAL_PAGES } from './legal-pages';

@Component({
  selector: 'app-legal-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './legal-page.component.html',
  styleUrl: './legal-page.component.scss'
})
export class LegalPageComponent {
  private readonly route = inject(ActivatedRoute);

  // The route says which text to show: { path: 'terms', data: { page: 'terms' } }.
  readonly page: LegalPageModel = LEGAL_PAGES[this.route.snapshot.data['page']] ?? new LegalPageModel();
}
