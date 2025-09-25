
import { AfterViewInit, Component,  EventEmitter,  ViewChild, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { PuestosService } from 'src/app/core/services/capacitaciones/puestos.service';

@Component({
  selector: 'app-ver-permisos-puesto',
  templateUrl: './ver-permisos-puesto.component.html',
  styleUrl: './ver-permisos-puesto.component.css'
})
export class VerPermisosPuestoComponent implements OnInit{
  
  public nombrePuesto:any = '';
  public id:any = 0;
  public data:any = [];
  public isLoad: boolean = true;


  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    public modalRef: BsModalRef,
    private puestos: PuestosService,
  ){}

  ngOnInit(): void {
    this.getAll();
  }
    /**
     * cierra la ventana modal
     */
    public cerrarModal(): void {
      this.modalRef.hide();
      // setTimeout(() => { this.modalCerrado.emit() }, 150);
    }

    private getAll() {
      this.puestos.getPermisos(this.id).subscribe(
        (response) => {
          if (response) {
            this.data = response.data;
            console.log(this.data)
            // this.ordenador = new FuncionesTablas(this.data);
            // this.datosFiltrados = [...this.data];
  
            this.isLoad = false;
          } else {
            console.log(response.message);
          }
        },
        (error) => {
          console.error("Error fetching data:", error);
        }
      );
    }

   public esUnaPalabra(texto: string): boolean {
    return texto.trim().split(/\s+/).length === 1;
  }



}
