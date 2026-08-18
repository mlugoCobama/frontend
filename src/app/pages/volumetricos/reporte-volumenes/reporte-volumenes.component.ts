import { Component, OnInit } from '@angular/core';
import { VisorVolumetricosService } from 'src/app/core/services/volumetricos/visor-volumetricos.service';
import { VolumetricosExportService } from 'src/app/core/services/volumetricos/volumetricos-export-service.service';
import Swal from 'sweetalert2';
import { PermisosService } from 'src/app/core/services/permisos.service';
import { ProcessVolumetricosService } from 'src/app/core/services/volumetricos/process-volumetricos.service';

@Component({
  selector: 'app-reporte-volumenes',
  templateUrl: './reporte-volumenes.component.html',
  styleUrl: './reporte-volumenes.component.css'
})
export class ReporteVolumenesComponent implements OnInit{

  constructor(
    private volumetricos: VisorVolumetricosService,
    private exportService: VolumetricosExportService,
    private permisosService:PermisosService,
    private processVolumetricos: ProcessVolumetricosService
  ){
  }

  public jsonPreview:any;
  public itemSeleccionado = null;
  public isOpenPanelEdicion = false;

  public selectedViewer = 'json';

reportes:any[]=[];
  columnas: any[] = [
    {
      campo:'nombre_empresa',
      etiqueta:'EMPRESA',
      bold: true,
      align: 'center'
    },
    {
      campo:'created_at',
      etiqueta:'FECHA',
      pipe:'date'
    },

    {
      campo:'descripcion',
      etiqueta:'DESCRIPCION'
    },
    {
      campo:'tipo',
      etiqueta:'CLAVE DE INSTALACION',
      align: 'center'
    },
    {
      campo:'fecha_reporte_txt',
      etiqueta:'PERIODO REPORTADO',
      bold: true,
      align: 'center'
    },

  ];

  acciones: any[]=[];

  ngOnInit(){

    this.cargarReportes();

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

  isLoad= false;
  cargarReportes(){
    this.isLoad = true;
    this.volumetricos.getAll()
    .subscribe({
      next:(resp:any)=>{
        this.reportes = resp.data;
        this.isLoad = false;
      },
      error:(err)=>{
          console.log(err);
          this.isLoad = false;
      }
    });

  }

  async verArchivo(item:any){
    this.jsonPreview = null;
    this.selectedViewer = 'json';
    return new Promise<void>((resolve,reject)=>{

      this.volumetricos.getOne(item.id)
      .subscribe({
        next:(resp:any)=>{
          console.group(resp)
          if(resp.tipo == 'json'){
          this.selectedViewer = 'json';
            this.itemSeleccionado = item;
            this.jsonPreview = resp.data;
          }

          if(resp.tipo == 'xml'){
            this.selectedViewer = 'xml';
            this.itemSeleccionado = item;
            const jsonParcial = this.processVolumetricos.convertirXml(resp.data);
            this.jsonPreview = jsonParcial.ControlesVolumetricos
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
                    cancelButton: "btn btn- ms-2 px-4",
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
                    cancelButton: "btn btn- ms-2 px-4",
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

  // descargarXml() {
  //    console.log('funcino2')
  //   this.exportService.descargarXml(this.jsonPreview);
  // }

  public openUpdate(){
    this.isOpenPanelEdicion = true;
    this.verArchivo(this.itemSeleccionado)
  }

  descargarExcel() {
    this.exportService.descargarExcelDesdeServidor(this.itemSeleccionado?.id);
  }

   esExcel(ruta: string): boolean {
    return /\.xl(s|sx|sm|sb)$/i.test(ruta);
  }
}
