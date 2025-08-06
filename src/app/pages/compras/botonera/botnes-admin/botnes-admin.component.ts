import { Component, Input, EventEmitter, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { EstadoSolicitud } from '../../compras/estado-solicitud.enum';
import { ComprasService } from 'src/app/core/services/compras/compras.service';
@Component({
  selector: 'app-botnes-admin',
  templateUrl: './botnes-admin.component.html',
  styleUrl: './botnes-admin.component.css'
})
export class BotnesAdminComponent implements OnInit{

  public enEsts = EstadoSolicitud;
  
  @Input() status:any = false;
  @Input() mostrarBoton;
  @Input() solicitudSelecionada:any;

  @Output() btnGenerarOC = new EventEmitter<void>();
  @Output() mostrarCotizacion = new EventEmitter<void>();
  @Output() cancelarSolicitud = new EventEmitter<void>();

  constructor(
    public comprasService: ComprasService
  ){}

  public ngOnInit(): void {
    console.log('status',this.status);
    console.log('mostrarBoton',this.mostrarBoton);
    console.log('solicitudSelecionada',this.solicitudSelecionada);
      // this.comprasService.mostrarBoton$.subscribe((mostrar) => {
      //   this.mostrarBoton = mostrar;
      // });
     
  }
      
  clickGenerarOrden() {
      this.btnGenerarOC.emit();
  }

  clickCotizar() {
      this.mostrarCotizacion.emit();
  }

  clickCancelar() {
      this.cancelarSolicitud.emit();
  }

}
