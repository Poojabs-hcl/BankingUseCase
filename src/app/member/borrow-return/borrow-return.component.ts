import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Book } from '../../model/books.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../model/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-borrow-return',
  imports: [CommonModule, FormsModule, MatListModule, MatCardModule, MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule],
  templateUrl: './borrow-return.component.html',
  styleUrl: './borrow-return.component.css'
})
export class BorrowReturnComponent {
  userId!: number;
  displayedColumns: string[] = ['title','author', 'status','borrowDate', 'dueDate', 'action'];
  books: Book[] = [];
  dataSource = new MatTableDataSource<Book>();
  filteredBook: Book[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  canBorrowFlag!: boolean;

  constructor(private service: ApiService, private snackBar: MatSnackBar,private authService: AuthService) {

  }
  ngOnInit(): void {
  this.authService.currentUser$.subscribe((user: User | null) => {
       if (user) {
         this.userId = user.id;
       }
     });
    this.loadBooks();
    this.canBorrow()
  }

  loadBooks(): void {
    this.service.getBooks().subscribe(books => {
      this.books = books;
      this.dataSource.data = books;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
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
      this.snackBar.open(`Borrowed "${book.title}"`, 'Close', { duration: 2000 });
      this.loadBooks();
      this.canBorrow(); 
    });
  }
}
