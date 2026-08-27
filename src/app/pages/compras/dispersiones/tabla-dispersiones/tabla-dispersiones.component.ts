import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DispersionData, VehiculoDispersion } from 'src/app/core/models/compras/dispersiones-diesel';
import { DispersionesDieselService } from 'src/app/core/services/compras/dispersiones-diesel.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { UnidadesService } from 'src/app/core/services/compras/unidades.service';

@Component({
  selector: 'app-tabla-dispersiones',
  templateUrl: './tabla-dispersiones.component.html',
  styleUrls: ['./tabla-dispersiones.component.css']
})

export class TablaDispersionesComponent implements OnInit{

  public form: FormGroup;
  @Output() volver = new EventEmitter<void>();
  @Output() actualizarDispersiones = new EventEmitter<void>();

  @Input() solicitud:any;
  @Input() dispersionesData: DispersionData[] = [];
  // @Input() vehiculos:any;
  noDispersiones: number[] = [];
  tabSeleccionado = 0;

  public deshabilitado = false;
  public descargando:boolean = false;
  public notificando:boolean = false;

  constructor(
    private fb: FormBuilder,
    private alertasService: SwalComprsServiceService,
    private unidadesService: UnidadesService,
    private dispersiones: DispersionesDieselService
  ) {

    this.form = this.fb.group({
      dispersiones: this.fb.array([])
    });

  }

  ngOnInit(): void {
    this.generarTabs(this.solicitud.exibiciones);
    this.cargarVehiculosEnTabs();
    this.deshabilitarTab();
  }

    /**
   * @description Método para manejar cambios en los inputs del componente.
   * @param {SimpleChanges} changes - Cambios realizados en las propiedades del componente.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dispersionesData'] && this.dispersionesArray?.length) {
      this.cargarVehiculosEnTabs();
    }
  }

    /**
   * @description Método para cargar los vehículos en cada tabulador.
   */
  private cargarVehiculosEnTabs(): void {
    if (!this.dispersionesData?.length) { return; }

    this.dispersionesData.forEach((dispersion, i) => {
      const grupoDispersion = this.dispersionesArray.at(i) as FormGroup;
      if (!grupoDispersion) { return; }

      const primerVehiculo = dispersion.vehiculos[0];

      grupoDispersion.patchValue({
        fechaDispersion: primerVehiculo?.fechaDispersion ?? null,
        guardada: primerVehiculo?.guardada ?? false,
        notificada: primerVehiculo?.notificada ?? false,
        dispersada: primerVehiculo?.dispersada ?? false,
        porcentaje: primerVehiculo?.porcentaje ?? 100,
      });

      const vehiculosFormArray = grupoDispersion.get('vehiculos') as FormArray;
      vehiculosFormArray.clear();

      dispersion.vehiculos.forEach(v => vehiculosFormArray.push(this.crearGrupo(v)));
    });
  }

    /**
   * @description Getter para obtener el array de grupos de dispersiones.
   * @returns {FormArray}
   */
  get dispersionesArray(): FormArray {
    return this.form.get('dispersiones') as FormArray;
  }

  /**
   * @description Getter para obtener el grupo de dispersion actualmente seleccionado.
   * @returns {FormGroup | null}
   */
get dispersionActual(): FormGroup | null {
  if (this.dispersionesArray.length === 0) {
    return null;
  }
  return this.dispersionesArray.at(this.tabSeleccionado) as FormGroup;

}

 /**
   * @description Getter para obtener el array de vehículos del grupo de dispersion actual.
   * @returns {FormArray}
   */
get vehiculosArray(): FormArray {
  return this.dispersionActual!.get('vehiculos') as FormArray;
}

  /**
   * @description Método para generar los tabs en función del número de exhibiciones disponibles.
   * @param {number} cantidad - Cantidad de exhibiciones.
   */
generarTabs(cantidad: number): void {
  this.noDispersiones = Array.from({ length: cantidad }, (_, i) => i + 1);
    this.dispersionesArray.clear();
    for (let i = 0; i < cantidad; i++) {
      this.dispersionesArray.push(
        this.crearDispersion()
      );
    }
  }


  public generarArrayVehiculos(data:any){
    this.dispersionesArray.controls.forEach(d => {
      const vehiculos = d.get('vehiculos') as FormArray;
      vehiculos.clear();
      data.forEach((v:any) => {
        vehiculos.push(this.crearGrupo(v));
      });
    });
  }

