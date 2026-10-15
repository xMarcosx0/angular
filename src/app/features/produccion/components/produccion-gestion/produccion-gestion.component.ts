import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProduccionService, Produccion } from '../../services/produccion.service';

@Component({
  selector: 'app-produccion-gestion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produccion-gestion.component.html',
  styleUrl: './produccion-gestion.component.css'
})
export class ProduccionGestionComponent {
  produccionService = inject(ProduccionService);

  // Filtros
  filtroBusqueda = signal('');
  filtroGalpon = signal<string>('Todos');

  // Paginación
  paginaActual = signal(1);
  elementosPorPagina = 10;

  // Modales
  mostrarModalForm = signal(false);
  modoEdicion = signal(false);
  mostrarModalHistorial = signal(false);

  loteCodigoHistorial = signal<string>('');

  // Formulario de producción
  produccionForm = signal<Produccion>({
    id: 0,
    codigoProduccion: '',
    loteCodigo: 'LOT-2026-001',
    galponCodigo: 'GAL-001',
    fecha: new Date().toISOString().substring(0, 10),
    huevosPrimera: 4500,
    huevosSegunda: 250,
    huevosRotos: 30,
    totalHuevos: 4780,
    porcentajePostura: 90.5,
    alimentoConsumidoKg: 480,
    observaciones: 'Recolección estándar'
  });

  // Filtrado
  produccionesFiltradas = computed(() => {
    const q = this.filtroBusqueda().toLowerCase();
    const g = this.filtroGalpon();

    return this.produccionService.producciones().filter(p => {
      const coincideTexto = p.codigoProduccion.toLowerCase().includes(q) ||
                            p.loteCodigo.toLowerCase().includes(q) ||
                            p.galponCodigo.toLowerCase().includes(q);
      const coincideGalpon = g === 'Todos' || p.galponCodigo === g;
      return coincideTexto && coincideGalpon;
    });
  });

  // Paginación
  produccionesPaginadas = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.elementosPorPagina;
    return this.produccionesFiltradas().slice(inicio, inicio + this.elementosPorPagina);
  });

  totalPaginas = computed(() => {
    return Math.ceil(this.produccionesFiltradas().length / this.elementosPorPagina) || 1;
  });

  // KPIs
  totalHuevosRecolectados = computed(() => {
    return this.produccionService.producciones().reduce((acc, p) => acc + p.totalHuevos, 0);
  });

  promedioPostura = computed(() => {
    const list = this.produccionService.producciones();
    if (!list.length) return '0.0 %';
    const sum = list.reduce((acc, p) => acc + p.porcentajePostura, 0);
    return `${(sum / list.length).toFixed(1)} %`;
  });

  totalPrimeraCalidad = computed(() => {
    return this.produccionService.producciones().reduce((acc, p) => acc + p.huevosPrimera, 0);
  });

  totalHuevosRotos = computed(() => {
    return this.produccionService.producciones().reduce((acc, p) => acc + p.huevosRotos, 0);
  });

  // Historial filtrado por lote seleccionado
  historialPorLote = computed(() => {
    const lote = this.loteCodigoHistorial();
    if (!lote) return [];
    return this.produccionService.producciones().filter(p => p.loteCodigo === lote);
  });

  // Navegación
  irAPagina(p: number) {
    if (p >= 1 && p <= this.totalPaginas()) {
      this.paginaActual.set(p);
    }
  }

  // Modales
  abrirModalNuevo() {
    this.modoEdicion.set(false);
    const nuevoNum = this.produccionService.producciones().length + 1;
    this.produccionForm.set({
      id: Date.now(),
      codigoProduccion: `PRD-2026-${String(nuevoNum).padStart(4, '0')}`,
      loteCodigo: 'LOT-2026-001',
      galponCodigo: 'GAL-001',
      fecha: new Date().toISOString().substring(0, 10),
      huevosPrimera: 4500,
      huevosSegunda: 200,
      huevosRotos: 25,
      totalHuevos: 4725,
      porcentajePostura: 91.0,
      alimentoConsumidoKg: 490,
      observaciones: 'Registro de recolección matutina'
    });
    this.mostrarModalForm.set(true);
  }

  abrirModalEditar(p: Produccion) {
    this.modoEdicion.set(true);
    this.produccionForm.set({ ...p });
    this.mostrarModalForm.set(true);
  }

  abrirHistorialLote(loteCod: string) {
    this.loteCodigoHistorial.set(loteCod);
    this.mostrarModalHistorial.set(true);
  }

  calcularTotalesForm() {
    const form = this.produccionForm();
    const total = Number(form.huevosPrimera || 0) + Number(form.huevosSegunda || 0) + Number(form.huevosRotos || 0);
    this.produccionForm.update(f => ({ ...f, totalHuevos: total }));
  }

  cerrarModales() {
    this.mostrarModalForm.set(false);
    this.mostrarModalHistorial.set(false);
  }

  guardarProduccion() {
    this.calcularTotalesForm();
    if (this.modoEdicion()) {
      this.produccionService.producciones.update(list =>
        list.map(p => p.id === this.produccionForm().id ? this.produccionForm() : p)
      );
    } else {
      this.produccionService.producciones.update(list => [this.produccionForm(), ...list]);
    }
    this.cerrarModales();
  }

  eliminarProduccion(id: number) {
    this.produccionService.producciones.update(list => list.filter(p => p.id !== id));
  }
}