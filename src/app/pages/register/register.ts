import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  form = this.fb.group({
    nombre: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],

    password: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d_]+$/)
    ]],

    confirmPassword: ['', [Validators.required]]
  });

  async register() {
    console.log("Click detectado");

    console.log('FORM STATUS:', this.form.status);
    console.log('FORM VALUE:', this.form.value);

    if (this.form.invalid) {
      alert('Formulario inválido. Revisa los campos');
      return;
    }

    const { email, password, confirmPassword } = this.form.value;

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      const userCredential = await this.auth.register(email!, password!);
      console.log('Usuario creado', userCredential);
    } catch (err) {
      console.error(err);
    }
  }
}