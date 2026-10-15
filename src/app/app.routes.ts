import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';

// Importaciones con la ruta exacta al archivo dashboard.ts
import { Dashboard as AdminDashboard } from './features/admin/dashboard/dashboard';
import { Dashboard as VetDashboard } from './features/veterinario/dashboard/dashboard';
import { Dashboard as TrabajadorDashboard } from './features/trabajador/dashboard/dashboard';

export const routes: Routes = [
  // 1. Redirección inicial al login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 2. Ruta del Login
  { path: 'login', component: LoginComponent },

  // 3. Rutas de cada Rol
  { path: 'admin/dashboard', component: AdminDashboard },
  { path: 'veterinario/dashboard', component: VetDashboard },
  { path: 'trabajador/dashboard', component: TrabajadorDashboard },

  // 4. Ruta comodín
  { path: '**', redirectTo: 'login' }
];