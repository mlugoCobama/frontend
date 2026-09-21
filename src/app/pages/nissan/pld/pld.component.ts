import { Component, ViewChild } from '@angular/core';
import { DatosOperacionFormComponent } from './datos-operacion-form/datos-operacion-form.component';
import { DocumentacionFormComponent } from './documentacion-form/documentacion-form.component';
import { DocumentosServiceService } from 'src/app/core/services/pld/documentos-service.service';
import { DatosIdentificacionFormComponent } from './datos-identificacion-form/datos-identificacion-form.component';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { DomicilioContactoFormComponent } from './domicilio-contacto-form/domicilio-contacto-form.component';
import { RelacionNegocioComponent } from './relacion-negocio/relacion-negocio.component';

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

  constructor(
    private documentosService: DocumentosServiceService,
    private alertasService: SwalComprsServiceService
  ){}

  pasoActual: number = 1;
  pasoActualMaximo: number = 1; // Para no permitir saltar a pasos no visitados
  readonly totalPasos: number = 5;
  cargando: boolean = false;
  paso2Procesado: boolean = false;
  public datosIA: any = null;

  pasos: Paso[] = [
    { numero: 1, titulo: 'Datos de Operacion' },
    { numero: 2, titulo: 'Documentacion' },
    { numero: 3, titulo: 'Datos de Identificacion' },
    { numero: 4, titulo: 'Relacion de Negocios' },
    { numero: 5, titulo: 'Domicilio y datos de contacto' },
    // { numero: 6, titulo: 'Documentos' },
    // { numero: 7, titulo: 'Pago' },
    // { numero: 8, titulo: 'Términos' },
    // { numero: 9, titulo: 'Resumen' }
  ];

  @ViewChild('step1Form') step1Form!: DatosOperacionFormComponent;
  @ViewChild('step2Form') step2Form!: DocumentacionFormComponent;
  @ViewChild('step3Form') step3Form!: DatosIdentificacionFormComponent;
  @ViewChild('step4Form') step4Form!: RelacionNegocioComponent;
  @ViewChild('step5Form') step5Form!: DomicilioContactoFormComponent;

  get porcentajeProgreso(): number {
    return Math.round((this.pasoActual / this.totalPasos) * 100);
  }

async siguiente(): Promise<void> {
    // ---- VALIDACIÓN Y PROCESO PASO 1 ----
    if (this.pasoActual === 1) {
      if (this.step1Form?.ventaForm?.invalid) {
        this.step1Form.ventaForm.markAllAsTouched();
        this.alertasService.mostrarAlerta('Error', 'El formulario no esta llenado correctamente', 'error', 'danger');
        return;
      }
      this.avanzarPaso();
      return;
    }

    // ---- VALIDACIÓN Y ENVÍO ASÍNCRONO PASO 2 ----
    if (this.pasoActual === 2) {
      this.cargando = true;

       if (this.step2Form?.documentosForm?.invalid) {
         this.step2Form.documentosForm.markAllAsTouched();
         this.alertasService.mostrarAlerta('Error', 'Faltan Archivos', 'error', 'danger');
         this.cargando = false;
         return;
       }

       if (this.paso2Procesado) {
        this.cargando = false;
        this.avanzarPaso();
        return;
      }

      const formData = this.step2Form?.generarPayload();

      this.documentosService.procesar(formData!).subscribe({
      next: (res) => {
        if(res.status == 'success'){
          this.datosIA = res.data;
          this.cargando = false;
          //  this.step2Form?.listaDocumentos.forEach(doc => doc.error = null);
          //  if (res.errors) {
          //    Object.keys(res.errors).forEach(backendKey => {
          //      const item = this.step2Form?.listaDocumentos.find(d => d.backendKey === backendKey);
          //      if (item) {
          //        item.error = res.errors[backendKey];
          //      }
          //    });
          //  }
          this.alertasService.mostrarAlerta('Listo', 'Archivos procesados correctamente', 'success', 'success');
          this.step3Form.sethValues(res.data.data);
          this.paso2Procesado = true;
          this.avanzarPaso();
        }

      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al comunicarse con el servidor:', err);
        this.alertasService.mostrarAlerta('Error','Ocurrió un error al procesar los documentos. Por favor intenta de nuevo.', 'error', 'danger');
        return;
      }
    });
      return;
    }

    if(this.pasoActual === 3) {
      if (this.step3Form.clienteForm?.invalid) {
        this.step3Form.clienteForm?.markAllAsTouched();
        this.alertasService.mostrarAlerta('Error', 'El formulario no esta llenado correctamente', 'error', 'danger');
        return;
      }
    }

    if (this.pasoActual === 4) {

      if (this.step4Form?.relacionForm?.invalid) {
        this.step4Form.relacionForm.markAllAsTouched();
        this.alertasService.mostrarAlerta('Error', 'El formulario no esta llenado correctamente', 'error', 'danger');
        return;
      }

      this.step5Form.sethValues(this.datosIA.data);
      this.avanzarPaso();
      return;
    }

    if (this.pasoActual === 5) {

      if (this.step5Form?.registroForm?.invalid) {
        this.step5Form?.registroForm?.markAllAsTouched();
        this.alertasService.mostrarAlerta('Error', 'El formulario no esta llenado correctamente', 'error', 'danger');
        return;
      }
      this.avanzarPaso();
      return;
    }

    // ---- PASOS RESTANTES (3 al 9) ----
    if (this.pasoActual < this.totalPasos) {
      this.avanzarPaso();
    }
  }

  private avanzarPaso(): void {
    this.pasoActual++;
    if (this.pasoActual > this.pasoActualMaximo) {
      this.pasoActualMaximo = this.pasoActual;
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

  resertPaso2(){
    this.paso2Procesado = false;
  }

  finalizar(): void {
    console.log('Proceso de 9 pasos completado con éxito.');
  }
}