  private crearDispersion(estado?: { fechaDispersion:any, guardada: boolean; notificada: boolean; dispersada: boolean; porcentaje?: number  }): FormGroup {
    return this.fb.group({
      fechaDispersion: [estado?.fechaDispersion ?? null],
      guardada: [estado?.guardada ?? false],
      notificada: [estado?.notificada ?? false],
      dispersada: [estado?.dispersada ?? false],
      porcentaje: [estado?.porcentaje ?? 100, [Validators.min(0), Validators.max(100)]],
      vehiculos: this.fb.array([])
    });
  }


  seleccionarTab(index: number): void {
      this.tabSeleccionado = index;
      this.deshabilitarTab();
  }

  /**
   * @description Método para crear un grupo de dispersion.
   * @param {VehiculoDispersion} v - Datos del vehículo de la dispersión.
   * @returns {FormGroup}
   */
  private crearGrupo(v: VehiculoDispersion): FormGroup {
    return this.fb.group({
      idExhibicion:       [v.idExhibicion],
      idAsignacion:       [v.idAsignacion],
      idSolicitud:        [v.idSolicitud],
      id_asignacion:      [v.id_asignacion],
      eco:                [{ value: v.eco, disabled: true }],
      marca:              [{ value: v.marca_vehiculo, disabled: true }],
      submarca:           [{ value: v.submarca, disabled: true }],
      modelo:             [{ value: v.modelo, disabled: true }],
      placas:             [{ value: v.placas, disabled: true }],
      numTarjetaToka:     [{ value: v.numTarjetaToka, disabled: true }],
      litros:             [{ value: v.ventasLitros, disabled: true }],
      saldoDispersado:    [{ value: v.saldoMesActual, disabled: true }],
      distanciaRecorrida: [{  value: v.distanciaRecorrida,  disabled: true}],
      fechaDispersion:    [{  value: v.fechaDispersion,  disabled: true}],
      porcentaje:         [{  value: v.porcentaje ?? 100,  disabled: true}],
      saldoAutorizado:    [  v.saldoAutorizado ?? 0,  [Validators.required, Validators.min(0)]],
      saldoSolicitado:    [{ value: v.saldoSolicitado,  disabled: true}],
      saldoActual:        [  v.saldoActual ?? 0,  [Validators.required, Validators.min(0)]],
      saldoDispersar:     [{  value: Math.max(0 , +(((v.saldoAutorizado ?? 0) *  (v.porcentaje / 100)) - (v.saldoActual ?? 0)).toFixed(2)) ?? 0,  disabled: true}]

    });
  }

  calcularSaldoDispersar(index?: number): void {
  const porcentaje = Number(this.dispersionActual?.get('porcentaje')?.value);
  const factorPorcentaje = isNaN(porcentaje) ? 1 : porcentaje / 100;

  const recargarVehiculo = (ctrl: FormGroup) => {
    const autorizado = Number(ctrl.get('saldoAutorizado')?.value) || 0;
    const actual = Number(ctrl.get('saldoActual')?.value) || 0;

    const autorizadoConPorcentaje = autorizado * factorPorcentaje;
    const saldoDispersar = Math.max(0, +(autorizadoConPorcentaje - actual).toFixed(2));

    ctrl.get('saldoDispersar')?.setValue(saldoDispersar, { emitEvent: false });
  };

  if (index !== undefined) {
    const grupo = this.vehiculosArray.at(index) as FormGroup;
    recargarVehiculo(grupo);
  } else {
    this.vehiculosArray.controls.forEach(ctrl => recargarVehiculo(ctrl as FormGroup));
  }
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

  get totalAutorizado(): number {
    return this.vehiculosArray.controls.reduce(
      (acc, ctrl) =>
        acc + (Number(ctrl.get('saldoAutorizado')?.value) || 0), 0
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
      saldoAutorizado: ctrl.get('saldoAutorizado')?.value,
      saldoDispersar: ctrl.get('saldoDispersar')?.value
    }));
  }

  private getVehiculosArray(dispersion: FormGroup): FormArray {
    return dispersion.get('vehiculos') as FormArray;
  }

  private construirPayload(dispersion: FormGroup) {

  const vehiculos = this.getVehiculosArray(dispersion);

  return {
    no_dispersion: this.tabSeleccionado + 1,
    porcentaje: Number(dispersion.get('porcentaje')?.value) || 100,
    solicitudDiesel: this.solicitud,
    saldosDispersar: vehiculos.controls.map(ctrl => ({
    idSolicitud: ctrl.get('idSolicitud')?.value,
    id_asignacion: ctrl.get('id_asignacion')?.value,
    idExhibicion: ctrl.get('idExhibicion')?.value,
    saldoAutorizado:  Number(ctrl.get('saldoAutorizado')?.value) || 0,
    saldoActual: Number(ctrl.get('saldoActual')?.value) || 0,
    saldoDispersar: Number(ctrl.get('saldoDispersar')?.value) || 0
    }))
  };
}

