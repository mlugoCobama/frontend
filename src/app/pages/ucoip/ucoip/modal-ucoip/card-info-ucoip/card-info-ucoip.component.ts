import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AreasDepartamentosService } from 'src/app/core/services/ucoip/areas-departamentos.service';
import { UcoipService } from 'src/app/core/services/ucoip/ucoip.service';
import Swal from 'sweetalert2';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
@Component({
  selector: 'app-card-info-ucoip',
  templateUrl: './card-info-ucoip.component.html',
  styleUrl: './card-info-ucoip.component.css'
})

export class CardInfoUcoipComponent {

  private _ucoip: any;

  @Output() actualizarUcoip = new EventEmitter<any>();
  @Input() data:any;
  @Input() catalogo: any[] = [];
  @Input() areas: any[] = [];
  departamentos: any[] = [];
  puestos: any[] = [];

  @Input() set ucoip(value: any) {
    this._ucoip = value;
      if (value) {
          this.cargarUsuario(value); 
      }
    }

  get ucoip(): any {
    return this._ucoip;
  }

vistaActual: 'info' | 'formulario' = 'info';

  form!: FormGroup;
  infraForm!: FormGroup;

  mostrarPassword = false;
  mostrarPasswordEmail = false;



  constructor(
    private fb: FormBuilder,
    private ucoipService: UcoipService, 
    private  alertasService: SwalComprsServiceService
  ) {
     this.crearFormulario();
  }

  ngOnInit(): void {
   
  }


  crearFormulario(): void {
    this.form = this.fb.group({
      nombre: [null, Validators.required],
      apellidos: [null, Validators.required],
      area_id: [null, Validators.required],
      departamento_id: [null, Validators.required],
      puesto_id: [null, Validators.required],
      password: [''],
      // password_email: [''],
      ucoip: [''],
      // correo: ['', [Validators.email]]
    });
  }




  onAreaChange(): void {
    const areaId = this.form.get('area_id')?.value;
    const area = this.catalogo.find(
      item => item.id == areaId
    );
    this.departamentos = area?.departamentos ?? [];
    this.puestos = [];

    this.form.patchValue({
      departamento_id: null,
      puesto_id: null
    });
  }

  onDepartamentoChange(): void {
    const departamentoId = this.form.get('departamento_id')?.value;
    const departamento = this.departamentos.find(
      item => item.id == departamentoId
    );
    this.puestos = departamento?.puestos ?? [];
    this.form.patchValue({
      puesto_id: null
    });
  }

  public saving: boolean = false;

  guardar(): void {
    this.saving = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alertasService.mostrarAlerta(
             "Listo",
             `Llena correctamente los campos`,
             "warning",
             "warning"
           );
      this.saving = false;
      return;
    }

    const data = {
      idUcoip:(this.ucoip?.id ?? null),
      ...this.data,
      ...this.form.value};

  this.ucoipService.save(data)
      .subscribe({
        next: (resp) => {
         this.alertasService.mostrarAlerta(
             "Listo",
             `Archivo Guardado Correctamente`,
             "success",
             "success"
           );
           this.saving = false;
          this.form.reset();
           this.actualizarUcoip.emit();

        },
        error: (err) => {
          this.saving = false;
          console.log(err);
        }
      });
  }


  cargarUsuario(usuario: any): void {
    // console.log(this.catalogo)
  // Buscar área
  const area = this.catalogo.find(
    item => item.id == usuario.puesto?.departamento?.area?.id
  );

  this.departamentos = area?.departamentos ?? [];
  console.log(this.departamentos)
  // Buscar departamento
  const departamento = this.departamentos.find(
    item => item.id == usuario.puesto?.departamento?.id
  );

  this.puestos = departamento?.puestos ?? [];

  console.log(this.puestos);

  // Llenar formulario
  this.form.patchValue({
    nombre : this.data?.firstname,
    apellidos : this.data?.realname,
    area_id: usuario.puesto?.departamento?.area?.id,
    departamento_id: usuario.puesto?.departamento?.id,
    puesto_id: usuario.puesto?.id,
    // password: usuario.password,
    // password_email: usuario.password_email,
    ucoip: usuario.ucoip,
    // correo: this?.data?.name ?? null
  });

  this.onAreaChange()
  this.form.patchValue({
    departamento_id: usuario.puesto?.departamento?.id,
  });
  this.onDepartamentoChange()
  this.form.patchValue({
    puesto_id: usuario.puesto?.id,
  });
}
  public openPass(){
    this.ucoipService.getPasswordUcoip(this.ucoip.id)
      .subscribe({
        next: (resp) => {
          if(resp.success){
            Swal.fire({
              title: 'Contraseña',
              text: resp.data,
              icon: 'info',
              timer: 15000,          // 30 segundos
              timerProgressBar: true, // muestra barra de progreso
              showConfirmButton: false // oculta el botón de aceptar
            });
          }

        },
        error: (err) => {
          console.log(err);
        }
      });
    

    
  }

}