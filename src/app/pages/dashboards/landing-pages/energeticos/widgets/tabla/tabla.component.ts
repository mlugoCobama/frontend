import { Component, Input, OnInit } from '@angular/core';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit {

  @Input() concepto: string;

  public dataEnergeticos: any;

  public isLoad: boolean = true;

  constructor(
    private localStorage: LocalStorageServiceService
  ) {}

  ngOnInit(): void {
    
    this.dataEnergeticos = this.localStorage.getItem('DataEnergeticos');

    this.isLoad = false;

  }

}
