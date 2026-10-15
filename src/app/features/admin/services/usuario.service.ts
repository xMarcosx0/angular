import { Injectable, signal } from '@angular/core';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  rol: 'Administrador' | 'Trabajador' | 'Veterinario';
  estado: 'Activo' | 'Inactivo';
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuarios = signal<Usuario[]>([
    { id: 1, nombre: 'Marcos Márquez', email: 'mmarquez@gmail.com', telefono: '+57 300 876 5432', rol: 'Administrador', estado: 'Activo' },
    { id: 2, nombre: 'Emily Mercado', email: 'emercado@gmail.com', telefono: '+57 315 432 1098', rol: 'Veterinario', estado: 'Activo' },
    { id: 3, nombre: 'Brayan Muñoz', email: 'bmunoz@gmail.com', telefono: '+57 320 654 9871', rol: 'Trabajador', estado: 'Activo' }
  ]);
}   