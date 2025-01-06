import { Component, OnInit, NgModule } from "@angular/core";
import { environment } from "src/environments/environment";
import { ModalComprasComponent } from "./modal-compras/modal-compras.component";

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { Config } from "datatables.net";
import Swal from "sweetalert2";

//services
import { ComprasService } from "src/app/core/services/compras/compras.service";
import { CatUnidadesMedidasService } from "src/app/core/services/compras/unidadesMedidas/cat-unidades-medidas.service";


@Component({
  selector: "app-compras",
  templateUrl: "./compras.component.html",
  styleUrls: ["./compras.component.css"],
})
export class ComprasComponent implements OnInit {
  public dtOptions: Config = {};
  public showTable: boolean = false;
  public modalRef?: BsModalRef;

  public solicitudSelecionada: boolean = false;

  public submitted: boolean = false;
  public submittedDetail: boolean = false;
  public isLoad: boolean = true;

  public formSolicitudCompra: FormGroup;
  public formDetalleSolicitud: FormGroup;

  
  public solicitudCompra: any; // Objeto que envió al componente detallesSolicitudCompra

  public data: any;
  public unidades: any; 
  unidad: any;
  detalles: any;

  public formData = new FormData();

  constructor(
    private catUnidadesMedidasService: CatUnidadesMedidasService,
    public comprasService: ComprasService,
    private modalService: BsModalService,
    public formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.dtOptions = environment.dataTables;
    this.buildForm();
    this.getAll();
  }

