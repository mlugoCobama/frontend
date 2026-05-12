import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrdenesServicioService } from 'src/app/core/services/renault/ordenes-servicio.service';
import Swal from 'sweetalert2';
import { obtenerErroresFormulario, obtenerPrimerError } from 'src/app/core/helpers/errores-forrmulario';
import { PermisosService } from 'src/app/core/services/permisos.service';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';

@Component({
  selector: 'app-filtro-ordenes-servicio',
  templateUrl: './filtro-ordenes-servicio.component.html',
  styleUrl: './filtro-ordenes-servicio.component.css'
})
export class FiltroOrdenesServicioComponent implements OnInit {

  filtroForm!: FormGroup;

  @Input() loading = false;
  @Output() executeFilter = new EventEmitter<any>();
  public hoy = new Date().toISOString().split("T")[0];

  agencias:any[] = [];

  apsList:any[] = [];

  constructor(
      private fb:FormBuilder,
     private ordenesServicioService:OrdenesServicioService,
     private permisosService:PermisosService,
    
  ){}

  ngOnInit(): void {

    this.filtroForm = this.fb.group({

      agencia:['', Validators.required],
      aps:['', Validators.required],
      fechaInicio:[this.hoy, Validators.required],
      fechaFin:[this.hoy, Validators.required]

    });

    this.cargarAgencias();

  }

  cargarAgencias(){

    this.agencias = [
      {intercompania:333, nombre:'Todas', permiso: '' },
      {intercompania:7064, nombre:'Renault Azcapotzalco', permiso: '' },
      {intercompania:7062, nombre:'Renault Ecatepec', permiso: ''},
      {intercompania:7063, nombre:'Renault Vallejo', permiso: ''},
      {intercompania:7061, nombre:'Renault Pachuca', permiso: ''},
    ];

    //  this.agencias = [
    //   {intercompania:333, nombre:'Todas', permiso: 'view opcion os all' },
    //   {intercompania:7064, nombre:'Renault Azcapotzalco', permiso: 'view opcion os ra' },
    //   {intercompania:7062, nombre:'Renault Ecatepec', permiso: 'view opcion os re'},
    //   {intercompania:7063, nombre:'Renault Vallejo', permiso: 'view opcion os rv'},
    //   {intercompania:7061, nombre:'Renault Pachuca', permiso: 'view opcion os rp'},
    // ];

  }

  cargarAps(){
    const agencia = this.filtroForm.value.agencia;

    this.ordenesServicioService.getAps(agencia).subscribe(
          (response: any) => {
            if (response) {
              this.apsList = response.data;
              // this.isLoad = false;
            } else {
              console.log(response.message);
            }
          },
          (error) => {
            console.error("Error fetching data:", error);
          }
        );
    this.filtroForm.patchValue({
      aps:''
    });

  }

  buscar(){

    this.loading = true;
    const filtros = this.filtroForm.value;

    if(this.filtroForm.valid){
      this.executeFilter.emit(filtros);
    }else{
      Swal.fire('Llena todos los campos', obtenerPrimerError(this.filtroForm).toUpperCase(), 'warning');
      this.loading = false;
    }

    

    // console.log(filtros);

    // setTimeout(()=>{
    //   this.loading = false;
    // },1200);

  }

  limpiar(){

    this.filtroForm.reset();
    this.apsList = [];

  }

  tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }


}