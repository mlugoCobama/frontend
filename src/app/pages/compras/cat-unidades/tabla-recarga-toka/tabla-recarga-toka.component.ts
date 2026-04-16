import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { UnidadesService } from 'src/app/core/services/compras/unidades.service';
import { PermisosService } from 'src/app/core/services/permisos.service';
import { pmsParqueVehciular } from 'src/app/shared/constants/permisos';

export interface VehiculoInput {
  id: number;
  eco: string;
  marca_vehiculo: string;
  submarca: string;
  no_serie: string;
  numTarjetaToka: string;
  placas: string;
  modelo: string;
  tipo:string;
  
  saldoMesAnterior: number;
  saldoMesActual: number;

  numAbonosMesAnterior: number;
  numAbonosMesActual: number;

  ventasLitros: number;
  saldoSolicitado:number;

  idSolicitud:number; 
  saldoActual: number;
  saldoDispersar:number;
}


@Component({
  selector: 'app-tabla-recarga-toka',
  templateUrl: './tabla-recarga-toka.component.html',
  styleUrl: './tabla-recarga-toka.component.css'
})

export class TablaRecargaTokaComponent implements OnChanges {

  @Input() tipo: any;
  @Input() intercompania: any;

  vehiculos: VehiculoInput[] = []; 
  form!: FormGroup;
  public isLoad:boolean = false;
  public deshabilitado:boolean = false;
  public permisos = pmsParqueVehciular;

  constructor(
    private fb: FormBuilder, 
    private alertasService: SwalComprsServiceService, 
    private unidadesService: UnidadesService,
    private permisosService: PermisosService,
  ) {
    this.form = this.fb.group({ vehiculos: this.fb.array([]) });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['intercompania'] && this.intercompania){
      this.getCatVehiculos(this.intercompania);
    }
  }

  get vehiculosArray(): FormArray {
    return this.form.get('vehiculos') as FormArray;
  }

  private reconstruirFormArray(): void {
    this.vehiculosArray.clear();
    this.vehiculos.forEach((v) => this.vehiculosArray.push(this.crearGrupo(v)));
  }

  get totalSaldoAnterior()  :   number { return this.sumarCampo('saldoMesAnterior'); }
  get totalVentaLitros()    :   number { return this.sumarCampo('ventaLitros'); }
  get totalSaldoSolicitado():   number { return this.sumarCampo('saldoSolictado'); }
  get totalSaldoActual()    :   number { return this.sumarCampo('saldoActual'); }
  get totalSaldoDispersar() :   number { return this.sumarCampo('saldoDispersar'); }
  get totalSaldoMesActual() :   number { return this.sumarCampo('saldoMesActual'); }
  get totalSaldoNuevo()     :   number { return this.sumarCampo('saldoNuevo'); }

  private crearGrupo(data: VehiculoInput): FormGroup {
    return this.fb.group({
      // ----Datos del vehículo---
      id:                   [{ value: data.id ,     disabled: true }],
      seleccionado:         [false],
      eco:                  [{ value: data.eco ,     disabled: true }],
      marca:                [{ value: data.marca_vehiculo,            disabled: true }],
      submarca:             [{ value: data.submarca,         disabled: true }],
      tipo:                 [{ value: data.tipo,         disabled: true }],
      numTarjetaToka:       [{ value: data.numTarjetaToka,         disabled: true }],
      modelo:               [{ value: data.modelo,           disabled: true }],
      numeroSerie:          [{ value: data.no_serie,      disabled: true }],
      placas:               [{ value: data.placas,           disabled: true }],
      //-- Informacion Extra--
      saldoMesAnterior:     [{ value: data.saldoMesAnterior ?? 0, disabled: true }],
      saldoMesActual:       [{ value: data.saldoMesActual ?? 0, disabled: true }],
      numAbonosMesAnterior: [{ value: data.numAbonosMesAnterior ?? 0, disabled: true }],
      numAbonosMesActual:   [{ value: data.numAbonosMesActual ?? 0, disabled: true }],
      //-- Informacion Extra--
      ventaLitros:          [{ value: data.ventasLitros ?? 0, disabled:   (data.saldoSolicitado ?? 0) > 0  }, [Validators.min(0)]],
      saldoSolictado:       [{ value: data.saldoSolicitado ?? 0,   disabled: (data.saldoSolicitado ?? 0) > 0},[Validators.min(0)]],

      idSolicitud:          [{ value: data.idSolicitud ?? null, disabled: true }],
      saldoActual:          [{ value: data.saldoActual ?? 0, disabled: !((data.saldoSolicitado ?? 0) > 0) } ,[Validators.min(0)]],
      saldoDispersar:       [ {value: 0, disabled: true }, [Validators.min(0)]],
      saldoNuevo:           [{ value: data.saldoMesActual ?? 0, disabled: true }],
    });
  }

  calcularSaldoNuevo(index: number): void {
    const grupo    = this.vehiculosArray.at(index) as FormGroup;

    // SALDO A DISPERSAR =  SALDO SOLICITADO - SALDO ACTUAL
    const saldoActual        = parseFloat(grupo.get('saldoActual')?.value) || 0;
    const saldoSolicitado    = parseFloat(grupo.get('saldoSolictado')?.value) || 0;
    const saldoDispersar     = parseFloat((saldoSolicitado - saldoActual).toFixed(2)) || 0;
    const saldoNuevo         = parseFloat((saldoActual + saldoDispersar).toFixed(2)) || 0; 

    grupo.get('saldoDispersar')?.setValue(saldoDispersar);
  
  }

  get seleccionados(): number[] {
    return this.vehiculosArray.controls.reduce<number[]>((acc, ctrl, i) => {
      if (ctrl.get('seleccionado')?.value) acc.push(i);
      return acc;
    }, []);
  }

  get todosSeleccionados(): boolean {
    return (
      this.vehiculosArray.length > 0 &&
      this.vehiculosArray.controls.every((c) => c.get('seleccionado')?.value)
    );
  }

  get algunoSeleccionado(): boolean {
    return this.vehiculosArray.controls.some((c) => c.get('seleccionado')?.value);
  }

  toggleTodos(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.vehiculosArray.controls.forEach((ctrl) =>
      ctrl.get('seleccionado')?.setValue(checked)
    );
  }

  onCheckChange(): void { /* activa detección de cambios en los getters */ }

  private sumarCampo(campo: string): number {
    return this.vehiculosArray.controls.reduce(
      (acc, ctrl) => acc + (parseFloat(ctrl.get(campo)?.value) || 0),
      0
    );
  }


