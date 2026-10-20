import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { UsuariosService } from "src/app/core/services/compras/usuarios.service";

import { TokaService } from 'src/app/core/services/compras/toka.service';
import { TagService } from 'src/app/core/services/compras/tag.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { ColumnaTabla } from 'src/app/shared/ui/tabla-generica/tabla-generica.component';
import Swal from 'sweetalert2';
import { ModalTagsComponent } from './modal-tags/modal-tags.component';
import { TagTelepeaje } from 'src/app/core/models/compras/tags';

@Component({
  selector: 'app-cat-tags',
  templateUrl: './cat-tags.component.html',
  styleUrl: './cat-tags.component.css'
})
export class CatTagsComponent implements OnInit{

    public modalRef?: BsModalRef;
    public isLoad :  boolean = true;
    private clientesToka = [];
    private empresas = [];
    public data: TagTelepeaje[] = [];
    public sectedItem:TagTelepeaje | null = null;

    public columnas: ColumnaTabla[] = [
      {etiqueta: 'Empresa', campo:'empresa'},
      {etiqueta: 'Marca del TAG', campo:'marca'},
      {etiqueta: 'Nro. TAG',  campo:'num_tag'},
      {etiqueta: 'Serie',  campo:'serie'},
      {etiqueta: 'Estatus', campo:'estado', bold: true, textColor:"primary" }
    ];

    constructor(
        private modalService: BsModalService,
        private tokaService: TokaService,
        private tagService: TagService,
        private alertasService: SwalComprsServiceService,
        private usuariosService: UsuariosService
      ) {}

  ngOnInit(): void {
    this.getEmpresas()
    this.getClientesToka()
  }

  public openModalNuevo() {
    const data = {
          tipo: 'nueva',
          clientesToka: this.clientesToka,
          empresas: this.empresas
    }
    this.openModal(data);
    }

  public openModalActualizar(){
      const data = {
          tipo: 'actualizar',
          clientesToka: this.clientesToka,
          data: this.sectedItem,
          empresas: this.empresas
      }
    this.openModal(data);
  }

  openModal(data:any){
    const initialState: ModalOptions = {
        initialState: data,
        class: "modal-lg",
      };
      this.modalRef = this.modalService.show(ModalTagsComponent, initialState);
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
        this.tokaService.destroy(this.sectedItem?.id).subscribe(
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

  onItemSeleccionado(item: TagTelepeaje | null): void {
    this.sectedItem = item;
  }

  private getClientesToka() {
    this.isLoad = true;
      this.tagService.getAll().subscribe(
        (response) => {
          if (response) {
            this.data = response.data;
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

    public getEmpresas() {
    this.usuariosService.getEmpresas().subscribe(
      (response) => {
        if (response) {

          this.empresas = response.data;
          // this.isLoading = false;
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }
}
