import { Component, OnInit } from '@angular/core';
import { Config } from 'datatables.net';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UcoipService } from 'src/app/core/services/ucoip/ucoip.service';
import { environment } from 'src/environments/environment';
import { ModalUcoipComponent } from './modal-ucoip/modal-ucoip.component';
import { DataTableDirective } from 'angular-datatables';
import { AreasDepartamentosService } from 'src/app/core/services/ucoip/areas-departamentos.service';
import { ViewChild } from '@angular/core';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-ucoip',
  templateUrl: './ucoip.component.html',
  styleUrls: ['./ucoip.component.css']
})
export class UcoipComponent implements OnInit {


  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  public data: any;
  public showTable:boolean = false;
  public modalRef?: BsModalRef;

  public catalogoAreas: any;
  public catalogoSistemas: any;
  public catalogoRecursos: any;

  dtOptions: Config = {};

  empresas: any[] = [];
  areas: any[] = [];
  puestos: any[] = [];

  filtros = {
    empresa: '',
    area: '',
    puesto: ''
  };



  constructor(
    private ucoipService: UcoipService,
    private modalService: BsModalService,
    private catalogosService: AreasDepartamentosService,
  ){}

  public ngOnInit(): void {
    this.dtOptions = environment.dataTables;
    this.getAll();
    this.obtenerCatalogo();
  }

  private getAll() {
    this.ucoipService.getAll()
      .subscribe(
        response => {
          if (response.success) {
            this.data = response.data;
            this.empresas = [
              ...new Set(this.data.map((x:any) => x.empresa))
            ].sort();

                this.areas = [
                  ...new Set(this.data.map((x: any) => x.area)),
                ].sort();

                this.puestos = [
                  ...new Set(this.data.map((x: any) => x.puesto)),
                ].sort();
            this.showTable = true;
            } else {
              this.showTable = false;
            }
          },
          error => {
            console.error('Error fetching data:', error);
          }
      );
  }

  public openEdit(item: any) {
    const initialState = {
      listaDatos: [
        {
          data: item,
          tipo: 'editar',
        },
      ],
      catalogo: this.catalogoAreas,
      areas : this.catalogoAreas,
      catSistemas : this.catalogoSistemas,
      catRecurso : this.catalogoRecursos
    };

    this.modalRef = this.modalService.show(ModalUcoipComponent, {
      initialState,
      class: 'modal-lg'
    });

    this.modalRef.content.closeBtnName = 'Close';
    this.modalRef.content.event.subscribe((res:any) => {
      if (res.data) {
        this.modalRef?.hide();
        // this.getAll();
      }
    });

  }

  aplicarFiltros() {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.column(0).search(this.filtros.empresa);
      dtInstance.column(3).search(this.filtros.area);
      dtInstance.column(4).search(this.filtros.puesto);
      dtInstance.draw();
    });
  }

  obtenerCatalogo(): void {
     this.catalogosService.getAreas().subscribe({
       next: (resp: any) => {
        this.catalogoAreas = resp.data.areas;
        this.catalogoSistemas = resp.data.sistemas;
        this.catalogoRecursos = resp.data.recursos;
        // this.areas = resp.data;
       },
       error: (error) => {
         console.error(error);
       }
     });
  }



}
