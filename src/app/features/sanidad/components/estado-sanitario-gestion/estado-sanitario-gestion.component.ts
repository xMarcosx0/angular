import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstadoSanitarioService, RegistroEstadoAves, EstadoGeneralAves } from '../../services/estado-sanitario.service';

@Component({
  selector: 'app-estado-sanitario-gestion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estado-sanitario-gestion.component.html',
  styleUrl: './estado-sanitario-gestion.component.css'
})
export class EstadoSanitarioGestionComponent {
  sanidadService = inject(EstadoSanitarioService);

  // Filtros
  filtroBusqueda = signal('');
  filtroEstado = signal<string>('Todos');
  filtroGalpon = signal<string>('Todos');

  // Paginación
  paginaActual = signal(1);
  elementosPorPagina = 10;

  // Modales
  mostrarModalForm = signal(false);
  modoEdicion = signal(false);
  mostrarModalObservaciones = signal(false);

  registroSeleccionado = signal<RegistroEstadoAves | null>(null);
  nuevaNotaObservacion = signal('');

  // Formulario reactivo temporal
  sanitarioForm = signal<RegistroEstadoAves>({
    id: 0,
    codigoRegistro: '',
    loteCodigo: 'LOT-2026-001',
    galponCodigo: 'GAL-001',
    fechaEvaluacion: new Date().toISOString().substring(0, 10),
    estadoGeneral: 'Saludable',
    avesAfectadasCount: 0,
    sintomasPrincipales: 'Ninguno, aves activas',
    veterinarioCargo: 'Dra. Emily Mercado',
    observaciones: []
  });

  // Filtrado
  registrosFiltrados = computed(() => {
    const q = this.filtroBusqueda().toLowerCase();
    const e = this.filtroEstado();
    const g = this.filtroGalpon();

    return this.sanidadService.registrosSanitarios().filter(r => {
      const coincideTexto = r.codigoRegistro.toLowerCase().includes(q) ||
                            r.loteCodigo.toLowerCase().includes(q) ||
                            r.galponCodigo.toLowerCase().includes(q) ||
                            r.veterinarioCargo.toLowerCase().includes(q);
      const coincideEstado = e === 'Todos' || r.estadoGeneral === e;
      const coincideGalpon = g === 'Todos' || r.galponCodigo === g;
      return coincideTexto && coincideEstado && coincideGalpon;
    });
  });

  // Paginación
  registrosPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.elementosPorPagina;
    return this.registrosFiltrados().slice(inicio, inicio + this.elementosPorPagina);
  });

  totalPaginas = computed(() => {
    return Math.ceil(this.registrosFiltrados().length / this.elementosPorPagina) || 1;
  });

  // KPIs
  totalRegistrosCount = computed(() => this.sanidadService.registrosSanitarios().length);

  saludablesCount = computed(() =>
    this.sanidadService.registrosSanitarios().filter(r => r.estadoGeneral === 'Saludable').length
  );

  observacionCount = computed(() =>
    this.sanidadService.registrosSanitarios().filter(r => r.estadoGeneral === 'En Observación').length
  );

  alertasTratamientoCount = computed(() =>
    this.sanidadService.registrosSanitarios().filter(r => r.estadoGeneral === 'Alerta Sanitaria' || r.estadoGeneral === 'En Tratamiento').length
  );

  // Navegación
  irAPagina(p: number) {
    if (p >= 1 && p <= this.totalPaginas()) {
      this.paginaActual.set(p);
    }
  }

  // Modales
  abrirModalNuevo() {
    this.modoEdicion.set(false);
    const nuevoNum = this.sanidadService.registrosSanitarios().length + 1;
    this.sanitarioForm.set({
      id: Date.now(),
      codigoRegistro: `SAN-2026-${String(nuevoNum).padStart(4, '0')}`,
      loteCodigo: 'LOT-2026-001',
      galponCodigo: 'GAL-001',
      fechaEvaluacion: new Date().toISOString().substring(0, 10),
      estadoGeneral: 'Saludable',
      avesAfectadasCount: 0,
      sintomasPrincipales: 'Comportamiento normal y buen consumo',
      veterinarioCargo: 'Dra. Emily Mercado',
      observaciones: [
        {
          id: Date.now(),
          fechaHora: new Date().toISOString().replace('T', ' ').substring(0, 16),
          usuario: 'Dra. Emily Mercado',
          nota: 'Evaluación física realizada sin novedades de riesgo.'
        }
      ]
    });
    this.mostrarModalForm.set(true);
  }

  abrirModalEditar(r: RegistroEstadoAves) {
    this.modoEdicion.set(true);
    this.sanitarioForm.set({ ...r });
    this.mostrarModalForm.set(true);
  }

  abrirObservaciones(r: RegistroEstadoAves) {
    this.registroSeleccionado.set({ ...r });
    this.nuevaNotaObservacion.set('');
    this.mostrarModalObservaciones.set(true);
  }

  agregarObservacion() {
    const nota = this.nuevaNotaObservacion().trim();
    const sel = this.registroSeleccionado();

    if (nota && sel) {
      const nuevaObs = {
        id: Date.now(),
        fechaHora: new Date().toISOString().replace('T', ' ').substring(0, 16),
        usuario: 'Emily Mercado (Veterinario)',
        nota: nota
      };

      const observacionesActualizadas = [...sel.observaciones, nuevaObs];
      this.registroSeleccionado.set({ ...sel, observaciones: observacionesActualizadas });

      this.sanidadService.registrosSanitarios.update(list =>
        list.map(r => r.id === sel.id ? { ...r, observaciones: observacionesActualizadas } : r)
      );

      this.nuevaNotaObservacion.set('');
    }
  }

  cerrarModales() {
    this.mostrarModalForm.set(false);
    this.mostrarModalObservaciones.set(false);
  }

  guardarRegistroSanitario() {
    if (this.modoEdicion()) {
      this.sanidadService.registrosSanitarios.update(list =>
        list.map(r => r.id === this.sanitarioForm().id ? this.sanitarioForm() : r)
      );
    } else {
      this.sanidadService.registrosSanitarios.update(list => [this.sanitarioForm(), ...list]);
    }
    this.cerrarModales();
  }

  eliminarRegistro(id: number) {
    this.sanidadService.registrosSanitarios.update(list => list.filter(r => r.id !== id));
  }
}