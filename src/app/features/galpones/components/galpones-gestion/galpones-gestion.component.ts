import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GalponService, Galpon } from '../../services/galpon.service';

@Component({
  selector: 'app-galpones-gestion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './galpones-gestion.component.html',
  styleUrl: './galpones-gestion.component.css'
})
export class GalponesGestionComponent {
  galponService = inject(GalponService);

  // Filtros
  filtroBusqueda = signal('');
  filtroEstado = signal<'Todos' | 'Activo' | 'Mantenimiento' | 'Inactivo'>('Todos');

  // Paginación
  paginaActual = signal(1);
  elementosPorPagina = 10;

  // Modal (Crear / Editar)
  mostrarModal = signal(false);
  modoEdicion = signal(false);

  galponForm = signal<Galpon>({
    id: 0,
    codigo: '',
    nombre: '',
    tipoAve: 'Ponedoras',
    capacidadMax: 10000,
    avesActuales: 0,
    temperatura: 25,
    humedad: 65,
    estado: 'Activo'
  });

  // Lista filtrada
  galponesFiltrados = computed(() => {
    const q = this.filtroBusqueda().toLowerCase();
    const est = this.filtroEstado();

    return this.galponService.galpones().filter(g => {
      const coincideTexto = g.codigo.toLowerCase().includes(q) ||
                            g.nombre.toLowerCase().includes(q) ||
                            g.tipoAve.toLowerCase().includes(q);
      const coincideEstado = est === 'Todos' || g.estado === est;
      return coincideTexto && coincideEstado;
    });
  });

  // Lista paginada para la tabla
  galponesPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.elementosPorPagina;
    return this.galponesFiltrados().slice(inicio, inicio + this.elementosPorPagina);
  });

  // Total de páginas
  totalPaginas = computed(() => {
    return Math.ceil(this.galponesFiltrados().length / this.elementosPorPagina) || 1;
  });

  // Métricas rápidas
  totalAves = computed(() => {
    return this.galponService.galpones().reduce((acc, g) => acc + g.avesActuales, 0);
  });

  galponesActivosCount = computed(() => {
    return this.galponService.galpones().filter(g => g.estado === 'Activo').length;
  });

  // Cambios de página
  irAPagina(p: number) {
    if (p >= 1 && p <= this.totalPaginas()) {
      this.paginaActual.set(p);
    }
  }

  // Modales
  abrirModalNuevo() {
    this.modoEdicion.set(false);
    const nuevoId = Date.now();
    this.galponForm.set({
      id: nuevoId,
      codigo: `GAL-${String(this.galponService.galpones().length + 1).padStart(3, '0')}`,
      nombre: '',
      tipoAve: 'Ponedoras',
      capacidadMax: 8000,
      avesActuales: 0,
      temperatura: 25.0,
      humedad: 65,
      estado: 'Activo'
    });
    this.mostrarModal.set(true);
  }

  abrirModalEditar(g: Galpon) {
    this.modoEdicion.set(true);
    this.galponForm.set({ ...g });
    this.mostrarModal.set(true);
  }

  cerrarModal() {
    this.mostrarModal.set(false);
  }

  guardarGalpon() {
    if (this.modoEdicion()) {
      // Actualizar información
      this.galponService.galpones.update(list =>
        list.map(g => g.id === this.galponForm().id ? this.galponForm() : g)
      );
    } else {
      // Registrar galpón
      this.galponService.galpones.update(list => [this.galponForm(), ...list]);
    }
    this.cerrarModal();
  }

  eliminarGalpon(id: number) {
    this.galponService.galpones.update(list => list.filter(g => g.id !== id));
  }
}