import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth.guard';
import { CanDeactivateGuard } from './can-deactivate.guard';
import { AuthChildGuard } from './can-activate-child.guard';


export const routes: Routes = [
  { path: 'login', component: LoginComponent,canDeactivate:[CanDeactivateGuard] },


  {
    path: 'member',
    loadChildren: () =>
      import('./member/member.module').then(m => m.MemberModule),
canActivate: [AuthGuard],

  },
  {
    path: 'librarian',
    loadChildren: () =>
      import('./librarian/librarian.module').then(m => m.LibrarianModule),
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }

];
