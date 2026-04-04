import { Component, Input, OnInit, AfterViewInit, ViewChild , EventEmitter} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { TomaUnidadFormComponent } from '../forms/toma-unidad-form/toma-unidad-form.component';
import { TomaUnidadesService } from 'src/app/core/services/renault/toma-unidades.service';
import { SelectAgenciaVendedorComponent } from 'src/app/shared/ui/select-agencia-vendedor/select-agencia-vendedor.component';

@Component({
  selector: 'app-toma-unidades-modal',
  templateUrl: './toma-unidades-modal.component.html',
  styleUrl: './toma-unidades-modal.component.css'
})
export class TomaUnidadesModalComponent implements OnInit, AfterViewInit {

  @Input() data: any = null;
  @Input() vendedores: any = null;
  @ViewChild('formSelectAgencia', { static: false }) formSelectAgencia!: SelectAgenciaVendedorComponent;
  @ViewChild('formFinancimiento', { static: false }) formFinanciamiento!: TomaUnidadFormComponent;
  public event: EventEmitter<any> = new EventEmitter();
  public loading = false;
  public empresaActiva:any= '';
  constructor(
    public bsModalRef: BsModalRef,
    public alertas: SwalComprsServiceService,
    private tomaUnidadesService: TomaUnidadesService
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
    console.log(valores);
    const payload = valores;
    const formData = new FormData();
    Object.keys(payload).forEach(key => {
      if (payload[key] !== null && payload[key] !== undefined && key !== 'archivo') {
        formData.append(key, payload[key]);
      }
    });

    this.tomaUnidadesService.create(formData).subscribe((response:any)=>{
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