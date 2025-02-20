import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageServiceComponent } from './services/local-storage-service/local-storage-service.component';

@NgModule({
  declarations: [
    LocalStorageServiceComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
