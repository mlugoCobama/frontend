import { Component, OnInit } from '@angular/core';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { GestionServiciosService } from 'src/app/core/services/gestion-servicios/gestion-servicios.service';

@Component({
  selector: 'app-dashboard-servicios',
  templateUrl: './dashboard-servicios.component.html',
  styleUrl: './dashboard-servicios.component.css'
})
export class DashboardServiciosComponent implements OnInit {

  constructor(
    private gestionServicio: GestionServiciosService, 
    private alertas: SwalComprsServiceService
  ) {}

  //Datos originales del backend
  public data: any[] = [];

  //Datos transformados para la tabla
  public dataTransformada: any[] = [];

  //Meses base
  public mesesArray = [1,2,3,4,5,6,7,8,9,10,11,12];

  //Totales por mes
  public totalesMes: number[] = Array(12).fill(0);

  ngOnInit(): void {
    this.getPagosProgramados();
  }

  //CONSUMO DE API
  public pagados:any;
  public penidentes:any;
  public vencidos: any;
  public cantServicio: any;

  public getPagosProgramados(){
    this.gestionServicio.getPagoServicios().subscribe(
      (response:any) => {
        if(response.status == 'success'){
          this.data = response.data;
          this.pagados = this.sumarPorEstado(response.data, '2');
          this.penidentes = this.sumarPorEstado(response.data, '1');
          this.vencidos = this.sumarPorEstado(response.data, '0');
          this.cantServicio = response.data.length;
          this.transformar(this.data);
          this.calcularTotales();

          console.log(this.dataTransformada);
        }else{
          this.alertas.mostrarAlerta('Error', 'Algo salió mal en la búsqueda', 'info', 'info');
        }
      },
      (error) => {
        this.alertas.mostrarAlerta("Error", `Error fetching data: ${error}`, "error" , "danger" );
      }
    );
  }

  //TRANSFORMACIÓN PRINCIPAL
  transformar(data: any[]) {

    this.dataTransformada = data.map(servicio => {

      const meses = this.mesesArray.map(mes => {
        const item = servicio.meses[mes];

        if (!item) {
          return this.getDefaultMes();
        }

        return this.mapEstado(item);
      });

      return {
        servicio: servicio.servicio,
        proveedor: servicio.proveedor,
        tipo: servicio.tipo,
        meses
      };
    });
  }

  //MAPEO DE ESTADOS → UI
  mapEstado(item: any) {

    switch (item.estado) {

      case 2: // pagado
        return {
          icon: 'mdi-check-circle',
          color: 'success',
          label: 'Pagado',
          amount: Number(item.importe)
        };

      case 1: // pendiente
        return {
          icon: 'mdi-alert-circle',
          color: 'primary',
          label: 'Pendiente',
          amount: Number(item.importe)
        };

      case 0: // vencido (si luego lo usas)
        return {
          icon: 'mdi-close-circle',
          color: 'danger',
          label: 'Vencido',
          amount: Number(item.importe)
        };

      default:
        return this.getDefaultMes();
    }
  }

  //DEFAULT PARA MESES VACÍOS
  getDefaultMes() {
    return {
      icon: 'mdi-minus-circle',
      color: 'secondary',
      label: '-',
      amount: 0
    };
  }

  //CALCULAR TOTALES POR MES
  calcularTotales() {
    this.totalesMes = Array(12).fill(0);

    this.dataTransformada.forEach(servicio => {
      servicio.meses.forEach((mes: any, index: number) => {
        if (mes.amount) {
          this.totalesMes[index] += mes.amount;
        }
      });
    });
  }

  sumarPorEstado(data:any, estado:any) {
  let total = 0;
  let contador = 0;

  data.forEach((servicio:any) => {
    const meses =  this.convertirObjetoAMeses(servicio.meses)
      meses.forEach((mes:any) => {
        if (Number(mes.estado) == Number(estado)) {
          total += Number(mes.importe);
          contador++;
        }
      });
  });

  return {
    estado: estado,
    total: total,
    cantidad: contador
  };
}

convertirObjetoAMeses(obj: Record<string, any>) {
  return Object.entries(obj)
    .filter(([_, value]) => value !== null)
    .map(([key, value]) => ({
      mes: key,
      estado: value.estado,
      importe: value.importe
    }));
}

}