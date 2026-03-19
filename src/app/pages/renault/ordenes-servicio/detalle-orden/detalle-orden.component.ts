import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdenesServicioService } from 'src/app/core/services/renault/ordenes-servicio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-orden',
  templateUrl: './detalle-orden.component.html',
  styleUrl: './detalle-orden.component.css'
})
export class DetalleOrdenComponent implements OnInit {

folio: string | null = null;
id: any;
@Input() cita:any;
@Output() setActiveCita = new EventEmitter<any>();
@Output() reload = new EventEmitter<any>();

public isLoad: boolean = false;
isLoading = false;


public avance = 25;
public eventos = [
  {estatus: 'Entrada', fecha: '04/03/2026',  hora: '00:00:00', usuario: 'Juan Pérez', completado: true },
  {estatus: 'Taller', fecha: '04/03/2026',  hora: '00:00:00', usuario: 'Juan Pérez', completado: true },
  {estatus: 'Lavado', fecha: '04/03/2026',  hora: '00:00:00', usuario: 'Juan Pérez', completado: false },
  {estatus: 'Calidad', fecha: '04/03/2026',  hora: '00:00:00', usuario: 'Juan Pérez', completado: false },
  {estatus: 'Entregado', fecha: '04/03/2026',  hora: '00:00:00', usuario: 'Juan Pérez', completado: false },
]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordenesServicio: OrdenesServicioService
    ) {}

ngOnInit() {
    this.folio = this.route.snapshot.paramMap.get('folio');
    this.id = this.route.snapshot.paramMap.get('id');
    this.getDatosEntrada(this.cita.id);
    // ahora puedes usar this.id para cargar datos
  }

  goBack() {
    this.setActiveCita.emit(false);
    this.reload.emit();
    // this.router.navigate(['/renault/ordenes-servicio']);
  }



  ngOnDestroy() {
    // console.log('DetalleComponent destruido');
    // aquí puedes limpiar subscripciones o recursos
  }

  public dataEntrada:any = [] ;
  public getDatosEntrada(id:any){
    this.isLoad= false;
    this.ordenesServicio.getOne(id).subscribe(data => {
      if (data.status == 'success') {
        this.dataEntrada = data.data;
        // console.log(this.dataEntrada);
        // this.setValues();
        if(this.dataEntrada.num_entrada){
          // this.showBtnSave = false;
        }
        this.isLoad= true;
      } else {
        console.log(data.message);
        this.isLoad= true;
      }
    });
  }

  descargarPdf(id: number) {
    this.isLoading = true;

    this.ordenesServicio.descargarPdfOrdenServicio(id).subscribe((archivo: Blob) => {
      const fileURL = URL.createObjectURL(archivo);
      // Abrir en nueva pestaña
      // window.open(fileURL);

      // O forzar descarga
      const a = document.createElement('a');
      a.href = fileURL;
      a.download = 'orden_reparacion_mecanica_no_entrada_'+this.dataEntrada.num_entrada+'.pdf';
      a.click();
      URL.revokeObjectURL(fileURL);
      this.isLoading = false;
    },
        (error) => {
          this.isLoading = false;
          Swal.fire('Ocurrio un error', error, 'error')
        });
  }




}
