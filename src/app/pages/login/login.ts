import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  login() {
    const { email, password } = this.form.value;

    this.auth.login(email!, password!)
      .then(async (res) => {

        const uid = res.user.uid;

        console.log('UID:', uid);

        const role = await this.auth.getUserRole(uid);

        console.log('ROL:', role);

        if (role === 'admin') {
          this.router.navigate(['/productos']);
        } else {
          this.router.navigate(['/dashboard']);
        }

      })
      .catch(err => {
        console.error(err);

        if (err.code === 'auth/user-not-found') {
          alert('Usuario no encontrado');
        } else if (err.code === 'auth/wrong-password') {
          alert('Contraseña incorrecta');
        } else {
          alert('Error al iniciar sesión');
        }
      });
  }

  loginGoogle() {
    this.auth.loginWithGoogle()
      .then(() => {
        this.router.navigate(['/dashboard']);
      })
      .catch(err => console.error(err));
  }
}