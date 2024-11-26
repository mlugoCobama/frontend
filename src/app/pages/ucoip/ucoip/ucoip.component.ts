import { Component, OnInit } from '@angular/core';
import { Config } from 'datatables.net';
import { UcoipService } from 'src/app/core/services/ucoip/ucoip.service';
import { environment } from 'src/environments/environment';

UcoipService

@Component({
  selector: 'app-ucoip',
  templateUrl: './ucoip.component.html',
  styleUrls: ['./ucoip.component.css']
})
export class UcoipComponent implements OnInit {

  public data: any;
  public showTable:boolean = false;
  dtOptions: Config = {};

  constructor(
    private ucoipService: UcoipService,
  ){}

  public ngOnInit(): void {
    this.dtOptions = environment.dataTables;
    this.getAll();
  }

  private getAll() {

    this.ucoipService.getAll()
                      .subscribe(
                        response => {
                            if (response.success) {
                              this.data = response.data;
                              this.showTable = true;
                            } else {
                              console.log(response.message);

                            }
                            console.log(this.data);
                        },
                        error => {
                            console.error('Error fetching data:', error);
                        }
                      );
  }

}
