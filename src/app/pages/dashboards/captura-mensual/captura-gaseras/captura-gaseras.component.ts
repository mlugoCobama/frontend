import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { EnergeticosGaserasService } from 'src/app/core/services/dashboard/energeticos-gaseras.service';
import { ResponseCatEmpresas, CatEmpresas } from 'src/app/core/models/cat-empresas';
import { AlertErrorService } from 'src/app/core/services/alert-error.service';
import { CatEmpresasService } from 'src/app/core/services/cat-empresas.service';

import dataMeses from 'src/environments/meses.json';
import { EnergeticosGaseras } from 'src/app/core/models/dashboard/energeticos-gaseras';

@Component({
  selector: 'app-captura-gaseras',
  templateUrl: './captura-gaseras.component.html',
  styleUrls: ['./captura-gaseras.component.css']
})
export class CapturaGaserasComponent implements OnInit {

  public dataEmpresas:EnergeticosGaseras[];

  public catEmpresas:CatEmpresas[];

  public mostrar: boolean = false;

  public formDatosEnergeticos: FormGroup;

  public meses = dataMeses;

  private fecha = new Date();

  public mes =  this.fecha.getMonth();

  public anio = this.fecha.getFullYear();

  public isDisabled: boolean = false;

  public existInfo: boolean = true;

  private modelInputs = {
    venta_litros: '',
    ventas: '',
    eficiencia: '',
    gasto: '',
    utilidad_bruta: '',
    ubo: '',
    personal: '',
    uno: '',
  }

  constructor(
    private catEmpresasService: CatEmpresasService,
    public alertService: AlertErrorService,
    public formBuilder: FormBuilder,
    private energerticosGaseras: EnergeticosGaserasService
  ) {}

  ngOnInit(): void {
    //this.getAllEmpresas();
    //this.getInfoMes();
  }

  public getAllEmpresas() {

    this.catEmpresasService.getAll(1).subscribe(
      (data: ResponseCatEmpresas) => {
        if (data.success) {
          this.catEmpresas = data.data;
          this.buildFormDatosEnergeticos();
          console.log(this.catEmpresas);

        } else {
          this.alertService.alertError(data.message, data.success);
        }
      },
      (error) => {
        this.alertService.alertError(error, false);
      }
    );

  }

  private buildFormDatosEnergeticos() {

    const fields = {}

    this.formDatosEnergeticos = this.formBuilder.group({});
    /*
    if (this.existInfo) {
      */
      Object.entries(this.dataEmpresas).forEach((data) => {
        for (const field of Object.keys(this.modelInputs)) {
          this.formDatosEnergeticos.addControl(field + '_' + data[1].id,this.formBuilder.control(data[1][field], Validators.required));
        }
      });
      /*
    } else {
      Object.entries(this.catEmpresas).forEach((data) => {

        for (const field of Object.keys(this.modelInputs)) {
          this.formDatosEnergeticos.addControl(field + '_' + data[1].sucursal_id,this.formBuilder.control('', Validators.required));
        }
      });
    }
      */
    this.mostrar = true;
    this.isDisabled = false;
  }

  public saveInfo() {
    console.warn(this.formDatosEnergeticos.value);
  }

  public getInfoMes() {

    this.isDisabled = true;
    this.dataEmpresas = []

    this.energerticosGaseras.get(this.mes, this.anio).subscribe(data => {
      if (data.success) {
        this.dataEmpresas = data.data;

        if (Object.entries(this.dataEmpresas).length > 1) {
          this.buildFormDatosEnergeticos();
          this.existInfo = true;
        } else {
          this.alertService.alertError('No hay información captura en el periodo seleccionado', false);
          this.dataEmpresas = [];
          this.existInfo = false;
          this.getAllEmpresas();
        }

      } else {
        this.alertService.alertError(data.message, false);
      }
    });
  }

  public onSelectedAnio(value:number) {
    this.anio = value;
  }

  public onSelectedMes(value:number) {
    this.mes = value;
  }

}
