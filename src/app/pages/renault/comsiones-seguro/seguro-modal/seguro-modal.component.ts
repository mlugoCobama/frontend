import { Component, Input, OnInit, AfterViewInit, ViewChild , EventEmitter} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { FinanciamientoFormComponent } from '../../comisiones-financiamiento/forms/financiamiento-form/financiamiento-form.component';
import { SegurosService } from 'src/app/core/services/renault/seguros.service';
import { SelectAgenciaVendedorComponent } from 'src/app/shared/ui/select-agencia-vendedor/select-agencia-vendedor.component';

@Component({
  selector: 'app-seguro-modal',
  templateUrl: './seguro-modal.component.html',
  styleUrl: './seguro-modal.component.css'
})
export class SeguroModalComponent implements OnInit, AfterViewInit {

  @Input() data: any = null;
  @Input() vendedores: any = null;
  @ViewChild('formSelectAgencia', { static: false }) formSelectAgencia!: SelectAgenciaVendedorComponent;
  @ViewChild('formFinancimiento', { static: false }) formFinanciamiento!: FinanciamientoFormComponent;
  public event: EventEmitter<any> = new EventEmitter();
  public loading = false;
  public empresaActiva:any= '';
  constructor(
    public bsModalRef: BsModalRef,
    public alertas: SwalComprsServiceService,
    private segurosService: SegurosService
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
    if (!this.formFinanciamiento.esValido()) {
      this.formFinanciamiento.marcarTodo();
      return;
    }

    this.loading = true;
    const valores = {...this.formFinanciamiento.getValores(), ...this.formSelectAgencia.getValues()};
    const payload = valores;
    const formData = new FormData();
    Object.keys(payload).forEach(key => {
      if (payload[key] !== null && payload[key] !== undefined && key !== 'archivo') {
        formData.append(key, payload[key]);
      }
    });

    // 5. Llamar servicio
    this.segurosService.create(formData).subscribe((response:any)=>{
      if(response.status = 'success'){
        this.alertas.mostrarAlerta('Listo!', response.message, 'success', 'success');
        this.loading = false;
        this.event.emit();
        this.cerrarModal();
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

  cerrarModal(): void {
    this.bsModalRef.hide();
  }
}