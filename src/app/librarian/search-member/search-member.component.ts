import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { Book } from './../../model/books.model'
import { ApiService } from '../../services/api.service';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, Subject, switchMap } from 'rxjs';



@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatListModule, MatCardModule, MatFormFieldModule, MatInputModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class LibrarianDashboardComponent {

  idform: FormGroup;
  titleform: FormGroup;

  memberId: number | null = null;
  bookTitle: string = '';
  memberBooks: Book[] = [];
  searchedBooks: Book[] = [];

  constructor(private fb: FormBuilder, private librarianService: ApiService) {
    this.idform = this.fb.group({
      memberId: new FormControl(null, Validators.required)
    });
    this.titleform = this.fb.group({
      bookTitle: new FormControl('', Validators.required)
    });
  }
  ngOnInit() {
    this.searchBooksByTitle();
   // this.searchMemberBooks();
  }
 

  searchMemberBooks() {
    const memberId = this.idform.get('memberId')?.value;
console.log(memberId)
   if (memberId !== null && memberId !== undefined) {
     
      this.librarianService.searchMember(memberId).pipe(
        map(books => books.filter(book => book.borrowedBy === memberId)),
        catchError(error => {
          console.error('Error fetching member books:', error);
          return of([]);
        })
      ).subscribe(filteredBooks => {
        this.memberBooks = filteredBooks;
      });


    }


  }

  searchBooksByTitle() {
    this.titleform.get('bookTitle')?.valueChanges.pipe(
      debounceTime(300), // Wait 300ms after the last keystroke
      distinctUntilChanged(), // Only emit if the value changed
      switchMap(title =>
        this.librarianService.searchBookByTitle(title ?? '')
      )
    ).subscribe(data => {
      const searchTerm = (this.titleform.get('bookTitle')?.value ?? '').trim().toLowerCase();
      console.log(searchTerm)
      this.searchedBooks = data.filter(book =>
        book.title.toLowerCase().includes(searchTerm)
      );
    });

  }
}