private totalDispersarDispersion(dispersion: FormGroup): number {
  const vehiculos = this.getVehiculosArray(dispersion);
  return vehiculos.controls.reduce((acc, ctrl) => {
    return acc + (Number(ctrl.get('saldoDispersar')?.value) || 0);
  }, 0);

}



guardarDispersionActual(): void {

  const dispersion = this.dispersionActual;

  if (!dispersion) {
    return;
  }

  const total = this.totalDispersarDispersion(dispersion);

  if (total === 0) {

    this.alertasService.mostrarAlerta(
      "Algo parece estar mal",
      "El saldo a dispersar no puede ser 0",
      "warning",
      "warning"
    );

    return;
  }

  this.deshabilitado = true;
  const payload = this.construirPayload(dispersion);
  this.unidadesService.dispersarToka(payload).subscribe({
    next: (response) => {
      this.deshabilitado = false;
      if (response.status !== "success") {
        this.alertasService.mostrarAlerta("Error",response.message,"error","danger");
        return;
      }
      this.alertasService.mostrarAlerta("Guardado","Datos guardados correctamente","success","success");
      this.marcarDispersionGuardada();
      this.descargarPlantilla();
      this.actualizarDispersiones.emit();
    },
    error: (error) => {
      this.deshabilitado = false;
      this.alertasService.mostrarAlerta("Error",`Error fetching data: ${error}`,"error","danger");
    }
  });

}

public marcarDispersionGuardada(): void {
  this.dispersionActual?.patchValue({ guardada: true  });
}

public marcarDispersionNotificada(): void {
  this.dispersionActual?.patchValue({ notificada: true  });
}


  public notificarDispersion(){
      const dispersion = this.dispersionActual;
      if (!dispersion) {
        return;
      }

    this.notificando = true;
    if(this.totalDispersar == 0){
      this.alertasService.mostrarAlerta("Algo parece estar mal", "El saldo a dispersar no puede ser 0",
                                        "warning", "warning");
      this.notificando = false;
      return
    }
    const payload = this.construirPayload(dispersion);


    this.dispersiones.notificarDispersion(payload).subscribe(
      (response) => {
        if (response.status === "success") {
          this.notificando = false;
          this.alertasService.mostrarAlerta("Listo","Se ha notificado la dispersion de combustible","success","success");
          this.volver.emit();
          this.marcarDispersionNotificada();
          this.actualizarDispersiones.emit();
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


  descargarPlantilla(): void {
    this.descargando =  true;
    const numDispersion = this.tabSeleccionado + 1;
    this.dispersiones.descargarPlantilla(this.solicitud.id, numDispersion )
      .subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `GenerarPedidoDeAltas_${this.solicitud.folio}_${numDispersion}.xlsx`;
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

public deshabilitarTab(){
  const porcentajeRestante = 100 - this.porcentajeUtilizadoPrevio ;
  if(this.dispersionActual?.get('guardada')?.value == true){
    this.dispersionActual.get('porcentaje')?.disable({ emitEvent: false });
    this.vehiculosArray.controls.forEach((ctrl) => {
    ctrl.get('saldoAutorizado')?.disable({ emitEvent: false });
    ctrl.get('saldoActual')?.disable({ emitEvent: false });
  });
  return;
  }

  if(this.tabSeleccionado > 0){
    this.dispersionActual?.get('porcentaje')?.patchValue(porcentajeRestante)
     this.vehiculosArray.controls.forEach((ctrl) => {
        ctrl.get('saldoAutorizado')?.disable({ emitEvent: false });
      });
  }
}

get porcentajeUtilizadoPrevio(): number {
  let acumulado = 0;
  for (let i = 0; i < this.tabSeleccionado; i++) {
    const dispersion = this.dispersionesArray.at(i) as FormGroup;
    acumulado += Number(dispersion.get('porcentaje')?.value) || 0;
  }
  return acumulado;
}
}
