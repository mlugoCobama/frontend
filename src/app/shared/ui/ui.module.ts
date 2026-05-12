import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { PagetitleComponent } from './pagetitle/pagetitle.component';
import { LoaderComponent } from './loader/loader.component';
import { TablaGenericaComponent } from './tabla-generica/tabla-generica.component';
import { CardTopComponent } from './card-top/card-top.component';
import { FiltroComsionesGenericoComponent } from './filtro-comsiones-generico/filtro-comsiones-generico.component';
import { KpiCardGenericoComponent } from './kpi-card-generico/kpi-card-generico.component';
import { SelectAgenciaVendedorComponent } from './select-agencia-vendedor/select-agencia-vendedor.component';

@NgModule({
  declarations: [PagetitleComponent,  LoaderComponent, TablaGenericaComponent, CardTopComponent, FiltroComsionesGenericoComponent, KpiCardGenericoComponent, SelectAgenciaVendedorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    
  ],
  exports: [PagetitleComponent, LoaderComponent, TablaGenericaComponent, CardTopComponent, FiltroComsionesGenericoComponent,  KpiCardGenericoComponent, SelectAgenciaVendedorComponent]
})
export class UIModule { }
