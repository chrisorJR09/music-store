import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '@angular/fire/auth';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  private auth = inject(Auth);
  private service = inject(AuthService);
  private router = inject(Router);

  email: string | null = null;
  isAdmin = false;

  constructor() {

    this.auth.onAuthStateChanged(async (user) => {

      if (!user) {
        this.email = null;
        this.isAdmin = false;
        return;
      }

      this.email = user.email;

      const role = await this.service.getUserRole(user.uid);
      this.isAdmin = role === 'admin';
    });
  }

  logout() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}