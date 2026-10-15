import { Injectable, signal } from '@angular/core';

export interface RegistroHistorial {
  fecha: string;
  semana: number;
  mortalidadDia: number;
  alimentoKg: number;
  observacion: string;
}

export interface LoteAves {
  id: number;
  codigoLote: string;
  galponCodigo: string;
  galponNombre: string;
  raza: 'Hy-Line Brown' | 'Cobb 500' | 'Ross 308' | 'Lohmann LSL';
  cantidadInicial: number;
  cantidadActual: number;
  mortalidadAcumulada: number;
  fechaIngreso: string;
  edadSemanas: number;
  estado: 'En Crecimiento' | 'En Producción' | 'Finalizado';
  historial: RegistroHistorial[];
}

@Injectable({
  providedIn: 'root'
})
export class LoteService {
  private generar100Lotes(): LoteAves[] {
    const razas: ('Hy-Line Brown' | 'Cobb 500' | 'Ross 308' | 'Lohmann LSL')[] = [
      'Hy-Line Brown', 'Cobb 500', 'Ross 308', 'Lohmann LSL'
    ];
    const estados: ('En Crecimiento' | 'En Producción' | 'Finalizado')[] = [
      'En Producción', 'En Producción', 'En Crecimiento', 'Finalizado'
    ];

    const lotes: LoteAves[] = [];

    for (let i = 1; i <= 100; i++) {
      const raza = razas[(i - 1) % razas.length];
      const estado = estados[(i - 1) % estados.length];
      const inicial = 4000 + ((i * 250) % 8000); // Entre 4,000 y 12,000
      const mortalidad = estado === 'Finalizado' ? Math.floor(inicial * 0.04) : Math.floor(inicial * (0.01 + ((i % 15) / 500)));
      const actual = inicial - mortalidad;
      const semana = estado === 'Finalizado' ? 80 : 12 + (i % 50);
      const galponNum = ((i - 1) % 100) + 1;

      // Generar 3 registros de historial representativos para la consulta
      const historialMock: RegistroHistorial[] = [
        { fecha: '2026-10-10', semana: semana, mortalidadDia: Math.floor(Math.random() * 5) + 1, alimentoKg: 450 + (i * 2), observacion: 'Parámetros ambientales estables' },
        { fecha: '2026-10-12', semana: semana, mortalidadDia: Math.floor(Math.random() * 4), alimentoKg: 455 + (i * 2), observacion: 'Vacunación de refuerzo completada' },
        { fecha: '2026-10-14', semana: semana, mortalidadDia: Math.floor(Math.random() * 6), alimentoKg: 460 + (i * 2), observacion: 'Consumo de agua óptimo' }
      ];

      lotes.push({
        id: i,
        codigoLote: `LOT-2026-${String(i).padStart(3, '0')}`,
        galponCodigo: `GAL-${String(galponNum).padStart(3, '0')}`,
        galponNombre: `Galpón Norte #${galponNum}`,
        raza: raza,
        cantidadInicial: inicial,
        cantidadActual: actual,
        mortalidadAcumulada: mortalidad,
        fechaIngreso: `2026-${String(((i % 12) + 1)).padStart(2, '0')}-01`,
        edadSemanas: semana,
        estado: estado,
        historial: historialMock
      });
    }

    return lotes;
  }

  lotes = signal<LoteAves[]>(this.generar100Lotes());
}