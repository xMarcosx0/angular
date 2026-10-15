import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, Usuario } from '../../cliente/services/auth.service';

import { GalponesGestionComponent } from '../../galpones/components/galpones-gestion/galpones-gestion.component';
import { LotesGestionComponent } from '../../lotes/components/lotes-gestion/lotes-gestion.component';
import { SensoresGestionComponent } from '../../sensores/components/sensores-gestion/sensores-gestion.component';
import { MonitoreoAmbientalComponent } from '../../monitoreo/components/monitoreo-ambiental/monitoreo-ambiental.component';
import { ProduccionGestionComponent } from '../../produccion/components/produccion-gestion/produccion-gestion.component';
import { AlertasGestionComponent } from '../../alertas/components/alertas-gestion/alertas-gestion';
import { ReportesDashboardComponent } from '../../reportes/components/reportes-dashboard/reportes-dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    GalponesGestionComponent,
    LotesGestionComponent,
    SensoresGestionComponent,
    MonitoreoAmbientalComponent,
    ProduccionGestionComponent,
    AlertasGestionComponent,
    ReportesDashboardComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  authService = inject(AuthService);
  private router = inject(Router);

  // Pestaña inicial por defecto para el Trabajador
  pestanaActiva = signal<'galpones' | 'lotes' | 'sensores' | 'monitoreo' | 'produccion' | 'alertas' | 'reportes'>('galpones');

  seleccionarPestana(pestana: 'galpones' | 'lotes' | 'sensores' | 'monitoreo' | 'produccion' | 'alertas' | 'reportes') {
    this.pestanaActiva.set(pestana);
  }

  cerrarSesion() {
    this.authService.usuarioActual.set(null);
    this.router.navigate(['/login']);
  }
}