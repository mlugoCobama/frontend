import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ComisionesService } from 'src/app/core/services/nissan/comisiones.service';
import { PermisosService } from 'src/app/core/services/permisos.service';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';
import { ActivatedRoute } from '@angular/router';


export interface FiltroConfig {
  showAgencia?:   boolean;
  showTipoVenta?: boolean;
  showVendedor?:  boolean;
  showEstado?:    boolean;
  showFechas?:    boolean;
}

export interface EstadoOption {
  value: string | number;
  label: string;
}

export interface FiltroValues {
  agencia?:      string;
  tipoVenta?:    string;
  fechaInicial?: string;
  fechaFinal?:   string;
  vendedor?:     string;
  estado?:       string | number;
}


@Component({
  selector: 'app-filtro-comsiones-generico',
  templateUrl: './filtro-comsiones-generico.component.html',
  styleUrl: './filtro-comsiones-generico.component.css'
})
export class FiltroComsionesGenericoComponent implements OnInit, OnChanges {


  /** Objeto de configuración — controla visibilidad de cada campo */
  @Input() config: FiltroConfig = {};
  /** Booleanos individuales — alternativa o complemento al objeto config */
  @Input() showAgencia?:   boolean;
  @Input() showTipoVenta?: boolean;
  @Input() showVendedor?:  boolean;
  @Input() showEstado?:    boolean;
  @Input() showFechas?:    boolean;

  @Input() defaultEstado:   string | number = '';
  @Input() defaultVendedor: string          = '';
  @Input() defaultAgencia:  string          = '';
  @Input() defaultTipoVenta: string         = '';

  /** Opciones dinámicas para el select de Estado (las provee el padre) */
  @Input() estadoOpciones: EstadoOption[] = [];
  /** El padre informa si hay datos (para mostrar/ocultar botón descargar) */
  @Input() hasData: boolean = false;
  /** El padre informa si está descargando */
  @Input() downloading: boolean = false;
  /** El padre activa/desactiva el spinner del botón buscar */
  @Input() searching: boolean = false;
  /** Emite los valores del formulario — el padre ejecuta la búsqueda */
  @Output() buscar = new EventEmitter<FiltroValues>();
  /** Emite los valores del formulario — el padre ejecuta la descarga */
  @Output() descargar = new EventEmitter<FiltroValues>();
  /** Emite true/false cada vez que cambia la validez del formulario */
  @Output() formValidChange = new EventEmitter<boolean>();
  /** Emite cuando el padre pide limpiar el formulario externamente */
  @Output() resetted = new EventEmitter<void>();


  public hoy = new Date().toISOString().split('T')[0];
  formulario: FormGroup;
  vendedores: { value: string; label: string }[] = [{ value: 'todos', label: 'Todos' }];

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

  agencias: typeof this.rawAgencias = [];

  constructor(
    private fb: FormBuilder,
    private comisiones: ComisionesService,
    private permisosService: PermisosService,
    private localStorage: LocalStorageServiceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.mergeConfig();
    this.buildForm();
    this.agencias = this.filtrarAgencias(this.getEmpresaActiva());
    this.formulario.patchValue({ agencia: this.getEmpresaUsuario().intercompania });
  }

  /**
   * Si el padre actualiza el config o los booleanos individuales en tiempo de
   * ejecución, re-sincronizamos la configuración efectiva.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.formulario) return;

    const camposConfig = ['showAgencia','showTipoVenta','showVendedor','showEstado','showFechas'];
    const afectado = camposConfig.some(k => changes[k] || changes['config']);
    if (afectado) {
      this.mergeConfig();
      this.syncValidators();
    }

    if (changes['defaultEstado'] && !this.formulario.get('estado')?.value) {
    this.formulario.patchValue({ estado: this.defaultEstado });
    }
    if (changes['defaultVendedor'] && !this.formulario.get('vendedor')?.value) {
      this.formulario.patchValue({ vendedor: this.defaultVendedor });
    }
    if (changes['defaultAgencia'] && !this.formulario.get('agencia')?.value) {
      this.formulario.patchValue({ agencia: this.defaultAgencia });
    }
    if (changes['defaultTipoVenta'] && !this.formulario.get('tipoVenta')?.value) {
      this.formulario.patchValue({ tipoVenta: this.defaultTipoVenta });
    }
  }


  /**
   * Fusiona el objeto config con los booleanos individuales.
   * El booleano individual tiene prioridad sobre el objeto config.
   * Si ninguno está definido, el campo es visible por defecto.
   */
  private mergeConfig(): void {
    const defaults: Required<FiltroConfig> = {
      showAgencia:   true,
      showTipoVenta: true,
      showVendedor:  true,
      showEstado:    false,
      showFechas:    true,
    };

    this.config = {
      showAgencia:   this.showAgencia   ?? this.config.showAgencia   ?? defaults.showAgencia,
      showTipoVenta: this.showTipoVenta ?? this.config.showTipoVenta ?? defaults.showTipoVenta,
      showVendedor:  this.showVendedor  ?? this.config.showVendedor  ?? defaults.showVendedor,
      showEstado:    this.showEstado    ?? this.config.showEstado    ?? defaults.showEstado,
      showFechas:    this.showFechas    ?? this.config.showFechas    ?? defaults.showFechas,
    };
  }


