import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CatHardware } from 'src/app/core/models/ucoip/cat-hardware';
import { Inventario } from 'src/app/core/models/ucoip/inventario';
import { AlertErrorService } from 'src/app/core/services/alert-error.service';
import { CatHardwareService } from 'src/app/core/services/ucoip/cat-hardware.service';
import { InventarioService } from 'src/app/core/services/ucoip/inventario.service';
import { EmpresasService } from 'src/app/core/services/ucoip/empresas.service';
import Swal from 'sweetalert2';
import { obtenerPrimerError } from 'src/app/core/helpers/errores-forrmulario';
import { OrdenesCompraService } from 'src/app/core/services/compras/ordenesCompra/ordenes-compra.service';

@Component({
  selector: 'app-modal-inventario',
  templateUrl: './modal-inventario.component.html',
  styleUrls: ['./modal-inventario.component.css']
})
export class ModalInventarioComponent implements OnInit {
  
  tabActiva = 'asignaciones';
  mostrarHistorial = false;
  public tipo: string = '';

  public data: any = [];
  
  public listaDatos: any[] = [];

  public formModalInventario!: FormGroup;

  public dataCatHardware: CatHardware[] = []; 
  public empresas: any[] = []; 
  public mensajeCampoRequerido = 'Este campo es requerido';
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    public formBuilder: FormBuilder,
    public modalRef: BsModalRef,
    public modalService: BsModalService,
    public alertService: AlertErrorService,
    private inventarioService: InventarioService,
    private ordenesCompra: OrdenesCompraService,
  ) {}

  public ngOnInit(): void {
    this.setHardwareFields();
    this.buildFormModal();
    this.configurarCamposDinamicos();

    this.tipo = this.listaDatos[0].tipo;
    this.data = this.listaDatos[0].data;

    if (this.tipo == 'editar') {
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
      'estado_fisico' : this.data.estado_fisico
      });
    } 
  }


  setHardwareFields(){
    this.dataCatHardware.forEach(item => {
        this.hardwareFields[item.id] = item.campos;
    });
  }
  public hardwareFields: { [key: number]: string[] } = {

  };


  private buildFormModal() {
    return new Promise((resolve, reject) => {
      this.formModalInventario = this.formBuilder.group({
        empresa: new FormControl("", [Validators.required]),
        cat_hardware_id: new FormControl("", [Validators.required]),
        marca: new FormControl(null, [Validators.required]),
        modelo: new FormControl(null, [Validators.required]),
        no_serie: new FormControl(null, [Validators.required]),
        estado: new FormControl("", [Validators.required]),
        tipo_cpu: new FormControl("", []),
        mac: new FormControl(null, []),
        memoria_ram: new FormControl(null),
        disco_duro: new FormControl(null),
        procesador: new FormControl(null),
        caracteristicas: new FormControl(null, []),
        observaciones: new FormControl(null, []),
        estado_fisico: new FormControl("", []),
        
        
      });
      resolve(true);
    });
  }

  public cerrarModal(): void {
    this.modalRef.hide();
  }


saving = false;
  public save() {
this.saving = true;
    if (!this.formModalInventario.valid) {
          Swal.fire({
            icon: "warning",
            title: "Error",
            text: "Falta informacion Importante: " + obtenerPrimerError(this.formModalInventario),
          });
          this.formModalInventario.markAllAsTouched();
          this.saving = false;
          return;
        }

    let datos: Inventario;

    datos = this.formModalInventario.value;
    this.inventarioService.save(datos).subscribe((resp) => {
      if (resp.success) {
        this.saving = false
        this.event.emit({ data: true, res: 200 });
        this.alertService.alertError(resp.message, resp.success);
      } else {
        this.saving = false
        this.event.emit({ data: false, res: 200 });
        this.alertService.alertError(resp.message, resp.success);
      }
    });

    // this.event.emit({ data: true, res: 200 });
  }

  public update() {
  this.saving = true;
    if (!this.formModalInventario.valid) {
          Swal.fire({
            icon: "warning",
            title: "Error",
            text: "Falta informacion Importante: " + obtenerPrimerError(this.formModalInventario),
          });
          this.formModalInventario.markAllAsTouched();
          this.saving = false;
          return;
        }

    const datos = this.formModalInventario.value;

    this.inventarioService.update(datos, this.data.id).subscribe((resp) => {
      if (resp.success) {
        this.saving = false
        this.event.emit({ data: true, res: 200 });
        this.alertService.alertError(resp.message, resp.success);
      } else {
        this.saving = false
        this.event.emit({ data: false, res: 200 });
        this.alertService.alertError(resp.message, resp.success);
      }
    });
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

  public openModalOC(item:any) {
  this.ordenesCompra.pdfOrdenCompra(item.detalle?.solicitudes_compra_id).subscribe(
    (response) => {
      const blob = new Blob([response.body!], { type: "application/pdf" });
      //  console.log(response.headers)
      const fileName = response.headers.get('X-Filename') || 'orden_compra.pdf';

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    },
    (error) => {
      console.log(error);
    }
  );

}
}