import { Component, Input, OnInit , Output, EventEmitter} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { ComisionesService } from 'src/app/core/services/nissan/comisiones.service';
import { PermisosService } from 'src/app/core/services/permisos.service';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrl: './filtro.component.css'
})
export class FiltroComponent implements OnInit{

  public finding : boolean = false;

  public data:any = [];

  public hoy = new Date().toISOString().split("T")[0];
  
  formulario: FormGroup;

  public estado: any = 0;

  vendedores: { value: string, label: string }[] = [{ value: 'todos', label: 'Todos' }];



   @Output() bindingSpiner = new EventEmitter<boolean>();
   @Output() bindingData = new EventEmitter<any>();
   @Output() bindingEstado = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private alertas: SwalComprsServiceService,
    private comisiones:  ComisionesService,
    private permisosService:PermisosService,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.estado = this.asignarEstado()
  }

  buildForm(){
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - 15);
    const haceDosSemanas = fecha.toISOString().split("T")[0];

    this.formulario = this.fb.group({
      agencia: ['', Validators.required],
      tipoVenta: ['', Validators.required],
      fechaInicial: [haceDosSemanas, Validators.required],
      fechaFinal: [this.hoy, Validators.required],
      vendedor: ['', Validators.required],
      },
      { validators: this.fechaValidator }
    );

    this.formulario.get('agencia')?.valueChanges.subscribe(value => {
    if (value === 'todos' || !value) {
      // Si selecciona "todos" o vacío, solo deja esa opción
      this.vendedores = [{ value: 'todos', label: 'Todos' }];
      return;
    }

    // Mostrar opción de "cargando"
    this.vendedores = [{ value: '', label: 'Cargando vendedores...' }];

    this.comisiones.getVendedoresAgencia(value).subscribe({
      next: (data) => {
        this.vendedores = [
          { value: 'todos', label: 'Todos' },
          ...data.data.map((v: any) => ({ value: v.id, label: `${v.nombre}-${v.clave}` }))
        ];
        console.log(this.vendedores)
      },
      error: () => {
        this.vendedores = [{ value: '', label: 'Error al cargar vendedores' }];
      }
    });
  });



  }

asignarEstado() {
  const permisos = [
    { key: 'view comisiones cxc access', value: 1 },
    { key: 'view comisiones gv access', value: 2 },
    { key: 'view comisiones conta access', value: 3 },
    { key: 'view comisiones rh access', value: 4 },
    { key: 'view comisiones pagados access', value: 5 },
    { key: 'view comisiones all access', value: 12345 }
  ];

  const encontrado = permisos.find(p => this.tienePermiso(p.key));
  return encontrado?.value ?? 0;
}




  
  // Getter para acceder a los controles
  get form() {
    return this.formulario.controls;
  }

  fechaValidator(control: AbstractControl): ValidationErrors | null {
    const fechaInicial = control.get('fechaInicial')?.value;
    const fechaFinal = control.get('fechaFinal')?.value;
    if (fechaInicial && fechaFinal && fechaInicial > fechaFinal) {
      return { fechaInvalida: true };
    }
    return null;
  }

  buscarDatos(){
    this.finding = true;
    this.bindingSpiner.emit(true);
    if(!this.formulario.valid){
      this.alertas.mostrarAlerta('Error', 'Llena correctamente los parametros del filtro', 'info', 'info');
      this.formulario.markAllAsTouched();
      this.finding = false;
      this.bindingSpiner.emit(false);
      return;
    }

    const param = this.formulario.value;

    this.comisiones.getLibroVentas(this.estado ,param.agencia, param.tipoVenta, param.fechaInicial, param.fechaFinal, param.vendedor).subscribe(
      (response:any) => {
        if(response.status == 'success'){
          this.data = response.data;
          this.finding = false;
          const estado = response.estado
          this.bindingSpiner.emit(false);
          this.bindingData.emit(this.data);
          this.bindingEstado.emit(+estado);
        }else{
          this.alertas.mostrarAlerta('Error', 'Algo salio mal en la búsqueda', 'info', 'info');
          this.finding = false;
          this.bindingSpiner.emit(false);
          this.bindingEstado.emit(0);
          return;
        }
      },(error) => {
          this.alertas.mostrarAlerta("Error", `Error fetching data: ${error}`, "error" , "danger" );
          this.finding = false;
          this.bindingEstado.emit(0);
          this.bindingSpiner.emit(false);
          return;
      })
  }

tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }

}
