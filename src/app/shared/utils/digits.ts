// Persian (۰-۹) and Arabic-Indic (٠-٩) digits -> Latin digits, so people can type the
// mobile number or the code with the Persian keyboard.
const PERSIAN_ZERO = 0x06f0;
const ARABIC_ZERO = 0x0660;

export function normalizeDigits(value: string): string {
  let result = '';

  for (const character of value) {
    const code = character.charCodeAt(0);

    if (code >= PERSIAN_ZERO && code <= PERSIAN_ZERO + 9) {
      result += String(code - PERSIAN_ZERO);
    } else if (code >= ARABIC_ZERO && code <= ARABIC_ZERO + 9) {
      result += String(code - ARABIC_ZERO);
    } else {
      result += character;
    }
  }

  return result.trim();
}
