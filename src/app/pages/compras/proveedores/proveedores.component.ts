import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {

  public modalRef?: BsModalRef;

  public submitted: boolean = false;

  public formProveedores: FormGroup;

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
    this.modalRef = this.modalService.show(content, { class: 'modal-lg' });
  }

  public save() {
    this.submitted = true;
    if (this.formProveedores.invalid) {
      return;
    }
    console.log(this.formProveedores.value);
    this.modalRef.hide();
    this.submitted = false;
    this.formProveedores.reset();
  }

  private buildForm() {
    return new Promise( (resolve, reject) => {
      this.formProveedores = this.formBuilder.group({
        nombre: new FormControl(null, Validators.required),
        contacto: new FormControl(null, Validators.required),
        telefono: new FormControl(null, Validators.required),
        localidad: new FormControl(null, Validators.required),
        condiciones: new FormControl(null, Validators.required),
        servicios: new FormControl(null, Validators.required),
        constancia_fiscal: new FormControl(null),
        ine: new FormControl(null),
        comprobante_domicilio: new FormControl(null),
        estado_cuenta: new FormControl(null),
        acta_constitutiva: new FormControl(null),
        poder_notarial: new FormControl(null),
      });
      resolve(true);
    } )
  }

  get proveedoresFormControl() {
    return this.formProveedores.controls;
  }

}
