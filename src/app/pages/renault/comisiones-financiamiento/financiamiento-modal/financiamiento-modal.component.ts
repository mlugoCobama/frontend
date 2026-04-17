import { Component, Input, OnInit, AfterViewInit, ViewChild , EventEmitter} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { FinanciamientoFormComponent } from '../forms/financiamiento-form/financiamiento-form.component';
import { FinanciamientoService } from 'src/app/core/services/renault/financiamiento.service';
import { ActivatedRoute } from '@angular/router';
import { SelectAgenciaVendedorComponent } from 'src/app/shared/ui/select-agencia-vendedor/select-agencia-vendedor.component';

@Component({
  selector: 'app-financiamiento-modal',
  templateUrl: './financiamiento-modal.component.html',
  styleUrl: './financiamiento-modal.component.css'
})
export class FinanciamientoModalComponent implements OnInit, AfterViewInit {

  @Input() data: any = null;
  @Input() vendedores: any = null;
  public empresaActiva:any= '';
  @ViewChild('formSelectAgencia', { static: false }) formSelectAgencia!: SelectAgenciaVendedorComponent;
  @ViewChild('formFinancimiento', { static: false }) formFinanciamiento!: FinanciamientoFormComponent;
  public event: EventEmitter<any> = new EventEmitter();
  public loading = false;

  constructor(
    public bsModalRef: BsModalRef,
    public alertas: SwalComprsServiceService,
    private financiamientoService: FinanciamientoService,

  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.data) {
      setTimeout(() => {
        this.formFinanciamiento.setValores(this.data);
        this.formSelectAgencia.setValores(this.data);
      });
    }
  }

guardar(): void {
  if (!this.formSelectAgencia.esValido()) {
    this.formSelectAgencia.marcarTodo();
    return;
  }

  const items = this.formFinanciamiento.getItems();

  if (items.length === 0) {
    this.alertas.mostrarAlerta('Aviso', 'Agrega al menos un financiamiento', 'warning', 'warning');
    return;
  }

  this.loading = true;
  const agenciaValues = this.formSelectAgencia.getValues();
  const formData = new FormData();

  items.forEach((item, i) => {
    const payload = { ...item.formData, ...agenciaValues };

    Object.keys(payload).forEach(key => {
      // if (payload[key] !== null && payload[key] !== undefined) {
        formData.append(`financiamientos[${i}][${key}]`, payload[key]);
      // }
    });

    if(item.archivo){
      formData.append(`financiamientos[${i}][archivo]`, item.archivo , item.archivo.name);
    }
    
  });

  this.financiamientoService.create(formData).subscribe({
    next: (response: any) => {
      if (response.status === 'success') {
        this.alertas.mostrarAlerta('Listo!', response.message, 'success', 'success');
        this.event.emit();
        this.cerrarModal();
      } else {
        this.alertas.mostrarAlerta('Error!', response.message, 'error', 'danger');
      }
      this.loading = false;
    },
    error: (error) => {
      console.error(error);
      this.alertas.mostrarAlerta('Error!', error, 'error', 'danger');
      this.loading = false;
    }
  });
}

  cerrarModal(): void {
    this.bsModalRef.hide();
  }
}