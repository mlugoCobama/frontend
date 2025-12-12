import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TerjetaClienteService } from 'src/app/core/services/tarjetas-clientes/terjeta-cliente.service';

import Swal from 'sweetalert2';
import { CatEstadosService } from "src/app/core/services/cat-estados.service";

@Component({
  selector: 'app-wizzard-tarjetas-de-clientes',
  templateUrl: './wizzard-tarjetas-de-clientes.component.html',
  styleUrl: './wizzard-tarjetas-de-clientes.component.css'
})
export class WizzardTarjetasDeClientesComponent implements OnInit {
  currentStep = 1;
  totalSteps = 7;
  estados:any

  // FormGroups para cada paso
  agenciaForm!: FormGroup;
  personalForm!: FormGroup;
  contactForm!: FormGroup;
  tipoClienteForm!: FormGroup;
  atencionForm!: FormGroup;
  intencionCompraForm!: FormGroup;
  vehiculoClienteForm!: FormGroup;

  // Datos de ejemplo
  agenciasNissan: any[] = [];
  opcionesSelectCita: any[] = [];
  servicios: any[] = [];
  coleccionCita: any[] = [];
  coleccionNoCita: any[] = [];

  constructor(private fb: FormBuilder,
     private tarjetaClientes: TerjetaClienteService,
     private catEstadosService: CatEstadosService
    ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadData();
    this.selectLocalidad();
  }

  initializeForms(): void {
    // Step 1: Identificación de agencia
    this.agenciaForm = this.fb.group({
      agencia: new FormControl('', [Validators.required]),
      asesor_ventas:  new FormControl('', [Validators.required]),
      no_sicop:  new FormControl('', [Validators.required]),
    });

    // Step 2: Datos personales
    this.personalForm = this.fb.group({
      nombre_cliente: ['', Validators.required],
      direccion: ['', Validators.required],
      ciudad: ['', Validators.required],
      estado: ['', Validators.required]
    });

    // Step 3: Datos de contacto
    this.contactForm = this.fb.group({
      email_personal: ['', [Validators.required, Validators.email]],
      email_trabajo: ['', Validators.email],
      telefono_principal: ['', Validators.required],
      telefono_secundario: [''],
      telefono_adicional: ['']
    });

    // Step 4: Tipo de cliente
    this.tipoClienteForm = this.fb.group({
      tiene_cita: ['', Validators.required],
      tipo_contacto: ['', Validators.required],
      cual_publicidad: ['']
    });

    // Step 5: Atención al cliente
    this.atencionForm = this.fb.group({
      servicio: ['', Validators.required],
      notas_apv: ['', Validators.required],
      notas_gv: ['', Validators.required]
    });

    // Step 6: Intención de compra
    this.intencionCompraForm = this.fb.group({
      cliente_quiere: ['', Validators.required],
      anio: [''],
      modelo: [''],
      estilo: [''],
      color: [''],
      stock_vin: [''],
      equipo_particular: ['']
    });

    // Step 7: Vehículo del cliente
    this.vehiculoClienteForm = this.fb.group({
      anio_vehiculo: [''],
      modelo_vehiculo: [''],
      estilo_vehiculo: [''],
      color_vehiculo: [''],
      ac: [false],
      pw: [false],
      pl: [false],
      cruise: [false],
      tilt: [false],
      auto: [false],
      x4x4: [false],
      cd: [false],
      sat: [false],
      navi: [false],
      kilometraje: [''],
      vin: [''],
      costo_pagar: [''],
      acv: [''],
      telefono_banco: ['']
    });
  }

