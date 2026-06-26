import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CatHardware } from 'src/app/core/models/ucoip/cat-hardware';
import { Inventario } from 'src/app/core/models/ucoip/inventario';
import { AlertErrorService } from 'src/app/core/services/alert-error.service';
import { CatHardwareService } from 'src/app/core/services/ucoip/cat-hardware.service';
import { InventarioService } from 'src/app/core/services/ucoip/inventario.service';
import { EmpresasService } from 'src/app/core/services/ucoip/empresas.service';

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

  public dataCatHardware: CatHardware[] = []; 
  public empresas: any[] = []; 

  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    public formBuilder: FormBuilder,
    public modalRef: BsModalRef,
    public modalService: BsModalService,
    public alertService: AlertErrorService,
    private inventarioService: InventarioService,
  ) {}

  public ngOnInit(): void {
    this.buildFormModal();

    this.configurarCamposDinamicos();

    this.tipo = this.listaDatos[0].tipo;
    this.data = this.listaDatos[0].data;

    if (this.tipo == 'editar') {

      console.log(this.data)
      this.formModalInventario.patchValue({
      'marca' : this.data.marca,
      'empresa' :this.data.id_empresa, 
      'modelo' : this.data.modelo,
      'no_serie' : this.data.no_serie,
      'tipo_cpu' : this.data.tipo_cpu,
      'mac' : this.data.mac,
      'memoria_ram' : this.data.memoria_ram,
      'disco_duro' : this.data.disco_duro,
      'procesador' : this.data.procesador,
      'caracteristicas' : this.data.caracteristicas,
      'observaciones' : this.data.observaciones,
      'estado' : this.data.estado,
      'cat_hardware_id' : this.data.tipo?.id,
      });
    } 
  }

  public hardwareFields: { [key: number]: string[] } = {
    1: ['tipo_cpu', 'mac', 'memoria_ram', 'disco_duro', 'procesador'], // CPU
    2: [], // Monitor
    3: [], // Teclado
    4: [], // Mouse
    5: [], // Diadema
    6: [], // Regulador
    7: ['mac'], // Teléfono fijo
    8: ['mac', 'memoria_ram', 'disco_duro', 'procesador'], // Teléfono móvil
    9: ['mac'], // Multifuncional
    10: ['mac', 'memoria_ram', 'disco_duro', 'procesador'], // Tableta
    11: [] // Otro
  };


  private buildFormModal() {
    return new Promise((resolve, reject) => {
      this.formModalInventario = this.formBuilder.group({
        empresa: new FormControl("", [Validators.required]),
        marca: new FormControl(null, [Validators.required]),
        modelo: new FormControl(null, [Validators.required]),
        no_serie: new FormControl(null, [Validators.required]),
        tipo_cpu: new FormControl("", []),
        mac: new FormControl(null, []),
        memoria_ram: new FormControl(null),
        disco_duro: new FormControl(null),
        procesador: new FormControl(null),
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



  public save() {

    let datos: Inventario;

    datos = this.formModalInventario.value;
    // {
    //   marca: this.formModalInventario.controls['marca'].value,
    //   modelo: this.formModalInventario.controls['modelo'].value,
    //   no_serie: this.formModalInventario.controls['no_serie'].value,
    //   tipo_cpu: this.formModalInventario.controls['tipo_cpu'].value,
    //   mac: this.formModalInventario.controls['mac'].value,
    //   disco_duro: this.formModalInventario.controls['disco_duro'].value,
    //   procesador: this.formModalInventario.controls['procesador'].value,
    //   memoria_ram: this.formModalInventario.controls['memoria_ram'].value,
    //   caracteristicas: this.formModalInventario.controls['caracteristicas'].value,
    //   observaciones: this.formModalInventario.controls['observaciones'].value,
    //   estado: this.formModalInventario.controls['estado'].value,
    //   cat_hardware_id: this.formModalInventario.controls['cat_hardware_id'].value,
    // };

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

  public mostrarCampo(campo: string): boolean {
    const tipo = Number(
      this.formModalInventario?.get('cat_hardware_id')?.value
    );
    if (!tipo) {
      return false;
    }
    return this.hardwareFields[tipo]?.includes(campo);
  }

  private configurarCamposDinamicos(): void {

    this.formModalInventario
      .get('cat_hardware_id')
      ?.valueChanges
      .subscribe((tipo: number) => {
        const campos = [
          'tipo_cpu',
          'mac',
          'memoria_ram',
          'disco_duro',
          'procesador'
        ];
        campos.forEach(campo => {
          const control = this.formModalInventario.get(campo);
          control?.clearValidators();
          if (
            this.hardwareFields[tipo] &&
            this.hardwareFields[tipo].includes(campo)
          ) {
            control?.setValidators([Validators.required]);
          }
          control?.updateValueAndValidity();
        });
      });
  }

}
