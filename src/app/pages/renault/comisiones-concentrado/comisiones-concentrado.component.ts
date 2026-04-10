import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { configTablaConcentrado } from './modelo-concentrado';
import { ConcentradoComisionesService } from 'src/app/core/services/renault/concentrado-comisiones.service';
import { ModalDetalleRubroComponent } from './modal-detalle-rubro/modal-detalle-rubro.component';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { FiltroComsionesGenericoComponent } from 'src/app/shared/ui/filtro-comsiones-generico/filtro-comsiones-generico.component';
import { TablaConcentradoComisionesComponent } from './tabla-concentrado-comisiones/tabla-concentrado-comisiones.component';

@Component({
  selector: 'app-comisiones-concentrado',
  templateUrl: './comisiones-concentrado.component.html',
  styleUrl: './comisiones-concentrado.component.css'
})
export class ComisionesConcentradoComponent implements OnInit{
  public data: any = []
  public columnasVendedor = configTablaConcentrado;
  public isLoad =  false;
  configFiltro = { showEstado: false, showVendedor: false, showTipoVenta: false}
  hayDatos = false;
  public totales;
  public modalRef?: BsModalRef;

   @ViewChild('formFiltro', { static: false }) formFiltro!: FiltroComsionesGenericoComponent;
   @ViewChild('tablaConcentradoComisiones', { static: false }) tablaConcentradoComisiones!: TablaConcentradoComisionesComponent;
  
  constructor(private concentradoComisiones: ConcentradoComisionesService,
     private modalService: BsModalService,
     private alertas:SwalComprsServiceService ){
  }

  ngOnInit(): void {
  }



//  obtenerTotales(rows) {
//   // Buscamos la fila que tenga el texto "TOTAL GENERAL"
//   const totales = rows.find(r => r.vendedor === 'TOTAL GENERAL');
//   return totales || null;
// }

agenciaActual:any = '0';
  buscarDatos(params:any){
    this.isLoad = true;
    this.agenciaActual = params.agencia;
    this.data = [];
    this.concentradoComisiones.getAll(params.agencia).subscribe(
      (response: any) => {
        if (response) {
          this.data = response.data;
          // this.totales = this.obtenerTotales(response.data);
          this.isLoad = false;
        } else {
          console.log(response.message);
          this.isLoad = false;
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
        this.isLoad = false;
      },
    );
  }

generarCorte(): void {

  if (this.seleccionados.length === 0) {
    this.alertas.mostrarAlerta('El corte parece estar vació', 'Selecciona las filas que se incluirán en el corte e intenta nuevamente', 'info', 'info');
    return;
  }

  Swal.fire({
    title: 'Ingresa una clave para identificar el corte posteriormente.',
    text: 'El corte será generado con los datos que se muestran en pantalla.',
    input: 'text',
    inputPlaceholder: 'Ingresa una clave para identificar el corte',
    showCancelButton: true,
    confirmButtonText: 'Enviar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    customClass: {
      confirmButton: 'btn btn-primary m-1',
      cancelButton: 'btn btn-secondary m-1'
    },
    buttonsStyling: false,
    allowOutsideClick: false,
    inputValidator: (value) => {
      if (!value) {
        return 'El campo de clave es obligatorio';
      }
      return null;
    }
  }).then(result => {
    if (!result.isConfirmed || !result.value) return;

    const clave = result.value;
    const datosFiltro = this.formFiltro.getValues();
    const data = {
      fecha_inicio: datosFiltro.fechaInicial,
      fecha_fin: datosFiltro.fechaFinal,
      clave_corte: clave,
      agencia: datosFiltro.agencia,
      comisiones: this.seleccionados
    };

    Swal.fire({
      title: 'Generando corte...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.concentradoComisiones.crearCorte(data).subscribe((response: any) => {
      Swal.close();

      if (response.status === 'success') {
        this.alertas.mostrarAlerta('Listo', response.message, 'success', 'success');
        this.buscarDatos(this.getAgencia());
      } else {
        this.alertas.mostrarAlerta('Error', response.message, 'error', 'danger');
      }
    },(error) => {
        console.error("Error fetching data:", error);
        this.alertas.mostrarAlerta('Error!', error, 'error', 'danger');
    });
  });
}

  private getAgencia(){
    return this.formFiltro.getValues();
  }

  public totalAutorizado(key): number {
    return this.data.reduce((acc, item) => acc + (Number(item[key]) || 0), 0);
  }

  onCellClick(event: any) {
  const item = event.fila
  const rubro = event.campo
  if(item.id !==  null){
    const initialState: ModalOptions = {
        initialState: {
          idVendedor : item.id,
          nroVendedor : item.nro_vendedor_as,
          nombreVendedor : item.vendedor,
          rubro: rubro
        },
        class: "modal-lg",
      };
      this.modalRef = this.modalService.show(
        ModalDetalleRubroComponent,
        initialState,
      );
      this.modalRef.content.closeBtnName = "Close";
      this.modalRef.content.event.subscribe(() => {
         this.buscarDatos(this.getAgencia());
      });
  }
}
seleccionados: any[] = [];

onSeleccionados(registros: any[]) {
  this.seleccionados = registros;
}
}
