import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tabla-concentrado-comisiones',
  templateUrl: './tabla-concentrado-comisiones.component.html',
  styleUrls: ['./tabla-concentrado-comisiones.component.css']
})
export class TablaConcentradoComisionesComponent implements OnInit, OnChanges {

  @Input() data: any[] = [];

  @Output() cambios = new EventEmitter<any>();
  @Output() seleccionados = new EventEmitter<any[]>();
  @Output() cellClick = new EventEmitter<{ fila: any, campo: string }>();

  form!: FormGroup;

  filasFiltradas: number[] = [];
  terminoBusqueda: string = '';

  columnaOrden: string = '';
  direccionOrden: 'asc' | 'desc' = 'asc';

  private inicializando = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      filas: this.fb.array([])
    });

    this.form.valueChanges.subscribe(val => {
      if (this.inicializando) return;
      this.cambios.emit(val);
      this.emitirSeleccionados();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['data'] &&
      changes['data'].currentValue !== changes['data'].previousValue
    ) {
        this.reconstruirTabla();
    }
  }

  get filas(): FormArray {

      return this.form.get('filas') as FormArray;
    
  }

  crearFila(item: any): FormGroup {
    const group = this.fb.group({
      selected: [false],
      id: [item.id],
      nro_vendedor_as: [item.nro_vendedor_as],
      vendedor: [item.vendedor],

      nuevos: [item.nuevos],
      seminuevos: [item.seminuevos],
      financiamiento: [item.financiamiento],
      accesorios: [item.accesorios],
      seguros: [item.seguros],
      toma_unidades: [item.toma_unidades],

      pend_nuevos: [item.pend_nuevos],
      pend_seminuevos: [item.pend_seminuevos],
      pend_financiamiento: [item.pend_financiamiento],
      pend_accesorios: [item.pend_accesorios],
      pend_seguros: [item.pend_seguros],
      pend_toma: [item.pend_toma],

      otros: [item.otros],
      total: [0],
      // com_por_fact: [item.comision_factura, [Validators.min(0)]],
      comision_factura: [item.comision_factura, [Validators.min(0)]],
      desc_nomina: [item.desc_nomina, [Validators.min(0)]],
      prestaciones: [item.prestaciones, [Validators.min(0)]],
      otros_descuentos: [item.otros_descuentos, [Validators.min(0)]],
      desc_c_casa: [item.desc_c_casa, [Validators.min(0)]],
      infonavit: [item.infonavit, [Validators.min(0)]],
      nomina: [item.nomina, [Validators.min(0)]],
      observaciones: [item.observaciones ?? ''],
      monto_dispersar: [{ value: item.monto_dispersar, disabled: true }]
    });

    group.valueChanges.subscribe(() => {
      this.calcularFila(group);
    });

    this.calcularFila(group);

    return group;
  }

calcularFila(group: FormGroup) {
  const limpiar = (val: any): number =>
    parseFloat((+String(val ?? 0).replace(/[^0-9.-]/g, '') || 0).toFixed(2));

  const nuevos         = limpiar(group.get('nuevos')?.value);
  const seminuevos     = limpiar(group.get('seminuevos')?.value);
  const financiamiento = limpiar(group.get('financiamiento')?.value);
  const accesorios     = limpiar(group.get('accesorios')?.value);
  const seguros        = limpiar(group.get('seguros')?.value);
  const toma           = limpiar(group.get('toma_unidades')?.value);
  const otros          = limpiar(group.get('otros')?.value);
  const nomina         = limpiar(group.get('nomina')?.value);

  const total          = parseFloat((nuevos + seminuevos + financiamiento + accesorios + seguros + toma + otros).toFixed(2));
  const comFactura     = parseFloat((total * 0.12).toFixed(2));
  const descuentos     = parseFloat((
    limpiar(group.get('desc_nomina')?.value)      +
    limpiar(group.get('prestaciones')?.value)     +
    limpiar(group.get('otros_descuentos')?.value) +
    limpiar(group.get('desc_c_casa')?.value)      +
    limpiar(group.get('infonavit')?.value)
  ).toFixed(2));

  const montoDispersar = parseFloat((total - comFactura - descuentos + nomina).toFixed(2));

  group.get('total')?.setValue(total,             { emitEvent: false });
  group.get('comision_factura')?.setValue(comFactura,     { emitEvent: false });
  group.get('monto_dispersar')?.setValue(montoDispersar,  { emitEvent: false });
}

  cargarData() {
    this.data.forEach((item, index) => {
      this.filas.push(this.crearFila(item));
      this.filasFiltradas.push(index);
    });
  }


  reconstruirTabla() {
    if(this.form && this.filas){
      this.inicializando = true;
      this.filas.clear();
      this.filasFiltradas = [];
      this.cargarData();
      this.inicializando = false;
    }
  }

  buscar() {
    const term = this.terminoBusqueda.toLowerCase();

    this.filasFiltradas = this.filas.controls
      .map((fila, index) => ({ fila, index }))
      .filter(({ fila }) => {
        const val = fila.value;

        return (
          val.vendedor?.toLowerCase().includes(term) ||
          val.nro_vendedor_as?.toString().includes(term)
        );
      })
      .map(x => x.index);
  }


  ordenar(col: string) {

    if (this.columnaOrden === col) {
      this.direccionOrden = this.direccionOrden === 'asc' ? 'desc' : 'asc';
    } else {
      this.columnaOrden = col;
      this.direccionOrden = 'asc';
    }

    this.filasFiltradas.sort((a, b) => {
      const valA = this.filas.at(a).value[col];
      const valB = this.filas.at(b).value[col];

      if (valA < valB) return this.direccionOrden === 'asc' ? -1 : 1;
      if (valA > valB) return this.direccionOrden === 'asc' ? 1 : -1;
      return 0;
    });
  }

  onCellClick(event: MouseEvent, fila: any, campo: string) {
    event.stopPropagation();
    this.cellClick.emit({ fila, campo });
  }

  // emitirSeleccionados() {
  //   const seleccionados = this.filas.value.filter((f: any) => f.selected);
  //   this.seleccionados.emit(seleccionados);
  // }

  emitirSeleccionados() {
    const seleccionados = this.filas.controls
      .filter(f => f.get('selected')?.value === true)
      .map(f => {
        const { selected, ...datos } = (f as FormGroup).getRawValue(); // getRawValue incluye disabled
        return datos;
      });

    this.seleccionados.emit(seleccionados);
  }


  toggleAll(event: any) {
    const checked = event.target.checked;
    this.filas.controls.forEach(f => f.get('selected')?.setValue(checked));
  }
}