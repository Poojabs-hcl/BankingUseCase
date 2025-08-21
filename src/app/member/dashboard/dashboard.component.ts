import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { User } from '../../model/user.model';


@Component({
  selector: 'app-dashboard',
  imports: [MatToolbarModule,RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class MemberDashboardComponent {
 user!:User|null;

  constructor(private auth: AuthService, private router: Router) {}
  ngOnInit(){
    this.auth.currentUser$.subscribe((user:User|null) => {
      if (user) {
        this.user = user;
      }
    });

  }

  logout() {
    this.auth.logout();
  this.router.navigate(['/login']); 

  }
}
