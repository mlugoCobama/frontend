import { Component } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { FormTecnicoComponent } from '../forms/form-tecnico/form-tecnico.component';
import { data } from 'jquery';
@Component({
  selector: 'app-tecnicos',
  templateUrl: './tecnicos.component.html',
  styleUrl: './tecnicos.component.css'
})
export class TecnicosComponent {
  
  public modalRef?: BsModalRef;
  public mostrar =  false;
  public dato = [];


  constructor(
    private modalService  : BsModalService,
  ){}
  public mecanicos = [
        { nombre: "JORGE", apellidos: "PALOMINO", tipo: "MECANICO", empresa: "SATELITE", },
        { nombre: "GREGORIO", apellidos: "CAMPA", tipo: "MECANICO", empresa: "SATELITE", },
        { nombre: "GERARDO", apellidos: "LUNA", tipo: "MECANICO", empresa: "FLAMAZUL", },
        { nombre: "REFUGIO", apellidos: "CASTELLANOS", tipo: "MECANICO", empresa: "SERVIGAS", },
        { nombre: "RAFAEL", apellidos: "VITE", tipo: "MECANICO", empresa: "SERVIGAS", },
        { nombre: "IVAN", apellidos: "PORRAS", tipo: "AYUDANTE", empresa: "SERVIGAS", },
        { nombre: "ALBERTO", apellidos: "ESTUDILLO", tipo: "MECANICO", empresa: "SERVIGAS" },
        { nombre: "ANGEL", apellidos: "FLORES", tipo: "MECANICO", empresa: "GAS PREMIO" },
        { nombre: "NORBERTO", apellidos: "COLIN", tipo: "MECANICO", empresa: "GAS PREMIO" },
        { nombre: "EDGAR", apellidos: "PENDIENTE", tipo: "MECANICO", empresa: "GAS URBANO" },
        { nombre: "ISRAEL", apellidos: "PENDIENTE", tipo: "AYUDANTE", empresa: "GAS URBANO" },
        { nombre: "PENDIENTE", apellidos: "PENDIENTE", tipo: "MECANICO", empresa: "GARZA SUR" },
        { nombre: "PENDIENTE", apellidos: "PENDIENTE", tipo: "MECANICO", empresa: "GARZA SUR" },
        { nombre: "PENDIENTE", apellidos: "PENDIENTE", tipo: "MECANICO", empresa: "GARZA SUR" },
        { nombre: "PENDIENTE", apellidos: "PENDIENTE", tipo: "MECANICO", empresa: "GARZA SUR" },
        { nombre: "FEDERICO", apellidos: "RODRIGUEZ", tipo: "MECANICO", empresa: "TANQUES GARZA GAS" },
        { nombre: "FRANCISCO", apellidos: "NONINGO", tipo: "MECANICO", empresa: "TANQUES GARZA GAS" },
        { nombre: "JUAN CARLOS", apellidos: "PICHARDO", tipo: "MECANICO", empresa: "TANQUES GARZA GAS" },
        { nombre: "JOSE LUIS ", apellidos: "ISIDRO MARTINEZ", tipo: "MECANICO", empresa: "TANQUES GARZA GAS" },
        { nombre: "VICENTE", apellidos: "DELGADO", tipo: "MECANICO", empresa: "TANQUES GARZA GAS" },
        { nombre: "SEVERO", apellidos: "CERON", tipo: "MECANICO", empresa: "TANQUES GARZA GAS" },
        { nombre: "ALBERTO", apellidos: "SILVA", tipo: "MECANICO", empresa: "TANQUES GARZA GAS" }
    ];

    public openModalNuevo() {
      // this.modalAbierto = true;
      const initialState: ModalOptions = {
        initialState: {
          tipo : 'agregar',
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
          datos : this.dato
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
}
