import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LecturaService, LecturaSensor } from '../../services/lectura.service';

@Component({
  selector: 'app-monitoreo-ambiental',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monitoreo-ambiental.component.html',
  styleUrl: './monitoreo-ambiental.component.css'
})
export class MonitoreoAmbientalComponent {
  lecturaService = inject(LecturaService);

  // Filtros
  filtroBusqueda = signal('');
  filtroTipo = signal<string>('Todos');
  filtroEstado = signal<string>('Todos');
  filtroGalpon = signal<string>('Todos');

  // Paginación
  paginaActual = signal(1);
  elementosPorPagina = 10;

  // Modal
  mostrarModal = signal(false);

  // Formulario de lectura manual
  lecturaForm = signal<LecturaSensor>({
    id: 0,
    codigoLectura: '',
    sensorCodigo: 'SNS-TEM-001',
    galponCodigo: 'GAL-001',
    tipoSensor: 'Temperatura',
    valor: 25.0,
    unidadMedida: '°C',
    fechaHora: new Date().toISOString().replace('T', ' ').substring(0, 16),
    estado: 'Normal',
    observaciones: 'Registro manual realizado por personal'
  });

  // Filtrado
  lecturasFiltradas = computed(() => {
    const q = this.filtroBusqueda().toLowerCase();
    const t = this.filtroTipo();
    const e = this.filtroEstado();
    const g = this.filtroGalpon();

    return this.lecturaService.lecturas().filter(l => {
      const coincideTexto = l.codigoLectura.toLowerCase().includes(q) ||
                            l.sensorCodigo.toLowerCase().includes(q) ||
                            l.galponCodigo.toLowerCase().includes(q);
      const coincideTipo = t === 'Todos' || l.tipoSensor === t;
      const coincideEstado = e === 'Todos' || l.estado === e;
      const coincideGalpon = g === 'Todos' || l.galponCodigo === g;
      return coincideTexto && coincideTipo && coincideEstado && coincideGalpon;
    });
  });

  // Paginación
  lecturasPaginadas = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.elementosPorPagina;
    return this.lecturasFiltradas().slice(inicio, inicio + this.elementosPorPagina);
  });

  totalPaginas = computed(() => {
    return Math.ceil(this.lecturasFiltradas().length / this.elementosPorPagina) || 1;
  });

  // KPIs - Últimas Mediciones Promedio
  promedioTemp = computed(() => {
    const temps = this.lecturaService.lecturas().filter(l => l.tipoSensor === 'Temperatura');
    if (!temps.length) return '0.0 °C';
    const sum = temps.reduce((acc, curr) => acc + curr.valor, 0);
    return `${(sum / temps.length).toFixed(1)} °C`;
  });

  promedioHumedad = computed(() => {
    const hums = this.lecturaService.lecturas().filter(l => l.tipoSensor === 'Humedad');
    if (!hums.length) return '0 %';
    const sum = hums.reduce((acc, curr) => acc + curr.valor, 0);
    return `${Math.round(sum / hums.length)} %`;
  });

  alertasActivasCount = computed(() =>
    this.lecturaService.lecturas().filter(l => l.estado === 'Alerta' || l.estado === 'Crítico').length
  );

  totalLecturasCount = computed(() => this.lecturaService.lecturas().length);

  // Navegación
  irAPagina(p: number) {
    if (p >= 1 && p <= this.totalPaginas()) {
      this.paginaActual.set(p);
    }
  }

  // Modal registrar
  abrirModalNuevo() {
    const nuevoNum = this.lecturaService.lecturas().length + 1;
    const ahora = new Date();
    const fechaFormat = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')} ${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;

    this.lecturaForm.set({
      id: Date.now(),
      codigoLectura: `LEC-2026-${String(nuevoNum).padStart(4, '0')}`,
      sensorCodigo: 'SNS-TEM-001',
      galponCodigo: 'GAL-001',
      tipoSensor: 'Temperatura',
      valor: 25.5,
      unidadMedida: '°C',
      fechaHora: fechaFormat,
      estado: 'Normal',
      observaciones: 'Lectura registrada manualmente'
    });
    this.mostrarModal.set(true);
  }

  actualizarUnidadPorTipo() {
    const tipo = this.lecturaForm().tipoSensor;
    let unidad = '°C';
    if (tipo === 'Humedad') unidad = '%';
    else if (tipo === 'Dióxido de Carbono (CO2)' || tipo === 'Amoníaco (NH3)') unidad = 'ppm';
    else if (tipo === 'Luminosidad') unidad = 'lux';

    this.lecturaForm.update(f => ({ ...f, unidadMedida: unidad }));
  }

  cerrarModal() {
    this.mostrarModal.set(false);
  }

  guardarLectura() {
    this.lecturaService.lecturas.update(list => [this.lecturaForm(), ...list]);
    this.cerrarModal();
  }

  eliminarLectura(id: number) {
    this.lecturaService.lecturas.update(list => list.filter(l => l.id !== id));
  }
}