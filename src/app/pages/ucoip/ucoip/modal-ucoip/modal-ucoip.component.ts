import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Permisos } from 'src/app/core/models/ucoip/permisos';
import { AlertErrorService } from 'src/app/core/services/alert-error.service';
import { AreasDepartamentosService } from 'src/app/core/services/ucoip/areas-departamentos.service';
import { PermisosService } from 'src/app/core/services/ucoip/permisos.service';
import { ResguardosService } from 'src/app/core/services/ucoip/resguardos.service';
@Component({
  selector: 'app-modal-ucoip',
  templateUrl: './modal-ucoip.component.html',
  styleUrl: './modal-ucoip.component.css'
})
export class ModalUcoipComponent implements OnInit  {
  public tipo: string = '';
  
  public data: any = [];
    
  public listaDatos: any[] = [];
  
  public formModalUcoip: FormGroup;

  public dataAreas: any;

  public dataDepto: any;

  public dataPuesto: any;

  public dataPermisos: Permisos[];

  public isLoad: boolean = true;
    
  public event: EventEmitter<any> = new EventEmitter();
  
  constructor(
    public formBuilder: FormBuilder,
    public modalRef: BsModalRef,
    public modalService: BsModalService,
    public alertService: AlertErrorService,
    private areasDeptosService: AreasDepartamentosService,
    private permisosService: PermisosService,
    private resguardosService: ResguardosService
  ) {}

  public ngOnInit(): void {

    this.tipo = this.listaDatos[0].tipo;
    this.data = this.listaDatos[0].data;
    this.getPermisos();
    this.getResguardos();
    this.buildFormModal();

    // console.log(this.dataPermisos);
    
  }

  private buildFormModal() {
    return new Promise((resolve, reject) => {
      this.formModalUcoip = this.formBuilder.group({
        area: new FormControl("", [Validators.required]),
        departamento: new FormControl("", [Validators.required]),
        puesto: new FormControl(null, [Validators.required]),
        titular: new FormControl(null, [Validators.required]),
        ucoip: new FormControl(null, [Validators.required]),
        contrasenia: new FormControl(null, [Validators.required]),
        correo: new FormControl(null, [Validators.required]),
        usuario_as: new FormControl(null, [Validators.required]),
        ip: new FormControl(null, [Validators.required]),
        extension: new FormControl(null, []),
        empresa: new FormControl(null, [Validators.required]),
      });
      resolve(true);
    });
  }

  public getAreas () {
    this.areasDeptosService.getAreas().subscribe(
      (data: any) => {
        if (data.success) {
          this.dataAreas = data.data;
        } else {
          this.alertService.alertError(data.message, data.success);
        }
      },
      (error) => {
        this.alertService.alertError(error, false);
      }
    );
  }

  public onSelectAreaChange(value: number) {
    this.areasDeptosService.getAreasDeptos(value).subscribe(
      (data: any) => {
        if (data.success) {
          this.dataDepto = data.data;
        } else {
          this.alertService.alertError(data.message, data.success);
        }
      },
      (error) => {
        this.alertService.alertError(error, false);
      }
    );
    
  }

  public onSelectDeptoChange(value: number) {
    this.areasDeptosService.getDeptoPuestos(value).subscribe(
      (data: any) => {
        if (data.success) {
          this.dataPuesto = data.data;          
        } else {
          this.alertService.alertError(data.message, data.success);
        }
      },
      (error) => {
        this.alertService.alertError(error, false);
      }
    );
    
  }

  private getPermisos() {
    this.permisosService.getModulo(1).subscribe({
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

  public resguardos = [];
  private getResguardos() {
    this.resguardosService.getUcoipResguardos(this.data.id).subscribe({
      next: async (resp) => {
        if (resp.success) {
          this.resguardos = resp.data;
          console.log(this.resguardos)
          this.isLoad = false;
        }
      },
      error: (err) => {
        console.error('Error cargando módulos', err);
      }
    });
  }

  
}
