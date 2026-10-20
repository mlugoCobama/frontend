import { Component, OnInit } from '@angular/core';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { GestionServiciosService } from 'src/app/core/services/gestion-servicios/gestion-servicios.service';
import { ColumnaTabla } from 'src/app/shared/ui/tabla-generica/tabla-generica.component';

@Component({
  selector: 'app-cat-servicios',
  templateUrl: './cat-servicios.component.html',
  styleUrl: './cat-servicios.component.css'
})
export class CatServiciosComponent implements OnInit{

  constructor(
    private gestionServicio: GestionServiciosService,
    private alertas: SwalComprsServiceService
  ){}

  public servicios:any = []

  public configTabla: ColumnaTabla[] = [
      { campo: "nombre",     etiqueta: " Nombre", bold: true, textNoWrap: true},
      { campo: "descripcion", etiqueta: "Descripcion"},
    ];
  
  ngOnInit(): void {
    this.loadServicios();
  }
  
    public loadServicios(){
    this.gestionServicio.getCatServicios().subscribe(
      (response:any) => {
        if(response.status == 'success'){
          this.servicios = response.data.servicios;
          console.log(this.servicios)
          // this.buscando = false;
          // this.isLoad = false;
        }else{
          this.alertas.mostrarAlerta('Error', 'Algo salio mal en la búsqueda', 'info', 'info');
          // this.buscando = false;
          // this.isLoad = false;
          return;
        }
      },(error) => {
          this.alertas.mostrarAlerta("Error", `Error fetching data: ${error}`, "error" , "danger" );
          // this.buscando = false;
          // this.isLoad = false;
          return;
      }
    )
  }


}
