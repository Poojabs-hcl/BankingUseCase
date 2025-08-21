import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable, of } from 'rxjs';
import {Book, BookHistory} from'./../model/books.model'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Books
 
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/books`);
  }

  searchBooks(query: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}?q=${query}`);
  }


  updateBook(book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.baseUrl}/books/${book.id}`, book);
  }

  // Borrow History
  getBorrowHistory(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/bookHistory?borrowedBy=${userId}`);
  }

  
getHistoryByUserAndDate(userId: number, month: number, year: number): Observable<BookHistory[]> {
  return this.http.get<BookHistory[]>(`${this.baseUrl}?userId=${userId}`);
}


  // Librarian-specific
 
searchMember(memberId: number): Observable<Book[]> {
if (memberId != null) {
  return this.http.get<Book[]>(`${this.baseUrl}/books?borrowedBy=${memberId}`);
} else {
  return of([]); // or handle error
}
//return this.http.get<Book[]>(`${this.baseUrl}/books?borrowedBy=${memberId}`);
}


searchBookByTitle(title: string): Observable<Book[]> {
  return this.http.get<Book[]>(`${this.baseUrl}/books?title_like=${title}`);
}

}





