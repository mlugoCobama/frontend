import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Modulos } from 'src/app/core/models/ucoip/modulos';
import { AlertErrorService } from 'src/app/core/services/alert-error.service';
import { ModulosService } from 'src/app/core/services/ucoip/modulos.service';
import { PermisosService } from 'src/app/core/services/ucoip/permisos.service';

@Component({
  selector: 'app-modal-permisos',
  templateUrl: './modal-permisos.component.html',
  styleUrl: './modal-permisos.component.css'
})
export class ModalPermisosComponent {
  public tipo: string = '';
  
  public data: any = [];
  
  public listaDatos: any[] = [];

  public dataModulos: Modulos[];

  public formModalPermisos: FormGroup;
  
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    public formBuilder: FormBuilder,
    public modalRef: BsModalRef,
    public modalService: BsModalService,
    public alertService: AlertErrorService,
    private modulosService: ModulosService,
    private permisosService: PermisosService
  ) {}

  public ngOnInit(): void {

    this.tipo = this.listaDatos[0].tipo;
    this.data = this.listaDatos[0].data;

    this.getModulos();
    this.buildFormModal();
  }

  public cerrarModal(): void {
    this.modalRef.hide();
  }

  private buildFormModal() {
    return new Promise((resolve, reject) => {
      this.formModalPermisos = this.formBuilder.group({
        modulo: new FormControl('', [Validators.required]),
        nombre: new FormControl(null, [Validators.required]),
        descripcion: new FormControl(null, [Validators.required]),
      });
      resolve(true);
    });
  }

  public save() {
  
    let datos;
  
    datos = {
      modulo: this.formModalPermisos.controls['modulo'].value,
      nombre: this.formModalPermisos.controls['nombre'].value,
      descripcion: this.formModalPermisos.controls['descripcion'].value,
    };
  
    this.permisosService.crearModulo(datos).subscribe((resp) => {
        this.event.emit({ data: false, res: 200 });
        this.alertService.alertError(resp.message, resp.success);
    });
  
  }
  
    public update() {
      this.event.emit({ data: true, res: 200 });
    }

  private getModulos() {

    this.modulosService.getModulos().subscribe({
      next: async (resp) => {
        if (resp.success) {
          this.dataModulos = resp.data;
        }
      },
      error: (err) => {
        console.error('Error cargando módulos', err);
      }
    });

  }
}
