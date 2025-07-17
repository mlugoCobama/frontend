import { Component, OnInit} from '@angular/core';
import { FuncionesTablas } from '../compras/funciones-tablas';
import { UnidadesService } from 'src/app/core/services/compras/unidades.service';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { ModalAddAutotanqueComponent } from './modal-add-autotanque/modal-add-autotanque.component';
import { ModalUpdtAutotanqueComponent } from './modal-updt-autotanque/modal-updt-autotanque.component';

@Component({
  selector: 'app-cat-unidades',
  templateUrl: './cat-unidades.component.html',
  styleUrl: './cat-unidades.component.css'
})
export class CatUnidadesComponent implements OnInit{

  constructor(
    private unidades : UnidadesService,
    private modalService: BsModalService,
  ){}

  ngOnInit(): void {
    this.getCatVehiculos();  
  }

  datosFiltrados:any[] = [];
  private ordenador!: FuncionesTablas<any>;
  busqueda:string = '';

  public unidad:any;
  public mostrar : boolean = false;

  public data:any;
  public modalAbierto:boolean = false;
  public isLoad:boolean = false;

  public modalRef?: BsModalRef;

  ordenarPor(columna: keyof any){
    this.datosFiltrados = this.ordenador.ordenar(columna);
  }

  getIconoOrden(columna:keyof any):string{
    return this.ordenador.getIcono(columna)
  }

  filtrarTabla(){
    this.datosFiltrados = this.ordenador.filtrar(this.busqueda, [
      'entidad', 'marca_vehiculo', 'submarca', 
      'modelo', 'no_serie', 'placas',
      'marca_tanque', 'anio_fabricacion', 'capacidad',
      'tipo_medidor', 'serie',
    ]);
    this.contarDatos();
  }

  // Despliega la ventana modal para un nuevo registro
  public openModalNuevo() {
    this.modalAbierto =  true;
    const initialState: ModalOptions = {
          initialState: {
          },
          class: "modal-lg",
        };
        this.modalRef = this.modalService.show(
          ModalAddAutotanqueComponent,
          initialState
        );
        this.modalRef.content.closeBtnName = "Close";
        this.modalRef.content.event.subscribe(() => {
          this.isLoad = true;
  
          // this.mostrar = false;
          this.getCatVehiculos();
        });
        this.modalRef.content.modalCerrado.subscribe(() => {
          this.modalAbierto = false;
        });
  }

  // Despliega la ventana modal para un nuevo registro
  public openModalUpdate() {
    this.modalAbierto =  true;
    const initialState: ModalOptions = {
          initialState: {
          },
          class: "modal-lg",
        };
        this.modalRef = this.modalService.show(
          ModalUpdtAutotanqueComponent,
          initialState
        );
        this.modalRef.content.closeBtnName = "Close";
        this.modalRef.content.event.subscribe(() => {
          this.isLoad = true;
  
          // this.mostrar = false;
          this.getCatVehiculos();
        });
        this.modalRef.content.modalCerrado.subscribe(() => {
          this.modalAbierto = false;
        });
  }

  public totalDatos:any;
  public totalDatosFiltrados:any;
  contarDatos(){

    this.totalDatosFiltrados = this.datosFiltrados.length
    this.totalDatos = this.data.length 
    
  }

  private getCatVehiculos() {
    this.isLoad = true;
    this.unidades.getVehiculos().subscribe(
      (response) => {
        if (response) {
          this.data = response.data;

          this.ordenador = new FuncionesTablas(this.data);
          this.datosFiltrados = [...this.data];

          // console.table(this.datosFiltrados);
          this.contarDatos();
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

  //Recupera los datos del elemento seleccionado
  public seleccionar(dato: any, evento: any) {
    this.mostrar = true;
    this.unidad = dato;
    if (evento.currentTarget.classList.contains("table-primary")) {
      evento.currentTarget.classList.remove("table-primary");
      this.mostrar = false;
    } else {
      const filas = document.querySelectorAll("tbody tr");
      filas.forEach((fila) => fila.classList.remove("table-primary"));
      evento.currentTarget.classList.add("table-primary");
    }
  }
}
