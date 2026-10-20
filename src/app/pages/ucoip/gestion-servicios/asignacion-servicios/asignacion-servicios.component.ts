import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ColumnaTabla } from 'src/app/shared/ui/tabla-generica/tabla-generica.component';
import { ModalAsignacionServicioComponent } from './modal-asignacion-servicio/modal-asignacion-servicio.component';
import { GestionServiciosService } from 'src/app/core/services/gestion-servicios/gestion-servicios.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
@Component({
  selector: 'app-asignacion-servicios',
  templateUrl: './asignacion-servicios.component.html',
  styleUrl: './asignacion-servicios.component.css'
})
export class AsignacionServiciosComponent implements OnInit{

  constructor(
    private modalService: BsModalService, 
    private gestionServicios: GestionServiciosService,
    private alertas: SwalComprsServiceService
  ){

  }

  ngOnInit(): void {
    this.loadEmpresas();
  }
  

  public empresas: any;

public configTabla: ColumnaTabla[] = [
    { campo: "no_vendedor",              etiqueta: " # ", bold: true, textNoWrap: true, sticky: true, width:35},
    { campo: "vendedor",              etiqueta: "APV", bold: true, textNoWrap: true, sticky: true, width:240},
    { campo: "folio",                 etiqueta: "Folio", bold: true},
    { campo: "poliza",                etiqueta: "Poliza", bold: true},
    { campo: "aseguradora",                etiqueta: "Aseguradora", bold: true},
    { campo: "nombre",         etiqueta: "Nombre", textNoWrap: true},
    { campo: "unidad",         etiqueta: "Unidad", textNoWrap: true},
    { campo: "serie",         etiqueta: "Serie"},
    { campo: "fecha_emision",         etiqueta: "Fecha Emisión", pipe: "date",},
    { campo: "forma_pago",         etiqueta: "Forma de pago"},
    { campo: "prima_neta",            etiqueta: "Prima Neta", pipe: "currency",   align:'right', bold: true , borderEnd: true, borderStart: true},
    { campo: "vs",            etiqueta: "VS", pipe: "currency",   align:'right'},
    { campo: "comision_apv_pesos",    etiqueta: "Comision APV",     pipe: "currency",   align:'right', bold: true, borderEnd: true, borderStart: true},
    { campo: "com_encargado_seg",            etiqueta: "Com. Encargado Seg.", pipe: "currency",   align:'right'},
    { campo: "observaciones",         etiqueta: "Observaciones" },
    // { campo: "porcentaje_asesor",     etiqueta: "%",                pipe: "percent",    align:'right' },
    { campo: "estatusTexto",          etiqueta: "Estatus",  textNoWrap: true, textColor:'primary',  align:'center', bold: true  },
  ];

   public modalRef?: BsModalRef;
    /** Despliega la ventana modal para un nuevo registro  */
    public openModalNuevo() {
      const initialState: ModalOptions = {
        initialState: {
        },
        class: "modal-lg",
      };
      this.modalRef = this.modalService.show(
        ModalAsignacionServicioComponent,
        initialState,
      );
      this.modalRef.content.closeBtnName = "Close";
      this.modalRef.content.event.subscribe(() => {
      });
    }

      public loadEmpresas(){
    this.gestionServicios.getServicios().subscribe(
      (response:any) => {
        if(response.status == 'success'){
          this.empresas = response.data.map((item:any) => ({ etiqueta: item.name, valor: item.intercompania  }));
          console.log(this.empresas)
          // this.buscando = false;
          // this.isLoad = false;
        }else{
          this.alertas.mostrarAlerta('Error', 'Algo salio mal en la búsqueda', 'info', 'info');
          // this.buscando = false;
          // this.isLoad = false;
          return;
        }
      },(error) => {
          this.alertas.mostrarAlerta("Error", `Error fetching data: ${error}`, "error" , "danger" );
          // this.buscando = false;
          // this.isLoad = false;
          return;
      }
    )
  }

  // public loadServicios(){
  //   this.gestionServicios.getCatServicios().subscribe(
  //     (response:any) => {
  //       if(response.status == 'success'){
  //         this.servicios = response.data.servicios;
  //         this.proveedores = response.data.provedores;
  //         console.log(this.servicios)
  //         // this.buscando = false;
  //         // this.isLoad = false;
  //       }else{
  //         this.alertas.mostrarAlerta('Error', 'Algo salio mal en la búsqueda', 'info', 'info');
  //         // this.buscando = false;
  //         // this.isLoad = false;
  //         return;
  //       }
  //     },(error) => {
  //         this.alertas.mostrarAlerta("Error", `Error fetching data: ${error}`, "error" , "danger" );
  //         // this.buscando = false;
  //         // this.isLoad = false;
  //         return;
  //     }
  //   )
  // }
}
