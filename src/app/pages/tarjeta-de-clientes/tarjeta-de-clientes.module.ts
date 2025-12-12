import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { TarjetaDeClientesRoutingModule } from './tarjeta-de-clientes-routing.module';
import { WizzardTarjetasDeClientesComponent } from './wizzard-tarjetas-de-clientes/wizzard-tarjetas-de-clientes.component';
import { TarjetasCleintesListComponent } from './tarjetas-cleintes-list/tarjetas-cleintes-list.component';


@NgModule({
  declarations: [
    WizzardTarjetasDeClientesComponent,
    TarjetasCleintesListComponent
  ],
  imports: [
    CommonModule,
    TarjetaDeClientesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [
    provideNgxMask()
  ]
})
export class TarjetaDeClientesModule { }
