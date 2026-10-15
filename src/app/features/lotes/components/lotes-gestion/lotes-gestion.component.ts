import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoteService, LoteAves } from '../../services/lote.service';

@Component({
  selector: 'app-lotes-gestion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lotes-gestion.component.html',
  styleUrl: './lotes-gestion.component.css'
})
export class LotesGestionComponent {
  loteService = inject(LoteService);

  // Filtros
  filtroBusqueda = signal('');
  filtroEstado = signal<'Todos' | 'En Crecimiento' | 'En Producción' | 'Finalizado'>('Todos');

  // Paginación
  paginaActual = signal(1);
  elementosPorPagina = 10;

  // Modales
  mostrarModalForm = signal(false);
  modoEdicion = signal(false);
  mostrarModalHistorial = signal(false);

  loteSeleccionadoHistorial = signal<LoteAves | null>(null);

  // Formulario reactivo temporal
  loteForm = signal<LoteAves>({
    id: 0,
    codigoLote: '',
    galponCodigo: 'GAL-001',
    galponNombre: 'Galpón Norte #1',
    raza: 'Hy-Line Brown',
    cantidadInicial: 5000,
    cantidadActual: 5000,
    mortalidadAcumulada: 0,
    fechaIngreso: new Date().toISOString().substring(0, 10),
    edadSemanas: 1,
    estado: 'En Crecimiento',
    historial: []
  });

  // Filtrado
  lotesFiltrados = computed(() => {
    const q = this.filtroBusqueda().toLowerCase();
    const est = this.filtroEstado();

    return this.loteService.lotes().filter(l => {
      const coincideTexto = l.codigoLote.toLowerCase().includes(q) ||
                            l.galponCodigo.toLowerCase().includes(q) ||
                            l.raza.toLowerCase().includes(q);
      const coincideEstado = est === 'Todos' || l.estado === est;
      return coincideTexto && coincideEstado;
    });
  });

  // Lista Paginada
  lotesPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.elementosPorPagina;
    return this.lotesFiltrados().slice(inicio, inicio + this.elementosPorPagina);
  });

  totalPaginas = computed(() => {
    return Math.ceil(this.lotesFiltrados().length / this.elementosPorPagina) || 1;
  });

  // KPIs
  totalAvesVivas = computed(() => {
    return this.loteService.lotes().reduce((acc, l) => acc + l.cantidadActual, 0);
  });

  mortalidadGlobalCount = computed(() => {
    return this.loteService.lotes().reduce((acc, l) => acc + l.mortalidadAcumulada, 0);
  });

  lotesActivosCount = computed(() => {
    return this.loteService.lotes().filter(l => l.estado !== 'Finalizado').length;
  });

  // Métodos de navegación y modales
  irAPagina(p: number) {
    if (p >= 1 && p <= this.totalPaginas()) {
      this.paginaActual.set(p);
    }
  }

  abrirModalNuevo() {
    this.modoEdicion.set(false);
    const nuevoNum = this.loteService.lotes().length + 1;
    this.loteForm.set({
      id: Date.now(),
      codigoLote: `LOT-2026-${String(nuevoNum).padStart(3, '0')}`,
      galponCodigo: 'GAL-001',
      galponNombre: 'Galpón Norte #1',
      raza: 'Hy-Line Brown',
      cantidadInicial: 6000,
      cantidadActual: 6000,
      mortalidadAcumulada: 0,
      fechaIngreso: new Date().toISOString().substring(0, 10),
      edadSemanas: 1,
      estado: 'En Crecimiento',
      historial: []
    });
    this.mostrarModalForm.set(true);
  }

  abrirModalEditar(lote: LoteAves) {
    this.modoEdicion.set(true);
    this.loteForm.set({ ...lote });
    this.mostrarModalForm.set(true);
  }

  abrirHistorial(lote: LoteAves) {
    this.loteSeleccionadoHistorial.set(lote);
    this.mostrarModalHistorial.set(true);
  }

  cerrarModales() {
    this.mostrarModalForm.set(false);
    this.mostrarModalHistorial.set(false);
  }

  guardarLote() {
    if (this.modoEdicion()) {
      this.loteService.lotes.update(list =>
        list.map(l => l.id === this.loteForm().id ? this.loteForm() : l)
      );
    } else {
      this.loteService.lotes.update(list => [this.loteForm(), ...list]);
    }
    this.cerrarModales();
  }

  eliminarLote(id: number) {
    this.loteService.lotes.update(list => list.filter(l => l.id !== id));
  }
}