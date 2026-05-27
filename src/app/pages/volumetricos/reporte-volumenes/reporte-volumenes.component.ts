import { Component, OnInit } from '@angular/core';
import { VisorVolumetricosService } from 'src/app/core/services/volumetricos/visor-volumetricos.service';

@Component({
  selector: 'app-reporte-volumenes',
  templateUrl: './reporte-volumenes.component.html',
  styleUrl: './reporte-volumenes.component.css'
})
export class ReporteVolumenesComponent implements OnInit{

  constructor(private volumetricos: VisorVolumetricosService){
  }

  public jsonPreview:any;

reportes:any[]=[];

  columnas: any[] = [
    {
      campo:'empresa',
      etiqueta:'Empresa'
    },
    {
      campo:'tipo',
      etiqueta:'Tipo'
    },
    {
      campo:'descripcion',
      etiqueta:'Descripción'
    },
    {
      campo:'created_at',
      etiqueta:'Fecha',
      pipe:'date'
    }
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
    return new Promise<void>((resolve,reject)=>{

      this.volumetricos.getOne(item.id)
      .subscribe({
        next:(resp:any)=>{

          // console.log(resp.data);

          // mostrar preview
          this.jsonPreview = resp.data;

          resolve();

        },
        error:(err)=>{

          console.log(err);

          reject();

        }
      });

    });

  }

  public volver(){
    this.jsonPreview = null;
    this.cargarReportes();
  }
}
