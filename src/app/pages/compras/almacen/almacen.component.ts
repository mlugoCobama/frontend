import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AlmacenService } from 'src/app/core/services/compras/almacen.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { ColumnaTabla } from 'src/app/shared/ui/tabla-generica/tabla-generica.component';
import { ModalSalidaInventarioComponent } from './modal-salida-inventario/modal-salida-inventario.component';

@Component({
  selector: 'app-almacen',
  templateUrl: './almacen.component.html',
  styleUrl: './almacen.component.css'
})
export class AlmacenComponent implements OnInit{

  constructor(
    private almacenService: AlmacenService, 
    private alertasService:SwalComprsServiceService,
    private modalService: BsModalService, ){

  }

  public data:any = [];
  public salidas:any = [];
  public tecnicos = [];
  public isLoad:boolean = false;
  public modalRef?: BsModalRef;

  public configTabla: ColumnaTabla[] = [
    { campo: "empresa", etiqueta: "Empresa", textNoWrap: true},
    // { campo: "folio",     etiqueta: "Folio", bold: true, textNoWrap: true},
    
    { campo: "usuario_destino", etiqueta: "U. Destino", textNoWrap: true },
    { campo: "fecha", etiqueta: "Fecha", pipe:'date'},
    { campo: "categoria", etiqueta: "Categoria"},
    { campo: "cantidad", etiqueta: "Cant."},
    { campo: "unidad", etiqueta: "Unidad"},
    { campo: "descripcion", etiqueta: "Descripcion"},
    { campo: "observaciones", etiqueta: "Observaciones"},
  ];

  public configTablaSalidas: ColumnaTabla[] = [
    { campo: "fecha", etiqueta: "Fecha", pipe:'date'},
    { campo: "texto_movimiento", etiqueta: "Movimiento", textColor: 'primary', bold: true},
    { campo: "cantidad", etiqueta: "Cant."},
    { campo: "descripcion", etiqueta: "Descripcion"},
    { campo: "usuario_entrega", etiqueta: "Usuario Entrega"},
    { campo: "usuario_recibe", etiqueta: "Usuario Recibe"},
  ];

  ngOnInit(): void {
    this.getData();
    this.getTecnicos();
  }
  

  private getData() {
    this.isLoad = true;
    this.almacenService.getAll().subscribe(
      (response) => {
        if (response) {
          this.data = response.data;
          this.isLoad = false;
        } else {
          this.alertasService.mostrarAlerta(
          "Error",response.message,
          "error","danger");
          this.isLoad = false;
          }
        },
        (error) => {
          this.alertasService.mostrarAlerta("Error",`Error fetching data: ${error}`,"error","danger");
          this.isLoad = false;
        }
    );
  }

  private getSalidas() {
    this.isLoad = true;
    this.almacenService.getMovimientos().subscribe(
      (response) => {
        if (response) {
          this.salidas = response.data;
          this.isLoad = false;
        } else {
          this.alertasService.mostrarAlerta(
          "Error",response.message,
          "error","danger");
          this.isLoad = false;
          }
        },
        (error) => {
          this.alertasService.mostrarAlerta("Error",`Error fetching data: ${error}`,"error","danger");
          this.isLoad = false;
        }
    );
  }

    private getTecnicos() {
    this.isLoad = true;
    this.almacenService.getTecnicosTi().subscribe(
      (response) => {
        if (response) {
          this.tecnicos = response.data;
          this.isLoad = false;
        } else {
          this.alertasService.mostrarAlerta("Error",response.message,"error","danger");
          this.isLoad = false;
          }
        },
        (error) => {
          this.alertasService.mostrarAlerta("Error",`Error fetching data: ${error}`,"error","danger");
          this.isLoad = false;
        }
    );
  }

    openModalSsalida(){
      if(this.tecnicos.length == 0){
        this.alertasService.mostrarAlerta('Espera','Estamos preparando la información', 'info', 'info')
        return;
      }

      const initialState: ModalOptions = {
        initialState: {
          tecnicos: this.tecnicos
        },
        class: "modal-lg",
      };
      this.modalRef = this.modalService.show(ModalSalidaInventarioComponent, initialState);
      this.modalRef.content.closeBtnName = "Close";
      this.modalRef.content.event.subscribe(() => {
        // this.isLoad = true;
        this.setPanel('existencias')
      });
    }

    panel: string = 'existencias'; // Panel inicial

  setPanel(nombre: string) {
    switch (nombre) {
      case 'existencias':
        this.panel = nombre;
        this.getData();
        break;
      case 'entradas':
        this.panel = nombre;
        break;
      case 'salidas':
        this.panel = nombre;
        this.getSalidas();
        break;
    
      default:
        this.panel = 'existencias';
        break;
    }
  }
}