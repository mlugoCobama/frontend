import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Config } from 'datatables.net';
import { DataTableDirective } from 'angular-datatables';

import { ViewChild } from '@angular/core';
import { EstadoRecursoConfig } from 'src/app/shared/configs';
import { EstadoRecurso } from 'src/app/shared/Enums';

@Component({
  selector: 'app-tabla-inventario',
  templateUrl: './tabla-inventario.component.html',
  styleUrl: './tabla-inventario.component.css'
})
export class TablaInventarioComponent implements OnInit {

  EstadoRecurso = EstadoRecurso;
  EstadoRecursoConfig = EstadoRecursoConfig;

  selectedId: number | null = null;


  @Output() abrirModal = new EventEmitter<any>();

@Input() isLoad: boolean = true;
@Input() dataInventario: any[] = [];
@Input() dtOptions: Config = {
            searching: true, 
            paging: true, 
            info: false,
            order: [0,'asc'],
            language: {
              url: '/assets/es-mx.json'
            },
          };

  empresas: string[] = [];
  tipos: string[] = [];
  estados: string[] = [];

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;


  @Input()  estadoRecurso:any ;
  @Input()  estadoRecursoConfig:any;


          ngOnInit(): void {
            this.empresas = [...new Set(
                this.dataInventario.map((x:any) => x.empresa)
              )].sort();

              this.tipos = [...new Set(
                this.dataInventario.map((x:any) => x.tipo.tipo)
              )].sort();

              this.estados = [...new Set(
                this.dataInventario.map((x:any) => this.getEstatus(x.estado))
              )].sort();
            this.dtOptions = {
            searching: true, 
            paging: true, 
            info: false,
            order: [0,'asc'],
            language: {
              url: '/assets/es-mx.json'
            },
          };
          }
  
public openEdit(item:any){
  this.selectedId = item.id;
 this.abrirModal.emit(item)
}

selectRow(item: any) {
  this.selectedId = item.id;
}

getEstatus(status:any){

  let label = 'Desconcido'
  switch (status) {
    case 1:
        label  = "Disponible"
      break;
    case 2:
        label  = "Asignado"
      break;
    case 3:
        label  = "Obsoleto"
      break;
    default:
      label ='Desconocido'
      break;
  }
  return label;
}

filtros = {
  empresa: '',
  tipo: '',
  estado: ''
};

aplicarFiltros() {
  this.dtElement.dtInstance.then((dtInstance: any) => {

    // Tipo
    dtInstance.column(0).search(this.filtros.tipo);

    // Estado
    dtInstance.column(1).search(this.filtros.estado);

    // Empresa
    dtInstance.column(5).search(this.filtros.empresa);

    dtInstance.draw();
  });
}
}
