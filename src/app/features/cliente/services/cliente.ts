// src/app/features/cliente/services/cliente.service.ts
 
import { Injectable, signal } from '@angular/core';
import { Cliente } from '../models/cliente.models';
 
@Injectable({
  providedIn: 'root'   // Singleton: disponible en toda la app
})
export class ClienteService {
 
  // Signal privado: la lista solo se modifica desde aquí
  private _clientes = signal<Cliente[]>([
    { id: 1, nombre: 'Ana García',    email: 'ana@email.com',    telefono: '3001234567' },
    { id: 2, nombre: 'Carlos López',  email: 'carlos@email.com', telefono: '3107654321' },
    { id: 3, nombre: 'María Pérez',   email: 'maria@email.com',  telefono: '3209876543' },
  ]);
 
  // Propiedad pública de solo lectura (los componentes solo leen)
  readonly clientes = this._clientes.asReadonly();
 
  // Contador para generar IDs únicos
  private nextId = 4;
 
  // ── Obtener todos ──────────────────────────────────────
  obtenerClientes(): Cliente[] {
    return this._clientes();
  }
 
  // ── Obtener por ID ─────────────────────────────────────
  obtenerClientePorId(id: number): Cliente | undefined {
    return this._clientes().find(c => c.id === id);
  }
 
  // ── Agregar ────────────────────────────────────────────
  agregarCliente(cliente: Omit<Cliente, 'id'>): void {
    const nuevo: Cliente = { id: this.nextId++, ...cliente };
    this._clientes.update(lista => [...lista, nuevo]);
  }
 
  // ── Actualizar ─────────────────────────────────────────
  actualizarCliente(cliente: Cliente): void {
    this._clientes.update(lista =>
      lista.map(c => c.id === cliente.id ? cliente : c)
    );
  }
 
  // ── Eliminar ───────────────────────────────────────────
  eliminarCliente(id: number): void {
    this._clientes.update(lista => lista.filter(c => c.id !== id));
  }
}
