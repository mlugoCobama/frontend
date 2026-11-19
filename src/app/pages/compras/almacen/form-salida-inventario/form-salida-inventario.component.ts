import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { UsuariosService } from 'src/app/core/services/compras/usuarios.service';
import { PermisosService } from 'src/app/core/services/permisos.service';

@Component({
  selector: 'app-form-salida-inventario',
  templateUrl: './form-salida-inventario.component.html',
  styleUrl: './form-salida-inventario.component.css'
})
export class FormSalidaInventarioComponent implements OnInit {

  @Input() tecnicos: any[] = [];
  @Input() empresas: any[] = [];
  @Input() materiales: any[] = []; // Existencias del almacén
  @Input() isLoad: boolean = false;
  @Input() isLoading: boolean = false;

  @Output() findExistencias =  new EventEmitter();

  submitted = false;

  formulario: FormGroup;

  filtroBusqueda = '';

  materialesFiltrados: any[] = [];

  materialesSeleccionados: any[] = [];

  public tiposSalida = [
    {
      tipo: '1',
      nombre: "Compras Generales",
      permiso: "view option select cg tipo modal salida",
    },
    {
      tipo: '2',
      nombre: "Compras Macrotaller",
      permiso: "view option select mt tipo modal salida",
    },
    {
      tipo: '3',
      nombre: "Recursos Tecnologicos",
      permiso: "view option select rt tipo modal salida",
    },
  ];

  constructor(private fb: FormBuilder,
     private alertasService: SwalComprsServiceService,
     private usuariosService: UsuariosService,
    private permisosService: PermisosService,
    ) {}

  ngOnInit(): void {

    this.formulario = this.fb.group({
      tipoSalida: ['', Validators.required],
      empresa: ['', Validators.required],
      tecnico: ['', Validators.required],
    });

    this.materialesFiltrados = [...this.materiales];
  }

  ngOnChanges(): void {
    this.materialesFiltrados = [...this.materiales];
  }

  get solicitudCompraFormControl() {
    return this.formulario.controls;
  }

  filtrarMateriales(): void {
    const texto = this.filtroBusqueda.trim().toLowerCase();
    if (!texto) {
      this.materialesFiltrados = [...this.materiales];
      return;
    }
    this.materialesFiltrados = this.materiales.filter(item =>
      item.descripcion_planta?.toLowerCase().includes(texto) || item.clave_interna?.toLowerCase().includes(texto)
    );
  }

  agregarMaterial(material: any): void {
    const existe = this.materialesSeleccionados.find(
      x => x.id === material.id
    );

    if (existe) {
      return;
    }

    this.materialesSeleccionados.push({ ...material, cantidad: 1 });

    this.materiales = this.materiales.filter(x => x.id !== material.id);
    this.filtrarMateriales();
  }

  eliminarMaterial(material: any): void {
    this.materialesSeleccionados =
      this.materialesSeleccionados.filter(
        x => x.id !== material.id
      );
      const { cantidad, ...materialOriginal } = material;
    this.materiales.push(materialOriginal);
    this.filtrarMateriales();
  }

  onSubmit(){

    if (this.formulario.invalid) {
      this.alertasService.mostrarAlerta('Algo anda mal', 'Debes de seleccionar un técnico', 'info', 'info');
      this.formulario.markAllAsTouched();
      return;
    }

    if(this.materialesSeleccionados.length == 0){
      this.alertasService.mostrarAlerta('Algo anda mal', 'Aun no haz agregado materiales para asignar', 'info', 'info');
      return;
    }

    const payload = {
     ...this.formulario.value,
      materiales: this.materialesSeleccionados
    };

    return payload ;
  }

 aumentarCantidad(item: any): void {
  if (item.cantidad < item.stock) {
    item.cantidad++;
  }
}

disminuirCantidad(item: any): void {
  if (item.cantidad > 1) {
    item.cantidad--;
  }
}

// Validación al escribir manualmente en el input
validarCantidad(item: any): void {
  if (item.cantidad > item.stock) {
    item.cantidad = item.stock;
  }
  if (item.cantidad < 1 || !item.cantidad) {
    item.cantidad = 1;
  }
}

 cambioSelectEmpresa(value:any){
  const valor = value.target.value;
  const tiposSalida = +this.formulario.get('tipoSalida')?.value;

  const payload = {
    intercompania: valor,
    tipo: tiposSalida
  };

  this.materialesSeleccionados = [];
  switch (tiposSalida) {
    case 1:
        this.getUsuarios(valor);
        this.findExistencias.emit(payload);
      break;
    case 2:
        this.getUsuarios(valor);
        this.findExistencias.emit(payload);
      break;
    case 3:
        this.usuarios = this.tecnicos
        this.findExistencias.emit(payload);
      break;
    default:
      this.alertasService.mostrarAlerta('Error', 'Debes de selccionar un tipo de entrega', 'error', 'danger')
      break;
  }

  this.formulario.patchValue({
    tecnico: '',
  });

 }

  cambioSelectTipo(value:any){
  const valor = value.target.value;
  this.formulario.patchValue({
    tecnico: '',
    empresa: '',
  });
  this.usuarios = [];
 }

 public usuarios:any = [];
 public disabled:boolean = false;
   /**
   * Recupera los usuarios que pertenecen a las empresas (Select usuario)
   * @param intercompania num de intercompania
   */
  public getUsuarios(intercompania: any) {
    this.usuarios = [];
    this.isLoading = false;
    this.disabled = false;
    if (intercompania) {
      this.usuariosService.getUsuariosEmpresas(intercompania).subscribe(
        (response) => {
          if (response) {
            if (response.data.length > 0) {
              this.usuarios = response.data;
              this.isLoading = true;
            } else {
              this.usuarios = [
                { id: 0, firstname: "No hay datos", realname: "", puesto: "" },
              ];
              this.isLoading = true;
              this.disabled = true;
            }
          } else {
            console.log(response.message);
          }
        },
        (error) => {
          console.error("Error fetching data:", error);
        }
      );
    } else {
      this.usuarios = [
        {
          id: 0,
          firstname: " Debes seleccionar una empresa",
          realname: "",
          puesto: "",
        },
      ];
      this.isLoad = true;
      this.disabled = true;
    }
  }

    tienePermiso(permiso: string = ''): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }
}
