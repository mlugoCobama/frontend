import { Component, OnInit } from '@angular/core';
import { configTablaConcentrado } from './modelo-concentrado';
import { ConcentradoComisionesService } from 'src/app/core/services/renault/concentrado-comisiones.service';

@Component({
  selector: 'app-comisiones-concentrado',
  templateUrl: './comisiones-concentrado.component.html',
  styleUrl: './comisiones-concentrado.component.css'
})
export class ComisionesConcentradoComponent implements OnInit{
  public data: any = []
  public columnasVendedor = configTablaConcentrado;
  public isLoad =  true;
  configFiltro = { showEstado: false, showVendedor: true, showTipoVenta: false}
  hayDatos = false;
  public totales;
  
  constructor(private concentradoComisiones: ConcentradoComisionesService){
  }

  ngOnInit(): void {
    this.getAll();
  }


  private getAll() {
    this.isLoad = true;
    this.concentradoComisiones.getAll().subscribe(
      (response: any) => {
        if (response) {
          this.data = response.data;
          this.totales = this.obtenerTotales(response.data);
          console.log(this.totales)
          this.isLoad = false;
        } else {
          console.log(response.message);
          this.isLoad = false;
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
        this.isLoad = false;
      },
    );
  }

 obtenerTotales(rows) {
  // Buscamos la fila que tenga el texto "TOTAL GENERAL"
  const totales = rows.find(r => r.vendedor === 'TOTAL GENERAL');
  return totales || null;
}



  buscarDatos(params){
    console.log(params);
  }
}
