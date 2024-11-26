import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CapturaGaserasComponent } from './captura-gaseras/captura-gaseras.component';
import { CapturaGasolineriasComponent } from './captura-gasolinerias/captura-gasolinerias.component';

const routes: Routes = [
    { path: 'gaseras', component: CapturaGaserasComponent },
    { path: 'gasolinerias', component: CapturaGasolineriasComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CapturaMensualRoutingModule { }
