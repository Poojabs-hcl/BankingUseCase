import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
      path: 'dashboard',
      loadComponent: () =>
        import('./dashboard/dashboard.component').then(m => m.LibrarianDashboardComponent)
    }
  ];
  
  

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class LibrarianRoutingModule { }
  
  
  