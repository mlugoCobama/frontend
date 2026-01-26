import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProveedoresService } from 'src/app/core/services/compras/proveedores/proveedores.service';
import { PermisosService } from "src/app/core/services/permisos.service";

import { AcuseRecibidoService } from 'src/app/core/services/compras/acuse-recibido.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { MacroService } from 'src/app/core/services/macrotaller/macro.service';
import { TableFormExistenciasComponent } from './table-form-existencias/table-form-existencias.component';

@Component({
  selector: "app-panel-entregas",
  templateUrl: "./panel-entregas.component.html",
  styleUrl: "./panel-entregas.component.css",
})
export class PanelEntregasComponent implements OnInit, AfterViewInit {
   @ViewChild("formTableEntradas", { static: false })
    formTableEntradas!: TableFormExistenciasComponent;

  @Input() ordenCompra: any;
  @Input() solicitudCompra: any;
  @Output() actualizarStatus1 = new EventEmitter<void>();

  acuseForm: FormGroup;
  acusesGuardados: any[] = [];
  public detalles:any = [];
  public entregaCompleta: boolean = false;

  submitted = false;

  constructor(
    private fb: FormBuilder,
    private acuseRecibido: AcuseRecibidoService,
    private alertasService: SwalComprsServiceService,
    private proveedoresService: ProveedoresService,
    private permisosService : PermisosService, 
    private macro: MacroService,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.cargarAcuses();
    this.buscarDetalles(this.solicitudCompra?.id);
  }

  ngAfterViewInit(): void {
      
    
  }

  /**
   * Construccion del form
   */
  private buildForm() {
    this.acuseForm = this.fb.group({
      archivo: [null, Validators.required],
      observaciones: [""],
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.acuseForm.patchValue({ archivo: file });
  }

  /**
   * Guarda los datos de entrega
   * cantidad de entradas y acuse de entrega
   * @returns 
   */
  guardar(): void {
    this.submitted = true;

    if (this.acuseForm.invalid) {
      this.alertasService.mostrarAlerta(
        "Falta algo", "Debes de adjuntar un archivo",
        "warning", "warning"
      );
      return;
    }

    const hasDatos = this.formTableEntradas.validarSeleccion();

    if (!hasDatos) {
      this.alertasService.mostrarAlerta(
        "Error", "Debes de seleccionar por lo menos un detalle",
        "warning", "warning"
      );
      return;
    }

    if (!this.formTableEntradas.confirmadosValidos()) {
      this.alertasService.mostrarAlerta(
        "Error", `Debes de llenar correctamente el detalle`,
        "warning","warning"
      );
      return;
    }
    const formData = new FormData();
    formData.append("archivo", this.acuseForm.get("archivo")?.value);
    formData.append(
      "observaciones",
      this.acuseForm.get("observaciones")?.value
    );
    formData.append("orden_compra_id", this.ordenCompra?.id);
    formData.append("detalles_entrada", JSON.stringify(this.formTableEntradas.getEntradas()))
    this.acuseRecibido.guardarAcuse(formData).subscribe(
      (response) => {
        if (response.status === "success") {
          this.alertasService.mostrarAlerta(
            "Guardado",  response.message,
            "success",   "success"
          );

          this.actualizarStatus1.emit();
          this.buscarDetalles(this.solicitudCompra?.id);
          // ESTO VA A CAMBIAR POR UN EVENT EMMITER
          this.acuseForm.reset();
          this.submitted = false;
        } else {
          this.submitted = false;
          this.alertasService.mostrarAlerta(
            "Error", response.message, "warning", "warning"
          );
          this.buscarDetalles(this.solicitudCompra?.id);
          return;
        }
      },
      (error) => {
        this.submitted = false;
        this.buscarDetalles(this.solicitudCompra?.id);
        this.alertasService.mostrarAlerta("Error", error, "warning", "warning");
        return;
      }
    );
    this.cargarAcuses();
  }

  cargarAcuses(): void {
    if (this.ordenCompra?.acuses_entrega?.length > 0) {
      this.acusesGuardados = this.ordenCompra?.acuses_entrega;
    }
  }

  /**
   * Despliega la alerta pra solicitar el surtido
   */
  solicitarSurtido(): void {
    Swal.fire({
      title: "¿Deseas solicitar el surtido de la orden de compra?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
      reverseButtons: true
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        Swal.fire({
          title:
            "¿Deseas enviarle la solicitud de cotización por correo al proveedor?",
          icon: "question",
          reverseButtons: true,
          showCancelButton: true,
          confirmButtonText: "Sí",
          cancelButtonText: "No, lo contactaré por otro medio",
        }).then((respuesta) => {
          const tipo = respuesta.isConfirmed ? 1 : 2;

          const data = {
            tipo: tipo,
            id_orden_compra: this.ordenCompra?.id,
          };
          this.acuseRecibido.solicitarSurtido(data).subscribe(
            (response) => {
              if (response.status === "success") {
                this.alertasService.mostrarAlerta(
                  "Guardado", response.message, "success", "success"
                );

                this.actualizarStatus1.emit(); // ESTO VA A CAMBIAR POR UN EVENT EMMITER
              } else {
                this.alertasService.mostrarAlerta(
                  "Error", response.message, "warning", "warning"
                );

                return;
              }
            },
            (error) => {
              this.alertasService.mostrarAlerta(
                "Error", error, "warning", "warning"
              );
              return;
            }
          );
        });
      }
    });
  }

  mostrarBtnSolicitud() {
     return this.ordenCompra?.surtido_solicitado === 0 ? true : false; 
  }

  /**
   * abre los archivos en una pestaña nueva
   * @param prov ruta del archivo
   */
  verArchivos(prov: any) {
    this.proveedoresService.abrirArchivo(prov);
  }

  tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }

  public isLoad: boolean = false;
  public submittDetail:boolean = false;


  /**
   * Busca los detalles de uns solicitud de compra 
   * @param idSolicitud 
   */
  public buscarDetalles(idSolicitud){
    this.detalles = [];
    this.isLoad = true;
    this.macro.getDetalleEntradaCompras(idSolicitud).subscribe((response)=>{
      if(response.status){
        this.detalles = response.data;
        this.entregaCompleta = response.todasEnCero;
        if(this.detalles.length > 0 && this.ordenCompra.surtido_solicitado == 1){

              this.formTableEntradas.createFormArray(this.detalles);

        }
        this.isLoad = false;
        // this.enviarDatos.emit(response.data);
      }else{
        console.log(response.message);
        this.isLoad = false;
      }
    },(error) => {
      this.isLoad = false;
      console.error("Error fetching data:", error);
    })
  }

}