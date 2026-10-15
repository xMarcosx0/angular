import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertaService, Alerta } from '../../services/alerta'; // Ajusta la ruta a tu servicio de alertas

@Component({
  selector: 'app-alertas-gestion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alertas-gestion.html',
  styleUrl: './alertas-gestion.css'
})
export class AlertasGestionComponent {
  alertaService = inject(AlertaService);

  filtroBusqueda = signal('');
  filtroNivel = signal<string>('Todos');
  filtroEstado = signal<string>('Todos');
  filtroGalpon = signal<string>('Todos');

  paginaActual = signal(1);
  elementosPorPagina = 10;

  mostrarModalForm = signal(false);
  modoEdicion = signal(false);
  mostrarModalNotificacion = signal(false);

  alertaSeleccionada = signal<Alerta | null>(null);

  alertaForm = signal<Alerta>({
    id: 0,
    codigoAlerta: '',
    galponCodigo: 'GAL-001',
    tipoVariable: 'Temperatura',
    nivel: 'Alto',
    valorDetectado: '29.0 °C',
    limitePermitido: 'Máx 26.0 °C',
    fechaHora: new Date().toISOString().replace('T', ' ').substring(0, 16),
    estado: 'Activa',
    notificacionEnviada: false,
    destinatarioRol: 'Todos',
    mensajeNotificacion: 'Alerta ambiental detectada por sistema de sensores.'
  });

  alertasFiltradas = computed(() => {
    const q = this.filtroBusqueda().toLowerCase();
    const n = this.filtroNivel();
    const e = this.filtroEstado();
    const g = this.filtroGalpon();

    return this.alertaService.alertas().filter(a => {
      const coincideTexto = a.codigoAlerta.toLowerCase().includes(q) ||
                            a.galponCodigo.toLowerCase().includes(q) ||
                            a.tipoVariable.toLowerCase().includes(q);
      const coincideNivel = n === 'Todos' || a.nivel === n;
      const coincideEstado = e === 'Todos' || a.estado === e;
      const coincideGalpon = g === 'Todos' || a.galponCodigo === g;
      return coincideTexto && coincideNivel && coincideEstado && coincideGalpon;
    });
  });

  alertasPaginadas = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.elementosPorPagina;
    return this.alertasFiltradas().slice(inicio, inicio + this.elementosPorPagina);
  });

  totalPaginas = computed(() => {
    return Math.ceil(this.alertasFiltradas().length / this.elementosPorPagina) || 1;
  });

  totalAlertasCount = computed(() => this.alertaService.alertas().length);

  activasCount = computed(() =>
    this.alertaService.alertas().filter(a => a.estado === 'Activa').length
  );

  criticasCount = computed(() =>
    this.alertaService.alertas().filter(a => a.nivel === 'Crítico').length
  );

  notificadasCount = computed(() =>
    this.alertaService.alertas().filter(a => a.notificacionEnviada).length
  );

  irAPagina(p: number) {
    if (p >= 1 && p <= this.totalPaginas()) {
      this.paginaActual.set(p);
    }
  }

  abrirModalNuevo() {
    this.modoEdicion.set(false);
    const nuevoNum = this.alertaService.alertas().length + 1;
    this.alertaForm.set({
      id: Date.now(),
      codigoAlerta: `ALT-2026-${String(nuevoNum).padStart(4, '0')}`,
      galponCodigo: 'GAL-001',
      tipoVariable: 'Temperatura',
      nivel: 'Alto',
      valorDetectado: '28.8 °C',
      limitePermitido: 'Máx 26.0 °C',
      fechaHora: new Date().toISOString().replace('T', ' ').substring(0, 16),
      estado: 'Activa',
      notificacionEnviada: false,
      destinatarioRol: 'Todos',
      mensajeNotificacion: 'Superación de umbral térmico registrado.'
    });
    this.mostrarModalForm.set(true);
  }

  abrirModalEditar(a: Alerta) {
    this.modoEdicion.set(true);
    this.alertaForm.set({ ...a });
    this.mostrarModalForm.set(true);
  }

  abrirModalNotificacion(a: Alerta) {
    this.alertaSeleccionada.set({ ...a });
    this.mostrarModalNotificacion.set(true);
  }

  enviarNotificacionSimulada() {
    const sel = this.alertaSeleccionada();
    if (sel) {
      this.alertaService.alertas.update(list =>
        list.map(a => a.id === sel.id ? { ...a, notificacionEnviada: true } : a)
      );
      this.alertaSeleccionada.set({ ...sel, notificacionEnviada: true });
    }
  }

  cerrarModales() {
    this.mostrarModalForm.set(false);
    this.mostrarModalNotificacion.set(false);
  }

  guardarAlerta() {
    if (this.modoEdicion()) {
      this.alertaService.alertas.update(list =>
        list.map(a => a.id === this.alertaForm().id ? this.alertaForm() : a)
      );
    } else {
      this.alertaService.alertas.update(list => [this.alertaForm(), ...list]);
    }
    this.cerrarModales();
  }

  eliminarAlerta(id: number) {
    this.alertaService.alertas.update(list => list.filter(a => a.id !== id));
  }
}