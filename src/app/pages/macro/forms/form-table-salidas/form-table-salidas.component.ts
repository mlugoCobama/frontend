import { Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from "@angular/forms";
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';

@Component({
  selector: 'app-form-table-salidas',
  templateUrl: './form-table-salidas.component.html',
  styleUrl: './form-table-salidas.component.css'
})
export class FormTableSalidasComponent implements OnInit {

  entradaForm: FormGroup;
  @Input() detalles: any = [];
  @Input() isLoad: boolean =  true; 
  @Input() submittDetail: boolean = false;

  constructor(
    private fb: FormBuilder,
    private alerta:  SwalComprsServiceService,
  ) {
    this.entradaForm = this.fb.group({
      detallesArray: this.fb.array([])
    });
  }

  ngOnInit() {

  }

  get detallesArray(): FormArray {
    return this.entradaForm.get('detallesArray') as FormArray;
  }

  // Crear el FormArray basado en los detalles
  public createFormArray(detalles:any) {
    while (this.detallesArray.length !== 0) {
      this.detallesArray.removeAt(0);
    }
    detalles.forEach((detalle, index) => {
      const detalleGroup = this.fb.group({
        id: [detalle.id],
        idDs: [detalle.idDs],
        cantidad: [detalle.existencia],
        unidadMedida: [detalle.unidadMedida],
        descripcion: [detalle.descripcion],
        observaciones: [detalle.observaciones],
        autoTanque: [detalle.autoTanque],
        ordenTrabajo: [detalle.ordenTrabajo],
        // Campos editables
        confirmado: [detalle.confirmado === 1],
        recibidos: ['', [
          Validators.required,
          Validators.min(0.01),
          Validators.max(detalle.existencia)
        ]],
        comentario: ['', []]
      });

      this.detallesArray.push(detalleGroup);
    });
  }

  // Método para manejar cambio de checkbox
  cambioCheck(index: number, event: any) {
    const detalleControl = this.detallesArray.at(index);
    detalleControl.get('confirmado')?.setValue(event.target.checked);
  }

  // Método para obtener el valor de un control específico
  getDetalleControl(index: number, controlName: string): FormControl {
    return this.detallesArray.at(index).get(controlName) as FormControl;
  }

  // Método para obtener todos los valores del formulario
  public getEntradas() {
      const formValues = this.entradaForm.value;
      
      // Procesar solo los elementos confirmados
      const elementosConfirmados = formValues.detallesArray
        .filter((detalle: any) => detalle.confirmado)
        .map((detalle: any, originalIndex: number) => ({
          ...detalle,
          originalIndex 
        }));
      
      return elementosConfirmados;
  }

  public confirmadosValidos() {
  const detallesArray = this.entradaForm.get('detallesArray') as FormArray;
  const confirmadosInvalidos = detallesArray.controls.filter(control =>
    control.get('confirmado')?.value && !control.valid
  );
  if (confirmadosInvalidos.length > 0) {
    return false;
  }
  return true;
}

  // Método para validar que al menos un elemento esté seleccionado
  validarSeleccion(): boolean {
    return this.detallesArray.value.some((detalle: any) => detalle.confirmado);
  }
}
