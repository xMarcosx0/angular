import { Injectable, signal } from '@angular/core';

export interface Galpon {
  id: number;
  codigo: string;
  nombre: string;
  tipoAve: 'Ponedoras' | 'Engorde' | 'Crianza' | 'Reproductoras';
  capacidadMax: number;
  avesActuales: number;
  temperatura: number; // °C
  humedad: number; // %
  estado: 'Activo' | 'Mantenimiento' | 'Inactivo';
}

@Injectable({
  providedIn: 'root'
})
export class GalponService {
  // Generador dinámico de 100 galpones de prueba
  private generar100Galpones(): Galpon[] {
    const tipos: ('Ponedoras' | 'Engorde' | 'Crianza' | 'Reproductoras')[] = ['Ponedoras', 'Engorde', 'Crianza', 'Reproductoras'];
    const estados: ('Activo' | 'Mantenimiento' | 'Inactivo')[] = ['Activo', 'Activo', 'Activo', 'Mantenimiento', 'Inactivo'];
    
    const galpones: Galpon[] = [];

    for (let i = 1; i <= 100; i++) {
      const tipo = tipos[(i - 1) % tipos.length];
      const estado = estados[(i - 1) % estados.length];
      const capacidad = 5000 + ((i * 350) % 10000); // Entre 5,000 y 15,000
      const aves = estado === 'Inactivo' ? 0 : Math.floor(capacidad * (0.8 + ((i % 20) / 100))); // ~80%-100%
      const temp = Number((23 + (i % 7) * 0.8).toFixed(1)); // Entre 23.0°C y 28.6°C
      const hum = 55 + (i % 25); // Entre 55% y 80%

      galpones.push({
        id: i,
        codigo: `GAL-${String(i).padStart(3, '0')}`,
        nombre: `Galpón Norte #${i} - Sector ${String.fromCharCode(65 + (i % 6))}`,
        tipoAve: tipo,
        capacidadMax: capacidad,
        avesActuales: aves,
        temperatura: temp,
        humedad: hum,
        estado: estado
      });
    }

    return galpones;
  }

  // Signal con la lista inicial de 100 galpones
  galpones = signal<Galpon[]>(this.generar100Galpones());
}