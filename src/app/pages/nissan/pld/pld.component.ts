import { Component } from '@angular/core';

interface Paso {
  numero: number;
  titulo: string;
}

@Component({
  selector: 'app-pld',
  templateUrl: './pld.component.html',
  styleUrl: './pld.component.css'
})
export class PldComponent {
  pasoActual: number = 1;
  pasoActualMaximo: number = 1; // Para no permitir saltar a pasos no visitados
  readonly totalPasos: number = 3;

  public datosIA: any = [];

  pasos: Paso[] = [
    { numero: 1, titulo: 'Datos de operacion' },
    { numero: 2, titulo: 'Docuemntacion' },
    { numero: 3, titulo: 'Datos de identificacion' },
    // { numero: 4, titulo: 'Cuenta' },
    // { numero: 5, titulo: 'Preferencias' },
    // { numero: 6, titulo: 'Documentos' },
    // { numero: 7, titulo: 'Pago' },
    // { numero: 8, titulo: 'Términos' },
    // { numero: 9, titulo: 'Resumen' }
  ];

  get porcentajeProgreso(): number {
    return Math.round((this.pasoActual / this.totalPasos) * 100);
  }

  siguiente(): void {
    if (this.pasoActual < this.totalPasos) {
      this.pasoActual++;
      if (this.pasoActual > this.pasoActualMaximo) {
        this.pasoActualMaximo = this.pasoActual;
      }
    }
  }

  public serDatosIa(data:any){
    this.datosIA =  data;
  }

  anterior(): void {
    if (this.pasoActual > 1) {
      this.pasoActual--;
    }
  }

  irAlPaso(numeroPaso: number): void {
    if (numeroPaso <= this.pasoActualMaximo) {
      this.pasoActual = numeroPaso;
    }
  }

  finalizar(): void {
    console.log('Proceso de 9 pasos completado con éxito.');
    // Aquí invocas tu servicio o emisión de evento
  }
}
