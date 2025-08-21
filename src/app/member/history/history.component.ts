import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Book, BookHistory } from '../../model/books.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../model/user.model';
import { AuthService } from '../../services/auth.service';
import { ReusableTableComponent } from '../../shared/reusable-table/reusable-table.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-history',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDatepickerModule, MatListModule, MatCardModule, MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  books: Book[] = [];
  userId!: number;
  selectedDate = new FormControl(new Date());
  displayedColumns: string[] = ['title', 'author', 'borrowedDate', 'dueDate', 'returnDate', 'status', 'action'];
  filteredHistory: BookHistory[] = [];
  allHistory: BookHistory[] = [];
  tableColumns = [
    { key: 'title', header: 'Title' },
    { key: 'author', header: 'Author' },
    {
      key: 'borrowDate',
      header: 'Borrowed Date',
      cell: (el: BookHistory) => el.borrowDate ? new Date(el.borrowDate).toLocaleDateString() : 'N/A'

    },
    {
      key: 'dueDate',
      header: 'Due Date',
      cell: (el: BookHistory) => el.dueDate ? new Date(el.dueDate).toLocaleDateString() : 'N/A'
    },
    {
      key: 'returnDate',
      header: 'Return Date',
      cell: (el: BookHistory) => el.returnDate ? new Date(el.returnDate).toLocaleDateString() : 'Not Returned'
    },
    { key: 'status', header: 'Status' },
    { key: 'action', header: 'Action' } // New action column
  ];

  paginatedData: BookHistory[] = [];
  pageSize = 10;
  pageIndex = 0;
  constructor(private service: ApiService, private snackBar: MatSnackBar, private authService: AuthService) { }
  ngOnInit() {
    this.authService.currentUser$.subscribe((user: User | null) => {
      if (user) {
        this.userId = user.id;
        this.viewHistory(); // Load history after userId is set
      }
    });

    this.selectedDate.valueChanges.subscribe(() => {
      this.fetchHistory();
    });

  }

  fetchHistory(): void {
    const date = this.selectedDate.value;
    if (!date) {
      this.filteredHistory = this.allHistory;
      return;
    }
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    this.filteredHistory = this.allHistory.filter(item => {
      if (!item.borrowDate) return false;
      const itemDate = new Date(item.borrowDate);
      return itemDate.getMonth() + 1 === month && itemDate.getFullYear() === year;
    });
    console.log('Filtered history:', this.filteredHistory); 
    this.updatePaginatedData();
  }

  viewHistory(): void {
    this.service.getBorrowHistory(this.userId).subscribe({
      next: data => {
        console.log('Borrow history data:', data); 
        this.allHistory = data;
        this.filteredHistory = data; // Initially show all
        this.updatePaginatedData();
      },
      error: err => console.error('Error fetching history:', err)
    });
   
  }

  returnBook(book: Book) {
    const today = new Date();
    const returnDate = today.toISOString().split('T')[0];

    let overdueFee = 0;

    if (book.dueDate) {
      const dueDate = new Date(book.dueDate);
      const overdueDays = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

      if (overdueDays > 0) {
        overdueFee = overdueDays <= 3 ? overdueDays * 20 : overdueDays * 50;
      }
    } else {
      console.warn('Due date is missing for book:', book.title);
    }

    const updatedBook: Book = {
      ...book,
      status: 'available',
      returnDate: returnDate,
    };

    this.service.updateBook(updatedBook).subscribe(() => {
      this.filteredHistory = this.filteredHistory.map(b =>
        b.id === book.id ? { ...b, ...updatedBook } : b
      );

      let message = `Returned "${book.title}".`;
      if (overdueFee > 0) {
        message += ` Overdue fee: ₹${overdueFee}`;
      }

      this.snackBar.open(message, 'Close', { duration: 3000 });
    });
  }
  onActionClick(book: Book) {
    this.returnBook(book);
  }

  updatePaginatedData() {
    const start = this.pageIndex * this.pageSize;
    this.paginatedData = this.filteredHistory.slice(start, start + this.pageSize);
    console.log('Paginated data:', this.paginatedData); 
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

}






