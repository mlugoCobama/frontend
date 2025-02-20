import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';

@Component({
  selector: 'app-detalle-energeticos',
  templateUrl: './detalle-energeticos.component.html',
  styleUrls: ['./detalle-energeticos.component.css']
})
export class DetalleEnergeticosComponent implements OnInit{

  public concepto: string;

  public isLoad: boolean = true;

  public dataEnergeticos: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private localStorage: LocalStorageServiceService
  ) {}

  ngOnInit(): void {
    this.concepto = this.route.snapshot.paramMap.get('concepto')
    this.isLoad = false;

    this.dataEnergeticos = this.localStorage.getItem('DataEnergeticos');

    console.log(this.dataEnergeticos);
    
  }

}
