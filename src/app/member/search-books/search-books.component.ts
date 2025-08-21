import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Book } from './../../model/books.model'
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { User } from '../../model/user.model';
@Component({
  selector: 'app-search-books',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatListModule, MatCardModule, MatFormFieldModule, MatInputModule,MatTableModule,MatButtonModule ,MatPaginatorModule ],
  templateUrl: './search-books.component.html',
  styleUrl: './search-books.component.css'
})
export class SearchBooksComponent {
  displayedColumns: string[] = ['title', 'author', 'category', 'status','action'];
  dataSource = new MatTableDataSource<Book>();
  searchTerm: string = '';
  userId!: number;
  canBorrowFlag!: boolean;
  filteredBook: Book[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder, private service: ApiService,private snackBar: MatSnackBar,private authService: AuthService) {
    this.authService.currentUser$.subscribe((user: User | null) => {
         if (user) {
           this.userId = user.id;
         }
       });
  }

  ngOnInit(): void {
    this.loadBooks();
    this.canBorrow()
  }

  loadBooks(): void {
    this.service.getBooks().subscribe(books => {
      
      this.dataSource.data = books;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  applyFilter(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }
 
  canBorrow(): void {
    this.service.searchMember(this.userId).subscribe(books => {
     this.filteredBook = books.filter(book => book.borrowedBy === this.userId);
      this.canBorrowFlag = this.filteredBook.length < 3;
    });
  }

  borrowBook(book: Book): void {
    if (!this.canBorrowFlag) {
      this.snackBar.open('You can only borrow up to 3 books.', 'Close', { duration: 3000 });
      return;
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const updatedBook: Book = {
      ...book,
      status: 'borrowed',
      borrowedBy: this.userId,
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0]
    };

    this.service.updateBook(updatedBook).subscribe(() => {
      this.filteredBook = this.filteredBook.map(b =>
        b.id === book.id ? { ...b, ...updatedBook } : b
      );
      this.snackBar.open(`Borrowed "${book.title}"`, 'Close', { duration: 2000 });
      // this.loadBooks();
      // this.canBorrow(); 
    });
  }
}
