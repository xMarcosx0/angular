import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SensorService, Sensor, TipoSensor, EstadoSensor } from '../../services/sensor.service';

@Component({
  selector: 'app-sensores-gestion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sensores-gestion.component.html',
  styleUrl: './sensores-gestion.component.css'
})
export class SensoresGestionComponent {
  sensorService = inject(SensorService);

  // Filtros
  filtroBusqueda = signal('');
  filtroTipo = signal<string>('Todos');
  filtroEstado = signal<string>('Todos');

  // Paginación
  paginaActual = signal(1);
  elementosPorPagina = 10;

  // Modales
  mostrarModalForm = signal(false);
  modoEdicion = signal(false);
  mostrarModalEstado = signal(false);

  sensorSeleccionado = signal<Sensor | null>(null);

  // Formulario reactivo temporal
  sensorForm = signal<Sensor>({
    id: 0,
    codigoSensor: '',
    tipo: 'Temperatura',
    galponCodigo: 'GAL-001',
    galponNombre: 'Galpón Norte #1',
    ubicacion: 'Zona Centro - Techo',
    ultimaLectura: '25.0 °C',
    unidadMedida: '°C',
    estado: 'Activo',
    fechaInstalacion: new Date().toISOString().substring(0, 10),
    bateriaNivel: 100
  });

  // Filtrado
  sensoresFiltrados = computed(() => {
    const q = this.filtroBusqueda().toLowerCase();
    const t = this.filtroTipo();
    const e = this.filtroEstado();

    return this.sensorService.sensores().filter(s => {
      const coincideTexto = s.codigoSensor.toLowerCase().includes(q) ||
                            s.galponCodigo.toLowerCase().includes(q) ||
                            s.ubicacion.toLowerCase().includes(q);
      const coincideTipo = t === 'Todos' || s.tipo === t;
      const coincideEstado = e === 'Todos' || s.estado === e;
      return coincideTexto && coincideTipo && coincideEstado;
    });
  });

  // Lista Paginada
  sensoresPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.elementosPorPagina;
    return this.sensoresFiltrados().slice(inicio, inicio + this.elementosPorPagina);
  });

  totalPaginas = computed(() => {
    return Math.ceil(this.sensoresFiltrados().length / this.elementosPorPagina) || 1;
  });

  // KPIs
  totalSensoresCount = computed(() => this.sensorService.sensores().length);

  activosCount = computed(() =>
    this.sensorService.sensores().filter(s => s.estado === 'Activo').length
  );

  mantenimientoCount = computed(() =>
    this.sensorService.sensores().filter(s => s.estado === 'Mantenimiento' || s.estado === 'Calibración').length
  );

  inactivosCount = computed(() =>
    this.sensorService.sensores().filter(s => s.estado === 'Inactivo').length
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
    const nuevoNum = this.sensorService.sensores().length + 1;
    this.sensorForm.set({
      id: Date.now(),
      codigoSensor: `SNS-TEM-${String(nuevoNum).padStart(3, '0')}`,
      tipo: 'Temperatura',
      galponCodigo: 'GAL-001',
      galponNombre: 'Galpón Norte #1',
      ubicacion: 'Zona Centro - Techo',
      ultimaLectura: '25.0 °C',
      unidadMedida: '°C',
      estado: 'Activo',
      fechaInstalacion: new Date().toISOString().substring(0, 10),
      bateriaNivel: 100
    });
    this.mostrarModalForm.set(true);
  }

  abrirModalEditar(s: Sensor) {
    this.modoEdicion.set(true);
    this.sensorForm.set({ ...s });
    this.mostrarModalForm.set(true);
  }

  abrirModalCambiarEstado(s: Sensor) {
    this.sensorSeleccionado.set({ ...s });
    this.mostrarModalEstado.set(true);
  }

  cerrarModales() {
    this.mostrarModalForm.set(false);
    this.mostrarModalEstado.set(false);
  }

  guardarSensor() {
    if (this.modoEdicion()) {
      this.sensorService.sensores.update(list =>
        list.map(s => s.id === this.sensorForm().id ? this.sensorForm() : s)
      );
    } else {
      this.sensorService.sensores.update(list => [this.sensorForm(), ...list]);
    }
    this.cerrarModales();
  }

  guardarEstado() {
    const sel = this.sensorSeleccionado();
    if (sel) {
      this.sensorService.sensores.update(list =>
        list.map(s => s.id === sel.id ? { ...s, estado: sel.estado } : s)
      );
    }
    this.cerrarModales();
  }

  eliminarSensor(id: number) {
    this.sensorService.sensores.update(list => list.filter(s => s.id !== id));
  }
}