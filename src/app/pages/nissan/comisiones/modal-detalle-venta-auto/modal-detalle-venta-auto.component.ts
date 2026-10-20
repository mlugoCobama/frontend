import { Component, inject, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { ComisionesService } from 'src/app/core/services/nissan/comisiones.service';
import { AccesoriosService } from 'src/app/core/services/renault/accesorios.service';
import { FinanciamientoService } from 'src/app/core/services/renault/financiamiento.service';
import { SegurosService } from 'src/app/core/services/renault/seguros.service';

@Component({
  selector: 'app-modal-detalle-venta-auto',
  templateUrl: './modal-detalle-venta-auto.component.html',
  styleUrl: './modal-detalle-venta-auto.component.css'
})
export class ModalDetalleVentaAutoComponent implements OnInit{
  public dataVenta:any =  null;
  public data:any = {};

  public mostrarFormAccesorio: boolean = false;
  public mostrarFormFinanciamiento: boolean = false;
  public mostrarFormSeguro: boolean = false;
  public mostrarDetalleFinanciamiento: boolean = true;
  public cargando: boolean  = false;
  public guardando: boolean  = false;


  private comisiones = inject(ComisionesService);
  private financiamientoService =  inject(FinanciamientoService);
  private segurosService =  inject(SegurosService);
  private alertas =  inject(SwalComprsServiceService);
  private accesoriosService =  inject(AccesoriosService);

constructor(public bsModalRef: BsModalRef,){}
 ngOnInit(): void {
  this.getExpedienteVenta();
 }

 venta = {
    financiamiento: null,
    seguro: null,
    accesorios: [
    ]
  };


  toggleFormAccesorio() {
    this.mostrarFormAccesorio = !this.mostrarFormAccesorio;
  }

  toggleFormSeguro() {
    this.mostrarFormSeguro = !this.mostrarFormSeguro;
  }

  toggleFormFinanciamiento() {
    this.mostrarFormFinanciamiento = !this.mostrarFormFinanciamiento;
  }

  eliminarAccesorio(index: number) {
    this.venta.accesorios.splice(index, 1);
  }

  addfactura(factura:any){
    this.venta.accesorios.push(factura);
  }

  setFinanciamiento(financiamiento:any){
    this.venta.financiamiento = financiamiento;
  }

  saveAccesorios(factura:any){
    console.log(this.venta.accesorios)
  }


  public getExpedienteVenta(){
    this.cargando = true;
    this.comisiones.getDatosVenta(this.dataVenta.id_venta).subscribe(
      (response:any) => {
        if(response.status == 'success'){
          this.cargando = false;
          this.venta = response.data;
        }else{
          this.cargando = false;
          this.alertas.mostrarAlerta('Error', 'Algo salio mal en la búsqueda', 'info', 'info');
          return;
        }
      },(error) => {
        this.cargando = false;
          this.alertas.mostrarAlerta("Error", `Error fetching data: ${error}`, "error" , "danger" );
          return;
      })
  }

  public relacionarAccesorios(){
    this.guardando = true;

    const payload = {
      venta_id: this.dataVenta.id_venta,
      facturas: this.venta.accesorios
    };

    this.accesoriosService.asignarAccesorios(payload).subscribe(
      (response:any) => {
        if(response.status == 'success'){
          this.alertas.mostrarAlerta('Listo!', response.message, 'success', 'success');
          this.guardando = false;
          this.getExpedienteVenta();
          // this.venta = response.data;
        }else{
          this.alertas.mostrarAlerta('Error', 'Algo salio mal en la búsqueda', 'info', 'info');
          this.guardando = false;
          return;
        }
      },(error) => {
          this.alertas.mostrarAlerta("Error", `Error fetching data: ${error}`, "error" , "danger" );
          this.guardando = false;
          return;
      })
  }

  async verArchivoFinaciamiento(id:any) {
    this.financiamientoService.obtenerArchivo(id).subscribe((data: Blob) => {
      const url = window.URL.createObjectURL(data);
      window.open(url);
    });
  }

  async verArchivoSeguro(id:any) {
    this.segurosService.obtenerArchivo(id).subscribe((data: Blob) => {
      const url = window.URL.createObjectURL(data);
      window.open(url);
    });
  }


  toggleDetalleFinanciamiento(): void {
    this.mostrarDetalleFinanciamiento = !this.mostrarDetalleFinanciamiento;
  }

  cerrarModal(): void {
    this.bsModalRef.hide();
  }
}
