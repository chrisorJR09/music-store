import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // <-- 1. Importamos SweetAlert2

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

  // Configuración opcional: Un "Toast" limpio que desaparece solo en 2 segundos
  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  login() {
    const { email, password } = this.form.value;

    // Mostramos una alerta de carga (loading) mientras Firebase responde
    Swal.fire({
      title: 'Iniciando sesión...',
      text: 'Por favor, espera un momento.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.auth.login(email!, password!)
      .then(async (res) => {
        const uid = res.user.uid;
        console.log('UID:', uid);

        const role = await this.auth.getUserRole(uid);
        console.log('ROL:', role);

        // Cerramos el loading y avisamos del éxito
        this.Toast.fire({
          icon: 'success',
          title: '¡Bienvenido de vuelta!'
        });

        if (role === 'admin') {
          this.router.navigate(['/productos']);
        } else {
          this.router.navigate(['/dashboard']);
        }

      })
      .catch(err => {
        console.error(err);
        
        // Estructura limpia para manejar los errores con SweetAlert interactivo
        let mensajeError = 'Error al iniciar sesión';
        
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          mensajeError = 'El correo electrónico no está registrado.';
        } else if (err.code === 'auth/wrong-password') {
          mensajeError = 'La contraseña es incorrecta.';
        } else if (err.code === 'auth/too-many-requests') {
          mensajeError = 'Demasiados intentos fallidos. Cuenta bloqueada temporalmente.';
        }

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: mensajeError,
          confirmButtonColor: '#3085d6'
        });
      });
  }

  loginGoogle() {
    this.auth.loginWithGoogle()
      .then(() => {
        this.Toast.fire({
          icon: 'success',
          title: 'Sesión iniciada con Google'
        });
        this.router.navigate(['/dashboard']);
      })
      .catch(err => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text: 'No se pudo completar el inicio de sesión con Google.',
          confirmButtonColor: '#d33'
        });
      });
  }
}