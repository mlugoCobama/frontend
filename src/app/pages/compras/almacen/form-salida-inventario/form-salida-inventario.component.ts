import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';

@Component({
  selector: 'app-form-salida-inventario',
  templateUrl: './form-salida-inventario.component.html',
  styleUrl: './form-salida-inventario.component.css'
})
export class FormSalidaInventarioComponent implements OnInit {

  @Input() tecnicos: any[] = [];
  @Input() materiales: any[] = []; // Existencias del almacén
  @Input() isLoad: boolean = false;
  submitted = false;

  formulario!: FormGroup;

  filtroBusqueda = '';

  materialesFiltrados: any[] = [];

  materialesSeleccionados: any[] = [];

  constructor(private fb: FormBuilder, private alertasService: SwalComprsServiceService) {}

  ngOnInit(): void {

    this.formulario = this.fb.group({
      tecnico: ['', Validators.required],
      // motivo: ['', Validators.required]
    });

    this.materialesFiltrados = [...this.materiales];
  }

  ngOnChanges(): void {
    this.materialesFiltrados = [...this.materiales];
}

  get solicitudCompraFormControl() {
    return this.formulario.controls;
  }

  filtrarMateriales(): void {
    const texto = this.filtroBusqueda.trim().toLowerCase();
    if (!texto) {
      this.materialesFiltrados = [...this.materiales];
      return;
    }
    this.materialesFiltrados = this.materiales.filter(item =>
      item.descripcion?.toLowerCase().includes(texto)
    );
  }

  agregarMaterial(material: any): void {
    const existe = this.materialesSeleccionados.find(
      x => x.id === material.id
    );

    if (existe) {
      return;
    }

    this.materialesSeleccionados.push({ ...material, cantidad: 1 });

    this.materiales = this.materiales.filter(x => x.id !== material.id);
    this.filtrarMateriales();
  }

  eliminarMaterial(material: any): void {
    this.materialesSeleccionados =
      this.materialesSeleccionados.filter(
        x => x.id !== material.id
      );
      const { cantidad, ...materialOriginal } = material;
    this.materiales.push(materialOriginal);
    this.filtrarMateriales();
  }

  onSubmit(){

    if (this.formulario.invalid) {
      this.alertasService.mostrarAlerta('Algo anda mal', 'Debes de seleccionar un técnico', 'info', 'info');
      this.formulario.markAllAsTouched();
      return;
    }

    if(this.materialesSeleccionados.length == 0){
      this.alertasService.mostrarAlerta('Algo anda mal', 'Aun no haz agregado materiales para asignar', 'info', 'info');
      return;
    }

    const payload = {
      ...this.formulario.value,
      materiales: this.materialesSeleccionados
    };

    return payload ;
  }

 aumentarCantidad(item: any): void {
  if (item.cantidad < item.existencia) {
    item.cantidad++;
  }
}

disminuirCantidad(item: any): void {
  if (item.cantidad > 1) {
    item.cantidad--;
  }
}

// Validación al escribir manualmente en el input
validarCantidad(item: any): void {
  if (item.cantidad > item.existencia) {
    item.cantidad = item.existencia;
  }
  if (item.cantidad < 1 || !item.cantidad) {
    item.cantidad = 1;
  }
}
}