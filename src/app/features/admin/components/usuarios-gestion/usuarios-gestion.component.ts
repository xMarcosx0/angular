import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService, Usuario } from '../../services/usuario.service';

@Component({
  selector: 'app-usuarios-gestion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios-gestion.component.html',
  styleUrl: './usuarios-gestion.component.css'
})
export class UsuariosGestionComponent {
  usuarioService = inject(UsuarioService);

  filtroBusqueda = signal('');
  mostrarModal = signal(false);
  modoEdicion = signal(false);

  // Formulario reactivo temporal
  usuarioForm = signal<Usuario>({
    id: 0,
    nombre: '',
    email: '',
    telefono: '',
    rol: 'Trabajador',
    estado: 'Activo'
  });

  usuariosFiltrados() {
    const q = this.filtroBusqueda().toLowerCase();
    return this.usuarioService.usuarios().filter(u =>
      u.nombre.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.rol.toLowerCase().includes(q)
    );
  }

  abrirModalNuevo() {
    this.modoEdicion.set(false);
    this.usuarioForm.set({ id: Date.now(), nombre: '', email: '', telefono: '', rol: 'Trabajador', estado: 'Activo' });
    this.mostrarModal.set(true);
  }

  abrirModalEditar(u: Usuario) {
    this.modoEdicion.set(true);
    this.usuarioForm.set({ ...u });
    this.mostrarModal.set(true);
  }

  cerrarModal() {
    this.mostrarModal.set(false);
  }

  guardarUsuario() {
    if (this.modoEdicion()) {
      this.usuarioService.usuarios.update(list =>
        list.map(u => u.id === this.usuarioForm().id ? this.usuarioForm() : u)
      );
    } else {
      this.usuarioService.usuarios.update(list => [...list, this.usuarioForm()]);
    }
    this.cerrarModal();
  }

  eliminarUsuario(id: number) {
    this.usuarioService.usuarios.update(list => list.filter(u => u.id !== id));
  }
}