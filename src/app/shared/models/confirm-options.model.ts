/** What a confirmation dialog says. */
export class ConfirmOptionsModel {
  title = '';
  message = '';
  /** Text of the button that agrees. */
  confirmText = 'تأیید';
  /** Text of the button that backs out. */
  cancelText = 'انصراف';
  /** true = the agree button is red (the action cannot be undone). */
  danger = false;
}
