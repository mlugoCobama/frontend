import { Component, inject, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { CatGastosPredefinidosService } from 'src/app/core/services/nissan/cat-gastos-predefinidos.service';
import { ColumnaTabla } from 'src/app/shared/ui/tabla-generica/tabla-generica.component';
import Swal from 'sweetalert2';
import { ModalGastosPredefinidosComponent } from './modal-gastos-predefinidos/modal-gastos-predefinidos.component';
import { PermisosService } from 'src/app/core/services/ucoip/permisos.service';

@Component({
  selector: 'app-tab-gastos-predefinidos',
  templateUrl: './tab-gastos-predefinidos.component.html',
  styleUrl: './tab-gastos-predefinidos.component.css'
})
export class TabGastosPredefinidosComponent implements OnInit{
  private modalService =  inject(BsModalService);
  private catGastosService =  inject(CatGastosPredefinidosService);
  private alertasService = inject(SwalComprsServiceService);
  private permisosService= inject(PermisosService);

  public modalRef?: BsModalRef;
  public sectedItem:any;
  public isLoad:boolean =  false;
  public data:any = [];

  badgedMapEstatus = {
        'Asignada': 'rounded-pill bg-primary-subtle text-primary font-size-11 fw-semibold',
        'No asignada': 'rounded-pill bg-info-subtle text-info font-size-11 fw-semibold',
      }

  public columnas: ColumnaTabla[] = [
    {etiqueta: 'Gasto', campo:'clave_gasto', pipe:'titlecase'},
    {etiqueta: 'Importe', campo:'importe', pipe:'currency'},
    {etiqueta: 'Agencia',  campo:'agencia', bold: true},
    {etiqueta: 'Clave Producto',  campo:'tipo_vehiculo'},
    // {etiqueta: 'Estatus', campo:'estatus', bold: true, badge:true, badgeMap: this.badgedMapEstatus}
  ];


  ngOnInit(): void {
    this.getAll()
  }



  private getAll() {
    this.isLoad = true;
    this.catGastosService.getAll().subscribe(
      (response: any) => {
        if (response) {
          this.data = response.data;
            // this.ordenador = new FuncionesTablas(this.data);
            // this.datosFiltrados = [...this.data];
          this.isLoad = false;
        } else {
          console.log(response.message);
          this.isLoad = false;
        }
      },
      (error) => {
          console.error("Error fetching data:", error);
          this.isLoad = false;
      },
    );
  }

  public onItemSeleccionado(item: any | null): void {
    this.sectedItem = item;
  }
    public openModalNuevo() {
      const data = {
            tipo: 'nueva',
            // clientesToka: this.clientesToka
      }
      this.openModal(data);
      }

    public openModalActualizar(){
        const data = {
            tipo: 'actualizar',
            // clientesToka: this.clientesToka,
            data: this.sectedItem
        }
      this.openModal(data);
    }

    openModal(data:any){
      const initialState: ModalOptions = {
          initialState: data,
          class: "modal-sm",
        };
        this.modalRef = this.modalService.show(ModalGastosPredefinidosComponent, initialState);
        this.modalRef.content.closeBtnName = "Close";
        this.modalRef.content.event.subscribe(() => {
          this.getAll()
        });
    }

    public elminarRegistro(){
      Swal.fire({
      title: "¿Estas seguro?",
      text: "Se eliminara el registro seleccionado",
      icon: "error",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
      reverseButtons : true,
      customClass: {
        confirmButton: "btn btn-danger ms-2 px-4 fw-semibold",
        cancelButton: "btn btn-primary ms-2 px-4 fw-semibold",
      },buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.isLoad = true;
          this.catGastosService.delete(this.sectedItem.id).subscribe(
          (response) => {
            if (response.status === "success") {
              this.getAll()
              this.alertasService.mostrarAlerta('Borrado!', "El registro ha sido borrado.",
              "success", "success");
              this.isLoad = false;
              } else {
              console.log(response.message);
              this.alertasService.mostrarAlerta("Error!", "El registro no puedo ser borrado correctamente"
              , "success", "success");
              this.isLoad = false;
              }
          },(error) => {
            console.error("Error fetching data:", error);
              this.isLoad = false;
          }
          );
        }
      });
    }
}
