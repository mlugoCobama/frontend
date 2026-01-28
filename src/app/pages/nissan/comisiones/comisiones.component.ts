import { AfterViewInit, Component, OnInit, signal, ViewChild, WritableSignal } from "@angular/core";
import { Comision } from "src/app/core/models/nissan/comisiones";
import { ComisionesService } from "src/app/core/services/nissan/comisiones.service";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";
import Swal from "sweetalert2";
import { PermisosService } from 'src/app/core/services/permisos.service';
import { FiltroComponent } from "./filtro/filtro.component";
import { firstValueFrom } from 'rxjs';


@Component({
  selector: "app-comisiones",
  templateUrl: "./comisiones.component.html",
  styleUrl: "./comisiones.component.css",
})
export class ComisionesComponent implements AfterViewInit {
  finding: boolean = false;
  public datos: any = [];

  public vendedores: any;

  public ready: boolean = false;
  public isLoadig: boolean = false;
  public estado: any = 0;

  public modelCamposGastos = ['otros','gasolina','previa','descuentos','descuento_impulso',
                              'traslados','subsidios','descuento_da','cortesia','accesorios','placas'
                            ];

  public hoy = new Date().toISOString().split("T")[0];

  pagando: boolean[] = [];
  devolviendo: boolean[] = [];

  guardandoG: boolean = false;
  guardandoV: boolean = false;
  guardandoE: boolean = false;
  
  @ViewChild('formFiltro', { static: false }) formFiltro!:  FiltroComponent;

  constructor(
    private comisionesService: ComisionesService,
    private swal: SwalComprsServiceService,
    public fb: FormBuilder,
    private permisosService: PermisosService
  ) {}

  ngAfterViewInit(): void {}

  /** Form array */
  form = this.fb.group({
    ventas: this.fb.array([])
  });

  get ventas(): FormArray {
    return this.form.get('ventas') as FormArray;
  }