  buildForm(): void {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - 15);
    const haceDosSemanas = fecha.toISOString().split('T')[0];

    this.formulario = this.fb.group(
      {
        agencia:      [this.defaultAgencia   || '', []],
        tipoVenta:    [this.defaultTipoVenta || '', []],
        fechaInicial: [haceDosSemanas, []],
        fechaFinal:   [this.hoy, []],
        vendedor:     [this.defaultVendedor, []],
        estado:       [this.defaultEstado, []],
      },
      { validators: this.fechaValidator }
    );

    this.syncValidators();
    this.watchAgencia();
    this.watchFormValidity();
  }

  /**
   * Activa o desactiva validadores según la configuración efectiva.
   * Permite reutilizar buildForm sin duplicar lógica.
   */
  private syncValidators(): void {
    const map: { control: string; visible: boolean }[] = [
      { control: 'agencia',      visible: this.config.showAgencia   },
      { control: 'tipoVenta',    visible: this.config.showTipoVenta },
      { control: 'fechaInicial', visible: this.config.showFechas    },
      { control: 'fechaFinal',   visible: this.config.showFechas    },
      { control: 'vendedor',     visible: this.config.showVendedor  },
      { control: 'estado',       visible: this.config.showEstado    },
    ];

    map.forEach(({ control, visible }) => {
      const ctrl = this.formulario.get(control);
      if (visible) {
        ctrl?.setValidators(Validators.required);
      } else {
        ctrl?.clearValidators();
        // ctrl?.reset('');
      }
      ctrl?.updateValueAndValidity({ emitEvent: false });
    });
  }

  /** Carga vendedores cuando cambia la agencia seleccionada */
  private watchAgencia(): void {
    this.formulario.get('agencia')?.valueChanges.subscribe(value => {
      if (!this.config.showVendedor) return;

      if (value === 'todos' || !value) {
        this.vendedores = [{ value: 'todos', label: 'Todos' }];
        return;
      }

      this.vendedores = [{ value: '', label: 'Cargando vendedores...' }];
      this.comisiones.getVendedoresAgencia(value).subscribe({
        next: (data) => {
          this.vendedores = [
            { value: 'todos', label: 'Todos' },
            ...data.data.map((v: any) => ({ value: v.id, label: `${v.nro_vendedor_as}-${v.nombre}-${v.clave}` }))
          ];
        },
        error: () => {
          this.vendedores = [{ value: '', label: 'Error al cargar vendedores' }];
        }
      });
    });
  }

  /** Emite la validez del formulario cada vez que cambia */
  private watchFormValidity(): void {
    this.formulario.statusChanges.subscribe(status => {
      this.formValidChange.emit(status === 'VALID');
    });
  }

  get form() {
    return this.formulario.controls;
  }

  fechaValidator(control: AbstractControl): ValidationErrors | null {
    const fechaInicial = control.get('fechaInicial')?.value;
    const fechaFinal   = control.get('fechaFinal')?.value;
    if (fechaInicial && fechaFinal && fechaInicial > fechaFinal) {
      return { fechaInvalida: true };
    }
    return null;
  }


  buscarDatos(): void {
    if (!this.formulario.valid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.buscar.emit(this.getFormValues());
  }

  descargarConcentrado(): void {
    this.descargar.emit(this.getFormValues());
  }

  /** Limpia el formulario y notifica al padre */
  resetForm(): void {
    this.formulario.reset({
      agencia:      this.defaultAgencia   || '',
      tipoVenta:    this.defaultTipoVenta || '',
      fechaInicial: (() => {
        const f = new Date(); f.setDate(f.getDate() - 15);
        return f.toISOString().split('T')[0];
      })(),
      fechaFinal:   this.hoy,
      vendedor:     this.defaultVendedor || '',
      estado:       this.defaultEstado    ||'',
    });
    this.formulario.markAsUntouched();
    this.vendedores = [{ value: 'todos', label: 'Todos' }];
    this.resetted.emit();
  }

  /** Incluye campos deshabilitados para que el padre reciba todo */
  private getFormValues(): FiltroValues {
    return this.formulario.getRawValue();
  }


  tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }

  filtrarAgencias(cadena: string) {
    const filtro = cadena.toLowerCase();
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

  getEmpresaActiva(): string {
    return this.route.parent?.snapshot.url[0]?.path || '';
  }

  getValues(){
    return this.formulario.value;
  }

  getEmpresaUsuario() {
    const usuarioActual = this.localStorage.getItem('currentUser');
    const intercompania = usuarioActual['usuarioActivo'][0].intercompania;
    const nombreEmpresa = usuarioActual['usuarioActivo'][0].empresa ?? 'No especificada';
    return { intercompania, nombreEmpresa };
  }  
}