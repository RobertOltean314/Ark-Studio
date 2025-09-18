import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Quote {
  text: string;
  author: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private apiUrl = 'https://zenquotes.io/api/random?category=motivational';

  constructor(private http: HttpClient) {}

  getRandomQuote(): Observable<Quote> {
    return this.http.get<{ q: string; a: string; h: string }[]>(this.apiUrl).pipe(
      map(response => {
        const quoteData = response[0];
        return {
          text: quoteData.q,
          author: quoteData.a || 'Unknown'
        };
      }),
      catchError((error) => {
        console.error('Failed to fetch quote from ZenQuotes API:', error);
        return of({ text: 'Keep creating, no matter what!', author: 'Your App' });
      })
    );
  }
}