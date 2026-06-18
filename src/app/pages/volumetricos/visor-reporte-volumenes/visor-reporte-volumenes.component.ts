import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-visor-reporte-volumenes',
  templateUrl: './visor-reporte-volumenes.component.html',
  styleUrl: './visor-reporte-volumenes.component.css'
})
export class VisorReporteVolumenesComponent implements OnInit{
  @Input() dataJson:any = [];
  public producto:any;
  public recepciones:any;
  public entregas:any;
  public existencias:any;

  ngOnInit(): void {
    this.getPrincipalBlock();
  }

  public getPrincipalBlock(){
    this.producto = (this.dataJson['Producto'][0]) ? this.dataJson['Producto'][0] : null;
    this.recepciones = (this.producto['ReporteDeVolumenMensual']['Recepciones']) ? this.producto['ReporteDeVolumenMensual']['Recepciones'] : null;
    this.entregas = (this.producto['ReporteDeVolumenMensual']['Entregas']) ? this.producto['ReporteDeVolumenMensual']['Entregas'] : null;
    this.existencias = (this.producto['ReporteDeVolumenMensual']['ControlDeExistencias']) ? this.producto['ReporteDeVolumenMensual']['ControlDeExistencias'] : null;
  }


    
  }

