import { AfterViewInit, Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { TomaUnidadesService } from 'src/app/core/services/renault/toma-unidades.service';
import { TomaUnidadFormComponent } from '../../comisiones-toma-unidades/forms/toma-unidad-form/toma-unidad-form.component';
import { AccesoriosService } from 'src/app/core/services/renault/accesorios.service';
import { DetalleAccesorioFormComponent } from '../forms/detalle-accesorio-form/detalle-accesorio-form.component';
@Component({
  selector: 'app-accesorio-modal',
  templateUrl: './accesorio-modal.component.html',
  styleUrl: './accesorio-modal.component.css'
})
export class AccesorioModalComponent implements OnInit, AfterViewInit {

  @Input() data: any = null;
  @Input() vendedores: any = null;
  @ViewChild('formFinancimiento', { static: false }) formFinanciamiento!: TomaUnidadFormComponent;
  @ViewChild('formDetalles', { static: false }) formDetalles!: DetalleAccesorioFormComponent;

  public event: EventEmitter<any> = new EventEmitter();
  public loading = false;

  constructor(
    public bsModalRef: BsModalRef,
    public alertas: SwalComprsServiceService,
    private tomaUnidadesService: TomaUnidadesService,
    private accesoriosService: AccesoriosService,
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.data) {
      setTimeout(() => {
        this.formFinanciamiento.setValores(this.data);
        this.formDetalles.setValores(this.data.detalles);
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

  const detalles = this.formDetalles.getValores();
  formData.append('detalles', JSON.stringify(detalles)); // <-- importante

  this.accesoriosService.create(formData).subscribe((response:any) => {
    if (response.status === 'success') { // <-- corregido
      this.alertas.mostrarAlerta('Listo!', response.message, 'success', 'success');
      this.loading = false;
      this.event.emit();
      this.cerrarModal();
    } else {
      this.alertas.mostrarAlerta('Error!', response.message, 'error', 'danger');
      this.loading = false;
    }
  }, (error) => {
    console.error("Error fetching data:", error);
    this.alertas.mostrarAlerta('Error!', error, 'error', 'danger');
    this.loading = false;
  });
}

  cerrarModal(): void {
    this.bsModalRef.hide();
  }

}