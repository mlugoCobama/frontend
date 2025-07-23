import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Config } from 'datatables.net';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertErrorService } from 'src/app/core/services/alert-error.service';
import { ModalModulosComponent } from './modal-modulos/modal-modulos.component';
import { ModulosService } from 'src/app/core/services/ucoip/modulos.service';
import { Modulos } from 'src/app/core/models/ucoip/modulos';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-modulos',
  templateUrl: './modulos.component.html',
  styleUrls: ['./modulos.component.css']
})
export class ModulosComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective, { static: false })

  dtElement!: DataTableDirective;

  public isLoad: boolean = true;
    
  public dataModulos: Modulos[];
    
  public dtOptions:  {};
    
  public modalRef?: BsModalRef;

  public dtTrigger: Subject<any> = new Subject<any>();
    
  constructor(
    public alertService: AlertErrorService,
    private modalService: BsModalService,
    private modulosService: ModulosService
  ) {}
    
  ngOnInit(): void {
    this.dtOptions = {    
      paging: true,
      pageLength: 10,
      searching: true,
      ordering: true,
      info: true,
      responsive: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json' // Español (opcional)
      }
    }
    this.getAll();
  }

  ngAfterViewInit(): void {
    //if (!this.dataModulos.length) {
      this.dtTrigger.next(undefined);
    //}
  }

  ngOnDestroy(): void {
    //this.dtTrigger.unsubscribe(); // Importante evitar memory leaks
  }
    
  private getAll() {

    this.modulosService.getModulos().subscribe({
      next: async (resp) => {
        if (resp.success) {
          this.dataModulos = resp.data;
          this.isLoad = false;

          // Si ya existe instancia del datatable, destruir y volver a lanzar
          if (this.dtElement?.dtInstance) {
            const dtInstance = await this.dtElement.dtInstance;
            dtInstance.destroy(); // Destruye la tabla actual
            this.dtTrigger.next(null); // Vuelve a renderizar
          }
        }
      },
      error: (err) => {
        console.error('Error cargando módulos', err);
      }
    });

  }
    
  public openModal() {
    const initialState = {
      listaDatos: [{
          data: [],
          tipo: 'agregar',
        },],
    };
    
    this.modalRef = this.modalService.show(ModalModulosComponent, {
      initialState,
      class: '',    
    });
    
    this.modalRef.content.closeBtnName = 'Close';
    this.modalRef.content.event.subscribe((res) => {
      this.isLoad = true;
      this.dataModulos = [];
      if (res.data) {
        this.modalRef.hide();
        this.getAll();
      }
    });    
  }
    
  public openEdit(item: Modulos) {
        
    const initialState = {
      listaDatos: [{
        data: item,
        tipo: 'editar',
      },],
    };
    
    this.modalRef = this.modalService.show(ModalModulosComponent, {
      initialState,
      class: '',
    });
    
    this.modalRef.content.closeBtnName = 'Close';
    this.modalRef.content.event.subscribe((res) => {
      this.isLoad = true;
      this.dataModulos = [];
      if (res.data) {
        this.modalRef.hide();
        this.getAll();
      }
    });
  }
  
}
