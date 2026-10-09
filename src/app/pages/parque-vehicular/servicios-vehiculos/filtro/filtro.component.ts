import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { obtenerPrimerError } from 'src/app/core/helpers/errores-forrmulario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-filtro-cobama-service',
  templateUrl: './filtro.component.html',
  styleUrl: './filtro.component.css'
})
export class FiltroComponent implements OnInit {

  filtroForm!: FormGroup;

  @Input() loading = false;
  @Output() executeFilter = new EventEmitter<any>();
  public hoy = new Date().toISOString().split("T")[0];
  public haceUnMes: string = (() => {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().split("T")[0];
})();

  @Input() empresas:any[] = [];
  @Input() proveedores:any[] = [];

  apsList:any[] = [];

  constructor(
      private fb:FormBuilder,
    //  private ordenesServicioService:OrdenesServicioService,
    //  private permisosService:PermisosService,

  ){}

  ngOnInit(): void {
    this.filtroForm = this.fb.group({
      intercompania:[''],
      proveedor:[''],
      fechaInicio:[this.haceUnMes],
      fechaFin:[this.hoy]

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
    // if (!permiso)
      return true;
    // return this.permisosService.tienePermiso(permiso);
  }

}
