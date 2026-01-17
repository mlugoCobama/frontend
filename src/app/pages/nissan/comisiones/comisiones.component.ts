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

  public data: Comision[];
  public vendedores: any;

  public isDisabled = true;

  public ready: boolean = false;
  public isLoadig: boolean = false;
  public estado: any = 0;

  public showTable: boolean = false;

  public hoy = new Date().toISOString().split("T")[0];

  private fecha_inicio: Date = null;
  private fecha_fin: Date = null;

  public formDatosGastos: FormGroup;

  public porcentajes: any;
  public porcentajesBDC: any;

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

  ngAfterViewInit(): void {
    
  }


  form = this.fb.group({
    ventas: this.fb.array([])
  });

  get ventas(): FormArray {
    return this.form.get('ventas') as FormArray;
  }


  tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }

  bindingSpiner(value) {
    this.isLoadig = value;
  }

  bindingEstado(value) {
    this.estado = value;
  }

  bindingData(value) {
    this.datos = value;
    if (this.datos.length > 0) {
      this.cargarVentas();
    }
  }

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

      // Calculados
      total_gastos: [{ value: 0, disabled: true }],
      utilidad_final: [{ value: 0, disabled: true }],
      comision_apv: [{ value: 0, disabled: true }]
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

   inicializarReglasTipoVenta(fg: FormGroup) {
    this.aplicarReglasTipoVenta(fg);
  }

  aplicarReglasTipoVenta(fg: FormGroup) {
    const tipo = fg.get('clave_producto')?.value;
    const estatus = fg.get('estatus')?.value;

    const reglas: Record<string, string[]> = {
      NU: ['otros','gasolina','previa','descuentos','descuento_impulso',
      'traslados','subsidios','cortesia' ],
      SEMI: ['otros','gasolina','previa','descuentos','descuento_impulso',
      'traslados','subsidios','descuento_da','accesorios','placas'],
    };

    const campos = [
      'otros','gasolina','previa','descuentos','descuento_impulso',
      'traslados','subsidios','descuento_da','cortesia','accesorios','placas'
    ];
    
    if (Number(estatus) > 2) {
      campos.forEach(c => {
        fg.get(c)?.disable({ emitEvent: false });
        fg.get(c)?.setValue(0, { emitEvent: false });
      });
      return; // no aplicar reglas de tipo
    }



    campos.forEach(c => {
      fg.get(c)?.disable({ emitEvent: false });
      fg.get(c)?.setValue(0, { emitEvent: false });
    });

    reglas[tipo]?.forEach(c => {
      fg.get(c)?.enable({ emitEvent: false });
    });
  }

  // ===============================
  // Cálculos
  // ===============================
  calcularResultados(fg: FormGroup) {
  const camposGastos = [
    'otros',
    'gasolina',
    'previa',
    'descuentos',
    'descuento_impulso',
    'traslados',
    'subsidios',
    'descuento_da',
    'cortesia',
    'accesorios',
    'placas'
  ];

  fg.valueChanges.subscribe(() => {

    const totalGastos = camposGastos.reduce((total, campo) => {
      const valor = fg.get(campo)?.value;
      const numero = Number(valor);
      return total + (isNaN(numero) ? 0 : numero);
    }, 0);

    const comisionGuardada = Number(fg.get('comision_apv')?.value)
    const utilidadInicial = Number(fg.get('utilidad_inicial')?.value) || 0;
    const porcentaje = Number(fg.get('tipo_venta_porcentaje')?.value) || 0;

    const utilidadAC = utilidadInicial - totalGastos;
    const comision = utilidadAC * porcentaje;
    const utilidadFinal = utilidadAC - comision

    fg.patchValue({
      total_gastos: totalGastos,
      utilidad_final: utilidadFinal,
      comision_apv: comision
    }, { emitEvent: false });
  });
}


  // ===============================
  // Patch desde backend
  // ===============================
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

  // ===============================
  // Cargar ventas
  // ===============================
  cargarVentas() {
    this.ventas.clear();
        this.datos.forEach(row => {
          this.ventas.push(this.crearVenta(row));
          this.pagando.push(false);
          this.devolviendo.push(false);
        });
  }

  // ===============================
  // Guardar gastos
  // ===============================
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

  // Marcar entregados
  marcarEntregados() {
    const payload = this.ventas.getRawValue()
      .filter(v => v.entregado)
      .map(v => ({
        id : v.id_venta,
        entregado: true
      }));
    return payload;
  }


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

  resetFormArray() {
    this.ventas.clear();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.formFiltro.buscarDatos();
  }

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



  removerFila(index: number) {
    this.ventas.removeAt(index);
  }


    // Marcar entregados
  marcarValidados() {
    const payload = this.ventas.getRawValue()
      .filter(v => v.validado)
      .map(v => ({
        id : v.id_venta,
        validado: true
      }));
    return payload;
  }


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
