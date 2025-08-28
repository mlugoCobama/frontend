import { Component, OnInit, } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { FormTecnicoComponent } from '../forms/form-tecnico/form-tecnico.component';
import { FuncionesTablas } from '../../compras/compras/funciones-tablas';

import { TecnicosService } from 'src/app/core/services/macrotaller/tecnicos.service';
import { UsuariosService } from 'src/app/core/services/compras/usuarios.service';


@Component({
  selector: 'app-tecnicos',
  templateUrl: './tecnicos.component.html',
  styleUrl: './tecnicos.component.css'
})
export class TecnicosComponent implements OnInit{
  
  public isLoad:  boolean =  true;
  public showTable: boolean = false;


  public modalRef?: BsModalRef;
  public mostrar =  false;
  public dato = [];

  public empresas = [];


  constructor(
    private modalService  : BsModalService,
    private tecnicos : TecnicosService,
    private usuarios  : UsuariosService
  ){}

  ngOnInit(): void {
    // this.getEmpresas();
    this.getAll();
  }


  public mecanicos = [];

    public openModalNuevo() {
      // this.modalAbierto = true;
      const initialState: ModalOptions = {
        initialState: {
          tipo : 'agregar',
          empresas : this.empresas,
          //Datos que envió al componente
        },
        class: "modal-md",
      };
      this.modalRef = this.modalService.show(FormTecnicoComponent, initialState);
      this.modalRef.content.closeBtnName = "Close";
      this.modalRef.content.event.subscribe(() => {
        // this.isLoad = true;
        // this.getAll();
      });
      // this.modalRef.content.modalCerrado.subscribe(() => {
      //     this.modalAbierto = false;
      //   });
    }

      //Recupera los datos del elemento seleccionado
  public seleccionar(dato: any, evento: any) {
    this.mostrar = true;
    this.dato = dato;
    
    if (evento.currentTarget.classList.contains("table-primary")) {
      evento.currentTarget.classList.remove("table-primary");
      this.mostrar = false;
    } else {
      const filas = document.querySelectorAll("tbody tr");
      filas.forEach((fila) => fila.classList.remove("table-primary"));
      evento.currentTarget.classList.add("table-primary");
    }
  }

    public openModalUpdt() {
      // this.modalAbierto = true;
      const initialState: ModalOptions = {
        initialState: {
          tipo : 'actualizar',
          datos : this.dato,
          empresas : this.empresas,
          //Datos que envió al componente
        },
        class: "modal-md",
      };
      this.modalRef = this.modalService.show(FormTecnicoComponent, initialState);
      this.modalRef.content.closeBtnName = "Close";
      this.modalRef.content.event.subscribe(() => {
        // this.isLoad = true;
        // this.getAll();
      });
      // this.modalRef.content.modalCerrado.subscribe(() => {
      //     this.modalAbierto = false;
      //   });
    }

    private getAll() {
        // const user = this.getUsuarioActivo();
        this.tecnicos.getAll().subscribe(
          (response) => {
            if (response) {
              this.mecanicos = response.data;
              this.empresas = response.empresas
              console.log(this.mecanicos)
              console.log(this.empresas)
              // this.ordenador = new FuncionesTablas(this.data);
              // this.datosFiltrados = [...this.data];
    
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

        /**
   * Recupera el catalogo de empresas (Select empresa)
   */
  public getEmpresas() {
    this.usuarios.getEmpresas().subscribe(
      (response) => {
        if (response) {
          const rawData = response.data
          /**Filtro para solo mostrar las empresas que tienen acceso a macrotaller */
          this.empresas = rawData.filter(objeto => objeto.isAgencia === false);
          // this.isLoading = false;
          console.log(this.empresas);
        } else {
          // this.alertasService.mostrarAlerta("Error", response.message, "error" , "danger" );
        }
      },
      (error) => {
        // this.alertasService.mostrarAlerta("Error", `Error fetching data: ${error}`, "error" , "danger" );
      }
    );
  }

  public getEmpresa(intercompania){
    if(this.empresas.length > 0){
      const empresa = this.empresas.find(empresa => empresa.intercompania == intercompania);
    return empresa.name ?? "Fuera del catalogo";
    }
    
  }
}
