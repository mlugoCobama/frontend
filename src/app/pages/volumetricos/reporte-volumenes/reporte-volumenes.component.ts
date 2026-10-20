import { Component, OnInit } from '@angular/core';
import { VisorVolumetricosService } from 'src/app/core/services/volumetricos/visor-volumetricos.service';
import { VolumetricosExportService } from 'src/app/core/services/volumetricos/volumetricos-export-service.service';
import Swal from 'sweetalert2';
import { PermisosService } from 'src/app/core/services/permisos.service';
import { ProcessVolumetricosService } from 'src/app/core/services/volumetricos/process-volumetricos.service';
import { UsuariosService } from 'src/app/core/services/compras/usuarios.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';

@Component({
  selector: 'app-reporte-volumenes',
  templateUrl: './reporte-volumenes.component.html',
  styleUrl: './reporte-volumenes.component.css'
})
export class ReporteVolumenesComponent implements OnInit{

  constructor(
    private usuariosService: UsuariosService,
    private alertasService: SwalComprsServiceService,
    private volumetricos: VisorVolumetricosService,
    private exportService: VolumetricosExportService,
    private permisosService:PermisosService,
    private processVolumetricos: ProcessVolumetricosService
  ){
  }

  public jsonPreview:any;
  public itemSeleccionado = null;
  public isOpenPanelEdicion = false;
  public rawEmpresas: any;

  public selectedViewer = 'json';
  public reportesFiltrados: any[] = [];
  public empresasFiltro: string[] = [];
  public periodos: any[] = [];
  public reportes:any[]=[];
  public acciones: any[]=[];
  public acuses:any[] = [];
  public isLoad= false;

  badgedMapEstatus = {
      'GENERADO': 'rounded-pill bg-primary-subtle text-primary font-size-11 fw-semibold',
      'ENVIADO': 'rounded-pill bg-info-subtle text-info font-size-11 fw-semibold',
      'RECHAZADO': 'rounded-pill bg-danger-subtle text-danger font-size-11 fw-semibold',
      'ACEPTADO': 'rounded-pill bg-success-subtle text-success font-size-11 fw-semibold'
    }

  columnas: any[] = [
    { campo:'nombre_empresa', etiqueta:'EMPRESA', bold: true, align: 'center' },
    { campo:'created_at', etiqueta:'FECHA', pipe:'date' },
    { campo:'descripcion', etiqueta:'DESCRIPCION' },
    { campo:'tipo', etiqueta:'CLAVE DE INSTALACION', align: 'center'},
    { campo:'fecha_reporte_txt', etiqueta:'PERIODO REPORTADO', bold: true, align: 'center'},
    { campo:'estatus_txt', etiqueta:'ESTATUS', bold: true, align: 'center', badge: true, badgeMap: this.badgedMapEstatus},
  ];

  ngOnInit(){
    this.cargarReportes();
    this.getEmpresas();
    this.acciones = [
      {
        icono:'fas fa-eye',
        clase:'btn-primary',
        tooltip:'Ver JSON',
        accion: async(item:any)=>{
          await this.verArchivo(item);
        }
       }
    ];
  }

  cargarReportes() {
    this.isLoad = true;

    this.volumetricos.getAll()
      .subscribe({
        next: (resp: any) => {
          this.reportes = resp.data ?? [];
          this.reportesFiltrados = [...this.reportes];
          this.isLoad = false;
        },
        error: (err) => {
          console.log(err);
          this.isLoad = false;
        }
      });
  }

  async verArchivo(item:any, inicial = null){
    this.jsonPreview = inicial;
    this.selectedViewer = 'json';
    return new Promise<void>((resolve,reject)=>{
      this.volumetricos.getOne(item.id)
      .subscribe({
        next:(resp:any)=>{
          if(resp.tipo == 'json'){
          this.selectedViewer = 'json';
            this.itemSeleccionado = item;
            this.jsonPreview = resp.data;
            this.acuses = resp.reporte.acuses;
            this.itemSeleccionado.estatus = resp.reporte.estatus;
          }

          if(resp.tipo == 'xml'){
            this.selectedViewer = 'xml';
            this.itemSeleccionado = item;
            const jsonParcial = this.processVolumetricos.convertirXml(resp.data);
            this.jsonPreview = jsonParcial.ControlesVolumetricos;
            this.acuses = resp.reporte.acuses;
            this.itemSeleccionado.estatus = resp.reporte.estatus;
          }

          resolve();
        },
        error:(err)=>{
          console.log(err);
          reject();
        }
      });

    });

  }

  tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }

  public volver(){
    this.jsonPreview = null;
    this.itemSeleccionado = null;
    this.isOpenPanelEdicion = false;
    this.cargarReportes();
  }

  public setItemSeleccionado(item:any){
    this.itemSeleccionado =  item;
  }

  public eliminarRegistro(){
      Swal.fire({
        title: "¿Estas seguro?",
        text: "Se eliminara el registro seleccionado",
        icon: "error",
        confirmButtonText: "Eliminiar",
        showCancelButton: true,
        reverseButtons: true,
        customClass: {
          confirmButton: "btn btn-danger ms-2 px-4 fw-semibold",
          cancelButton: "btn btn-primary ms-2 px-4 fw-semibold",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.volumetricos.delete(this.itemSeleccionado?.id).subscribe(
            (response:any) => {
              if (response.status === "success") {
                // console.log(response.message);
                this.cargarReportes();
                Swal.fire({
                  title: "Borrado!",
                  text: "El registro ha sido borrado.",
                  buttonsStyling: false,
                  icon: "success",
                  customClass: {
                    confirmButton: "btn btn-danger px-4",
                  },
                });
              } else {
                console.log(response.message);
                Swal.fire({
                  title: "Error!",
                  text: "Your file has been deleted.",
                  buttonsStyling: false,
                  icon: "success",
                  customClass: {
                    confirmButton: "btn btn-danger px-4",
                  },
                });
              }
            },
            (error) => {
              console.error("Error fetching data:", error);
            }
          );
        }
        this.isLoad = false;
      });
  }

  descargarJson() {
    this.exportService.descargarJsonDesdeServidor(this.itemSeleccionado?.id, `${this.itemSeleccionado?.descripcion}_${this.itemSeleccionado?.nombre_empresa}_${this.itemSeleccionado?.fecha_reporte_txt}.${this.selectedViewer}`);
  }


  public openUpdate(){
    this.isOpenPanelEdicion = true;
    this.verArchivo(this.itemSeleccionado)
  }

  descargarExcel() {
    this.exportService.descargarExcelDesdeServidor(this.itemSeleccionado?.id);
  }

  descargarAcuse(id:number, ruta:string) {
    const nombre = ruta.split('/').pop();
    this.exportService.descargarAcuse(id, nombre );
  }

  esExcel(ruta: string): boolean {
    return /\.xl(s|sx|sm|sb)$/i.test(ruta);
  }

    /**
   * Recupera el catalogo de empresas (Select empresa)
   */
  public getEmpresas() {
    this.usuariosService.getEmpresas().subscribe(
      (response) => {
        if (response) {
          const rawData = response.data;

          const intercompaniasExcluidas = [200, 119, 201, 700, 333, 119, 200 ];
          this.rawEmpresas = rawData.filter((objeto: any) => {
          const noEsAgencia = objeto.isAgencia === false; // o simplemente !objeto.isAgencia
          const noEsIntercompaniaExcluida = !intercompaniasExcluidas.includes(objeto.intercompania);

          return noEsAgencia && noEsIntercompaniaExcluida;
        });
        } else {
          this.alertasService.mostrarAlerta(
            "Error", response.message, "error", "danger" );
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta(
          "Error", `Error fetching data: ${error}`, "error", "danger"
        );
      }
    );
  }


  aplicarFiltros(filtros: any) {
    this.reportesFiltrados = this.reportes.filter(reporte => {
      const coincideEmpresa = !filtros.empresa || reporte.nombre_empresa === filtros.empresa;
      const coincideAnio = !filtros.anio || this.obtenerAnio(reporte.fecha_reporte_txt) ===  filtros.anio;
      const coincideMes = !filtros.mes || this.obtenerMes(reporte.fecha_reporte_txt) === filtros.mes;
      const coincideTipo = !filtros.tipoInstalacion || reporte.tipo?.toUpperCase().startsWith(filtros.tipoInstalacion);
      return ( coincideEmpresa && coincideAnio && coincideMes && coincideTipo);
    });
  }

  private obtenerMes(periodo: string): number | null {
    if (!periodo) {
      return null;
    }
    const texto = String(periodo).toUpperCase();
    const mesesMap: { [key: string]: number } = {
      ENERO: 1,
      FEBRERO: 2,
      MARZO: 3,
      ABRIL: 4,
      MAYO: 5,
      JUNIO: 6,
      JULIO: 7,
      AGOSTO: 8,
      SEPTIEMBRE: 9,
      OCTUBRE: 10,
      NOVIEMBRE: 11,
      DICIEMBRE: 12
    };

    const mesEncontrado = Object.keys(mesesMap).find(mes => texto.includes(mes));
    return mesEncontrado ? mesesMap[mesEncontrado] : null;
  }

  private obtenerAnio(periodo: string): number | null {
    if (!periodo) {
      return null;
    }
    const match = String(periodo).match(/\d{4}/);
    return match ? Number(match[0]) : null;
  }
}
