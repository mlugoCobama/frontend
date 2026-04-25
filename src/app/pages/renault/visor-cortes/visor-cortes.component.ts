import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';
import { PermisosService } from 'src/app/core/services/permisos.service';
import { ConcentradoComisionesService } from 'src/app/core/services/renault/concentrado-comisiones.service';
import { ColumnaTabla } from 'src/app/shared/ui/tabla-generica/tabla-generica.component';
import { permisosVendedoresAgencias } from 'src/app/shared/constants/permisos';
import { distinctUntilChanged } from 'rxjs';
@Component({
  selector: 'app-visor-cortes',
  templateUrl: './visor-cortes.component.html'
})

export class VisorCortesComponent implements OnInit {

  form!: FormGroup;

  agencias: any[] = [];
  cortes:any = [];

  cargandoCortes = false;
  cargandoConsulta = false;

  public data = [];

  permisos = permisosVendedoresAgencias

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

  /** Configuracion de columnas de la tabla generica */
columnasVendedor: ColumnaTabla[] = [
    { campo: "nro_vendedor_as",       etiqueta: "Numero",                         bold: true,         textNoWrap:true, sticky:true, width:40},
    { campo: "clave",                 etiqueta: "Clave",                          bold: true,         textNoWrap:true, sticky:true, width:57},
    { campo: "apv",                   etiqueta: "Vendedor",                       bold: true,         textNoWrap:true, sticky:true, width:240},
    { campo: "total_nuevos",          etiqueta: "Com. Nuevos",                    pipe: "currency",   align:'right',  borderEnd: true, borderStart: true },
    { campo: "total_seminuevos",      etiqueta: "Com. Seminuevos",                pipe: "currency",   align:'right' },
    { campo: "total_seguros",         etiqueta: "Seguros",                        pipe: "currency",   align:'right' ,  borderEnd: true, borderStart: true},
    { campo: "total_financiamiento",  etiqueta: "Incentivo Dealer",               pipe: "currency",   align:'right' },
    { campo: "total_toma_unidad",     etiqueta: "Toma Unidad",                    pipe: "currency",   align:'right' ,  borderEnd: true, borderStart: true},
    { campo: "total_accesorios",      etiqueta: "Accesorios",                     pipe: "currency",   align:'right' ,  borderEnd: true, borderStart: true},
    { campo: "total_otros",           etiqueta: "Otros",                          pipe: "currency",   align:'right' },
    { campo: "total_comisiones",      etiqueta: "Total de Comisió",               pipe: "currency",   align:'right', bold:true ,  borderEnd: true, borderStart: true},
    { campo: "com_factura",           etiqueta: "Com. Factura",                   pipe: "currency",   align:'right', bold:true, textColor:'danger' },
    { campo: "desc_nomina",           etiqueta: "Desc. Nomina",                   pipe: "currency",   align:'right',  borderEnd: true, borderStart: true},
    { campo: "desc_pretaciones",      etiqueta: "PTU/AG/DifDeposito/Nom Cheque",  pipe: "currency",   align:'right', fontHeaderSize:'small'},
    { campo: "des_otros",             etiqueta: "Otros Desc.",                    pipe: "currency",   align:'right',  borderEnd: true, borderStart: true},
    { campo: "desc_c_casa",           etiqueta: "Desc. Credito Casa",             pipe: "currency",   align:'right'},
    { campo: "desc_infonavit",        etiqueta: "INFONAVIT",                      pipe: "currency",   align:'right',  borderEnd: true, borderStart: true},
    { campo: "monto_dispersar",       etiqueta: "Monto a Dispersar",              pipe: "currency",   align:'right', bold:true, textColor:'primary'},
    { campo: "nomina",                etiqueta: "Nomina",                         pipe: "currency",   align:'right',  borderEnd: true, borderStart: true},
    { campo: "observaciones",         etiqueta: "Observaciones",                  align:'right',      borderEnd: true, borderStart: true}
  ];

  constructor(
    private fb: FormBuilder,
    private service: ConcentradoComisionesService,
    private permisosService: PermisosService,
    private localStorage: LocalStorageServiceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getAgencias();
    this.handleChanges();
    this.getEmpresaUsuario();
  }

  initForm() {
    this.form = this.fb.group({
      agencia: [null],
      corte: [null]
    });
  }



  getAgencias() {
    this.agencias = this.filtrarAgencias(this.getEmpresaActiva());
  }

  tienePermiso(permiso: string): boolean {
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

  // getEmpresaUsuario() {
  //   const usuarioActual = this.localStorage.getItem('currentUser');
  //   const intercompania = usuarioActual['usuarioActivo'][0].intercompania;
  //   const nombreEmpresa = usuarioActual['usuarioActivo'][0].empresa ?? 'No especificada';
  //   return { intercompania, nombreEmpresa };
  // }


  handleChanges() {


    this.form.get('agencia')?.valueChanges.
    pipe(distinctUntilChanged())
    .subscribe(agenciaId => {

      if (!agenciaId) return;

      this.form.get('corte')?.reset();
      this.cortes = [];
      this.data = [];

      this.getCortes(agenciaId);
    });

    this.form.get('corte')?.valueChanges.
    pipe(distinctUntilChanged()).
    subscribe(corteId => {

      if (!corteId) return;

      this.consultarCorte(corteId);
    });
  }


  getCortes(agenciaId: number) {
    this.cargandoCortes = true;
    this.cortes = [];
    this.service.getCortesByAgencia(agenciaId).subscribe({
      next: (res) => {
        this.cortes =  res.data;
      },
      error: () => console.error('Error al cargar cortes'),
      complete: () => this.cargandoCortes = false
    });
  }

  public totalAutorizado(key): number {
    return this.data.reduce((acc, item) => acc + (Number(item[key]) || 0), 0);
  }


  consultarCorte(corteId: number) {
    this.cargandoConsulta = true;
    this.data = [];
    this.service.getDetalleCorte(corteId).subscribe({
      next: (res) => {
        console.log('Resultado corte:', res);
        this.data = res.data
      },
      error: () => console.error('Error en consulta'),
      complete: () => this.cargandoConsulta = false
    });
  }

    getEmpresaUsuario() {
    const usuarioActual = this.localStorage.getItem('currentUser');
    const numIntercompania = usuarioActual['usuarioActivo'][0].intercompania;
    const nombreEmpresa = usuarioActual['usuarioActivo'][0].empresa ?? 'No especificada';
    const intercompania = this.parseAgencia(numIntercompania)

    if(!this.tienePermiso(this.permisos.selectAgencias)){
      this.form.patchValue({
        agencia: intercompania
      });
      this.form.get('agencia')?.disable();
    }
    return { intercompania, nombreEmpresa };
  }  

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
}