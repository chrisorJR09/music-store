import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { ProductosComponent } from './pages/productos/productos';
import { LandingComponent } from './pages/landing/landing';

import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [

    //LANDING (PRIMERA PÁGINA)
    {
        path: '',
        component: LandingComponent
    },

    //LOGIN Y REGISTER
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },

    //USUARIO NORMAL
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
    },

    //ADMIN
    {
        path: 'productos',
        component: ProductosComponent,
        canActivate: [adminGuard]
    },

    // fallback
    {
        path: '**',
        redirectTo: ''
    }
];