import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalTarjetasTokaComponent } from './modal-tarjetas-toka/modal-tarjetas-toka.component';
import { TokaService } from 'src/app/core/services/compras/toka.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { ColumnaTabla } from 'src/app/shared/ui/tabla-generica/tabla-generica.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cat-tarjetas-toka',
  templateUrl: './cat-tarjetas-toka.component.html',
  styleUrl: './cat-tarjetas-toka.component.css'
})
export class CatTarjetasTokaComponent implements OnInit{

    public modalRef?: BsModalRef;
    public isLoad :  boolean = true;
    private clientesToka = [];
    public data = [];
    public sectedItem:any;

    public columnas: ColumnaTabla[] = [
      {etiqueta: 'Cliente', campo:'cliente'},
      {etiqueta: 'Tarjeta', campo:'tarjeta'},
      {etiqueta: 'Cuenta',  campo:'cuenta'},
      {etiqueta: 'Nomina',  campo:'nomina'},
      {etiqueta: 'Estatus', campo:'estatus', bold: true, textColor:"primary" }
    ];

    constructor(
        private modalService: BsModalService,
        private tokaService: TokaService,
        private alertasService: SwalComprsServiceService
      ) {}

  ngOnInit(): void {
    this.getClientesToka()
  }

  public openModalNuevo() {
    const data = {
          tipo: 'nueva',
          clientesToka: this.clientesToka
    }
    this.openModal(data);
    }

  public openModalActualizar(){
      const data = {
          tipo: 'actualizar',
          clientesToka: this.clientesToka,
          data: this.sectedItem
      }
    this.openModal(data);
  }

  openModal(data:any){
    const initialState: ModalOptions = {
        initialState: data,
        class: "modal-lg",
      };
      this.modalRef = this.modalService.show(ModalTarjetasTokaComponent, initialState);
      this.modalRef.content.closeBtnName = "Close";
      this.modalRef.content.event.subscribe(() => {
        this.getClientesToka();
      });
  }

  public elminarRegistro(){
    Swal.fire({
    title: "¿Estas seguro?",
    text: "Se eliminara el registro seleccionado",
    icon: "error",
    confirmButtonText: "Eliminiar",
    showCancelButton: true,
    reverseButtons : true,
    customClass: {
      confirmButton: "btn btn-danger ms-2 px-4",
      cancelButton: "btn btn-primary ms-2 px-4",
    },buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.isLoad = true;
        this.tokaService.destroy(this.sectedItem.id).subscribe(
        (response) => {
          if (response.status === "success") {
            this.getClientesToka();
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

  onItemSeleccionado(item: any | null): void {
    this.sectedItem = item;
  }

  private getClientesToka() {
    this.isLoad = true;
      this.tokaService.getAll().subscribe(
        (response) => {
          if (response) {
            this.data = response.data.tarjetas
            this.clientesToka = response.data.clientes;
            this.isLoad =  false;
          } else {
            this.alertasService.mostrarAlerta(
              "Error", response.message, "error", "danger"
            );
            this.isLoad =  false;
          }
        },
        (error) => {
          this.alertasService.mostrarAlerta(
            "Error", `Error fetching data: ${error}`, "error", "danger"
          );
          this.isLoad =  false;
        }
      );
    }
}
