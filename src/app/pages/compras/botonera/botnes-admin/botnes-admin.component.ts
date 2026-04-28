import { Component, Input, EventEmitter, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { EstadoSolicitud } from '../../compras/estado-solicitud.enum';
import { ComprasService } from 'src/app/core/services/compras/compras.service';
import { PermisosService } from 'src/app/core/services/permisos.service';
import { ReportesComprasService } from 'src/app/core/services/compras/reportes-compras.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-botnes-admin',
  templateUrl: './botnes-admin.component.html',
  styleUrl: './botnes-admin.component.css'
})
export class BotnesAdminComponent implements OnInit{

  public enEsts = EstadoSolicitud;

  @Input() isLoadingGenerarOrden = false;
  @Input() isLoadingCotizar = false;
  @Input() isLoadingVolverACotizar = false;
  @Input() isLoadingCancelar = false;
  @Input() isLoadingDevolverRevision = false;
  
  @Input() status :  any = false;
  @Input() mostrarBoton :  any;
  @Input() solicitudSelecionada :  any;

  @Input() tipoCompras: any;
  @Input() tiposPermitidos: any = [];
  

  public downloading:boolean = false

  @Output() btnGenerarOC = new EventEmitter<void>();
  @Output() mostrarCotizacion = new EventEmitter<void>();
  @Output() cancelarSolicitud = new EventEmitter<void>();
  @Output() devolverRevision = new EventEmitter<void>();
  @Output() volverCotizar = new EventEmitter<void>();

  constructor(
    public comprasService: ComprasService,
    private permisosService: PermisosService,
    private reportesComprasService: ReportesComprasService
  ){}

  public ngOnInit(): void {
    
  }
      
  clickGenerarOrden() {
      this.btnGenerarOC.emit();
  }

  clickCotizar() {
      this.mostrarCotizacion.emit();
  }

  clickVolverACotizar() {
      this.volverCotizar.emit();
  }

  clickCancelar() {
      this.cancelarSolicitud.emit();
  }

  clickDevolverRevision() {
      this.devolverRevision.emit();
  }

  tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }

  onDownload1(): void {
    this.downloading = true;
    // setTimeout(() => {
      this.reportesComprasService.getReportFile(this.tipoCompras, 2, null, null)
      .subscribe(response => {
        this.reportesComprasService.downloadBlob(response, this.tipoCompras, 2);
        this.downloading = false;
      }, error => {
        Swal.fire('Error', 'Ocurrio un error al descargar el archivo', 'error')
        console.error('Error al descargar el archivo', error);
        this.downloading = false;
      });
    // }, 2000);
    
  }

async onDownload(): Promise<void> {
  const hoy = new Date();

  // const primerDiaMesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
  //   .toISOString().slice(0, 10);
  const primerDiaMesActual = hoy.toISOString().slice(0, 10);
  const primerDiaMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1)
    .toISOString().slice(0, 10);

  const tiposPermitidos = this.tiposPermitidos;

  const opcionesTipo: { value: string; label: string }[] = [
    { value: "1", label: "Compras Generales" },
    { value: "2", label: "Compras Macro Taller" },
    { value: "3", label: "Compras Recursos Tecnológicos" },
  ];

  const opcionesStatus: { value: string; label: string }[] = [
    { value: "1", label: "En espera de autorización" },
    { value: "2", label: "Solicitado" },
    { value: "3", label: "En cotización" },
    { value: "4", label: "Cancelados" },
    { value: "5", label: "Orden de compra" },
    // { value: "6", label: "Autorizado" },
    // { value: "7", label: "Autorizado a pago" },
    { value: "8", label: "En surtido" },
    { value: "9", label: "Entregado" },
    { value: "10", label: "Facturado" },
    { value: "11", label: "Solicitado a pago" },
    { value: "12", label: "Pagado" },
    { value: "13", label: "Cargar complemento" },
    { value: "14", label: "Finalizada" },
  ];

  const opcionesFiltradas = opcionesTipo
    .filter(op => tiposPermitidos.includes(op.value))
    .map(op => {
      const selected = tiposPermitidos.length === 1 ? "selected" : "";
      return `<option value="${op.value}" ${selected}>${op.label}</option>`;
    }).join("");

  const hidden = tiposPermitidos.length === 1 ? "hidden" : "";

  const status = opcionesStatus
    .map(op => {  return `<option value="${op.value}">${op.label}</option>`; })
    .join("");

  const { value: formValues } = await Swal.fire({
    title: 'Filtros del reporte',
    html: `
      <form class="container">
        <div class="row mb-2">
          <div class="col-12">
            <label class="form-label">Estatus</label>
            <select id="estatus" class="form-select form-select-sm">
              <option value="">Seleccione...</option>
              ${status}
            </select>
          </div>
        </div>

        <div class="row mb-2">
          <div class="col-md-6">
            <label class="form-label">Fecha inicial</label>
            <input id="fecha_inicial" type="date" class="form-control form-control-sm" value="${primerDiaMesAnterior}">
          </div>
          <div class="col-md-6">
            <label class="form-label">Fecha final</label>
            <input id="fecha_final" type="date" class="form-control form-control-sm" value="${primerDiaMesActual}">
          </div>
        </div>

        <div class="row mb-2" ${hidden}>
          <div class="col-12">
            <label class="form-label">Tipo</label>
            <select id="tipo" class="form-select form-select-sm">
              <option value="">Seleccione...</option>
              ${opcionesFiltradas}
            </select>
          </div>
        </div>
      </form>
    `,
    customClass: {
      popup: 'text-start',
      confirmButton: 'btn btn-sm btn-success',  
      cancelButton: 'btn btn-sm btn-secondary',
    },
    focusConfirm: false,
    reverseButtons: true,
    confirmButtonText: '<i class="fa fa-download"></i> Descargar',
    cancelButtonText: '<i class="fa fa-times"></i> Cancelar',
    showCancelButton: true,
    preConfirm: () => {
      return {
        estatus: (document.getElementById('estatus') as HTMLInputElement).value,
        fechaInicial: (document.getElementById('fecha_inicial') as HTMLInputElement).value,
        fechaFinal: (document.getElementById('fecha_final') as HTMLInputElement).value,
        tipo: (document.getElementById('tipo') as HTMLInputElement).value,
      };
    }
  });

  if (!formValues) return;

  this.downloading = true;

  this.reportesComprasService
    .getReportFile(formValues.tipo, formValues.estatus, formValues.fechaInicial,  formValues.fechaFinal)
    .subscribe(
      (response) => {
        this.reportesComprasService.downloadBlob(
          response,
          formValues.tipo,
          formValues.estatus
        );
        this.downloading = false;
      },
      (error) => {
        Swal.fire('Error', 'Ocurrió un error al descargar el archivo', 'error');
        console.error('Error al descargar el archivo', error);
        this.downloading = false;
      }
    );
}
}
