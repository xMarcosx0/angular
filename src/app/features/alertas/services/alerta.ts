import { Injectable, signal } from '@angular/core';

export type NivelAlerta = 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
export type EstadoAlerta = 'Activa' | 'Atendida' | 'Resuelta' | 'Ignorada';

export interface Alerta {
  id: number;
  codigoAlerta: string;
  galponCodigo: string;
  tipoVariable: 'Temperatura' | 'Humedad' | 'CO2' | 'NH3' | 'Fallo de Red';
  nivel: NivelAlerta;
  valorDetectado: string;
  limitePermitido: string;
  fechaHora: string;
  estado: EstadoAlerta;
  notificacionEnviada: boolean;
  destinatarioRol: 'Todos' | 'Veterinario' | 'Trabajador' | 'Administrador';
  mensajeNotificacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertaService {
  private generar100Alertas(): Alerta[] {
    const variables: ('Temperatura' | 'Humedad' | 'CO2' | 'NH3' | 'Fallo de Red')[] = [
      'Temperatura', 'Humedad', 'CO2', 'NH3', 'Fallo de Red'
    ];
    const niveles: NivelAlerta[] = ['Bajo', 'Medio', 'Alto', 'Crítico'];
    const estados: EstadoAlerta[] = ['Activa', 'Atendida', 'Resuelta', 'Activa', 'Resuelta'];
    const roles: ('Todos' | 'Veterinario' | 'Trabajador' | 'Administrador')[] = ['Todos', 'Veterinario', 'Trabajador', 'Administrador'];

    const alertas: Alerta[] = [];

    for (let i = 1; i <= 100; i++) {
      const variable = variables[(i - 1) % variables.length];
      const nivel = niveles[(i - 1) % niveles.length];
      const estado = estados[(i - 1) % estados.length];
      const galponNum = ((i - 1) % 10) + 1;
      const rol = roles[(i - 1) % roles.length];
      const notificada = i % 5 !== 0;

      let valor = '';
      let limite = '';

      switch (variable) {
        case 'Temperatura':
          valor = `${(28.5 + (i % 5) * 0.8).toFixed(1)} °C`;
          limite = 'Máx 26.0 °C';
          break;
        case 'Humedad':
          valor = `${78 + (i % 15)} %`;
          limite = 'Máx 75 %';
          break;
        case 'CO2':
          valor = `${1250 + (i % 20) * 30} ppm`;
          limite = 'Máx 1000 ppm';
          break;
        case 'NH3':
          valor = `${(18 + (i % 10) * 1.2).toFixed(1)} ppm`;
          limite = 'Máx 15.0 ppm';
          break;
        case 'Fallo de Red':
          valor = 'Sin conexión';
          limite = 'Ping < 5s';
          break;
      }

      const dia = String(28 - Math.floor((i - 1) / 4)).padStart(2, '0');
      const hora = String(23 - (i % 24)).padStart(2, '0');
      const min = String((i * 11) % 60).padStart(2, '0');

      alertas.push({
        id: i,
        codigoAlerta: `ALT-2026-${String(i).padStart(4, '0')}`,
        galponCodigo: `GAL-${String(galponNum).padStart(3, '0')}`,
        tipoVariable: variable,
        nivel: nivel,
        valorDetectado: valor,
        limitePermitido: limite,
        fechaHora: `2026-10-${dia} ${hora}:${min}`,
        estado: estado,
        notificacionEnviada: notificada,
        destinatarioRol: rol,
        mensajeNotificacion: `Atención: Se detectó ${variable} fuera del límite en GAL-${String(galponNum).padStart(3, '0')}. Valor actual: ${valor}.`
      });
    }

    return alertas;
  }

  alertas = signal<Alerta[]>(this.generar100Alertas());
}