getValor(index: number, campo: string) {
  return (this.vehiculosArray.at(index) as FormGroup).get(campo)?.value;
}

  getValoresCapturados() {
    const dataCapturados =  this.vehiculosArray.controls.map((ctrl) => ({
      id:               ctrl.get('id')?.value,
      abonoNuevo:       ctrl.get('saldoSolictado')?.value,
      ventaLitros:      ctrl.get('ventaLitros')?.value,

      idSolicitud:      ctrl.get('idSolicitud')?.value,
      saldoActual:      ctrl.get('saldoActual')?.value,
      saldoDispersar:   ctrl.get('saldoDispersar')?.value,
    }));

    const data = {
      captura : dataCapturados
    };

    return data;
  }

  public guardar(){
    this.deshabilitado = true;
    if(this.sumarCampo('saldoSolictado') == 0){
      this.alertasService.mostrarAlerta("Algo parece estar mal", "El total no puede ser 0, llena correctamente los campos",
                                        "warning", "warning");
      this.deshabilitado = false;
      return
    }

    const data = this.getValoresCapturados();
    this.unidadesService.solicitarToka(data).subscribe(
      (response) => {
        if (response.status === "success") {
          this.deshabilitado = false;
          this.alertasService.mostrarAlerta("Guardado","Datos guardados correctamente","success","success");
          this.getCatVehiculos(this.intercompania);
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

  // Suena a jutsu de naruto xD
  public dispersion(){
    this.deshabilitado = true;
    if(this.sumarCampo('saldoDispersar') == 0){
      this.alertasService.mostrarAlerta("Algo parece estar mal", "El saldo a dispersar no puede ser 0",
                                        "warning", "warning");
      this.deshabilitado = false;
      return
    }

    const data = this.getValoresCapturados();
    this.unidadesService.dispersarToka(data).subscribe(
      (response) => {
        if (response.status === "success") {
          this.deshabilitado = false;
          this.alertasService.mostrarAlerta("Guardado","Datos guardados correctamente","success","success");
          this.getCatVehiculos(this.intercompania);
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

   private getCatVehiculos(intercompania:any) {
    this.isLoad = true;
      this.vehiculos = [];
      this.unidadesService.getParqueConToka(intercompania).subscribe(
        (response) => {
          if (response) {
            this.vehiculos = response.data;
            this.reconstruirFormArray();
            this.isLoad = false;
          } else {
            this.reconstruirFormArray();
            this.isLoad = false;
            this.alertasService.mostrarAlerta("Error",response.message,"error","danger");
          }
        },
        (error) => {
          this.alertasService.mostrarAlerta("Error",`Error fetching data: ${error}`, "error", "danger");
          this.reconstruirFormArray();
          this.isLoad = false;
        }
      );
    }


  tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }
}