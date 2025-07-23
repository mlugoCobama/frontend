import { Component, OnInit } from '@angular/core';
import { Config } from 'datatables.net';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertErrorService } from 'src/app/core/services/alert-error.service';
import { ModalPermisosComponent } from './modal-permisos/modal-permisos.component';
import { PermisosService } from 'src/app/core/services/ucoip/permisos.service';
import { Permisos } from 'src/app/core/models/ucoip/permisos';

@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.css']
})
export class PermisosComponent implements OnInit {

    public isLoad: boolean = true;
  
    public dataPermisos: Permisos[];
  
    public dtOptions: Config = {};
  
    public modalRef?: BsModalRef;
  
    constructor(
        public alertService: AlertErrorService,
        private modalService: BsModalService,
        private permisosService: PermisosService
      ) {}
  
    ngOnInit(): void {
      this.getAll();
    }
  
    private getAll() {
      this.permisosService.getModulos().subscribe({
        next: async (resp) => {
          if (resp.success) {
            this.dataPermisos = resp.data;
            this.isLoad = false;
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
  
      this.modalRef = this.modalService.show(ModalPermisosComponent, {
        initialState,
        class: '',
     
      });
  
      this.modalRef.content.closeBtnName = 'Close';
      this.modalRef.content.event.subscribe((res) => {
        console.log(res);
        
        this.isLoad = true;
        this.dataPermisos = [];
        if (res.data) {
          this.modalRef.hide();
          
        }
      });
      
    }
  
    public openEdit(item: any) {
      /*
      const initialState = {
        listaDatos: [
          {
            data: item,
            tipo: 'editar',
          },
        ],
      };
  
      this.modalRef = this.modalService.show(ModalInventarioComponent, {
        initialState,
        class: 'modal-lg',
        backdrop: 'static',
      });
  
      this.modalRef.content.closeBtnName = 'Close';
      this.modalRef.content.event.subscribe((res) => {
        if (res.data) {
          this.modalRef.hide();
          //this.getAll();
        }
      });
      */
    }

}
