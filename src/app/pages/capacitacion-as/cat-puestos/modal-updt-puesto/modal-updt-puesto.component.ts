import { AfterViewInit, Component,  EventEmitter,  ViewChild, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { FormAsignarModulosComponent } from '../../forms/form-asignar-modulos/form-asignar-modulos.component';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { PuestosService } from 'src/app/core/services/capacitaciones/puestos.service';


@Component({
  selector: 'app-modal-updt-puesto',
  templateUrl: './modal-updt-puesto.component.html',
  styleUrl: './modal-updt-puesto.component.css'
})
export class ModalUpdtPuestoComponent implements AfterViewInit, OnInit  {

  public sending: boolean = false;

  public data: any;
  public nombrePuesto: any = "";
  public id: any;
  public isLoad: boolean = true;

  @ViewChild('formAsignarModulos', { static: false }) formAsignarModulos!:  FormAsignarModulosComponent;

  constructor(
    public modalRef: BsModalRef,
    public alerta: SwalComprsServiceService,
    public puestos : PuestosService
  ){}

  ngOnInit(): void {
    this.getAll();
    // console.log(this.nombrePuesto)
  }

  ngAfterViewInit() {

  }

  public event: EventEmitter<any> = new EventEmitter();
  /**
   * cierra la ventana modal
   */
  public cerrarModal(): void {
    this.modalRef.hide();
    // setTimeout(() => { this.modalCerrado.emit() }, 150);
  }

  private getAll() {
      this.isLoad = true;
        this.puestos.getPuestoModulos(this.id).subscribe(
          (response) => {
            if (response) {
              this.data = response.data;
              // console.log(this.data)
              // this.ordenador = new FuncionesTablas(this.data);
              // this.datosFiltrados = [...this.data];
    
              this.isLoad = false;
              // this.showTable = true;
            } else {
              console.log(response.message);
            }
          },
          (error) => {
            console.error("Error fetching data:", error);
          }
        );
      }

  public save(){
    // this.sending = true
    if(!this.formAsignarModulos.formValido()){
      this.alerta.mostrarAlerta("Error", " Llena correctamente el formulario e intenta nuevamente", "warning", "warning");
      this.sending = false;
      return;
    }

    const data = this.formAsignarModulos.guardar();

    this.puestos.edit(this.id, data).subscribe(
              (response) => {
                if (response.status === "success") {
                  this.event.emit(true);
                  this.alerta.mostrarAlerta("Guardado", response.message , "success", "success");
                  // this.event.emit(false);
                  this.cerrarModal();
                  this.sending = false;
                } else {
                  this.alerta.mostrarAlerta("Error", response.message , "error", "error");
                  this.sending = false;
                }
              },
              (error) => {
                 this.alerta.mostrarAlerta("Error", `"Error fetching data:" ${error}` , "error", "error");
                 this.sending = false;
              }
            );
  }

}
