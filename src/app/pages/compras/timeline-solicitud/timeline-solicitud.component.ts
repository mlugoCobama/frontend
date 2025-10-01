import { Component } from '@angular/core';

@Component({
  selector: 'app-timeline-solicitud',
  templateUrl: './timeline-solicitud.component.html',
  styleUrl: './timeline-solicitud.component.css'
})
export class TimelineSolicitudComponent {
  public events: any[] = [
  { fecha: '2025-09-01 10:00:00', mensaje: "Solicitud de compra generada" },
  { fecha: '2025-09-02 14:30:00', mensaje: "Autorización por Gerencia General" },
  { fecha: '2025-09-04 09:15:00', mensaje: "Autorización por Gerencia Administrativa" },
  { fecha: '2025-09-05 16:45:00', mensaje: "Notificación a departamento de compras" },
  { fecha: '2025-09-07 11:00:00', mensaje: "Inicio de cotización" },
  { fecha: '2025-09-10 08:20:00', mensaje: "Orden de compra generada" },
  { fecha: '2025-09-12 13:50:00', mensaje: "Orden de compra autorizada" },
  { fecha: '2025-09-15 17:10:00', mensaje: "Orden de compra pagada" },
];



  public getDayDifference(index: number): string {
  if (index === 0) return 'Inicio';

  const currentDate = new Date(this.events[index].fecha);
  const previousDate = new Date(this.events[index - 1].fecha);

  const diffMs = currentDate.getTime() - previousDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return `${diffDays} día(s)`;
}



}
