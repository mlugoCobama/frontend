import { Component } from '@angular/core';
import { Comision } from 'src/app/core/models/nissan/comisiones';
import { ComisionesService } from 'src/app/core/services/nissan/comisiones.service';

@Component({
  selector: 'app-comisiones',
  templateUrl: './comisiones.component.html',
  styleUrl: './comisiones.component.css'
})
export class ComisionesComponent {

  public data: Comision[];

  constructor(
      private comisionesService: ComisionesService,
    ){}
  
    public ngOnInit(): void {
  
      this.getAll();
    }
  
    private getAll() {
  
      this.comisionesService.getAll()
                        .subscribe(
                          response => {
                            console.log(response);
                            
                              if (response.status) {
                                this.data = response.data;
                                console.log(this.data);
                                
                              } else {
                                console.log(response.message);
  
                              }
                          },
                          error => {
                              console.error('Error fetching data:', error);
                          }
                        );
    }
  

}
