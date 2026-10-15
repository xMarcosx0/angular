import { Injectable, signal } from '@angular/core';

export interface Usuario {
  nombre: string;
  email: string;
  telefono: string;
  rol: 'Administrador' | 'Trabajador' | 'Veterinario';
  avatar: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Lista de usuarios predefinidos
  readonly usuarios: Usuario[] = [
    {
      nombre: 'Marcos Márquez',
      email: 'mmarquez@gmail.com',
      telefono: '+57 300 876 5432',
      rol: 'Administrador',
      avatar: 'MM'
    },
    {
      nombre: 'Emily Mercado',
      email: 'emercado@gmail.com',
      telefono: '+57 315 432 1098',
      rol: 'Veterinario',
      avatar: 'EM'
    },
    {
      nombre: 'Brayan Muñoz',
      email: 'bmunoz@gmail.com',
      telefono: '+57 320 654 9871',
      rol: 'Trabajador',
      avatar: 'BM'
    }
  ];

  // Usuario actual logueado
  usuarioActual = signal<Usuario | null>(null);

  seleccionarUsuarioYRol(usuario: Usuario) {
    this.usuarioActual.set(usuario);
  }
}