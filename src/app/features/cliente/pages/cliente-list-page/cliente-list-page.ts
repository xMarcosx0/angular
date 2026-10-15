// src/app/features/cliente/pages/cliente-list-page/cliente-list-page.ts
 
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Header } from '../../../../shared/components/header/header';
import { Nav } from '../../../../shared/components/nav/nav';
import { Footer } from '../../../../shared/components/footer/footer';
import { ClienteService } from '../../services/cliente';
 
@Component({
  selector: 'app-cliente-list-page',
  standalone: true,
  imports: [CommonModule, Header, Nav, Footer],
  templateUrl: './cliente-list-page.html',
  styleUrl: './cliente-list-page.css'
})
export class ClienteListPage {
  // Inyección de dependencias (Angular 17+ inject())
  clienteService = inject(ClienteService);
  router         = inject(Router);
 
  irANuevo(): void {
    this.router.navigate(['/clientes/nuevo']);
  }
 
  irAEditar(id: number): void {
    this.router.navigate(['/clientes/editar', id]);
  }
 
  eliminar(id: number): void {
    if (confirm('¿Deseas eliminar este cliente?')) {
      this.clienteService.eliminarCliente(id);
    }
  }
}
