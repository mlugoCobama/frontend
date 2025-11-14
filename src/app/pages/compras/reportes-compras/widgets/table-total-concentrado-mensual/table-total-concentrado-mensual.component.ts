import { Component } from '@angular/core';

@Component({
  selector: "app-table-total-concentrado-mensual",
  templateUrl: "./table-total-concentrado-mensual.component.html",
  styleUrl: "./table-total-concentrado-mensual.component.css",
})
export class TableTotalConcentradoMensualComponent {
  datos = [
    { empresa: "Garza Gas", solicitudes: "35", total: "24456.52" },
    { empresa: "Gas Premio", solicitudes: "25", total: "16014.76" },
    { empresa: "Reyes Gas", solicitudes: "12", total: "8485.00" },
    { empresa: "Satelite Gas", solicitudes: "10", total: "5338.29" },
    { empresa: "Garza Sur", solicitudes: "1", total: "5000.00" },
    { empresa: "Gas Flamazul", solicitudes: "2", total: "2800.00" },
    { empresa: "Servigas del Valle", solicitudes: "1", total: "290.92" },
    { empresa: "Iztagas y Energia", solicitudes: "0", total: "0.00" },
    { empresa: "Gas Urbano", solicitudes: "0", total: "0.00" },
    { empresa: "Zugas", solicitudes: "0", total: "0.00" },
    { empresa: "Flamamex", solicitudes: "0", total: "0.00" },
    { empresa: "Gas Multiregional", solicitudes: "0", total: "0.00" },
    { empresa: "Azteca Gas", solicitudes: "0", total: "0.00" },
    { empresa: "Gasamex", solicitudes: "0", total: "0.00" },
    { empresa: "Segas", solicitudes: "0", total: "0.00" },
  ];

  get totalGeneral(): number {
    return this.datos.reduce((sum, item) => sum + +item.total, 0);
  }

  get totalSolicitudes(): number {
    return this.datos.reduce((sum, item) => sum + +item.solicitudes, 0);
  }
}
