import { Component, Input, EventEmitter, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { EstadoSolicitud } from '../../compras/estado-solicitud.enum';
import { ComprasService } from 'src/app/core/services/compras/compras.service';
import { PermisosService } from 'src/app/core/services/permisos.service';
import { ReportesComprasService } from 'src/app/core/services/compras/reportes-compras.service';

@Component({
  selector: 'app-botnes-admin',
  templateUrl: './botnes-admin.component.html',
  styleUrl: './botnes-admin.component.css'
})
export class BotnesAdminComponent implements OnInit{

  public enEsts = EstadoSolicitud;
  
  @Input() status :  any = false;
  @Input() mostrarBoton :  any;
  @Input() solicitudSelecionada :  any;

  @Input() tipoCompras: any;

  @Output() btnGenerarOC = new EventEmitter<void>();
  @Output() mostrarCotizacion = new EventEmitter<void>();
  @Output() cancelarSolicitud = new EventEmitter<void>();

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

  clickCancelar() {
      this.cancelarSolicitud.emit();
  }

  tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }

  onDownload(): void {
    this.reportesComprasService.getReportFile(this.tipoCompras, 2)
      .subscribe(response => {
        this.reportesComprasService.downloadBlob(response, this.tipoCompras, 2);
      }, error => {
        console.error('Error al descargar el archivo', error);
      });
  }

}
