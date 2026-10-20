import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import Swal from 'sweetalert2';

import { TokensAgenciasService } from 'src/app/core/services/ucoip/tokens-agencias.service';
import { obtenerPrimerError } from 'src/app/core/helpers/errores-forrmulario';

@Component({
  selector: 'app-modal-token-agencia',
  templateUrl: './modal-token-agencia.component.html',
  styleUrls: ['./modal-token-agencia.component.css']
})
export class ModalTokenAgenciaComponent implements OnInit {

  public formToken!: FormGroup;

  // Catálogo de sistemas
  public sistemas: any[] = [];
  public puestos: any[] = [];
  public empresas: any[] = [];

  // Registro recibido cuando se edita
  public data: any;

  public submitted = false;

  public event: EventEmitter<any> = new EventEmitter();
  public modalCerrado: EventEmitter<any> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private tokenService: TokensAgenciasService,
    public bsModalRef: BsModalRef
  ) { }

  ngOnInit(): void {

    this.buildForm();

    // this.obtenerSistemas();

    if (this.data) {
      this.setValues();
    }

  }

  private buildForm(): void {
    this.formToken = this.formBuilder.group({
      id: new FormControl(0),
      token: new FormControl('', [Validators.required,Validators.maxLength(255)]),
      puesto_marca: new FormControl(null, [Validators.required,Validators.maxLength(45)]),
      cat_empresas_id: new FormControl(null, [ Validators.required]),
      observaciones: new FormControl('')
    });

  }

  public setValues(){
    this.formToken.patchValue({
      id: this.data?.id ,
      token: this.data?.token,
      puesto_marca: this.data?.ucoip_puesto_marca_id,
      cat_empresas_id: this.data?.ucoip_cat_empresas_id,
      observaciones: this.data?.observaciones
    }); 
  }

  get tokenFormControl() {
    return this.formToken.controls;
  }


  save(): void {
    this.submitted = true;
    if (this.formToken.invalid) {
      Swal.fire({
          title: "Alerta",
          text: "Debes llenar correctamente todos los campos: " + obtenerPrimerError(this.formToken) ,
          buttonsStyling: true,
          icon: "warning",
      });
      this.formToken.markAllAsTouched();
      this.submitted = true;
      return;
    }

    this.tokenService.save(this.formToken.value).subscribe({
      next: (response: any) => {
        if (response.status == 'success') {
          Swal.fire({
            title: 'Correcto',
            text: response.message,
            icon: 'success',
            buttonsStyling: false,
            customClass: {
              confirmButton: 'btn btn-success px-4'
            }
          });
          this.event.emit(true);
          this.modalCerrado.emit();
          this.cerrarModal();
        } else {
          Swal.fire({
            title: 'Error',
            text: response.message,
            icon: 'error'
          });
        }
      },
      error: (error) => {
        console.error(error);
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al guardar.',
          icon: 'error'
        });
      }
    });

  }

  cerrarModal(): void {
    this.formToken.reset();
    this.bsModalRef.hide();
  }

}