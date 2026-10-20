import { Component, Input, OnInit } from '@angular/core';
import { ComprasService } from 'src/app/core/services/compras/compras.service';
import { EstadoSolicitud } from "../../estado-solicitud.enum";
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";
import { CotizacionesService } from "src/app/core/services/compras/cotizaciones/cotizaciones.service";
import { PermisosService } from "src/app/core/services/permisos.service";
@Component({
  selector: 'app-table-detalles-solicitud-seg',
  templateUrl: './table-detalles-solicitud-seg.component.html',
  styleUrl: './table-detalles-solicitud-seg.component.css'
})
export class TableDetallesSolicitudSegComponent implements OnInit{
  constructor(
    public compras: ComprasService,
    public alertasService: SwalComprsServiceService,
    public cotizacionesService: CotizacionesService,
    public permisosService: PermisosService
  ){}

  @Input() mostrarTotal: boolean = false;
  @Input() solicitudCompra: any;

  public detalles = [];
  public cotProv: any[] = [];
  public enEsts = EstadoSolicitud;

  public isLoad: boolean = true;
  public mostrarObs: boolean = false;

  ngOnInit(): void {
    this.getDetalles();
  }

    public getDetalles() {
    this.compras.getOne(this.solicitudCompra.id).subscribe(
      (response) => {
        if (response) {
          this.detalles = response.data;
          if (this.solicitudCompra.estatus >= this.enEsts.EnCotizacion) {
            this.getProveedoresCotizacion();
            this.mostrarTotal = true;
          }else{
            this.isLoad = false;
          } 
        } else {
          this.alertasService.mostrarAlerta("Error guardando los datos:", response.message, "error", "danger");
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta("Error guardando los datos:", error, "error", "danger");
      }
    );
  }

   public getProveedoresCotizacion() {
  this.cotizacionesService.getOne(this.solicitudCompra.id).subscribe(
    (response) => {
      if (response) {

        this.cotProv = response.data.map((prov:any) => {
          const detallesMap: any = {};

          prov.detalles.forEach((d:any) => {
            detallesMap[d.detalle_solicitud_id] = Number(d.importe_unitario);
          });

          return {
            ...prov,
            detallesMap
          };
        });

        if (this.cotProv.length > 0) {
          this.calcularTotales();
        }

        this.isLoad = false;

      } else {
        this.alertasService.mostrarAlerta("Error guardando los datos:", response.message, "error", "danger");
      }
    },
    (error) => {
      this.alertasService.mostrarAlerta("Error guardando los datos:", error, "error", "danger");
    }
  );
}

totals: { [key: string]: number } = {};
totalMasBajo: number = 0;


calcularTotales(): void {
    this.totals = {};

    this.cotProv.forEach(prov => {
      const proveedorId = prov.proveedores_id.id;
      let total = 0;

      prov.detalles.forEach(det => {
        const precio = parseFloat(det.importe_unitario);
        const cantidad = det.detalle_solicitud.cantidad;
        total += precio * cantidad;
      });

      this.totals[`precio_${proveedorId}`] = total;
    });

    // Calcular el total más bajo para resaltar en la tabla
    const valores = Object.values(this.totals);
    this.totalMasBajo = Math.min(...valores);
  }

  tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }
  
  findDetalle(){

  }
}
