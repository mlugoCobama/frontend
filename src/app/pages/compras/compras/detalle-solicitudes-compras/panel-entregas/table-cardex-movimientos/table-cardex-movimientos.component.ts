import { Component } from '@angular/core';

@Component({
  selector: 'app-table-cardex-movimientos',
  templateUrl: './table-cardex-movimientos.component.html',
  styleUrl: './table-cardex-movimientos.component.css'
})
export class TableCardexMovimientosComponent {

    movimientos = [
    { cantidad: 10, tipo: 'entrada', fecha: '2025-11-25', usuario: 'Juan', observaciones: 'Stock inicial' },
    { cantidad: 5,  tipo: 'salida',  fecha: '2025-11-26', usuario: 'María', observaciones: 'Venta #123' },
    { cantidad: 20, tipo: 'entrada', fecha: '2025-11-27', usuario: 'Luis', observaciones: 'Compra proveedor' },
    { cantidad: 2,  tipo: 'salida',  fecha: '2025-11-28', usuario: 'Ana', observaciones: 'Devolución cliente' },
    { cantidad: 15, tipo: 'entrada', fecha: '2025-11-28', usuario: 'Pedro', observaciones: 'Inventario ajuste' }
  ];

}
