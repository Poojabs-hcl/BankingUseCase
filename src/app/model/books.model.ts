export interface Book{

id: number;
  title: string;
  author: string;
  category: string;
  status: 'available' | 'borrowed' | 'overdue';
  borrowedBy: number|null;
  borrowDate?: string;
  dueDate?: string;
  returnDate?:string;
}

export interface BorrowedBook {
    id: number;
    borrowedBy: number;
    bookId: number;
    borrowDate: string;
    dueDate: string | null;
  }
  export interface BookHistory {
    id: number;
    userId: number;
    title: string;
    author: string;
    borrowDate?: string;
    dueDate?: string;
  returnDate?:string; // ISO format: YYYY-MM-DD
  }
  
  