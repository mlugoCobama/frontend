import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup,FormGroupName, Validators } from '@angular/forms';
import { UcoipService } from 'src/app/core/services/ucoip/ucoip.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
export interface AuditoriaDetalle {
  id?: number;
  tipo: 'hardware' | 'sistema' | 'recurso_red' | 'licenciamiento' | 'tokens';
  referencia_id?: number | null;
  resultado: string;
  datos?: any;
  observaciones?: string | null;
}

export interface Auditoria {
  ucoip_id: number;
  fecha_inicio: string;
  fecha_fin?: string;
  observaciones?: string;
  detalles: AuditoriaDetalle[];
}

@Component({
  selector: 'app-auditoria-ucoip',
  templateUrl: './auditoria-ucoip.component.html',
  styleUrl: './auditoria-ucoip.component.css'
})
export class AuditoriaUcoipComponent implements OnInit {

  @Input() allUcoip:any;
  form!: FormGroup;
  @Output() guardadoExitoso = new EventEmitter<any>();

constructor(
  private fb: FormBuilder,
  private ucoipService: UcoipService,
  private alertasService: SwalComprsServiceService
) {}

ngOnInit(): void {

  this.form = this.fb.group({
    ucoip_id: [null, Validators.required],

    fecha_inicio: [
      new Date(),
      Validators.required
    ],
    fecha_fin: [null],
    observaciones: [''],
    activos: this.fb.array([]),
    sistemas: this.fb.array([]),
    recursosRed: this.fb.array([]),
    licenciamientos: this.fb.array([]),
    encontrados: this.fb.array([]),
    tokens: this.fb.array([])
  });

  this.cargarUsuario(this.allUcoip);
}

get activos(): FormArray {
  return this.form.get('activos') as FormArray;
}

get sistemas(): FormArray {
  return this.form.get('sistemas') as FormArray;
}

get tokens(): FormArray {
  return this.form.get('tokens') as FormArray;
}

get recursosRed(): FormArray {
  return this.form.get('recursosRed') as FormArray;
}

get licenciamientos(): FormArray {
  return this.form.get('licenciamientos') as FormArray;

}


get encontrados(): FormArray {
  return this.form.get('encontrados') as FormArray;
}

cargarUsuario(usuario: any): void {
  this.form.patchValue({
    ucoip_id: usuario.id
  });
  this.limpiarFormArrays();
  usuario.activos?.forEach((activo: any) => {
    this.activos.push(
      this.crearActivoForm(activo)
    );
  });
  usuario.sistemas?.forEach((sistema: any) => {
    this.sistemas.push(
      this.crearSistemaForm(sistema)
    );
  });

  usuario.recursos_red?.forEach((recurso: any) => {
    this.recursosRed.push(
      this.crearRecursoForm(recurso)
    );
  });

  usuario.licenciamientos?.forEach((licencia: any) => {
    this.licenciamientos.push(
      this.crearLicenciaForm(licencia)
    );
  });

  usuario.tokens?.forEach((token: any) => {
    this.tokens.push(
      this.crearTokenForm(token)
    );
  });
}

private crearActivoForm(activo: any): FormGroup {

  return this.fb.group({

    referencia_id: [activo.id,Validators.required],
    resultado: ['correcto',Validators.required],

    observaciones: [''],
    datos: this.fb.group({
      hardware_id: [activo.hardware?.id],
      no_inventario: [activo.hardware?.no_inventario],
      no_serie: [activo.hardware?.no_serie],
      tipo: [activo.hardware?.tipo_hardware?.tipo],
      marca: [activo.hardware?.marca],
      modelo: [activo.hardware?.modelo]
    })
  });
}

private crearSistemaForm(sistema: any): FormGroup {

  return this.fb.group({
    referencia_id: [sistema.id,Validators.required],
    resultado: ['correcto',Validators.required],
    observaciones: [''],
    datos: this.fb.group({
      sistema_id: [sistema.sistema?.id],
      nombre: [sistema.sistema?.nombre],
      username: [sistema.username]
    })
  });
}

private crearRecursoForm(recurso: any): FormGroup {

  return this.fb.group({
    referencia_id: [recurso.id,Validators.required],
    resultado: ['correcto',Validators.required],
    observaciones: [''],
    datos: this.fb.group({
      recurso_id: [recurso.recurso_red?.id],
      nombre: [recurso.recurso_red?.nombre],
      tipo: [recurso.recurso_red?.tipo],
      valor: [recurso.valor]
    })
  });

}

private crearLicenciaForm(licencia: any): FormGroup {

  return this.fb.group({
    referencia_id: [licencia.id,Validators.required],
    resultado: ['correcto',Validators.required],
    observaciones: [''],
    datos: this.fb.group({
      licencia_id: [licencia.licencia?.id],
      version: [licencia.licencia?.version],
      licencia: [licencia.licencia?.licencia]
    })

  });

}

private crearTokenForm(token: any): FormGroup {

  return this.fb.group({

    referencia_id: [token.id,Validators.required],
    resultado: ['correcto',Validators.required],
    observaciones: [''],
    datos: this.fb.group({
      token_id: [token.token?.id],
      nombre_token: [token.token?.token],
    })

  });

}

private limpiarFormArrays(): void {

  this.activos.clear();
  this.sistemas.clear();
  this.recursosRed.clear();
  this.licenciamientos.clear();
  this.encontrados.clear();

}

agregarEncontrado(): void {
  this.encontrados.push(
    this.fb.group({
      tipo: ['hardware',Validators.required],
      resultado: ['no_asignado',Validators.required],
      datos: this.fb.group({
        tipo_hardware: [''],
        no_inventario: [''],
        no_serie: [''],
        marca: [''],
        modelo: ['']
      }),
      observaciones: ['']
    })
  );
}
cargando: boolean = false;
guardar(): void {
this.cargando = true;
  if (this.form.invalid) {

    this.form.markAllAsTouched();
    this.cargando = false;
    return;
  }

  const value = this.form.value;

  const detalles= [
    ...this.mapDetalles(value.activos,'hardware'),
    ...this.mapDetalles(value.sistemas,'sistema'),
    ...this.mapDetalles(value.recursosRed,'recurso_red'),
    ...this.mapDetalles(value.licenciamientos,'licenciamiento'),
    ...this.mapDetalles(value.tokens,'token')
  ];

  const payload = {
    ucoip_id: value.ucoip_id,
    observaciones: value.observaciones,
    detalles
  };

  this.ucoipService
    .saveAuditoria(payload)
    .subscribe({
      next: response => {
        this.alertasService.mostrarAlerta('Listo', 'Se ha guardado correctamente','success', 'success');
        this.cargando = false;
        this.guardadoExitoso.emit();
      },
      error: error => {
        this.cargando = false;
        this.alertasService.mostrarAlerta('Error ', error ,'error', 'danger');
        console.error(error);
      }
    });

}

private mapDetalles(elementos: any[],tipo: string) {
  return elementos.map(elemento => ({
    tipo,
    referencia_id: elemento.referencia_id ?? null,
    resultado: elemento.resultado,
    datos: elemento.datos ?? null,
    observaciones: elemento.observaciones ?? null
  }));
}
}
