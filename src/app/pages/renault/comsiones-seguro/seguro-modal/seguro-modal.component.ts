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
    if (!this.formSelectAgencia.esValido()) {
        this.formSelectAgencia.marcarTodo();
      return;
    }

    this.loading = true;
    const valores = this.formFinanciamiento.getItems();
      if (valores.length === 0) {
        this.loading = false;
        this.alertas.mostrarAlerta('Aviso', 'Agrega al menos una toma de unidad', 'warning', 'warning');
      return;
    }
    const items = valores;
      const agenciaValues = this.formSelectAgencia.getValues();
      const formData = new FormData();

      items.forEach((item, i) => {
        const payload = { ...item.formData, ...agenciaValues };

        Object.keys(payload).forEach(key => {
          formData.append(`seguros[${i}][${key}]`, payload[key]);
        });

        if (item.archivo) {
          formData.append(`seguros[${i}][archivo]`, item.archivo, item.archivo.name);
        }
      });

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