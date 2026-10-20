import { AfterViewInit, Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { FormServicioEmpresaComponent } from '../forms/form-servicio-empresa/form-servicio-empresa.component';
import { GestionServiciosService } from 'src/app/core/services/gestion-servicios/gestion-servicios.service';

@Component({
  selector: 'app-modal-asignacion-servicio',
  templateUrl: './modal-asignacion-servicio.component.html',
  styleUrl: './modal-asignacion-servicio.component.css'
})
export class ModalAsignacionServicioComponent implements OnInit, AfterViewInit {

  @Input() data: any = null;
  @Input() vendedores: any = null;
  
  @ViewChild('formAsignacion', { static: false }) formAsignacion!: FormServicioEmpresaComponent;
  public event: EventEmitter<any> = new EventEmitter();
  public loading = false;
  public empresaActiva:any= '';

  
  constructor(
    public bsModalRef: BsModalRef,
    public alertas: SwalComprsServiceService,
    private gestionService: GestionServiciosService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.data) {
      setTimeout(() => {
        this.formAsignacion.setFormValues(this.data);
      });
    }
  }

  guardar(): void {
    const data = 
    this.formAsignacion.getFormValues();
      this.gestionService.storeServicio(data).subscribe((response:any)=>{
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

    console.log(data);
  }

  

  

  cerrarModal(): void {
    this.bsModalRef.hide();
  }
}