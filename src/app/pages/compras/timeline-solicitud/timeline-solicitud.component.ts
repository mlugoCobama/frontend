import { Component, Input, OnInit } from '@angular/core';
import { ComprasService } from 'src/app/core/services/compras/compras.service';
@Component({
  selector: 'app-timeline-solicitud',
  templateUrl: './timeline-solicitud.component.html',
  styleUrl: './timeline-solicitud.component.css'
})
export class TimelineSolicitudComponent implements OnInit{

  constructor(
    private compras: ComprasService
  ){}

  @Input() solicitudCompra:any;
  public isLoad: boolean = true;
  public showList: boolean = false

  ngOnInit(): void {
    this.getSeguimiento();
  }

  public events: any[] = [];

  private getSeguimiento(){
        this.compras.getSeguimientoSolicitud( this.solicitudCompra?.id).subscribe(
          (response) => {
            if (response) {
              this.events = response.data;
    
              this.isLoad = false;
              this.showList = true;
            } else {
              console.log(response.message);
            }
          },
          (error) => {
            console.error("Error fetching data:", error);
          }
        );
  }

  



  public getDayDifference(index: number): string {
  if (index === 0) return 'Inicio';

  const currentDate = new Date(this.events[index].fecha);
  const previousDate = new Date(this.events[index - 1].fecha);

  const diffMs = currentDate.getTime() - previousDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return `${diffDays} día(s)`;
}



}
