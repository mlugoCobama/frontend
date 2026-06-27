import { AfterViewInit, Component, OnInit, signal, ViewChild, WritableSignal } from "@angular/core";
import { Comision } from "src/app/core/models/nissan/comisiones";
import { ComisionesService } from "src/app/core/services/nissan/comisiones.service";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";
import Swal from "sweetalert2";
import { PermisosService } from 'src/app/core/services/permisos.service';
import { FiltroComponent } from "./filtro/filtro.component";
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from "@angular/router";
import { permisosComisonsionesVentasNuevos } from "src/app/shared/constants/permisos";



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
  public permisos = permisosComisonsionesVentasNuevos;

  public modelCamposGastos = ['otros','gasolina','previa','descuentos','descuento_impulso',
                              'traslados','subsidios','descuento_da','cortesia','accesorios','placas',
                               'comision_garantizada','comision_garantizada_gerencia', 'comision_garantizada_bdc','comision_garantizada_cor_bdc',
                            ];

  public hoy = new Date().toISOString().split("T")[0];

  pagando: boolean[] = [];
  devolviendo: boolean[] = [];

  guardandoG: boolean = false;
  guardandoV: boolean = false;
  guardandoE: boolean = false;

  searchText: string = '';
  filteredIndices: number[] = [];

  public vista: 'pendientes' | 'realizados' = 'pendientes';
  
  @ViewChild('formFiltro', { static: false }) formFiltro!:  FiltroComponent;

  constructor(
    private comisionesService: ComisionesService,
    private swal: SwalComprsServiceService,
    public fb: FormBuilder,
    private permisosService: PermisosService,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
    this.filteredIndices = [];
    this.resetFilter();
  }

  /** Form array */
  form = this.fb.group({
    ventas: this.fb.array([])
  });

  get ventas(): FormArray {
    return this.form.get('ventas') as FormArray;
  }

  /** Validador de permisos */
  tienePermiso(permiso: string = ''): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }

  /**Puente para manejar el spinner */
  bindingSpiner(value:any) {
    this.isLoadig = value;
  }

  /**Puente para manejar el estado */
  bindingEstado(value:any) {
    this.estado = value;
  }

  /**Puente para manejar la carga de datos nuevos */
  bindingData(value:any) {
    this.datos = value;
    if (this.datos.length > 0) {
      this.cargarVentas();
    }else{
      this.ventas.clear();
      this.form.markAsPristine();
      this.form.markAsUntouched();
      this.filteredIndices = [];
      this.resetFilter();
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
      bdc: [row.bdc ?? false],
      v_bdc: [row.v_bdc ?? false],

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
      // comisiones garantizadas
      comision_garantizada: [0],
      comision_garantizada_gerencia: [0],
      comision_garantizada_bdc: [0],
      comision_garantizada_cor_bdc: [0],
      // Calculados
      total_gastos: [{ value: 0, disabled: true }],
      utlidad_gastos: [{ value: 0, disabled: true }],
      utilidad_final: [{ value: 0, disabled: true }],
      comision_apv: [{ value: 0, disabled: true }],
      comision_bdc: [{ value: 0, disabled: true }],
      estatusTexto: [row.estatusTexto ?? ''],
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
    if (row.bdc) {
      fg.get('bdc')?.disable({ emitEvent: false });
    }
    if (row.v_bdc) {
      fg.get('v_bdc')?.disable({ emitEvent: false });
    }

    if(row.v_bdc && row.bdc){
      fg.patchValue({
        porcentaje_bdc : 2
      })
    }else{
      fg.get('porcentaje_bdc')?.disable({ emitEvent: false });
      fg.get('comision_garantizada_bdc')?.disable({ emitEvent: false });
      fg.get('comision_garantizada_cor_bdc')?.disable({ emitEvent: false });
    }

    if(Number(row.estatus) > 2){
      fg.get('bdc')?.disable({ emitEvent: false });
      fg.get('v_bdc')?.disable({ emitEvent: false });
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
      'traslados','subsidios','cortesia', 'porcentaje_bdc', 'comision_garantizada',
      'comision_garantizada_gerencia', 'comision_garantizada_bdc','comision_garantizada_cor_bdc' ],
      SEMI: ['otros','gasolina','previa','descuentos','descuento_impulso',
      'traslados','subsidios','descuento_da','accesorios','placas', 'porcentaje_bdc', 'comision_garantizada',
      'comision_garantizada_gerencia', 'comision_garantizada_bdc','comision_garantizada_cor_bdc'],
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
    const comGarantizada =  Number(fg.get('comision_garantizada')?.value);
    const comGarantizadaBdc = Number(fg.get('comision_garantizada_bdc')?.value);
    const utilidadAC = utilidadInicial - totalGastos;
    const comision =  comGarantizada > 0 ? comGarantizada : (utilidadAC > 0 ?  utilidadAC * porcentaje : 0);
    const comisionBDC = comGarantizadaBdc > 0 ? comGarantizadaBdc : ( utilidadAC > 0 ? utilidadAC * porcentajeBdc : 0); 
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
      placas: g.placas ?? 0,
      porcentaje_bdc: g.porcentaje_bdc ?? 0, 
      comision_garantizada: g.comision_garantizada ?? 0
    }, { emitEvent: true });
  }

  /**
   * Genera el formulario a partir de datos cargados
   */
  cargarVentas() {
    this.ventas.clear();
        this.datos.forEach((row:any) => {
          this.ventas.push(this.crearVenta(row));
          this.pagando.push(false);
          this.devolviendo.push(false);
        });
        this.filteredIndices = [];
        this.resetFilter();
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
        porcentaje_bdc: v.porcentaje_bdc,
        comision_bdc: v.comision_bdc,
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
        placas: v.placas,
        comision_garantizada: v.comision_garantizada,
        comision_garantizada_bdc: v.comision_garantizada_comision_garantizada_bdc,
        comision_garantizada_gerencia: v.comision_garantizada_gerencia,
        comision_garantizada_cor_bdc: v.comision_garantizada_cor_bdc
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
  /** Guarda los datos marcados como entregados */
  guardarEntregados(){
    this.guardandoE = true;
    const seleccionados = this.marcarLike('entregado');
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
    this.resetFilter();
  }

  /** Guarda los datos marcados como validados */
  guardarValidados(){
    this.guardandoV = true;
    const seleccionados = this.marcarLike('validado');
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

  guardandoBdc: boolean = false;
  guardandovBdc: boolean = false;
  guardarBDC(){
    this.guardandoBdc = true;
    const seleccionados = this.marcarLike('bdc');
    this.comisionesService.guardarBDC(seleccionados).subscribe((response) => {
      if (response.status === "success") {
          this.swal.mostrarAlerta(
            "Listo", response.message,
            "success", "success"
            );
            this.resetFormArray();
            this.guardandoBdc = false;
      } else {
          this.swal.mostrarAlerta(
            "Error", response.message,
            "error", "danger"
            );
            this.guardandoBdc = false;
            return;
      }
    },(error) => {
          this.swal.mostrarAlerta("Error", `Error fetching data: ${error}`, "error" , "danger" );
          this.guardandoBdc = false;
          return;
      });
  }

  guardarValidadosBDC(){
    this.guardandovBdc = true;
    const seleccionados = this.marcarLike('v_bdc');
    this.comisionesService.guardarValidadosBDC(seleccionados).subscribe((response) => {
      if (response.status === "success") {
          this.swal.mostrarAlerta(
            "Listo", response.message,
            "success", "success"
            );
            this.resetFormArray();
            this.guardandovBdc = false;
      } else {
          this.swal.mostrarAlerta(
            "Error", response.message,
            "error", "danger"
            );
            this.guardandovBdc = false;
            return;
      }
    },(error) => {
          this.swal.mostrarAlerta("Error", `Error fetching data: ${error}`, "error" , "danger" );
          this.guardandovBdc = false;
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

getVentaAuto() {
  const segments = this.route.snapshot.url;
  const ventaAuto = segments.length > 0 ? segments[segments.length - 1].path : '';
  return ventaAuto ?? null;
}

onSearch(text: string) {
  this.searchText = text;
  this.resetFilter();
}

resetFilter() {
  const q = this.searchText.toLowerCase().trim();
  this.filteredIndices = this.ventas.controls
    .map((ctrl, i) => ({ ctrl, i }))
    .filter(({ ctrl }) => {
      if (!q) return true;
      // Busca en los campos que necesites
      const campos = [
        ctrl.get('no_factura')?.value,
        ctrl.get('razon_social')?.value,
        ctrl.get('clave_vendedor')?.value,
        ctrl.get('descripcion')?.value,
        ctrl.get('serie')?.value,
        ctrl.get('clave_inventario')?.value,
      ];
      return campos.some(v =>
        v?.toString().toLowerCase().includes(q)
      );
    })
    .map(({ i }) => i);
}

filaSeleccionada: number | null = null;

  seleccionarFila(id: number): void {
    this.filaSeleccionada = id;
  }

  marcarLike(campo: string) {
  const payload = this.ventas.getRawValue()
    .filter(v => v[campo])
    .map(v => ({
      id: v.id_venta,
      [campo]: true
    }));
  return payload;
}

cambiarVista(vista: 'pendientes' | 'realizados') {
    this.vista = vista;
    this.datos = vista === 'pendientes'
        ? this.formFiltro.data
        : this.formFiltro.realizados;

    this.bindingData(this.datos)
    // this.cargarVentas();
}

}
