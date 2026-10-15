import { Injectable, signal } from '@angular/core';

export type EstadoGeneralAves = 'Saludable' | 'En Observación' | 'Alerta Sanitaria' | 'En Tratamiento';

export interface ObservacionSanitaria {
  id: number;
  fechaHora: string;
  usuario: string;
  nota: string;
}

export interface RegistroEstadoAves {
  id: number;
  codigoRegistro: string;
  loteCodigo: string;
  galponCodigo: string;
  fechaEvaluacion: string;
  estadoGeneral: EstadoGeneralAves;
  avesAfectadasCount: number;
  sintomasPrincipales: string;
  veterinarioCargo: string;
  observaciones: ObservacionSanitaria[];
}

@Injectable({
  providedIn: 'root'
})
export class EstadoSanitarioService {
  private generar100RegistrosSanitarios(): RegistroEstadoAves[] {
    const estados: EstadoGeneralAves[] = ['Saludable', 'Saludable', 'Saludable', 'En Observación', 'Alerta Sanitaria', 'En Tratamiento'];
    const veterinarios = ['Dra. Emily Mercado', 'Dr. Carlos Mendoza', 'Dra. Sofía Rincón'];
    const sintomasList = [
      'Sin síntomas aparentes, parvada activa',
      'Leve estornudo matutino en zona posterior',
      'Disminución del 5% en consumo de alimento',
      'Plumas erizadas y decaimiento leve',
      'Heces acuosas en sector central',
      'Ligera tos en horario nocturno'
    ];

    const registros: RegistroEstadoAves[] = [];

    for (let i = 1; i <= 100; i++) {
      const loteNum = ((i - 1) % 50) + 1;
      const galponNum = ((i - 1) % 10) + 1;
      const estado = estados[(i - 1) % estados.length];
      const vet = veterinarios[(i - 1) % veterinarios.length];
      const sintoma = estado === 'Saludable' ? 'Ninguno, comportamiento y apetito normales' : sintomasList[i % sintomasList.length];
      const afecto = estado === 'Saludable' ? 0 : 15 + ((i * 13) % 120);

      const dia = String(28 - Math.floor((i - 1) / 4)).padStart(2, '0');

      const observacionesMock: ObservacionSanitaria[] = [
        {
          id: 1,
          fechaHora: `2026-10-${dia} 08:30`,
          usuario: vet,
          nota: estado === 'Saludable' ? 'Inspección de rutina sin hallazgos patológicos.' : 'Se recomienda incremento en ventilación y chequeo de camas.'
        }
      ];

      if (estado !== 'Saludable') {
        observacionesMock.push({
          id: 2,
          fechaHora: `2026-10-${dia} 14:15`,
          usuario: 'Brayan Muñoz (Trabajador)',
          nota: 'Aplicado suplemento vitamínico en agua de bebida según indicación.'
        });
      }

      registros.push({
        id: i,
        codigoRegistro: `SAN-2026-${String(i).padStart(4, '0')}`,
        loteCodigo: `LOT-2026-${String(loteNum).padStart(3, '0')}`,
        galponCodigo: `GAL-${String(galponNum).padStart(3, '0')}`,
        fechaEvaluacion: `2026-10-${dia}`,
        estadoGeneral: estado,
        avesAfectadasCount: afecto,
        sintomasPrincipales: sintoma,
        veterinarioCargo: vet,
        observaciones: observacionesMock
      });
    }

    return registros;
  }

  registrosSanitarios = signal<RegistroEstadoAves[]>(this.generar100RegistrosSanitarios());
}