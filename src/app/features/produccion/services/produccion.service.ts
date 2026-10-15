import { Injectable, signal } from '@angular/core';

export interface Produccion {
  id: number;
  codigoProduccion: string;
  loteCodigo: string;
  galponCodigo: string;
  fecha: string;
  huevosPrimera: number;
  huevosSegunda: number;
  huevosRotos: number;
  totalHuevos: number;
  porcentajePostura: number; // %
  alimentoConsumidoKg: number;
  observaciones?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProduccionService {
  private generar100Producciones(): Produccion[] {
    const producciones: Produccion[] = [];

    for (let i = 1; i <= 100; i++) {
      const loteNum = ((i - 1) % 50) + 1;
      const galponNum = ((i - 1) % 10) + 1;
      
      const primera = 3500 + ((i * 180) % 2500); // 3500 - 6000
      const segunda = 150 + ((i * 35) % 400);    // 150 - 550
      const rotos = 20 + ((i * 7) % 80);         // 20 - 100
      const total = primera + segunda + rotos;
      const postura = Number((82 + (i % 15) * 0.9).toFixed(1)); // 82.0% - 95.5%
      const alimento = 420 + ((i * 12) % 180);   // 420 - 600 kg

      const dia = String(28 - Math.floor((i - 1) / 4)).padStart(2, '0');
      const mes = '10';

      producciones.push({
        id: i,
        codigoProduccion: `PRD-2026-${String(i).padStart(4, '0')}`,
        loteCodigo: `LOT-2026-${String(loteNum).padStart(3, '0')}`,
        galponCodigo: `GAL-${String(galponNum).padStart(3, '0')}`,
        fecha: `2026-${mes}-${dia}`,
        huevosPrimera: primera,
        huevosSegunda: segunda,
        huevosRotos: rotos,
        totalHuevos: total,
        porcentajePostura: postura,
        alimentoConsumidoKg: alimento,
        observaciones: rotos > 70 ? 'Inconveniente menor en faja recolectora' : 'Recolección normal sin novedades'
      });
    }

    return producciones;
  }

  producciones = signal<Produccion[]>(this.generar100Producciones());
}