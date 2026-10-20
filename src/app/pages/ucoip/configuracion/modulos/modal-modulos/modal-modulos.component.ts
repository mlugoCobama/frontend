import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertErrorService } from 'src/app/core/services/alert-error.service';
import { ModulosService } from 'src/app/core/services/ucoip/modulos.service';

@Component({
  selector: 'app-modal-modulos',
  templateUrl: './modal-modulos.component.html',
  styleUrl: './modal-modulos.component.css'
})
export class ModalModulosComponent implements OnInit {

  public tipo: string = '';
  
    public data: any = [];
    
    public listaDatos: any[] = [];
  
    public formModalModulo: FormGroup;
    
    public event: EventEmitter<any> = new EventEmitter();
  
    constructor(
      public formBuilder: FormBuilder,
      public modalRef: BsModalRef,
      public modalService: BsModalService,
      public alertService: AlertErrorService,
      private modulosService: ModulosService
    ) {}

   public ngOnInit(): void {
    this.buildFormModal();

    this.tipo = this.listaDatos[0].tipo;
    this.data = this.listaDatos[0].data;

    if (this.tipo == 'editar') {
      this.formModalModulo.get('nombre').setValue(this.data.nombre);
      this.formModalModulo.get('descripcion').setValue(this.data.descripcion);
    } 
   }

  public cerrarModal(): void {
    this.modalRef.hide();
  }

  private buildFormModal() {
    return new Promise((resolve, reject) => {
      this.formModalModulo = this.formBuilder.group({
        nombre: new FormControl(null, [Validators.required]),
        descripcion: new FormControl(null, [Validators.required]),
      });
      resolve(true);
    });
  }

  public save() {
  
      let datos;
  
      datos = {
        nombre: this.formModalModulo.controls['nombre'].value,
        descripcion: this.formModalModulo.controls['descripcion'].value,
      };
  
      // console.log(datos);
      

      this.modulosService.crearModulo(datos).subscribe((resp) => {
        if (resp.success) {
          this.event.emit({ data: true, res: 200 });
          this.alertService.alertError(resp.message, resp.success);
        } else {
          this.event.emit({ data: false, res: 200 });
          this.alertService.alertError(resp.message, resp.success);
        }
      });
  
      this.event.emit({ data: true, res: 200 });
    }
  
    public update() {

      let datos;
  
      datos = {
        nombre: this.formModalModulo.controls['nombre'].value,
        descripcion: this.formModalModulo.controls['descripcion'].value,
      };

      this.modulosService.actualizarModulo( this.data.id ,datos).subscribe((resp) => {
        if (resp.success) {
          this.event.emit({ data: true, res: 200 });
          this.alertService.alertError(resp.message, resp.success);
        } else {
          this.event.emit({ data: false, res: 200 });
          this.alertService.alertError(resp.message, resp.success);
        }
      });
    }


    public delete() {

      this.modulosService.eliminarModulo( this.data.id).subscribe((resp) => {
        if (resp.success) {
          this.event.emit({ data: true, res: 200 });
          this.alertService.alertError(resp.message, resp.success);
        } else {
          this.event.emit({ data: false, res: 200 });
          this.alertService.alertError(resp.message, resp.success);
        }
      });
    }
}
