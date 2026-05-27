import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {

  const auth = inject(Auth);
  const router = inject(Router);
  const service = inject(AuthService);

  return new Promise(async (resolve) => {

    onAuthStateChanged(auth, async (user) => {

      // NO HAY SESIÓN
      if (!user) {
        router.navigate(['/login']);
        resolve(false);
        return;
      }

      // LEER ROL
      const role = await service.getUserRole(user.uid);

      // ES ADMIN
      if (role === 'admin') {
        resolve(true);
      } else {

        // NO ES ADMIN
        router.navigate(['/dashboard']);
        resolve(false);
      }

    });

  });

};