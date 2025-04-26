import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ComprasService } from 'src/app/core/services/compras/compras.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-btn-autorizacion-gerencia',
  templateUrl: './btn-autorizacion-gerencia.component.html',
  styleUrl: './btn-autorizacion-gerencia.component.css'
})
export class BtnAutorizacionGerenciaComponent {

@Input() solicitudCompra:any;
@Output() actualizarStatus = new EventEmitter<void>();

constructor(
 public comprasService:ComprasService
){}

ngOnChanges(changes: SimpleChanges) { 
  if(changes !=  null){
    this.enviarSolicitud();  
  }
}

public autorizar(gerencia){
  const data = { campo: gerencia, value: 1  }
  this.comprasService.edit(this.solicitudCompra.id, data).subscribe(
    (response) => {
      if (response.status === "success"){
        Swal.fire({
            title: "Listo!",
            text: "Autorización Notificada",
            buttonsStyling: false,
            icon: "success",
            customClass: {
            confirmButton: "btn btn-danger px-4",
            cancelButton: "btn btn- ms-2 px-4",
           },
        });
        this.actualizarStatus.emit();
      }else{
        Swal.fire({
          title: "Error!",
          text: "Hubo un error",
          buttonsStyling: false,
          icon: "error",
          customClass: {
          confirmButton: "btn btn-danger px-4",
          cancelButton: "btn btn- ms-2 px-4",
         },
      });
      } 
    },
    (error) => {
      console.error("Error fetching data:", error);
    }
  );
} 

public enviarSolicitud(){
   const auto_admin =  this.solicitudCompra.auto_admin;
   const auto_gral =  this.solicitudCompra.auto_gg;
   const data = { campo: 'estatus', value: 2  } 
   if(auto_admin === 1 && auto_gral === 1){
    this.comprasService.edit(this.solicitudCompra.id, data).subscribe(
      (response) => {
        if (response.status === "success"){
          console.log("Se envía notificación al departamento de compras")
          this.actualizarStatus.emit();
        }else{
          Swal.fire({
            title: "Error!",
            text: "Hubo un error",
            buttonsStyling: false,
            icon: "error",
            customClass: {
            confirmButton: "btn btn-danger px-4",
            cancelButton: "btn btn- ms-2 px-4",
           },
        });
        } 
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
   }
}
}
