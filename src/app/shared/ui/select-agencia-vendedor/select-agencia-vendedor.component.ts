import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';
import { ComisionesService } from 'src/app/core/services/nissan/comisiones.service';
import { PermisosService } from 'src/app/core/services/permisos.service';

@Component({
  selector: 'app-select-agencia-vendedor',
  templateUrl: './select-agencia-vendedor.component.html',
  styleUrl: './select-agencia-vendedor.component.css'
})
export class SelectAgenciaVendedorComponent implements OnInit{
    @Input() empresaActiva:any = '';
    agencias: typeof this.rawAgencias = [];
    vendedores: { value: string; label: string }[] = [{ value: 'todos', label: 'Todos' }];

  constructor(
      private fb: FormBuilder,
      private comisiones: ComisionesService,
      private permisosService: PermisosService,
      private localStorage: LocalStorageServiceService,
      private route: ActivatedRoute
    ) {}
  
  ngOnInit(): void {
    this.buildForm();
    
    this.agencias = this.filtrarAgencias(this.empresaActiva);
    this.watchAgencia();
    this.formulario.patchValue({ agencia: this.getEmpresaUsuario().intercompania });
  }

  buildForm(): void {

    this.formulario = this.fb.group(
      {
        agencia: ["", [Validators.required]],

        com_vendedores_id:["", [Validators.required]],
      }
    );
  }
    
  formulario: FormGroup;

  rawAgencias = [
    { value: 'todos', name: 'Todas',                permiso: 'view select agencias all' },
    { value: '710',   name: 'Nissan Universidad',   permiso: 'view select agencias nu'  },
    { value: '730',   name: 'Nissan Azcapotzalco',  permiso: 'view select agencias na'  },
    { value: '714',   name: 'Nissan Campestre',     permiso: 'view select agencias nc'  },
    { value: '1',     name: 'Renault Azcapotzalco', permiso: 'view select agencias ra'  },
    { value: '2',     name: 'Renault Ecatepec',     permiso: 'view select agencias re'  },
    { value: '3',     name: 'Renault Vallejo',      permiso: 'view select agencias rv'  },
    { value: '4',     name: 'Renault Pachuca',      permiso: 'view select agencias rp'  },
  ];

  getValues(){
    return this.formulario.value;
  }

  getEmpresaUsuario() {
    const usuarioActual = this.localStorage.getItem('currentUser');
    const intercompania = usuarioActual['usuarioActivo'][0].intercompania;
    const nombreEmpresa = usuarioActual['usuarioActivo'][0].empresa ?? 'No especificada';
    return { intercompania, nombreEmpresa };
  } 

   tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }

  filtrarAgencias(cadena: string) {
    const filtro = cadena.toLowerCase();
    console.log(filtro)
    let resultado = [];

    if (filtro === 'nissan') {
      resultado = this.rawAgencias.filter(a => a.name.toLowerCase().includes('nissan'));
    } else if (filtro === 'lille' || filtro === 'renault') {
      resultado = this.rawAgencias.filter(a => a.name.toLowerCase().includes('renault'));
    } else {
      resultado = this.rawAgencias;
    }

    const todas = this.rawAgencias.find(a => a.value === 'todos');
    return [todas, ...resultado.filter(a => a.value !== 'todos')];
  }

  public watchAgencia(): void {
    this.formulario.get('agencia')?.valueChanges.subscribe(value => {
      if (value === 'todos' || !value) {
        this.vendedores = [{ value: 'todos', label: 'Todos' }];
        return;
      }

      this.vendedores = [{ value: '', label: 'Cargando vendedores...' }];
      this.comisiones.getVendedoresAgencia(value).subscribe({
        next: (data) => {
          this.vendedores = [
            // { value: 'todos', label: 'Todos' },
            ...data.data.map((v: any) => ({ value: v.id, label: `${v.nro_vendedor_as}-${v.nombre}-${v.clave}` }))
          ];
        },
        error: () => {
          this.vendedores = [{ value: '', label: 'Error al cargar vendedores' }];
        }
      });
    });

    console.log(this.vendedores)
  }

}
