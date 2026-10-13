import { ChangeDetectionStrategy, Component, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

/** Password input with an eye button that shows or hides what was typed. */
@Component({
  selector: 'app-password-field',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './password-field.component.html',
  styleUrl: './password-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordFieldComponent {
  label = input.required<string>();
  autocomplete = input('current-password');
  name = input('password');
  value = model('');

  visible = signal(false);

  toggleVisible(): void {
    this.visible.update(isVisible => !isVisible);
  }
}
