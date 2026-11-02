import { ChangeDetectionStrategy, Component, ElementRef, HostListener, effect, inject, viewChild } from '@angular/core';
import { ConfirmService } from '../../services/confirm.service';

/** Draws the dialog of ConfirmService. Put it once in the layout, next to the toast host. */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  readonly confirmService = inject(ConfirmService);

  private readonly cancelButton = viewChild<ElementRef<HTMLButtonElement>>('cancelButton');
  private elementBeforeDialog: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const isOpen = this.confirmService.openConfirm() !== null;
      const button = this.cancelButton();

      if (isOpen && button) {
        // The safe answer gets the focus, so a quick Enter never confirms a destructive action by accident.
        this.elementBeforeDialog = document.activeElement as HTMLElement | null;
        button.nativeElement.focus();
      } else if (!isOpen && this.elementBeforeDialog) {
        this.elementBeforeDialog.focus();
        this.elementBeforeDialog = null;
      }
    });
  }

  answer(agreed: boolean): void {
    this.confirmService.openConfirm()?.answer(agreed);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.confirmService.openConfirm() !== null) {
      this.answer(false);
    }
  }

  // Keeps Tab inside the dialog while it is open.
  onKeydown(event: KeyboardEvent, firstButton: HTMLButtonElement, lastButton: HTMLButtonElement): void {
    if (event.key !== 'Tab') {
      return;
    }

    if (event.shiftKey && document.activeElement === firstButton) {
      event.preventDefault();
      lastButton.focus();
    } else if (!event.shiftKey && document.activeElement === lastButton) {
      event.preventDefault();
      firstButton.focus();
    }
  }
}
