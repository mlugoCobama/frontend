import { Component, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-card-prestamos',
  templateUrl: './card-prestamos.component.html',
  styleUrl: './card-prestamos.component.css'
})
export class CardPrestamosComponent implements AfterViewInit{

  @Input() concepto:any;
  @Input() tipo:any;
  @Input() dataMes:any;
  @Input() dataMesAnterior:any;

  public title: any;

  public totalMes: any = 0;
  public interesMes:  any = 0;

  public totalMesAnt: any = 0;
  public interesMesAnt:  any = 0;

  public difTotal: any = 0;
  public difIntereses: any = 0;

  ngAfterViewInit(): void {
    this.setTitle();
    this.calcularDiferencias();
  }

  /**
   * Calcula los datos del concepto y sus intereses
   * Asigna totales y calcula las diferencias
   */
  public calcularDiferencias(){
    const filaTotalesMes =  this.dataMes.find((registro) => registro.estacion === "Total");
    const filaTotalesMesAnt =  this.dataMesAnterior.find((registro) => registro.estacion === "Total");

    this.totalMes = filaTotalesMes[this.concepto];
    this.interesMes = filaTotalesMes[`${this.concepto}_interes`];

    this.totalMesAnt = filaTotalesMesAnt[this.concepto];
    this.interesMesAnt = filaTotalesMesAnt[`${this.concepto}_interes`];

    this.difTotal =  Number(this.totalMes- this.totalMesAnt);
    this.difIntereses = Number(this.interesMes - this.interesMesAnt);
  }

  /**
   * Asigna un titulo en base al concepto dado
   */
  private setTitle() {
    switch (this.concepto) {
        case 'nrf':
          this.title = 'Prestamos NRF';
          break;
        case 'plan_piso':
          this.title = 'Prestamos Bancarios';
          break;
      default:
        break;
    }
  }
}