  /** Validador de permisos */
  tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }

  /**Puente para manejar el spinner */
  bindingSpiner(value) {
    this.isLoadig = value;
  }

  /**Puente para manejar el estado */
  bindingEstado(value) {
    this.estado = value;
  }

  /**Puente para manejar la carga de datos nuevos */
  bindingData(value) {
    this.datos = value;
    if (this.datos.length > 0) {
      this.cargarVentas();
    }
  }

 /**
  * Genera una fila (formulario) dentro del form array
  * @param row registro de venta
  * @returns 
  */
  crearVenta(row: any): FormGroup {
    const fg = this.fb.group({
      id_venta: [row.id ?? false],
      entregado: [row.entregado ?? false],
      estatus: [{ value: row.estatus, disabled: true }],
      fecha_factura: [{ value: row.fecha_factura, disabled: true }],
      no_factura: [{ value: row.no_factura, disabled: true }],
      razon_social: [{ value: row.razon_social, disabled: true }],
      clave_producto: [{ value: row.clave_producto, disabled: true }],
      clave_inventario: [{ value: row.clave_inventario, disabled: true }],
      clave_vendedor: [{ value: row.clave_vendedor, disabled: true }],
      descripcion: [{ value: row.descripcion, disabled: true }],
      serie: [{ value: row.serie, disabled: true }],
      total_venta: [{ value: row.total_venta, disabled: true }],
      costos: [{ value: row.costos, disabled: true }],
      bonificaciones: [{ value: row.bonificaciones, disabled: true }],
      utilidad_inicial: [{ value: row.utilidad_inicial, disabled: true }],
      tipo_venta: [{ value: row.tipo_venta, disabled: true }],
      tipo_venta_porcentaje: [{ value: row.tipo_venta_porcentaje, disabled: true }],
      validado: [row.validado ?? false],
      pagado: [row.pagado ?? 0],
      observacion: [row.observacion ?? null],
      // Gastos editables
      id_gastos : [0],
      otros: [0],
      gasolina: [0],
      previa: [0],
      descuentos: [0],
      descuento_impulso: [0],
      traslados: [0],
      subsidios: [0],
      descuento_da: [0],
      cortesia: [0],
      accesorios: [0],
      placas: [0],
      porcentaje_bdc: [0],
      // Calculados
      total_gastos: [{ value: 0, disabled: true }],
      utlidad_gastos: [{ value: 0, disabled: true }],
      utilidad_final: [{ value: 0, disabled: true }],
      comision_apv: [{ value: 0, disabled: true }],
      comision_bdc: [{ value: 0, disabled: true }],
    });

    this.calcularResultados(fg);
    this.inicializarReglasTipoVenta(fg);

    if (row.gastos) {
      this.patchGastosBackend(fg, row.gastos);
    }

    if (row.entregado) {
      fg.get('entregado')?.disable({ emitEvent: false });
    }

    if (row.validado) {
      fg.get('validado')?.disable({ emitEvent: false });
    }

    return fg;
  }

  /** Inicializa las reglas de tipo de venta (deshabilitado de campos) */
  inicializarReglasTipoVenta(fg: FormGroup) {
    this.aplicarReglasTipoVenta(fg);
  }

  /**
   * Reglas por tipo de venta y por estado (deshabilitado de campos)
   * @param fg fila-formulario
   * @returns 
   */
  aplicarReglasTipoVenta(fg: FormGroup) {
    const tipo = fg.get('clave_producto')?.value;
    const estatus = fg.get('estatus')?.value;

    const reglas: Record<string, string[]> = {
      NU: ['otros','gasolina','previa','descuentos','descuento_impulso',
      'traslados','subsidios','cortesia' ],
      SEMI: ['otros','gasolina','previa','descuentos','descuento_impulso',
      'traslados','subsidios','descuento_da','accesorios','placas'],
    };

    const campos = this.modelCamposGastos;
    
    if (Number(estatus) > 2) {
      campos.forEach(c => {
        fg.get(c)?.disable({ emitEvent: false });
        fg.get(c)?.setValue(0, { emitEvent: false });
      });
      return;
    }

    campos.forEach(c => {
      fg.get(c)?.disable({ emitEvent: false });
      fg.get(c)?.setValue(0, { emitEvent: false });
    });

    reglas[tipo]?.forEach(c => {
      fg.get(c)?.enable({ emitEvent: false });
    });
  }

  /**
   * Calculo de comisión, gastos, utilidad final
   * @param fg fila formulario
   */
  calcularResultados(fg: FormGroup) {
  const camposGastos = this.modelCamposGastos;

  fg.valueChanges.subscribe(() => {

    const totalGastos = camposGastos.reduce((total, campo) => {
      const valor = fg.get(campo)?.value;
      const numero = Number(valor);
      return total + (isNaN(numero) ? 0 : numero);
    }, 0);

    const porcentajeBdc = (Number(fg.get('porcentaje_bdc')?.value) / 100) || 0;
    const comisionGuardada = Number(fg.get('comision_apv')?.value)
    const utilidadInicial = Number(fg.get('utilidad_inicial')?.value) || 0;
    const porcentaje = (Number(fg.get('tipo_venta_porcentaje')?.value) - porcentajeBdc)  || 0;

    const utilidadAC = utilidadInicial - totalGastos;
    const comision = utilidadAC * porcentaje;
    const comisionBDC = utilidadAC * porcentajeBdc; 
    const utilidadFinal = utilidadAC - comision - comisionBDC;
  

    fg.patchValue({
      utlidad_gastos: utilidadAC,
      total_gastos: totalGastos,
      utilidad_final: utilidadFinal,
      comision_apv: comision,
      comision_bdc: comisionBDC
    }, { emitEvent: false });
  });
}


  /**
   * Set de valores de gastos en los inputs
   * @param fg fila.formulario
   * @param g gastos fila-formulario si existen
   */
  patchGastosBackend(fg: FormGroup, g: any) {
    fg.patchValue({
      id_gastos: g.id ?? null,
      otros: g.otros ?? 0,
      gasolina: g.gasolina ?? 0,
      previa: g.previa ?? 0,
      descuentos: g.descuentos ?? 0,
      descuento_impulso: g.descuento_impulso ?? 0,
      traslados: g.traslados ?? 0,
      subsidios: g.subsidios ?? 0,
      descuento_da: g.descuento_da ?? 0,
      cortesia: g.cortesia ?? 0,
      accesorios: g.accesorios ?? 0,
      placas: g.placas ?? 0
    }, { emitEvent: true });
  }

  /**
   * Genera el formulario a partir de datos cargados
   */
  cargarVentas() {
    this.ventas.clear();
        this.datos.forEach(row => {
          this.ventas.push(this.crearVenta(row));
          this.pagando.push(false);
          this.devolviendo.push(false);
        });
  }

  /**
   * Guarda los datos de los gastos (solo los que tienen gastos > 0)
   */
  guardarGastos() {
    this.guardandoG = true;
    const payload = this.ventas.getRawValue()
      .filter(v => v.total_gastos > 0)
      .map(v => ({
        id_venta: v.id_venta,
        total_gastos: v.total_gastos,
        utilidad_final: v.utilidad_final,
        comision_apv: v.comision_apv,
        id_gastos: v.id_gastos,
        otros: v.otros,
        gasolina: v.gasolina,
        previa: v.previa,
        descuentos: v.descuentos,
        descuento_impulso: v.descuento_impulso,
        traslados: v.traslados,
        subsidios: v.subsidios,
        descuento_da: v.descuento_da,
        cortesia: v.cortesia,
        accesorios: v.accesorios,
        placas: v.placas
      }));
      
      this.comisionesService.save(payload).subscribe((response) => {
        if (response.status === "success") {
            this.swal.mostrarAlerta(
              "Listo", response.message,
              "success", "success"
              );
              this.resetFormArray();
              this.guardandoG = false;
        } else {
            this.swal.mostrarAlerta(
              "Error", response.message,
              "error", "danger"
              );
              this.guardandoG = false;
              return;
        }
      },(error) => {
            this.swal.mostrarAlerta("Error", `Error fetching data: ${error}`, "error" , "danger" );
            this.guardandoG = false;
            return;
        });
  }

  /** Recupera los datos que fueron marcados como entregados */
  marcarEntregados() {
    const payload = this.ventas.getRawValue()
      .filter(v => v.entregado)
      .map(v => ({
        id : v.id_venta,
        entregado: true
      }));
    return payload;
  }

  /** Guarda los datos marcados como entregados */
  guardarEntregados(){
    this.guardandoE = true;
    const seleccionados = this.marcarEntregados();
    this.comisionesService.guardarEntregados(seleccionados).subscribe((response) => {
      if (response.status === "success") {
          this.swal.mostrarAlerta(
            "Listo", response.message,
            "success", "success"
            );
            this.guardandoE = false;
            this.resetFormArray();
      } else {
          this.swal.mostrarAlerta(
            "Error", response.message,
            "error", "danger"
            );
            this.guardandoE = false;
            return;
      }
    },(error) => {
          this.swal.mostrarAlerta("Error", `Error fetching data: ${error}`, "error" , "danger" );
          this.guardandoE = false;
          return;
      });
  }

  /** Limpia el form array */
  resetFormArray() {
    this.ventas.clear();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.formFiltro.buscarDatos();
  }

  /** Devuelve al estado anterior el registro seleccionado */
  devolver(idVenta:any, indexform:any) {
    Swal.fire({
    title: 'Va devolver esta partida al estado anterior',
    text: 'Agrega la razón del porque esta regresando',
    input: 'textarea',
    inputPlaceholder: 'Escribe la razón aquí...',
    inputAttributes: {
      'aria-label': 'Razón de devolución'
    },
    showCancelButton: true,
    confirmButtonText: 'Enviar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    customClass: {
      confirmButton: 'btn btn-primary m-1',
      cancelButton: 'btn btn-secondary m-1'
    },
    buttonsStyling: false,
    showLoaderOnConfirm: true,
    preConfirm: async (razon) => {
      if (!razon) {
        Swal.showValidationMessage('El campo es obligatorio');
        return false;
      }
      try {
        this.devolviendo[indexform] = true;
        Swal.showLoading();
        const payload = { observacion: razon}
        const response: any = await firstValueFrom(
          this.comisionesService.devolverPartida(idVenta, payload )
        );
        if (response.status === 'success') {
          this.swal.mostrarAlerta('Listo', response.message, 'success', 'success');
          this.devolviendo[indexform] = false;
          this.removerFila(indexform);
        } else {
          this.swal.mostrarAlerta('Error', response.message, 'error', 'danger');
          this.devolviendo[indexform] = false;
          throw new Error(response.message);
        }
      } catch (error: any) {
        Swal.showValidationMessage(`Solicitud fallida: ${error.message}`);
        this.devolviendo[indexform] = false;
        throw error;
      }
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire('¡Enviado!', 'La partida fue devuelta correctamente.', 'success');
    }
  });
}
  /** Remueve la fila de tabla y del from array */
  removerFila(index: number) {
    this.ventas.removeAt(index);
  }


  /** Recupera los datos que fueron marcados como validados */
  marcarValidados() {
    const payload = this.ventas.getRawValue()
      .filter(v => v.validado)
      .map(v => ({
        id : v.id_venta,
        validado: true
      }));
    return payload;
  }

  /** Guarda los datos marcados como validados */
  guardarValidados(){
    this.guardandoV = true;
    const seleccionados = this.marcarValidados();
    this.comisionesService.guardarValidados(seleccionados).subscribe((response) => {
      if (response.status === "success") {
          this.swal.mostrarAlerta(
            "Listo", response.message,
            "success", "success"
            );
            this.resetFormArray();
            this.guardandoV = false;
      } else {
          this.swal.mostrarAlerta(
            "Error", response.message,
            "error", "danger"
            );
            this.guardandoV = false;
            return;
      }
    },(error) => {
          this.swal.mostrarAlerta("Error", `Error fetching data: ${error}`, "error" , "danger" );
          this.guardandoV = false;
          return;
      });
  }
  
  /** Guarda la partida que se desea pagar */
  guardarPagado(idVenta:any, indice:any ){
     Swal.fire({
      title: '¿Estás seguro?',
      text: 'La partida sera marcada para dispersion a pago de comision',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      customClass: {
        confirmButton: 'btn btn-primary m-1',
        cancelButton: 'btn btn-secondary m-1'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
      this.pagando[indice] = true;
      this.comisionesService.guardarPagado(idVenta).subscribe((response) => {
            if (response.status === "success") {
                this.swal.mostrarAlerta(
                  "Listo", response.message,
                  "success", "success"
                  );
                  this.pagando[indice] = false;
                  this.removerFila(indice);
            } else {
                this.swal.mostrarAlerta(
                  "Error", response.message,
                  "error", "danger"
                  );
                  this.pagando[indice] = false;
                  return;
            }
          },(error) => {
                this.swal.mostrarAlerta("Error", `Error fetching data: ${error}`, "error" , "danger" );
                this.pagando[indice] = false;
                return;
            });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.pagando[indice] = false;
      }
    });
  }





}
