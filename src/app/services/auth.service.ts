import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { User } from './../model/user.model'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:3000';


  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<User> {
    return this.http.get<User[]>(`http://localhost:3000/users?username=${username}&password=${password}`)
      .pipe(
        map(users => {
          if (users.length) {
            this.currentUserSubject.next(users[0]);
            return users[0];
          }
          throw new Error('Invalid credentials');
        })
      );
  }

  logout() {
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
  
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isMember(): boolean {
    return this.isAuthenticated() && this.currentUserSubject?.value?.role === 'librarian';
  }

}

