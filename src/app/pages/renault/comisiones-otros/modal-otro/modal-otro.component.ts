import { Component, EventEmitter, Input, ViewChild } from '@angular/core';
import { SelectAgenciaVendedorComponent } from 'src/app/shared/ui/select-agencia-vendedor/select-agencia-vendedor.component';
import { AddOtroFormComponent } from '../forms/add-otro-form/add-otro-form.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { FinanciamientoService } from 'src/app/core/services/renault/financiamiento.service';
import { OtrosService } from 'src/app/core/services/renault/otros.service';
@Component({
  selector: 'app-modal-otro',
  templateUrl: './modal-otro.component.html',
  styleUrl: './modal-otro.component.css'
})
export class ModalOtroComponent {
  @Input() data: any = null;
  @Input() vendedores: any = null;
  
  @ViewChild('formSelectAgencia', { static: false }) formSelectAgencia!: SelectAgenciaVendedorComponent;
  @ViewChild('formOtrasComisiones', { static: false }) formOtrasComisiones!: AddOtroFormComponent;

  public event: EventEmitter<any> = new EventEmitter();

  public vendedor:any;
  public empresaActiva:any= '';
  public loading = false;

  constructor(
      public bsModalRef: BsModalRef,
      public alertas: SwalComprsServiceService,
      private otrosService: OtrosService,
  
    ) {}
  
    ngOnInit(): void {}
  
    ngAfterViewInit(): void {
      if (this.data) {
        setTimeout(() => {
          // this.formFinanciamiento.setValores(this.data);
          this.formSelectAgencia.setValores(this.data);
        });
      }
    }
  
  guardar(): void {
    console.log(this.vendedor)
    const items = this.formOtrasComisiones.getItems();
  
    if (items.length === 0) {
      this.alertas.mostrarAlerta('Aviso', 'Agrega al menos un financiamiento', 'warning', 'warning');
      return;
    }
  
     this.loading = true; 

     const data = {
      agencia : this.vendedor.agencia,
      vendedor : this.vendedor.id,
      conceptos : items
     }
    // const agenciaValues = this.formSelectAgencia.getValues();
    // const formData = new FormData();
  
    // items.forEach((item, i) => {
    //   const payload = { ...item.formData, ...agenciaValues };
  
    //   Object.keys(payload).forEach(key => {
    //     // if (payload[key] !== null && payload[key] !== undefined) {
    //       formData.append(`financiamientos[${i}][${key}]`, payload[key]);
    //     // }
    //   });
  
    //   if(item.archivo){
    //     formData.append(`financiamientos[${i}][archivo]`, item.archivo , item.archivo.name);
    //   }
      
    // });
  
      this.otrosService.create(data).subscribe({
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