  /**
   * Open modal
   * @param content modal content
   */
  public openModal(content: any) {
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: "modal-lg" });
    this.getUnidades();
  }

  private buildForm() {
    return new Promise((resolve, reject) => {
      this.formSolicitudCompra = this.formBuilder.group({
        usuario: new FormControl(null, Validators.required),
        usuario_destino: new FormControl(null, Validators.required),
        motivo: new FormControl(null, Validators.required),
      });
      this.formDetalleSolicitud = this.formBuilder.group({
        cantidad: new FormControl(null, Validators.required),
        cat_unidades_medida_id: new FormControl(null, Validators.required),
        descripcion: new FormControl(null, Validators.required),
        observaciones: new FormControl(null, Validators.required),
        img_referencia: new FormControl(null),
      });
      resolve(true);
    });
  }

  get solicitudCompraFormControl() {
    return this.formSolicitudCompra.controls;
  }

  get detalleSolicitudFormControl() {
    return this.formDetalleSolicitud.controls;
  }

  
  public onChange(selectElement: any) { // metodo que obtiene el texto del select unidad
    const selectedText =
      selectElement.options[selectElement.selectedIndex].text;
    this.unidad = selectedText;
  }
  
  detalle = {
    cantidad: "",
    cat_unidades_medida_id: "",
    cat_unidades_medida_id1: "",
    img_referencia1: "",
    descripcion: "",
    observaciones: "",
    img_referencia: null,
  };
  tableData: Array<any> = [];

  public addDetalle() {
    if (this.formDetalleSolicitud.invalid) {
      this.submittedDetail = true;
      return;
    }
    const valores = this.formDetalleSolicitud.value;
    
    const newDetalle = {
      ...this.formDetalleSolicitud.value,
      cat_unidades_medida_id1: this.unidad,
      img_referencia1: valores.img_referencia,
    };

    if (this.formData.has("img_referencia")) {
      newDetalle.img_referencia1 = URL.createObjectURL(
        this.formData.get("img_referencia") as Blob
      );
    }
    if (this.formData.has("img_referencia")) {
      newDetalle.img_referencia = this.formData.get("img_referencia") as File;
    }

    this.tableData.push(newDetalle);
    this.formDetalleSolicitud.reset();
    this.formData.delete("img_referencia");
    // this.detalle = this.formDetalleSolicitud.value;
    // this.detalle.cat_unidades_medida_id1 = this.unidad;
    // this.tableData.push({ ...this.detalle});
    this.submittedDetail = false;
    // this.formDetalleSolicitud.reset();
  }

  
  onFileChange(event: any, fieldName: string) { // Funcion que captura el archivo en el input
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formData.append(fieldName, file);
    }
  }

  public removeDetalle(index: number) {
    this.tableData.splice(index, 1);
  }

  
  private generateFolio(): string { // Metodo para generar el folio de solicitud de compras
    return `SC-${Math.floor(Math.random() * 100000)}`;
  }

  
  public fecha() { // Metodo para asignar una fecha
    // obtener la fecha en el fomrato correcto para la bd
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = ("0" + (fecha.getMonth() + 1)).slice(-2);
    const dia = ("0" + fecha.getDate()).slice(-2);
    const horas = ("0" + fecha.getHours()).slice(-2);
    const minutos = ("0" + fecha.getMinutes()).slice(-2);
    const segundos = ("0" + fecha.getSeconds()).slice(-2);
    return `${anio}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
  }

  public save() {
    this.submitted = true;
    this.isLoad = true;
    if (this.formSolicitudCompra.invalid) {
      this.isLoad = false;
      Swal.fire({
        title: "Alerta",
        text: "Debes llenar correctamente todos los campos",
        buttonsStyling: false,
        icon: "warning",
        customClass: {
          confirmButton: "btn btn-warning px-4",
          cancelButton: "btn btn- ms-2 px-4",
        },
      });
      return;
    }
    
    if (this.tableData.length === 0) { // Valida que el usuario ingrese por lo menos un detalle
      this.isLoad = false;
      Swal.fire({
        title: "Alerta",
        text: "Agrega por lo menos un elemento a la solicitud",
        buttonsStyling: false,
        icon: "warning",
        customClass: {
          confirmButton: "btn btn-warning px-4",
          cancelButton: "btn btn- ms-2 px-4",
        },
      });
      return;
    }

    const data = { //Datos del form solicitud
      ...this.formSolicitudCompra.value,
      usuario_solicita: "1",
      users_id: "1",
      fecha: this.fecha(),
      folio: this.generateFolio(),
      detalles: this.tableData,
    };
    const formDataToSend = new FormData();
    formDataToSend.append("data", JSON.stringify(data));
    this.tableData.forEach((detalle, index) => { //agrega los detalles al form data para enviarlos
      if (detalle.img_referencia) {
        formDataToSend.append(
          `img_referencia_${index}`,
          detalle.img_referencia
        );
      }
    });
    this.comprasService.save(formDataToSend).subscribe(
      (response) => {
        if (response.status === "success") {
          this.getAll();
          this.showTable = true;
          Swal.fire({
            title: "Guardado",
            text: "Solicitud registrada correctamente",
            buttonsStyling: false,
            icon: "success",
            customClass: {
              confirmButton: "btn btn-success px-4",
              cancelButton: "btn btn- ms-2 px-4",
            },
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "Hubo un error al guardar la solicitud",
            buttonsStyling: false,
            icon: "warning",
            customClass: {
              confirmButton: "btn btn-warning px-4",
              cancelButton: "btn btn- ms-2 px-4",
            },
          });
          this.getAll();
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
    this.tableData = [];
    this.modalRef.hide();
    this.submitted = false;
    this.formSolicitudCompra.reset();
  }

  private getAll() {
    this.comprasService.getAll().subscribe(
      (response) => {
        if (response) {
          this.data = response.data;
          this.data.forEach((registro: any) => {
            registro.fecha = new Date(registro.fecha).toLocaleString();
            switch (registro.estatus) 
            { 
              case 1: 
              registro.estado = 'SOLICITADO';
              registro.claseEstado = 'bg-primary';
               break;

              case 2: 
              registro.estado = 'EN COTIZACIÓN';
              registro.claseEstado = 'bg-info';
               break;

              case 3: 
              registro.estado = 'ORDEN DE COMPRA';
              registro.claseEstado = 'bg-warning';
               break;

              case 4: 
              registro.estado = 'APROBADA';
              registro.claseEstado = 'bg-success';
               break;
              case 5: 
              registro.estado = 'CANCELADA';
              registro.claseEstado = 'bg-danger';
               break;

              default: 
              registro.estado = 'DESCONOCIDO'; 
              registro.claseEstado = 'badge-soft-dark';
              break; 
            }
          });

          // console.log(this.data);
          this.isLoad = false;
          this.showTable = true;
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

  private getUnidades() {
    this.catUnidadesMedidasService.getAll().subscribe(
      (response) => {
        if (response) {
          this.unidades = response.data;
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }
  public status:any;
  public openModal1(dato: any, evento: any) { // Funcion para llenar la vista con el detalle component
    this.solicitudSelecionada = true;
    // Verifica si hay un elemento seleccionado (evento del doble click)
    if (evento.currentTarget.classList.contains("table-primary")) {
      evento.currentTarget.classList.remove("table-primary");
      this.solicitudSelecionada = false;
    } else {
      const filas = document.querySelectorAll("tbody tr");

      filas.forEach((fila) => fila.classList.remove("table-primary"));
      evento.currentTarget.classList.add("table-primary");
      this.solicitudSelecionada = true;
      this.solicitudCompra = dato; // Castea el objeto que se envia al detalleSolicitudCompra 
      this.status = this.solicitudCompra.estatus;
    }
  }
  
  public regresar() { // Muestra la vista de la tabla
    this.comprasService.cambiarEstadoCotizacion(false); 
    this.solicitudSelecionada = false;
    this.status = 0;
    this.getAll();
  }
  
  mostrarCotizacion() { 
    this.comprasService.cambiarEstadoCotizacion(true); 
  }

  public cancelarSolicitud(){
    this.isLoad = true;
        Swal.fire({
          title: "¿Estas seguro?",
          text: "La solicitud será marcada como cancelada",
          icon: "error",
          confirmButtonText: " SI ",
          showCancelButton: true,
          cancelButtonText: " NO ",
          customClass: {
            confirmButton: "btn btn-danger px-4",
            cancelButton: "btn btn-primary ms-2 px-4",
          },
          buttonsStyling: false,
        }).then((result) => {
          if (result.value) {
            this.comprasService.destroy(this.solicitudCompra.id).subscribe(
              (response) => {
                if (response.status === "success") {
                  console.log(response.message);
                  this.getAll();
                  Swal.fire({
                    title: "Cancelada!",
                    text: "La solicitud ha sido cancelada.",
                    buttonsStyling: false,
                    icon: "success",
                    customClass: {
                      confirmButton: "btn btn-danger px-4",
                      cancelButton: "btn btn- ms-2 px-4",
                    },
                  });
                } else {
                  console.log(response.message);
                  Swal.fire({
                    title: "Error!",
                    text: "Your file has been deleted.",
                    buttonsStyling: false,
                    icon: "success",
                    customClass: {
                      confirmButton: "btn btn-danger px-4",
                      cancelButton: "btn btn- ms-2 px-4",
                    },
                  });
                }
              },
              (error) => {
                console.error("Error fetching data:", error);
              }
            );
          }
          this.isLoad = false;
        });

  }

}
