import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Config } from 'datatables.net';

@Component({
  selector: 'app-tabla-inventario',
  templateUrl: './tabla-inventario.component.html',
  styleUrl: './tabla-inventario.component.css'
})
export class TablaInventarioComponent implements OnInit {

  selectedId: number | null = null;


  @Output() abrirModal = new EventEmitter<any>();

@Input() isLoad: boolean = true;
@Input() dataInventario: any[] = [];
@Input() dtOptions: Config = {
            searching: true, 
            paging: true, 
            info: false,
            order: [0,'asc']
          };

          ngOnInit(): void {
            console.log(this.dataInventario)
            this.dtOptions = {
            searching: true, 
            paging: true, 
            info: false,
            order: [0,'asc']
          };
          }
  
public openEdit(item:any){
  this.selectedId = item.id;
 this.abrirModal.emit(item)
}

selectRow(item: any) {
  this.selectedId = item.id;
}
}
