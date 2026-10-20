import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';

@Component({
  selector: 'app-form-filtro-mensual',
  templateUrl: './form-filtro-mensual.component.html',
  styleUrl: './form-filtro-mensual.component.css'
})
export class FormFiltroMensualComponent {
  @Output() ejecutarConsulta = new EventEmitter<any>();
  @Input() isFetchingConcentrado : any;

  miFormulario: FormGroup;

  constructor(
    private fb: FormBuilder,
    private alertasService: SwalComprsServiceService
  ) {
    const today = new Date();
    const primerDiaMesActual = new Date(today.getFullYear(), today.getMonth(), 1);
    const primerDiaMesAnterior = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    const formatoFecha = (fecha: Date): string =>
      fecha.toISOString().split('T')[0];

    this.miFormulario = this.fb.group({
      tipo: ['', Validators.required],
      fechaInicial: [formatoFecha(primerDiaMesAnterior), Validators.required],
      fechaFinal: [formatoFecha(primerDiaMesActual), Validators.required]
    });
  }

  get f() {
    return this.miFormulario.controls;
  }

  consultar() {
    if(!this.miFormulario.valid){
      this.alertasService.mostrarAlerta('Error', 'Debes de llenar todos los campos', 'warning', 'warning');
      this.miFormulario.markAllAsTouched()
      return;
    }

    this.ejecutarConsulta.emit(this.miFormulario.value);
  }
}