  loadData(): void {
    // Cargar datos de ejemplo
    this.agenciasNissan = [
    {intercompania:'730', nombre: 'Nissan Azcapotzalco'},
    {intercompania:'714', nombre: 'Nissan Campestre'},
    {intercompania:'710', nombre: 'Nissan Universidad'},
    {intercompania:'0', nombre: 'Nissan Insurgentes'},
  ];

  this.coleccionCita = [
    {clave: '1', descripcion: 'Cliente' },
    {clave: '2', descripcion: 'Digital' },
    {clave: '3', descripcion: 'Recom' },
    {clave: '4', descripcion: 'Llamó' },
    {clave: '5', descripcion: 'Seg.' },
    {clave: '6', descripcion: 'P.R.-Otro' },
  ]

  this.coleccionNoCita = [
    {clave: '4', descripcion: 'Llamó' },
    {clave: '7', descripcion: 'Regreso' },
    {clave: '8', descripcion: 'Visita #1' },
    {clave: '5', descripcion: 'Seg.' },
    {clave: '6', descripcion: 'P.R.-Otro' },
    {clave: '3', descripcion: 'Recom' },
    {clave: '1', descripcion: 'Cliente' },
    {clave: '2', descripcion: 'Digital' },
  ]

  this.servicios = [
    {clave: '1', descripcion: 'Presen' },
    {clave: '2', descripcion: 'Demo' },
    {clave: '3', descripcion: 'Camino' },
    {clave: '4', descripcion: 'Escribió' },
    {clave: '5', descripcion: 'T/O' },
    {clave: '6', descripcion: 'Compró' },
  ]

   this.opcionesSelectCita = [];
  }

  getCurrentForm(): FormGroup {
    switch (this.currentStep) {
      case 1: return this.agenciaForm;
      case 2: return this.personalForm;
      case 3: return this.contactForm;
      case 4: return this.tipoClienteForm;
      case 5: return this.atencionForm;
      case 6: return this.intencionCompraForm;
      case 7: return this.vehiculoClienteForm;
      default: return this.agenciaForm;
    }
  }

  isCurrentStepValid(): boolean {
    console.log(this.getCurrentForm().errors)
    return this.getCurrentForm().valid;
  }

  getProgressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  nextStep(): void {
    const currentForm = this.getCurrentForm();
    // Marcar todos los campos como tocados para mostrar errores
    this.getCurrentForm().markAllAsTouched();
    Object.keys(currentForm.controls).forEach(key => {
      currentForm.get(key)?.markAsTouched();
    });

    if (currentForm.valid && this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    // Validar que todos los pasos anteriores estén completos
    for (let i = 1; i < step; i++) {
      this.currentStep = i;
      if (!this.getCurrentForm().valid) {
        // Marcar campos como tocados
        Object.keys(this.getCurrentForm().controls).forEach(key => {
          this.getCurrentForm().get(key)?.markAsTouched();
        });
        return;
      }
    }
    this.currentStep = step;
  }

  selectChange(event: any): void {
    const value = event.target.value;
    this.opcionesSelectCita = value === '1' ? this.coleccionCita : this.coleccionNoCita;
  }

  submitForm(): void {
    // Validar todos los formularios
    const allForms = [
      this.agenciaForm,
      this.personalForm,
      this.contactForm,
      this.tipoClienteForm,
      this.atencionForm,
      this.intencionCompraForm,
      this.vehiculoClienteForm
    ];

    let isValid = true;
    allForms.forEach(form => {
      Object.keys(form.controls).forEach(key => {
        form.get(key)?.markAsTouched();
      });
      if (!form.valid) {
        isValid = false;
      }
    });

    if (isValid) {
      const formData = {
        agencia: this.agenciaForm.value,
        personal: this.personalForm.value,
        contacto: this.contactForm.value,
        tipoCliente: this.tipoClienteForm.value,
        atencion: this.atencionForm.value,
        intencionCompra: this.intencionCompraForm.value,
        vehiculoCliente: this.vehiculoClienteForm.value
      };

      console.log(formData)
      this.tarjetaClientes.saveTarjetaCliente(formData)
      .subscribe({
        next: (resp) => 
          Swal.fire('Listo', resp.message, 'success').then(() => {
            this.resetAllForms();
          })
          // alert('Formulario enviado exitosamente!')
          ,
        error: (err) => Swal.fire('Listo', err, 'success')
      });
    } else {
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'success')
      // alert('Por favor complete todos los campos requeridos');
    }
  }

  resetAllForms(){
    this.agenciaForm.reset();
    this.personalForm.reset();
    this.contactForm.reset();
    this.tipoClienteForm.reset();
    this.atencionForm.reset();
    this.intencionCompraForm.reset();
    this.vehiculoClienteForm.reset();
    this.goToStep(1);
  }

  //LLena el select localidad desde cat_estados.json
  public selectLocalidad() {
  this.catEstadosService.getData().subscribe((data) => {
       this.estados = data;
     });
  }
  
}