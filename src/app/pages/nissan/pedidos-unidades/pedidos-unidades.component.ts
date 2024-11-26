import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-pedidos-unidades',
  templateUrl: './pedidos-unidades.component.html',
  styleUrls: ['./pedidos-unidades.component.css']
})
export class PedidosUnidadesComponent implements OnInit {

  public modalRef?: BsModalRef;

  public submitted: boolean = false;

  public formPedidoUnidades: FormGroup;

  public disableAuto:boolean = true;

  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
  ) { }

  public ngOnInit(): void {
    this.buildForm();
  }

  /**
   * Open modal
   * @param content modal content
   */
  public openModal(content: any) {
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: 'modal-xl' });
  }

  public save() {
    this.submitted = true;
    if (this.formPedidoUnidades.invalid) {
      return;
    }
    console.log(this.formPedidoUnidades.value);
    this.modalRef.hide();
    this.submitted = false;
  }

  private buildForm() {
    return new Promise( (resolve, reject) => {
      this.formPedidoUnidades = this.formBuilder.group({
        nombre_razon_social: new FormControl(null, Validators.required),
        rfc: new FormControl(null, Validators.required),
        curp: new FormControl(null, Validators.required),
        tel_casa: new FormControl(null, Validators.required),
        tel_oficina: new FormControl(null, Validators.required),
        tel_movil: new FormControl(null, Validators.required),
        calle: new FormControl(null),
        num_interior: new FormControl(null),
        num_exterior: new FormControl(null),
        cp: new FormControl(null),
        colonia: new FormControl(null),
        ciudad: new FormControl(null),
        estado: new FormControl(null),
        delegacion_municipio: new FormControl(null),
        forma_pago: new FormControl(null),
        numero_cuenta: new FormControl(null),
        uso_cfdi: new FormControl(null),
        metodo_pago: new FormControl(null),
        email_1: new FormControl(null),
        email_2: new FormControl(null),
        auto_actual: new FormControl('false'),
        comprobante_domicilio: new FormControl(null),
        identificacion: new FormControl(null),
        tipo_unidad: new FormControl({value:'', disabled:true}),
        anio_modelo: new FormControl({value:'', disabled:true}),
        color: new FormControl({value:'', disabled:true}),
      });
      resolve(true);
    } )
  }

public changeAutoActual(event) {
  console.log(event.target.value);
  if (event.target.value == 'true') {
    console.log('verdadero');

    this.formPedidoUnidades.get('tipo_unidad').enable();
    this.formPedidoUnidades.get('anio_modelo').enable();
    this.formPedidoUnidades.get('color').enable();
  } else {
    console.log('falso');
    this.formPedidoUnidades.get('tipo_unidad').disable();
    this.formPedidoUnidades.get('anio_modelo').disable();
    this.formPedidoUnidades.get('color').disable();
  }

}
}
