import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { DetallesSolicitudService } from 'src/app/core/services/compras/detalles-solicitud.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { FormDetalleSolicitudComponent } from '../form-detalle-solicitud/form-detalle-solicitud.component';

@Component({
  selector: 'app-form-actualizar-detalle',
  templateUrl: './form-actualizar-detalle.component.html',
  styleUrl: './form-actualizar-detalle.component.css'
})
export class FormActualizarDetalleComponent {

  constructor(
    private detallesService: DetallesSolicitudService,
    private alertasService: SwalComprsServiceService

  ){}

  @Input() detalles:any;
  @Input() solicitudCompra:any;

  @Output() updateDetalles = new EventEmitter<void>();
 
  @ViewChild('formDetalleSolicitud') tableData!:  FormDetalleSolicitudComponent;

  public modificarDetalles() {
    if (this.validarTamaño()) {
      Swal.fire({
        title: "¿Estas seguro?",
        text: "Los detalles se actualizaran",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          this.detallesService
            .edit(this.solicitudCompra.id, this.fromatearNuevosDetalles())
            .subscribe(
              (response) => {
                if (response.status === "success") {
                  this.alertasService.mostrarAlerta(
                    "Actualizado",
                    "Se han actualizado los detalles de la solicitud",
                    "success",
                    "success"
                  );
                  this.tableData.limpiarArray();
                  this.updateDetalles.emit();
                  // this.getDetalles();
                } else {
                  this.alertasService.mostrarAlerta(
                    "Error",
                    response.message,
                    "warning",
                    "warning"
                  );
                }
              },
              (error) => {
                console.error("Error enviando datos:", error);
              }
            );
        } else {
          this.updateDetalles.emit();
          // this.getDetalles();
        }
      });
    } else {
      this.alertasService.mostrarAlerta(
        "Error",
        "Ningun elemento esta autorizado",
        "error",
        "danger"
      );
      this.updateDetalles.emit();
      // this.getDetalles();
    }
  }

  validarTamaño() {
    // this.fromatearNuevosDetalles();
    const contador = this.detalles.reduce((acc, detalle) => acc + detalle.confirmado, 0);
    console.log(contador);
    return contador !== 0;
}
private fromatearNuevosDetalles(){
  const dataOriginal = this.detalles.slice();

  if(this.tableData.hasDatos()){
    const datos =  this.tableData.getDetalles();
    datos.forEach(dato => {
      dataOriginal.push(dato)
    });
    // console.log(dataOriginal)
    
  } 
  return dataOriginal;
}


}
