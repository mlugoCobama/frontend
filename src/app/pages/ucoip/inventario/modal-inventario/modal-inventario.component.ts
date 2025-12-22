import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CatHardware } from 'src/app/core/models/ucoip/cat-hardware';
import { Inventario } from 'src/app/core/models/ucoip/inventario';
import { AlertErrorService } from 'src/app/core/services/alert-error.service';
import { CatHardwareService } from 'src/app/core/services/ucoip/cat-hardware.service';
import { InventarioService } from 'src/app/core/services/ucoip/inventario.service';

@Component({
  selector: 'app-modal-inventario',
  templateUrl: './modal-inventario.component.html',
  styleUrls: ['./modal-inventario.component.css']
})
export class ModalInventarioComponent implements OnInit {
  
  public tipo: string = '';

  public data: any = [];
  
  public listaDatos: any[] = [];

  public formModalInventario: FormGroup;

  public dataCatHardware: CatHardware[];

  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    public formBuilder: FormBuilder,
    public modalRef: BsModalRef,
    public modalService: BsModalService,
    public alertService: AlertErrorService,
    private catHardwareService: CatHardwareService,
    private inventarioService: InventarioService,
  ) {}

  public ngOnInit(): void {
    this.getCatHardware();
    this.buildFormModal();

    this.tipo = this.listaDatos[0].tipo;
    this.data = this.listaDatos[0].data;

    if (this.tipo == 'editar') {
      this.formModalInventario.get('marca').setValue(this.data.marca);
      this.formModalInventario.get('modelo').setValue(this.data.modelo);
      this.formModalInventario.get('no_serie').setValue(this.data.no_serie);
      this.formModalInventario.get('tipo_cpu').setValue(this.data.tipo_cpu);
      this.formModalInventario.get('mac').setValue(this.data.mac);
      this.formModalInventario.get('memoria_ram').setValue(this.data.memoria_ram);
      this.formModalInventario.get('disco_duro').setValue(this.data.disco_duro);
      this.formModalInventario.get('procesador').setValue(this.data.procesador);
      this.formModalInventario.get('caracteristicas').setValue(this.data.caracteristicas);
      this.formModalInventario.get('observaciones').setValue(this.data.observaciones);
      this.formModalInventario.get('estado').setValue(this.data.estado);
      this.formModalInventario.get('cat_hardware_id').setValue(this.data.tipo.id);
    } 
  }


  private buildFormModal() {
    return new Promise((resolve, reject) => {
      this.formModalInventario = this.formBuilder.group({
        marca: new FormControl(null, [Validators.required]),
        modelo: new FormControl(null, [Validators.required]),
        no_serie: new FormControl(null, [Validators.required]),
        tipo_cpu: new FormControl("", []),
        mac: new FormControl(null, []),
        memoria_ram: new FormControl(null, [Validators.required]),
        disco_duro: new FormControl(null, [Validators.required]),
        procesador: new FormControl(null, [Validators.required]),
        caracteristicas: new FormControl(null, []),
        observaciones: new FormControl(null, []),
        estado: new FormControl("", []),
        cat_hardware_id: new FormControl("", [Validators.required]),
      });
      resolve(true);
    });
  }

  public cerrarModal(): void {
    this.modalRef.hide();
  }

  private getCatHardware() {
    this.catHardwareService.getAll().subscribe(
      (data: any) => {
        if (data.success) {
          this.dataCatHardware = data.data;
        } else {
          this.alertService.alertError(data.message, data.success);
        }
      },
      (error) => {
        this.alertService.alertError(error, false);
      }
    );
  }

  public save() {

    let datos: Inventario;

    datos = {
      marca: this.formModalInventario.controls['marca'].value,
      modelo: this.formModalInventario.controls['modelo'].value,
      no_serie: this.formModalInventario.controls['no_serie'].value,
      tipo_cpu: this.formModalInventario.controls['tipo_cpu'].value,
      mac: this.formModalInventario.controls['mac'].value,
      disco_duro: this.formModalInventario.controls['disco_duro'].value,
      procesador: this.formModalInventario.controls['procesador'].value,
      memoria_ram: this.formModalInventario.controls['memoria_ram'].value,
      caracteristicas: this.formModalInventario.controls['caracteristicas'].value,
      observaciones: this.formModalInventario.controls['observaciones'].value,
      estado: this.formModalInventario.controls['estado'].value,
      cat_hardware_id: this.formModalInventario.controls['cat_hardware_id'].value,
    };

    // console.log(datos);
    

    this.inventarioService.save(datos).subscribe((resp) => {
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
    this.event.emit({ data: true, res: 200 });
  }

}
