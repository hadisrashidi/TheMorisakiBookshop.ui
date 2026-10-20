import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

// Images uploaded from the admin panel are stored as "/uploads/..." and live on the API server;
// the covers that ship with the UI ("/covers/...") stay as they are.
const API_ORIGIN = environment.apiUrl.replace(/\/api$/, '');

@Pipe({
  name: 'apiImage',
  standalone: true
})
export class ApiImagePipe implements PipeTransform {
  transform(path: string | null | undefined): string {
    if (!path) {
      return '';
    }

    if (path.startsWith('/uploads/')) {
      return API_ORIGIN + path;
    }

    return path;
  }
}
