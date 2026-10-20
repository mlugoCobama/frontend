import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { SegurosService } from 'src/app/core/services/renault/seguros.service';
import { catalogoAseguradoras } from 'src/environments/catalogo_aseguradora';

@Component({
  selector: 'app-form-seguro',
  templateUrl: './form-seguro.component.html',
  styleUrl: './form-seguro.component.css'
})
export class FormSeguroComponent implements OnInit {
  public aseguradoras = catalogoAseguradoras;
  public form!: FormGroup;
  public archivo: File | null = null;
  public loading: boolean = false;

  @Input() data: any;
  @Output() refresh: EventEmitter<any> = new EventEmitter();

  private fb =  inject(FormBuilder);
  private segurosService =  inject(SegurosService);
  private alertas =  inject(SwalComprsServiceService);


  constructor() {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      folio: ['', Validators.required],
      poliza: ['', Validators.required],
      aseguradora: ['', Validators.required],
      fecha_emision: ['', Validators.required],
      forma_pago: ['', Validators.required],
      prima_neta: [null, [Validators.required, Validators.min(0)]],
      calcular_encargado_seg: [false],
      com_encargado_seg: [{ value: null, disabled: true }],
      archivo: [null, Validators.required],
      observaciones: [null]
    });

    if (this.data) {
      this.setValores(this.data);
    }

    this.form.get('prima_neta')?.valueChanges.subscribe(() => {
      this.calcularComisionEncargado();
    });

    this.form.get('calcular_encargado_seg')?.valueChanges.subscribe(() => {
      this.calcularComisionEncargado();
    });
  }

  setValores(data: any): void {
    this.form.patchValue({
      id: data.id ?? null,
      folio: data.folio ?? '',
      poliza: data.poliza ?? '',
      aseguradora: data.aseguradora ?? '',
      fecha_emision: this.formatDateForInputDate(data.fecha_emision) ?? '',
      forma_pago: data.forma_pago ?? '',
      prima_neta: data.prima_neta ?? null,
      calcular_encargado_seg: (data.com_encargado_seg ?? 0) > 0 ? true : false,
      observaciones: data.observaciones ?? ''
    });
  }

  getValores(): any {
    return this.form.getRawValue();
  }

  esValido(): boolean {
    return this.form.valid;
  }

  limpiar(): void {
    this.form.reset();
    this.archivo = null;
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.archivo = file;
      this.form.patchValue({ archivo: file.name });
    }
  }

  marcarTodo(): void {
    this.form.markAllAsTouched();
  }

  formatDateForInputDate(isoString: string): string {
    if (!isoString) return '';
    const fecha = new Date(isoString);
    if (isNaN(fecha.getTime())) return '';

    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();

    return `${anio}-${mes}-${dia}`;
  }

  private limpiarNumero(valor: any): number {
    if (!valor) return 0;
    return Number(valor.toString().replace(/[^0-9.-]+/g, ''));
  }

  private calcularComisionEncargado(): void {
    const prima = this.limpiarNumero(this.form.get('prima_neta')?.value);
    const calcularEnc = this.form.get('calcular_encargado_seg')?.value;

    if (!prima || prima <= 0) {
      this.form.patchValue({ com_encargado_seg: null }, { emitEvent: false });
      return;
    }

    const vs = prima * 0.20;
    const encSeg = calcularEnc ? vs * 0.05 : 0;

    this.form.patchValue({
      com_encargado_seg: encSeg.toFixed(2)
    }, { emitEvent: false });
  }

  getArchivo(): File | null {
    return this.archivo;
  }

  buildPayload(){
    const formData = new FormData;
    const form =  {
      com_vendedores_id: this.data.id_vendedor,
      id_venta: this.data.id_venta,
      agencia: this.data.agencia,
      nombre: this.data.razon_social,
      unidad: this.data.descripcion,
      serie: this.data.serie,
      ...this.form.getRawValue()
    }

    Object.keys(form).forEach(key => {
      formData.append(`seguros[0][${key}]`, form[key]);
    });

    if (this.archivo) {
      formData.append(`seguros[0][archivo]`, this.archivo, this.archivo.name);
    }

    return formData;
  }

  public saveSeguro(){
    this.loading = true;

    if (!this.form.valid) {
        this.form.markAllAsTouched();
         this.alertas.mostrarAlerta('Aviso', 'Debes de llenar correctamente el formulario', 'warning', 'warning');
        this.loading = false;
      return;
    }

    this.segurosService.create(this.buildPayload()).subscribe((response:any)=>{
      if(response.status = 'success'){
        this.alertas.mostrarAlerta('Listo!', response.message, 'success', 'success');
        this.loading = false;
        this.refresh.emit();
        // this.cerrarModal();
      }else{
        this.alertas.mostrarAlerta('Error!', response.message, 'error', 'danger');
        this.loading = false;
      }
    },(error) => {
        console.error("Error fetching data:", error);
        this.alertas.mostrarAlerta('Error!', error, 'error', 'danger');
        this.loading = false;
    });

  }

}
