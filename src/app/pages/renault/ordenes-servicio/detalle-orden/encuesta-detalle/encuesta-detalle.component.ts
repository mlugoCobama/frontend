
import { Component, Input } from '@angular/core';

export interface PreguntaEncuesta {
  id: number;
  texto: string;
  categoria?: string | null;
}

export interface RespuestaEncuesta {
  id: number;
  ren_encuesta_cita_id: number;
  ren_preguntas_encuesta_id: number;
  motivo: string | null;
  puntuacion: number;
  pregunta: PreguntaEncuesta;
}

export interface Encuesta {
  id: number;
  fecha: string;
  ren_citas_servicio_id: number;
  ruta_firma?: string | null;
  created_at?: string;
  updated_at?: string;
  repuestas: RespuestaEncuesta[];
}

@Component({
  selector: 'app-encuesta-detalle',
  templateUrl: './encuesta-detalle.component.html',
  styleUrl: './encuesta-detalle.component.css'
})
export class EncuestaDetalleComponent {

  @Input() encuesta: Encuesta | null = null;

  get promedio(): number {
    if (!this.encuesta?.repuestas?.length) {
      return 0;
    }

    const total = this.encuesta.repuestas.reduce(
      (sum, item) => sum + Number(item.puntuacion),
      0
    );

    return total / this.encuesta.repuestas.length;
  }

  get totalRespuestasBajas(): number {
    return this.encuesta?.repuestas?.filter(
      respuesta => respuesta.puntuacion < 5
    ).length ?? 0;
  }

  getClasePuntuacion(puntuacion: number): string {
    if (puntuacion === 5) {
      return 'bg-success';
    }

    if (puntuacion === 4) {
      return 'bg-warning text-dark';
    }

    return 'bg-danger';
  }

  getClaseCard(puntuacion: number): string {
    return puntuacion < 5
      ? 'border-warning'
      : 'border-light';
  }
}
