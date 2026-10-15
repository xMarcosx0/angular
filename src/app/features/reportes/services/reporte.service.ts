import { Injectable, signal } from '@angular/core';

export interface ReporteConsolidado {
  id: number;
  codigoReporte: string;
  galponCodigo: string;
  fechaReporte: string;
  totalHuevosPostura: number;
  porcentajePosturaPromedio: number;
  temperaturaPromedio: number;
  humedadPromedio: number;
  alertasGeneradasCount: number;
  estadoSanitarioPredominante: 'Saludable' | 'En Observación' | 'Alerta Sanitaria' | 'En Tratamiento';
  indiceEficiencia: number; // %
}

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private generar100Reportes(): ReporteConsolidado[] {
    const estados: ('Saludable' | 'En Observación' | 'Alerta Sanitaria' | 'En Tratamiento')[] = [
      'Saludable', 'Saludable', 'Saludable', 'En Observación', 'Alerta Sanitaria', 'En Tratamiento'
    ];

    const reportes: ReporteConsolidado[] = [];

    for (let i = 1; i <= 100; i++) {
      const galponNum = ((i - 1) % 10) + 1;
      const postura = Number((83 + (i % 14) * 0.9).toFixed(1));
      const huevos = 3800 + ((i * 195) % 2400);
      const temp = Number((23.5 + (i % 6) * 0.7).toFixed(1));
      const hum = 60 + (i % 22);
      const alertas = (i % 4 === 0) ? Math.floor(1 + (i % 5)) : 0;
      const estado = estados[(i - 1) % estados.length];
      const eficiencia = Number((85 + (i % 12) * 1.1).toFixed(1));

      const dia = String(28 - Math.floor((i - 1) / 4)).padStart(2, '0');

      reportes.push({
        id: i,
        codigoReporte: `RPT-2026-${String(i).padStart(4, '0')}`,
        galponCodigo: `GAL-${String(galponNum).padStart(3, '0')}`,
        fechaReporte: `2026-10-${dia}`,
        totalHuevosPostura: huevos,
        porcentajePosturaPromedio: postura,
        temperaturaPromedio: temp,
        humedadPromedio: hum,
        alertasGeneradasCount: alertas,
        estadoSanitarioPredominante: estado,
        indiceEficiencia: eficiencia
      });
    }

    return reportes;
  }

  reportes = signal<ReporteConsolidado[]>(this.generar100Reportes());
}