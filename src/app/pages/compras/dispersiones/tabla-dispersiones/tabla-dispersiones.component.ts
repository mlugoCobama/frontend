import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { DispersionesDieselService } from 'src/app/core/services/compras/dispersiones-diesel.service';

export interface VehiculoDispersion {
  idSolicitud: number;
  id_asignacion: number;
  eco: string;
  marca_vehiculo: string;
  submarca: string;
  modelo: string;
  placas: string;
  ventasLitros: number;
  numTarjetaToka: string;
  distanciaRecorrida: number;
  saldoSolicitado: number;
  saldoMesActual: number;
  saldoActual: number;
}

import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { UnidadesService } from 'src/app/core/services/compras/unidades.service';
@Component({
  selector: 'app-tabla-dispersiones',
  templateUrl: './tabla-dispersiones.component.html',
  styleUrls: ['./tabla-dispersiones.component.css']
})
export class TablaDispersionesComponent {

  form: FormGroup;
    @Output() volver = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private alertasService: SwalComprsServiceService,
    private unidadesService: UnidadesService,
    private dispersiones: DispersionesDieselService
  ) {
    this.form = this.fb.group({
      vehiculos: this.fb.array([])
    });
  }

  @Input() solicitud:any;
  @Input() set vehiculos(data: VehiculoDispersion[]) {

    this.vehiculosArray.clear();

    if (!data?.length) {
      return;
    }

    data.forEach(v => {
      this.vehiculosArray.push(
        this.crearGrupo(v)
      );
    });
  }

  get vehiculosArray(): FormArray {
    return this.form.get('vehiculos') as FormArray;
  }

  private crearGrupo(v: VehiculoDispersion): FormGroup {

    return this.fb.group({

      idSolicitud: [v.idSolicitud],
      id_asignacion: [v.id_asignacion],
      eco: [{ value: v.eco, disabled: true }],
      marca: [{ value: v.marca_vehiculo, disabled: true }],
      submarca: [{ value: v.submarca, disabled: true }],
      modelo: [{ value: v.modelo, disabled: true }],
      placas: [{ value: v.placas, disabled: true }],
      numTarjetaToka: [{ value: v.numTarjetaToka, disabled: true }],
      litros: [{ value: v.ventasLitros, disabled: true }],
      saldoDispersado: [{ value: v.saldoMesActual, disabled: true }],
      distanciaRecorrida: [{
        value: v.distanciaRecorrida,
        disabled: true
      }],

      saldoSolicitado: [{
        value: v.saldoSolicitado,
        disabled: true
      }],

      saldoActual: [
        v.saldoActual ?? 0,
        [Validators.required, Validators.min(0)]
      ],

      saldoDispersar: [{
        value: Math.max(
          0,
          +(v.saldoSolicitado - (v.saldoActual ?? 0)).toFixed(2)
        ),
        disabled: true
      }]
    });
  }

  calcularSaldoDispersar(index: number): void {

    const grupo = this.vehiculosArray.at(index) as FormGroup;
    const solicitado = Number(grupo.get('saldoSolicitado')?.value) || 0;
    const actual =  Number(grupo.get('saldoActual')?.value) || 0;
    const saldoDispersar = Math.max( 0, +(solicitado - actual).toFixed(2));
    grupo.get('saldoDispersar')?.setValue( saldoDispersar, { emitEvent: false });
  }

  get totalSolicitado(): number {
    return this.vehiculosArray.controls.reduce(
      (acc, ctrl) =>
        acc + (Number(ctrl.get('saldoSolicitado')?.value) || 0), 0
    );
  }

  get totalActual(): number {
    return this.vehiculosArray.controls.reduce(
      (acc, ctrl) =>
        acc + (Number(ctrl.get('saldoActual')?.value) || 0), 0
    );
  }

  get totalDispersar(): number {
    return this.vehiculosArray.controls.reduce(
      (acc, ctrl) =>
        acc + (Number(ctrl.get('saldoDispersar')?.value) || 0), 0
    );
  }

  getValor(index: number, campo: string): any {
    return (this.vehiculosArray.at(index) as FormGroup)
      .get(campo)?.value;
  }

  getValoresCapturados() {
    return this.vehiculosArray.controls.map(ctrl => ({
      idSolicitud: ctrl.get('idSolicitud')?.value,
      id_asignacion: ctrl.get('id_asignacion')?.value,
      saldoActual: ctrl.get('saldoActual')?.value,
      saldoDispersar: ctrl.get('saldoDispersar')?.value
    }));
  }

  public deshabilitado:boolean = false;

  // Suena a jutsu de naruto xD
  public dispersion(){
    this.deshabilitado = true;
    if(this.totalDispersar == 0){
      this.alertasService.mostrarAlerta("Algo parece estar mal", "El saldo a dispersar no puede ser 0",
                                        "warning", "warning");
      this.deshabilitado = false;
      return
    }

    const data = this.getValoresCapturados();
    const payload = {
      solicitudDiesel : this.solicitud,
      saldosDispersar : data,
    }

    this.unidadesService.dispersarToka(payload).subscribe(
      (response) => {
        if (response.status === "success") {
          this.deshabilitado = false;
          this.alertasService.mostrarAlerta("Guardado","Datos guardados correctamente","success","success");
          this.descargarPlantilla();
          this.volver.emit();
          // this.getCatVehiculos(this.intercompania);
        } else {
          this.alertasService.mostrarAlerta("Error",response.message,"error","danger");
          this.deshabilitado = false;
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta("Error",`Error fetching data: ${error}`,"error","danger",);
        this.deshabilitado = false;
      },
    );
  }

  public notificando:boolean = false;
  // 
  public notificarDispersion(){
    this.notificando = true;
    if(this.totalDispersar == 0){
      this.alertasService.mostrarAlerta("Algo parece estar mal", "El saldo a dispersar no puede ser 0",
                                        "warning", "warning");
      this.notificando = false;
      return
    }

    const data = this.getValoresCapturados();
    const payload = {
      solicitudDiesel : this.solicitud,
      saldosDispersar : data,
    }

    this.dispersiones.notificarDispersion(payload).subscribe(
      (response) => {
        if (response.status === "success") {
          this.notificando = false;
          this.alertasService.mostrarAlerta("Listo","Se ha notificado la dispersion de combustible","success","success");
          this.volver.emit();
        } else {
          this.alertasService.mostrarAlerta("Error",response.message,"error","danger");
          this.notificando = false;
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta("Error",`Error fetching data: ${error}`,"error","danger",);
        this.notificando = false;
      },
    );
  }

  public descargando:boolean = false;
  descargarPlantilla(): void {
    this.descargando =  true;
  this.dispersiones.descargarPlantilla(this.solicitud.id)
    .subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `GenerarPedidoDeAltas_${this.solicitud.folio}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.descargando =  false;
      },
      error: (error) => {
        console.error(error);
        this.descargando =  false;
      }
    });
}
}