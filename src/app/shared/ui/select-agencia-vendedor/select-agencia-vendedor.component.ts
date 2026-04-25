import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, switchMap, tap, takeUntil, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';
import { ComisionesService } from 'src/app/core/services/nissan/comisiones.service';
import { PermisosService } from 'src/app/core/services/permisos.service';
import { permisosVendedoresAgencias } from '../../constants/permisos';
@Component({
  selector: 'app-select-agencia-vendedor',
  templateUrl: './select-agencia-vendedor.component.html',
  styleUrl: './select-agencia-vendedor.component.css'
})
export class SelectAgenciaVendedorComponent implements OnInit, OnDestroy {

  @Input() empresaActiva: any = '';

  formulario!: FormGroup;

  agencias: typeof this.rawAgencias = [];
  vendedores: { value: string; label: string }[] = [{ value: 'todos', label: 'Todos' }];

  private destroy$ = new Subject<void>();
  private vendedorPendiente: string | null = null;
  public permisos = permisosVendedoresAgencias;

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

    this.initAgenciaListener();

    const empresa = this.getEmpresaUsuario();
    this.formulario.patchValue({ agencia: empresa.intercompania });
    if(!this.tienePermiso(this.permisos.selectAgencias)){
      this.formulario.get('agencia')?.disable();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // FORM
  buildForm(): void {
    this.formulario = this.fb.group({
      agencia: ['', [Validators.required]],
      com_vendedores_id: ['', [Validators.required]],
    });
  }

  getValues() {
    return this.formulario.getRawValue();
  }

  // LISTENER REACTIVO
  initAgenciaListener(): void {
    this.formulario.get('agencia')?.valueChanges
      .pipe(
        tap(() => {
          this.vendedores = [{ value: '', label: 'Cargando vendedores...' }];


          this.formulario.patchValue(
            { com_vendedores_id: '' },
            { emitEvent: false }
          );
        }),
        switchMap(value => {
          if (!value || value === 'todos') {
            this.vendedores = [{ value: 'todos', label: 'Todos' }];
            return of(null);
          }

          return this.comisiones.getVendedoresAgencia(value);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((res: any) => {
        if (!res?.data) return;

        this.vendedores = res.data.map((v: any) => ({
          value: v.id,
          label: `${v.nombre} - ${v.clave} - ${v.nro_vendedor_as}`
        }));

        if (this.vendedorPendiente) {
          this.formulario.patchValue(
            { com_vendedores_id: this.vendedorPendiente },
            { emitEvent: false }
          );
          this.vendedorPendiente = null;
        }
      });
  }

  // SET VALORES EXTERNOS
  setValores(data: any): void {
    this.vendedorPendiente = data.com_vendedores_id ?? null;
    this.formulario.patchValue({
      agencia: data.agencia ?? ''
    });
  }

  // DATA / HELPERS
  rawAgencias = [
    { value: '710', name: 'Nissan Universidad',   permiso: 'view select agencias nu' },
    { value: '730', name: 'Nissan Azcapotzalco',  permiso: 'view select agencias na' },
    { value: '714', name: 'Nissan Campestre',     permiso: 'view select agencias nc' },
    { value: '1',   name: 'Renault Azcapotzalco', permiso: 'view select agencias ra' },
    { value: '2',   name: 'Renault Ecatepec',     permiso: 'view select agencias re' },
    { value: '3',   name: 'Renault Vallejo',      permiso: 'view select agencias rv' },
    { value: '4',   name: 'Renault Pachuca',      permiso: 'view select agencias rp' },
  ];


  private parseAgencia(intercompania: string): string | null {
  const mapa: Record<string, string | null> = {
    '7051': '730',
    '712': '714',
    '710': '710',
    '333': '',
    '7064': '1',
    '7063': '3',
    '7062': '2',
    '7061': '4',
  };
  return mapa[intercompania] ?? intercompania;
}

  filtrarAgencias(cadena: string) {
    const filtro = (cadena || '').toLowerCase();

    let resultado = [];

    if (filtro === 'nissan') {
      resultado = this.rawAgencias.filter(a => a.name.toLowerCase().includes('nissan'));
    } else if (filtro === 'lille' || filtro === 'renault') {
      resultado = this.rawAgencias.filter(a => a.name.toLowerCase().includes('renault'));
    } else {
      resultado = this.rawAgencias;
    }

    return resultado;
  }

  getEmpresaUsuario() {
    const usuarioActual = this.localStorage.getItem('currentUser');
    const numIntercompania = usuarioActual['usuarioActivo'][0].intercompania;
    const nombreEmpresa = usuarioActual['usuarioActivo'][0].empresa ?? 'No especificada';
    const intercompania = this.parseAgencia(numIntercompania);
    return { intercompania, nombreEmpresa };
  }

  tienePermiso(permiso: string | null = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }

    esValido(): boolean {
    return this.formulario.valid;
  }

  marcarTodo(): void {
    this.formulario.markAllAsTouched();
  }

  deshabilitar(){
    this.formulario.get('agencia')?.disable();
    this.formulario.get('com_vendedores_id')?.disable();
  }
}