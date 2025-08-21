import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form: FormGroup;
  submitted:boolean=false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  }
  login() {
    const { username, password } = this.form.value;
    this.auth.login(username, password).subscribe({
      next: user => {
        this.submitted=true;
        const route = user.role === 'librarian' ? '/librarian/dashboard' : '/member/dashboard';
        this.router.navigate([route]);
      },
      error: () => alert('Invalid credentials')
    });
  }


  canDeactivate(): boolean {
    if (this.form.dirty && !this.submitted) {
      return confirm('You have unsaved login data. Do you really want to leave?');
    }
    return true;
  }

}
