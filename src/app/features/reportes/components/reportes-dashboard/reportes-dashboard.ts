import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReporteService, ReporteConsolidado } from '../../services/reporte.service';

@Component({
  selector: 'app-reportes-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes-dashboard.html',
  styleUrl: './reportes-dashboard.css'
})
export class ReportesDashboardComponent {
  reporteService = inject(ReporteService);

  // Filtros
  filtroBusqueda = signal('');
  filtroGalpon = signal<string>('Todos');
  filtroPeriodo = signal<string>('Este Mes');

  // Paginación
  paginaActual = signal(1);
  elementosPorPagina = 10;

  // Modal Reporte
  mostrarModalReporte = signal(false);
  reporteDetalle = signal<ReporteConsolidado | null>(null);

  // Filtrado
  reportesFiltrados = computed(() => {
    const q = this.filtroBusqueda().toLowerCase();
    const g = this.filtroGalpon();

    return this.reporteService.reportes().filter(r => {
      const coincideTexto = r.codigoReporte.toLowerCase().includes(q) ||
                            r.galponCodigo.toLowerCase().includes(q);
      const coincideGalpon = g === 'Todos' || r.galponCodigo === g;
      return coincideTexto && coincideGalpon;
    });
  });

  // Paginación
  reportesPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.elementosPorPagina;
    return this.reportesFiltrados().slice(inicio, inicio + this.elementosPorPagina);
  });

  totalPaginas = computed(() => {
    return Math.ceil(this.reportesFiltrados().length / this.elementosPorPagina) || 1;
  });

  // KPIs e Indicadores Clave del Dashboard
  promedioPosturaGlobal = computed(() => {
    const list = this.reporteService.reportes();
    if (!list.length) return '0.0%';
    const sum = list.reduce((acc, r) => acc + r.porcentajePosturaPromedio, 0);
    return `${(sum / list.length).toFixed(1)}%`;
  });

  totalHuevosGlobal = computed(() =>
    this.reporteService.reportes().reduce((acc, r) => acc + r.totalHuevosPostura, 0)
  );

  promedioTemperaturaGlobal = computed(() => {
    const list = this.reporteService.reportes();
    if (!list.length) return '0.0 °C';
    const sum = list.reduce((acc, r) => acc + r.temperaturaPromedio, 0);
    return `${(sum / list.length).toFixed(1)} °C`;
  });

  totalAlertasHistorico = computed(() =>
    this.reporteService.reportes().reduce((acc, r) => acc + r.alertasGeneradasCount, 0)
  );

  indiceEficienciaPromedio = computed(() => {
    const list = this.reporteService.reportes();
    if (!list.length) return '0.0%';
    const sum = list.reduce((acc, r) => acc + r.indiceEficiencia, 0);
    return `${(sum / list.length).toFixed(1)}%`;
  });

  // Navegación
  irAPagina(p: number) {
    if (p >= 1 && p <= this.totalPaginas()) {
      this.paginaActual.set(p);
    }
  }

  // Modales
  abrirModalGenerar(r?: ReporteConsolidado) {
    if (r) {
      this.reporteDetalle.set(r);
    } else {
      // Tomar el reporte más reciente como plantilla de simulación
      this.reporteDetalle.set(this.reporteService.reportes()[0]);
    }
    this.mostrarModalReporte.set(true);
  }

  cerrarModal() {
    this.mostrarModalReporte.set(false);
  }

  eliminarReporte(id: number) {
    this.reporteService.reportes.update(list => list.filter(r => r.id !== id));
  }
}