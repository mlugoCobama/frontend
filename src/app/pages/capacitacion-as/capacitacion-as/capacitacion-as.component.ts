import { Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from 'rxjs';
import { AdministracionService } from 'src/app/core/services/capacitaciones/administracion.service';



@Component({
  selector: 'app-capacitacion-as',
  templateUrl: './capacitacion-as.component.html',
  styleUrl: './capacitacion-as.component.css'
})
export class CapacitacionAsComponent implements OnInit, OnDestroy{

  public modulo: string = ''
  public submodulo: string = ''
  private routeSub: Subscription;

  public tabs: any;
  public permisos: any = [];

  constructor(
    private route: ActivatedRoute,
    private administracion:  AdministracionService
  ){}
  
  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.modulo = params.get("modulo") || '';
      this.submodulo = params.get("submodulo") || '';
      this.getAll();
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  private getAll() {
      this.administracion.getFunciones(this.modulo, this.submodulo).subscribe(
        (response) => {
          if (response) {
            if(response.data.length > 0){
              this.tabs = this.funcionesToTabs(response.data)
              console.log(response.data)
              
            }else{
              this.tabs = [];
            }
              console.log(this.tabs)
          } else {
            console.log(response.message);
          }
        },
        (error) => {
          console.error("Error fetching data:", error);
        }
      );
    }

  private funcionesToTabs(funciones){
  let tabs = [];  
  if(funciones.length > 0){
    tabs = funciones.map((funcion, index) => ({
      heading: funcion.nombre,
      content: funcion.nombre,
      active: index === 0, // solo el primero activo
      video: funcion.ruta_video,
      permiso: funcion.permiso
    }));

    return tabs;
  } 
  } 

}
