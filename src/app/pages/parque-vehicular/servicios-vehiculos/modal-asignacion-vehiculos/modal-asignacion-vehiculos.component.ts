import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, of } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
// import { CatalogosService } from './services/catalogos.service';
// import { Empresa, Vehiculo, Proveedor } from './models/form.model';
import { UsuariosService } from 'src/app/core/services/compras/usuarios.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { ProveedoresService } from 'src/app/core/services/compras/proveedores/proveedores.service';
import { UnidadesService } from 'src/app/core/services/compras/unidades.service';
import { ProveedoresVehiculosService } from 'src/app/core/services/parque-vehicular/proveedores-vehiculos.service';

@Component({
  selector: 'app-modal-asignacion-vehiculos',
  templateUrl: './modal-asignacion-vehiculos.component.html',
  styleUrl: './modal-asignacion-vehiculos.component.css'
})
export class ModalAsignacionVehiculosComponent implements OnInit, OnDestroy {
  form!: FormGroup;

  empresas: any[] = [];
  vehiculos: any[] = [];
  proveedores: any[] = [];

  loadingEmpresas = false;
  loadingVehiculos = false;
  loadingProveedores = false;
  cargando: boolean = false;

  private destroy$ = new Subject<void>();
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    public proveedoresService: ProveedoresService,
    public bsModalRef: BsModalRef,
    public usuariosService: UsuariosService,
    private unidades: UnidadesService,
    private alertasService: SwalComprsServiceService,
    private proveedoresVehiculos: ProveedoresVehiculosService
  ) {}

  ngOnInit(): void {
    this.initForm();
    // this.cargarCatalogosIniciales();
    this.escucharCambioEmpresa();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public deshabilitado: boolean = false;

  public cerrarModal(): void {
      this.deshabilitado = false;
    this.bsModalRef.hide();
  }

  private initForm(): void {
    this.form = this.fb.group({
      empresaId: ['', Validators.required],
      vehiculoId: [{ value: '', disabled: true }, Validators.required],
      // proveedorId: ['', Validators.required],
      descripcion_falla: ['', Validators.required], // Campo opcional
      observaciones: [''] // Campo opcional
    });
  }

  private cargarCatalogosIniciales(): void {
    // Cargar Empresas
    this.loadingEmpresas = true;

    this.usuariosService.getEmpresas().subscribe(
      (response) => {
        if (response) {
          const rawData = response.data;
          this.empresas = this.usuariosService.filtrarEmpresasGseras(rawData, [200, 119, 201, 700, 333, 119, 200 ]);
          // this.getUsuarioActivo();
          this.loadingEmpresas = false;
        } else {
          this.loadingEmpresas = false;
          this.alertasService.mostrarAlerta(
            "Error",response.message,
            "error","danger"
          );
        }
      },
      (error) => {
        this.loadingEmpresas = false;
        this.alertasService.mostrarAlerta(
          "Error",`Error fetching data: ${error}`,
          "error","danger"
        );
      }
    );

    this.loadingProveedores = true;
    this.proveedoresService.getProveedores().subscribe(
      (response) => {
        if (response) {
          this.proveedores = response.data;
          console.log(this.proveedores)
          this.loadingProveedores = false;
        } else {
          this.loadingProveedores = false;
          this.alertasService.mostrarAlerta(
            "Error!", response.message,
            "error","danger"
          );
        }
      },
      (error) => {
        this.loadingProveedores = false;
        this.alertasService.mostrarAlerta("Error!", error, "error", "danger");
      }
    );
  }

  private escucharCambioEmpresa(): void {

     this.form.get('empresaId')?.valueChanges.pipe(
       tap((empresaId) => {
         //Al cambiar de empresa se reinicia y deshabilita el select de vehículos
         const vehiculoCtrl = this.form.get('vehiculoId');
         vehiculoCtrl?.setValue('');
         vehiculoCtrl?.disable();
         this.vehiculos = [];
         if (empresaId) {
           this.loadingVehiculos = true;
         }
       }),
       switchMap((empresaId) => {
         if (!empresaId) return of([]);
          return this.unidades.getVehiculos(Number(empresaId));
       }),
       takeUntil(this.destroy$)
      ).subscribe({
       next: (vehiculos) => {
         this.vehiculos = vehiculos.data;
         this.loadingVehiculos = false;
         const vehiculoCtrl = this.form.get('vehiculoId');
         if (vehiculos.data.length > 0) {
           vehiculoCtrl?.enable();
         }
       },
       error: () => this.loadingVehiculos = false
     });
  }

  // Helper para validación visual de errores
  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public getValuesForm(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    return this.form.getRawValue();
  }

  guardar(): void {
    this.cargando = true;
     if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alertasService.mostrarAlerta('Error',  'Llena correctamente el formulario', 'warning', 'danger');
      this.cargando = false;
      return;
    }

    const formData = this.form.getRawValue();
    this.proveedoresVehiculos.store(formData).subscribe(
      (response) => {
        if (response.status == 'success') {
          this.alertasService.mostrarAlerta('Listo',  response.message, 'success', 'success')
          this.cerrarModal();
          this.cargando = false;
          this.event.emit();
        } else {
          this.cargando = false;
          this.alertasService.mostrarAlerta(
            "Error!", response.message,
            "error","danger"
          );
        }
      },
      (error) => {
        this.cargando = false;
        this.alertasService.mostrarAlerta("Error!", error, "error", "danger");
      }
    );


    // `getRawValue()` permite obtener los valores incluso si un control estuviera deshabilitado

    // console.log('Datos enviados:', formData);
    // alert('Formulario guardado correctamente');
  }
}
