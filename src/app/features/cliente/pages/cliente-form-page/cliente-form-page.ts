// src/app/features/cliente/pages/cliente-form-page/cliente-form-page.ts
 
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Header } from '../../../../shared/components/header/header';
import { Nav } from '../../../../shared/components/nav/nav';
import { Footer } from '../../../../shared/components/footer/footer';
import { ClienteForm } from '../../components/cliente-form/cliente-form';
import { ClienteService } from '../../services/cliente';
 
@Component({
  selector: 'app-cliente-form-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, Header, Nav, Footer, ClienteForm],
  templateUrl: './cliente-form-page.html',
  styleUrl: './cliente-form-page.css'
})
export class ClienteFormPage implements OnInit {
 
  private fb             = inject(FormBuilder);
  private router         = inject(Router);
  private route          = inject(ActivatedRoute);
  private clienteService = inject(ClienteService);
 
  // ID del cliente a editar (null = modo crear)
  clienteId: number | null = null;
  esEdicion = false;
 
  form = this.fb.group({
    nombre:   ['', Validators.required],
    email:    ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required]
  });
 
  ngOnInit(): void {
    // Si la ruta tiene :id, estamos en modo edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clienteId = Number(id);
      this.esEdicion = true;
      const cliente = this.clienteService.obtenerClientePorId(this.clienteId);
      if (cliente) {
        // Rellenar el formulario con los datos existentes
        this.form.patchValue({
          nombre:   cliente.nombre,
          email:    cliente.email,
          telefono: cliente.telefono
        });
      }
    }
  }
 
  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();  // Muestra errores de validación
      return;
    }
 
    const valores = this.form.value as { nombre: string; email: string; telefono: string };
 
    if (this.esEdicion && this.clienteId !== null) {
      // Modo edición: actualizar
      this.clienteService.actualizarCliente({
        id: this.clienteId,
        ...valores
      });
    } else {
      // Modo crear: agregar nuevo
      this.clienteService.agregarCliente(valores);
    }
 
    this.router.navigate(['/clientes']);
  }
 
  cancelar(): void {
    this.router.navigate(['/clientes']);
  }
}
