import { Injectable, signal } from '@angular/core';

export type TipoLectura = 'Temperatura' | 'Humedad' | 'Dióxido de Carbono (CO2)' | 'Amoníaco (NH3)' | 'Luminosidad';
export type EstadoLectura = 'Normal' | 'Alerta' | 'Crítico';

export interface LecturaSensor {
  id: number;
  codigoLectura: string;
  sensorCodigo: string;
  galponCodigo: string;
  tipoSensor: TipoLectura;
  valor: number;
  unidadMedida: string;
  fechaHora: string;
  estado: EstadoLectura;
  observaciones?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LecturaService {
  private generar100Lecturas(): LecturaSensor[] {
    const tipos: TipoLectura[] = [
      'Temperatura',
      'Humedad',
      'Dióxido de Carbono (CO2)',
      'Amoníaco (NH3)',
      'Luminosidad'
    ];

    const lecturas: LecturaSensor[] = [];

    for (let i = 1; i <= 100; i++) {
      const tipo = tipos[(i - 1) % tipos.length];
      const galponNum = ((i - 1) % 10) + 1; // Galpones GAL-001 a GAL-010
      const sensorNum = ((i - 1) % 100) + 1;

      let valor = 0;
      let unidad = '';
      let estado: EstadoLectura = 'Normal';

      // Simulación de valores realistas y estados de alerta/crítico
      switch (tipo) {
        case 'Temperatura':
          valor = Number((22 + (i % 9) * 0.9).toFixed(1)); // 22.0 - 29.2 °C
          unidad = '°C';
          estado = valor > 28.0 ? 'Crítico' : valor > 26.5 ? 'Alerta' : 'Normal';
          break;
        case 'Humedad':
          valor = 55 + (i % 30); // 55 - 84 %
          unidad = '%';
          estado = valor > 80 ? 'Crítico' : valor > 75 ? 'Alerta' : 'Normal';
          break;
        case 'Dióxido de Carbono (CO2)':
          valor = 500 + (i % 25) * 40; // 500 - 1460 ppm
          unidad = 'ppm';
          estado = valor > 1200 ? 'Crítico' : valor > 1000 ? 'Alerta' : 'Normal';
          break;
        case 'Amoníaco (NH3)':
          valor = Number((4 + (i % 15) * 1.5).toFixed(1)); // 4.0 - 25.0 ppm
          unidad = 'ppm';
          estado = valor > 20.0 ? 'Crítico' : valor > 15.0 ? 'Alerta' : 'Normal';
          break;
        case 'Luminosidad':
          valor = 10 + (i % 12) * 5; // 10 - 65 lux
          unidad = 'lux';
          estado = valor < 15 ? 'Alerta' : 'Normal';
          break;
      }

      // Horas escalonadas en el día de hoy y días anteriores
      const hora = String(23 - (i % 24)).padStart(2, '0');
      const minuto = String((i * 7) % 60).padStart(2, '0');
      const dia = String(15 - Math.floor(i / 20)).padStart(2, '0');

      lecturas.push({
        id: i,
        codigoLectura: `LEC-2026-${String(i).padStart(4, '0')}`,
        sensorCodigo: `SNS-${tipo.substring(0, 3).toUpperCase()}-${String(sensorNum).padStart(3, '0')}`,
        galponCodigo: `GAL-${String(galponNum).padStart(3, '0')}`,
        tipoSensor: tipo,
        valor: valor,
        unidadMedida: unidad,
        fechaHora: `2026-10-${dia} ${hora}:${minuto}`,
        estado: estado,
        observaciones: estado !== 'Normal' ? 'Lectura fuera del rango óptimo recomendado' : 'Dentro de parámetros normales'
      });
    }

    return lecturas;
  }

  lecturas = signal<LecturaSensor[]>(this.generar100Lecturas());
}