import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HtmlService {
  htmlUnboxing(html: string): Observable<string> {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return of(doc.documentElement.textContent || '');
  }
}
