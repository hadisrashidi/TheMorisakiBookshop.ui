import { Injectable, signal } from '@angular/core';
import { ConfirmOptionsModel } from '../models/confirm-options.model';

/** The dialog that is open right now, with the function that answers it. */
export interface OpenConfirm {
  options: ConfirmOptionsModel;
  answer: (agreed: boolean) => void;
}

/**
 * Asks the person to confirm an action in a small dialog (instead of the browser's confirm()):
 * `if (await confirmService.ask(options)) { ... }`. The dialog itself is drawn by ConfirmDialogComponent.
 */
@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private readonly openConfirmSignal = signal<OpenConfirm | null>(null);

  openConfirm = this.openConfirmSignal.asReadonly();

  /** Resolves true when the person agrees, false on "cancel", Escape or a click outside. */
  ask(options: ConfirmOptionsModel): Promise<boolean> {
    // A second question while one is open: the first one is cancelled.
    this.openConfirmSignal()?.answer(false);

    return new Promise<boolean>(resolve => {
      this.openConfirmSignal.set({
        options,
        answer: (agreed: boolean) => {
          this.openConfirmSignal.set(null);
          resolve(agreed);
        }
      });
    });
  }
}
