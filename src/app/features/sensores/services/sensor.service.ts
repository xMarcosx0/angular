import { Injectable, signal } from '@angular/core';

export type TipoSensor = 'Temperatura' | 'Humedad' | 'Dióxido de Carbono (CO2)' | 'Amoníaco (NH3)' | 'Luminosidad';
export type EstadoSensor = 'Activo' | 'Mantenimiento' | 'Calibración' | 'Inactivo';

export interface Sensor {
  id: number;
  codigoSensor: string;
  tipo: TipoSensor;
  galponCodigo: string;
  galponNombre: string;
  ubicacion: string;
  ultimaLectura: string;
  unidadMedida: string;
  estado: EstadoSensor;
  fechaInstalacion: string;
  bateriaNivel: number; // %
}

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private generar100Sensores(): Sensor[] {
    const tipos: TipoSensor[] = [
      'Temperatura',
      'Humedad',
      'Dióxido de Carbono (CO2)',
      'Amoníaco (NH3)',
      'Luminosidad'
    ];

    const estados: EstadoSensor[] = ['Activo', 'Activo', 'Activo', 'Mantenimiento', 'Calibración', 'Inactivo'];

    const sensores: Sensor[] = [];

    for (let i = 1; i <= 100; i++) {
      const tipo = tipos[(i - 1) % tipos.length];
      const estado = estados[(i - 1) % estados.length];
      const galponNum = ((i - 1) % 100) + 1;
      const bateria = estado === 'Inactivo' ? 0 : Math.floor(60 + ((i * 7) % 41)); // 60% a 100%

      let lectura = '';
      let unidad = '';

      switch (tipo) {
        case 'Temperatura':
          lectura = (24 + (i % 6) * 0.7).toFixed(1);
          unidad = '°C';
          break;
        case 'Humedad':
          lectura = String(58 + (i % 22));
          unidad = '%';
          break;
        case 'Dióxido de Carbono (CO2)':
          lectura = String(600 + (i % 40) * 15);
          unidad = 'ppm';
          break;
        case 'Amoníaco (NH3)':
          lectura = (5 + (i % 12) * 1.2).toFixed(1);
          unidad = 'ppm';
          break;
        case 'Luminosidad':
          lectura = String(15 + (i % 10) * 3);
          unidad = 'lux';
          break;
      }

      sensores.push({
        id: i,
        codigoSensor: `SNS-${tipo.substring(0, 3).toUpperCase()}-${String(i).padStart(3, '0')}`,
        tipo: tipo,
        galponCodigo: `GAL-${String(galponNum).padStart(3, '0')}`,
        galponNombre: `Galpón Norte #${galponNum}`,
        ubicacion: i % 2 === 0 ? 'Zona Centro - Techo' : 'Zona Entrada - Pared Lateral',
        ultimaLectura: `${lectura} ${unidad}`,
        unidadMedida: unidad,
        estado: estado,
        fechaInstalacion: `2025-${String(((i % 12) + 1)).padStart(2, '0')}-15`,
        bateriaNivel: bateria
      });
    }

    return sensores;
  }

  sensores = signal<Sensor[]>(this.generar100Sensores());
}