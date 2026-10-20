import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GestionServiciosService } from 'src/app/core/services/gestion-servicios/gestion-servicios.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';

@Component({
  selector: 'app-form-servicio-empresa',
  templateUrl: './form-servicio-empresa.component.html',
  styleUrl: './form-servicio-empresa.component.css'
})
export class FormServicioEmpresaComponent implements OnInit{
  contratoForm!: FormGroup;

  empresas: any[] = [];   // Se llenan desde consulta
  servicios: any[] = [];  // Se llenan desde consulta
  proveedores: any[] = []; // Se llenan desde consulta

  monedas = [
    { value: 'MXN', label: 'Pesos Mexicanos' },
    { value: 'USD', label: 'Dólares' }
  ];

  constructor(private fb: FormBuilder, 
              private gestionServicio: GestionServiciosService,
              private alertas: SwalComprsServiceService
            ) {}

  ngOnInit(): void {
    this.contratoForm = this.fb.group({
      empresa: ['', Validators.required],
      servicio: ['', Validators.required],
      proveedor: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: [''],
      identificadorExterno: [''],
      moneda: ['MXN', Validators.required],
      periodicidad: ['', Validators.pattern(/^[0-9]+$/)],
      fechaInicio: ['', Validators.required],
      fechaFin: [''],
      diaPago: ['', Validators.pattern(/^[0-9]+$/)],
      diaCorte: ['', Validators.pattern(/^[0-9]+$/)],
      renovable: [false],
      costoBase: ['', Validators.pattern(/^\d+(\.\d{1,2})?$/)]
    });

    
    this.loadEmpresas();
    this.loadServicios();
    // this.loadProveedores();
  }

  // Métodos de utilidad
  getFormValues() {
    return this.contratoForm.value;
  }

  setFormValues(values: any) {
    this.contratoForm.patchValue(values);
  }

  resetForm() {
    this.contratoForm.reset({
      moneda: 'MXN',
      renovable: false
    });
  }

  public loadEmpresas(){
    this.gestionServicio.getEmpresas().subscribe(
      (response:any) => {
        if(response.status == 'success'){
          this.empresas = response.data;
          console.log(this.empresas)
          // this.buscando = false;
          // this.isLoad = false;
        }else{
          this.alertas.mostrarAlerta('Error', 'Algo salio mal en la búsqueda', 'info', 'info');
          // this.buscando = false;
          // this.isLoad = false;
          return;
        }
      },(error) => {
          this.alertas.mostrarAlerta("Error", `Error fetching data: ${error}`, "error" , "danger" );
          // this.buscando = false;
          // this.isLoad = false;
          return;
      }
    )
  }

  public loadServicios(){
    this.gestionServicio.getCatServicios().subscribe(
      (response:any) => {
        if(response.status == 'success'){
          this.servicios = response.data.servicios;
          this.proveedores = response.data.provedores;
          console.log(this.servicios)
          // this.buscando = false;
          // this.isLoad = false;
        }else{
          this.alertas.mostrarAlerta('Error', 'Algo salio mal en la búsqueda', 'info', 'info');
          // this.buscando = false;
          // this.isLoad = false;
          return;
        }
      },(error) => {
          this.alertas.mostrarAlerta("Error", `Error fetching data: ${error}`, "error" , "danger" );
          // this.buscando = false;
          // this.isLoad = false;
          return;
      }
    )
  }
}
