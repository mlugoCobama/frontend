import { Component, OnInit } from '@angular/core';
import { AlmacenService } from 'src/app/core/services/compras/almacen.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { ColumnaTabla } from 'src/app/shared/ui/tabla-generica/tabla-generica.component';

@Component({
  selector: 'app-almacen',
  templateUrl: './almacen.component.html',
  styleUrl: './almacen.component.css'
})
export class AlmacenComponent implements OnInit{

  constructor(private almacenService: AlmacenService, private alertasService:SwalComprsServiceService ){

  }

  public data:any = [];

  public configTabla: ColumnaTabla[] = [
    { campo: "empresa", etiqueta: "Empresa", textNoWrap: true},
    // { campo: "folio",     etiqueta: "Folio", bold: true, textNoWrap: true},
    
    { campo: "usuario_destino", etiqueta: "U. Destino", textNoWrap: true },
    { campo: "fecha", etiqueta: "Fecha", pipe:'date'},
    { campo: "categoria", etiqueta: "Categoria"},
    { campo: "cantidad", etiqueta: "Cant."},
    { campo: "unidad", etiqueta: "Unidad"},
    { campo: "descripcion", etiqueta: "Descripcion"},
    { campo: "observaciones", etiqueta: "Descripcion"},
  ];

  ngOnInit(): void {
    this.getData()
  }
  

    private getData() {
      // this.mostrar = false;
      // this.intercompania = intercompania;
      // this.isLoad = true;
      // this.showTable = false;
      this.almacenService.getAll().subscribe(
        (response) => {
          if (response) {
            this.data = response.data;
            // this.isLoad = false;
            // this.showTable = true;
          } else {
            this.alertasService.mostrarAlerta(
              "Error",
              response.message,
              "error",
              "danger"
            );
            // this.showTable = false;
          }
        },
        (error) => {
          this.alertasService.mostrarAlerta(
            "Error",
            `Error fetching data: ${error}`,
            "error",
            "danger"
          );
          // this.showTable = false;
        }
      );
    }
}