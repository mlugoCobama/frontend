import { Component, Input, OnInit, AfterViewInit, ViewChild , EventEmitter} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { FinanciamientoFormComponent } from '../forms/financiamiento-form/financiamiento-form.component';
import { FinanciamientoService } from 'src/app/core/services/renault/financiamiento.service';

@Component({
  selector: 'app-financiamiento-modal',
  templateUrl: './financiamiento-modal.component.html',
  styleUrl: './financiamiento-modal.component.css'
})
export class FinanciamientoModalComponent implements OnInit, AfterViewInit {

  @Input() data: any = null;
  @Input() vendedores: any = null;
  @ViewChild('formFinancimiento', { static: false }) formFinanciamiento!: FinanciamientoFormComponent;
  public event: EventEmitter<any> = new EventEmitter();
  public loading = false;

  constructor(
    public bsModalRef: BsModalRef,
    public alertas: SwalComprsServiceService,
    private financiamientoService: FinanciamientoService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.data) {
      setTimeout(() => {
        this.formFinanciamiento.setValores(this.data);
      });
    }
  }

  guardar(): void {
    if (!this.formFinanciamiento.esValido()) {
      this.formFinanciamiento.marcarTodo();
      return;
    }

    this.loading = true;
    const valores = this.formFinanciamiento.getValores();
    const payload = valores;
    const formData = new FormData();
    Object.keys(payload).forEach(key => {
      if (payload[key] !== null && payload[key] !== undefined && key !== 'archivo') {
        formData.append(key, payload[key]);
      }
    });
    if (valores.archivo) {
      formData.append('archivo', valores.archivo);
    }

    // 5. Llamar servicio
    this.financiamientoService.create(formData).subscribe((response:any)=>{
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