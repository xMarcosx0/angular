import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, Usuario } from '../../cliente/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  // Redirecciona según el rol presionado
  ingresarConRol(usuario: Usuario) {
    this.authService.seleccionarUsuarioYRol(usuario);

    switch (usuario.rol) {
      case 'Administrador':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'Veterinario':
        this.router.navigate(['/veterinario/dashboard']);
        break;
      case 'Trabajador':
        this.router.navigate(['/trabajador/dashboard']);
        break;
    }
  }
}