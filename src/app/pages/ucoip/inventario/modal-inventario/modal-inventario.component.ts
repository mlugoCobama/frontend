import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CatHardware } from 'src/app/core/models/ucoip/cat-hardware';
import { Inventario } from 'src/app/core/models/ucoip/inventario';
import { AlertErrorService } from 'src/app/core/services/alert-error.service';
import { InventarioService } from 'src/app/core/services/ucoip/inventario.service';
import { obtenerPrimerError } from 'src/app/core/helpers/errores-forrmulario';
import { OrdenesCompraService } from 'src/app/core/services/compras/ordenesCompra/ordenes-compra.service';
import { CatSoftwareService } from 'src/app/core/services/ucoip/cat-software.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-inventario',
  templateUrl: './modal-inventario.component.html',
  styleUrls: ['./modal-inventario.component.css']
})
export class ModalInventarioComponent implements OnInit {
  private empresaSub?: Subscription;
  private tipoSub?: Subscription;

  tabActiva = 'asignaciones';
  mostrarHistorial = false;
  public tipo: string = '';

  public data: any = [];

  public listaDatos: any[] = [];
  licenciasSO:any[] = [];
  licenciasOffice:any[] = [];

  public formModalInventario!: FormGroup;
  public checklistCatalogo:any[] = [];

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
    private software: CatSoftwareService,
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

      this.obtenerLicenciasSO(this.data.id_empresa);
      this.obtenerLicenciasOffice(this.data.id_empresa);

    }

   this.empresaSub  = this.formModalInventario.get('empresa')?.valueChanges.subscribe(idEmpresa=>{
        this.obtenerLicenciasSO(idEmpresa);
        this.obtenerLicenciasOffice(idEmpresa);
    });
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
        no_serie: new FormControl(null),
        estado: new FormControl("", [Validators.required]),
        tipo_cpu: new FormControl("", []),
        mac: new FormControl(null, []),
        memoria_ram: new FormControl(null),
        disco_duro: new FormControl(null),
        procesador: new FormControl(null),
        licencia_so_id: new FormControl(""),
        licencia_office_id: new FormControl(""),
        caracteristicas: new FormControl(null, []),
        observaciones: new FormControl(null, []),
        estado_fisico: new FormControl("", []),
      });
      resolve(true);
    });
  }

  public cerrarModal(): void {
    this.empresaSub?.unsubscribe();
    this.tipoSub?.unsubscribe();
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
        Swal.fire({
            icon: "success",
            title: "Listo!",
            text: "Registro guardado correctamente",
          });
      } else {
        this.saving = false
        // this.event.emit({ data: false, res: 200 });
        Swal.fire({
            icon: "error",
            title: "Ocurrio un error!",
            text: resp.message,
          });
      }
    },(error) => {
      console.error("Error en la petición:", error);
      this.saving = false;
      // this.event.emit({ data: false, res: 500 });
      Swal.fire({
        icon: "error",
        title: "Error",
        text: 'Error: '+error,
      });
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
        Swal.fire({
            icon: "success",
            title: "Listo!",
            text: "Registro actualizado correctamente",
          });
      } else {
        this.saving = false
        this.event.emit({ data: false, res: 200 });
        Swal.fire({
              icon: "error",
              title: "Ocurrio un error!",
              text: resp.message,
            });
      }
    },(error) => {
      console.error("Error en la petición:", error);
      this.saving = false;
      // this.event.emit({ data: false, res: 500 });
      Swal.fire({
        icon: "error",
        title: "Error",
        text: 'Error: '+error,
      });
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
   this.tipoSub = this.formModalInventario.get('cat_hardware_id')?.valueChanges.subscribe((tipo: number) => {
        const campos = [
          'tipo_cpu','mac','memoria_ram','disco_duro',
          'procesador','licencia_so_id','licencia_office_id'
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

obtenerLicenciasSO(idEmpresa:number){
    this.software.getLicenciasDiponiblesByTipo(idEmpresa, 1)
        .subscribe(resp=>{
            this.licenciasSO = resp.data;
        });
}

obtenerLicenciasOffice(idEmpresa:number){
    this.software.getLicenciasDiponiblesByTipo(idEmpresa, 2)
        .subscribe(resp=>{
            this.licenciasOffice = resp.data;
        });
}


async nuevaLicencia(tipo:'windows'|'office'){

    const titulo = tipo == 'windows' ? 'Nueva licencia de SO' : 'Nueva licencia de Office';
    const cat_software_id = tipo == 'windows' ? 1 : 2;

    const {value} = await Swal.fire({
        title: titulo,
        html:`
          <div class="row">
              <div class="col-12">
                <input id="version" class="form-control form-control-sm m-1" placeholder="Versión">
                <input id="licencia" class="form-control form-control-sm  m-1" placeholder="Licencia">
              </div>
          </div>
        `,
        position: 'top',
        reverseButtons: true,
        showCancelButton:true,
        confirmButtonText:' <i class="fas fa-save"> </i> Guardar',
        cancelButtonText:' <i class="fas fa-window-close"> </i> Cancelar',
        focusConfirm:false,
        buttonsStyling: false,
        customClass: {
          confirmButton: 'btn btn-sm btn-primary m-1',
          cancelButton: 'btn btn-sm btn-secondary m-1'
        },
        preConfirm:()=>{
            const version = (<HTMLInputElement>document.getElementById('version')).value;
            const licencia = (<HTMLInputElement>document.getElementById('licencia')).value;
            if(!version || !licencia){
                Swal.showValidationMessage("Todos los campos son obligatorios");
                return;
            }
            return{
                empresa:this.formModalInventario.get('empresa')?.value,
                cat_software_id : cat_software_id,
                version: version,
                licencia : licencia
            };
        }
    });
    if(!value){
        return;
    }

    this.software.save(value)
        .subscribe(resp=>{
            if(resp.status == 'success'){
                if(tipo == 'windows'){
                    this.licenciasSO.push(resp.data);
                    this.formModalInventario.patchValue({
                        licencia_so_id:resp.data.id
                    });
                }else{
                    this.licenciasOffice.push(resp.data);
                    this.formModalInventario.patchValue({
                        licencia_office_id:resp.data.id
                    });
                }
                Swal.fire({
                    icon:'success',
                    title:'Licencia registrada',
                    timer:1200,
                    showConfirmButton:false
                });
            }
        });
}

// Método para alternar el estado del input
toggleCampoNoSerie(event: Event): void {
  const check = (event.target as HTMLInputElement).checked;
  const control = this.formModalInventario.get('no_serie');

  if (!control) return;

  if (check) {
    control.enable();
  } else {
    control.disable();
    control.setValue('');
  }
}
}
