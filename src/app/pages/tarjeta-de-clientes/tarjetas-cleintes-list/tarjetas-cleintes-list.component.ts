import { Component, OnInit } from '@angular/core';
import { TerjetaClienteService } from 'src/app/core/services/tarjetas-clientes/terjeta-cliente.service';
import { FuncionesTablas } from 'src/app/core/helpers/funciones-tablas';

@Component({
  selector: 'app-tarjetas-cleintes-list',
  templateUrl: './tarjetas-cleintes-list.component.html',
  styleUrl: './tarjetas-cleintes-list.component.css'
})
export class TarjetasCleintesListComponent implements OnInit {

  constructor(
    private tarjetaClientes: TerjetaClienteService
  ){}

  ngOnInit(): void {
    this.getAll();
  }

    datosFiltrados: any[] = [];
    private ordenador!: FuncionesTablas<any>;
    busqueda:string = '';
    public isLoad: boolean = true;
    public showTable: boolean = false;
    
  private getAll() {
      this.tarjetaClientes.getTarjetaCliente().subscribe(
        (response) => {
          if (response) {
            this.clientes = response.data;
  
            this.ordenador = new FuncionesTablas(this.clientes);
            this.datosFiltrados = [...this.clientes];
  
            this.isLoad = false;
            this.showTable = true;
          } else {
            this.isLoad = false;
            console.log(response.message);
            
          }
        },
        (error) => {
          this.isLoad = false;
          console.error("Error fetching data:", error);
        }
      );
    }

    

  clientes = [
    ];

}
