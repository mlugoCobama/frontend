import { Component, Input, Output, EventEmitter, SimpleChanges, OnInit } from '@angular/core';
import { ComprasService } from 'src/app/core/services/compras/compras.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';
import { UsuariosService } from 'src/app/core/services/compras/usuarios.service';


@Component({
  selector: 'app-btn-autorizacion-gerencia',
  templateUrl: './btn-autorizacion-gerencia.component.html',
  styleUrl: './btn-autorizacion-gerencia.component.css'
})
export class BtnAutorizacionGerenciaComponent{

@Input() solicitudCompra:any;
@Output() actualizarStatus = new EventEmitter<void>();


constructor(
 public comprasService:ComprasService,
 private alertasService:SwalComprsServiceService,
 private localStorage:LocalStorageServiceService,
 private usuariosService:UsuariosService
){}

// ngOnInit(): void {
//   this.getUsuarioActivo();
// }

ngOnChanges(changes: SimpleChanges) { 
  if(changes !=  null){
    this.enviarSolicitud();  
  }
}

public usuarioActivo:any;
public puesto:any;

public isGG:boolean = true;
public isGA:boolean = true;

public autorizar(gerencia){
  const data = { campo: gerencia, value: 1  }
  this.comprasService.edit(this.solicitudCompra.id, data).subscribe(
    (response) => {
      if (response.status === "success"){
        this.alertasService.mostrarAlerta("Listo!","Autorización Notificada", "success", "success");
        this.actualizarStatus.emit();
      }else{
        this.alertasService.mostrarAlerta("Error!","Hubo un error", "error", "danger");
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
          //console.log("Se envía notificación al departamento de compras")
          this.actualizarStatus.emit();
        }else{
          this.alertasService.mostrarAlerta("Error!","Hubo un error", "error", "danger");
        } 
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
   }
}

  /**
   * Recupera el usuario activo en el local storage
   */
  public getUsuarioActivo() {
    const usuarioActivo = this.localStorage.getItem("currentUser");

    this.usuariosService.getUserById(usuarioActivo["role"]["email"]).subscribe(
      (response) => {
        if (response.status === "success") {
          
          this.usuarioActivo = response.data[0];
          //this.validarGerencia(response.data[0]);
        } else {
          this.alertasService.mostrarAlerta(
            response.message,
            "Intente iniciar sesión nuevamente",
            "warning",
            "warning"
          );
          return;
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

  public validarGerencia(usuario:any){
    const puesto = usuario.puesto;
    // const patrones = ["Gerente General", "Gerente Administrativo"]
    const patron = "Gerente General";
    const posicion = puesto.indexOf(patron);
    const patron2 = "Gerente Administrativo";
    const posicion2 = puesto.indexOf(patron2);
    if (posicion !== -1) {
      this.isGA = true;
    }
    if(posicion2 !== -1){
      this.isGG = true;
    }


  }
}
