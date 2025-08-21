import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
      path: 'dashboard',
      loadComponent: () =>
        import('./dashboard/dashboard.component').then(m => m.MemberDashboardComponent)
    },
    {
      path: 'search-books',
      loadComponent: () =>
        import('./search-books/search-books.component').then(m => m.SearchBooksComponent)
    },
    {
      path: 'borrow-return',
      loadComponent: () =>
        import('./borrow-return/borrow-return.component').then(m => m.BorrowReturnComponent)
    },
    {
      path: 'history',
      loadComponent: () =>
        import('./history/history.component').then(m => m.HistoryComponent)
    }
  ];
  
  

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class MemberRoutingModule { }
  
  
  