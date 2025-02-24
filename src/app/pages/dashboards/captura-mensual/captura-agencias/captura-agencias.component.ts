import { Component, OnInit } from "@angular/core";
import {
  ResponseCatEmpresas,
  CatEmpresas,
} from "src/app/core/models/cat-empresas";
import dataMeses from "src/environments/meses.json";
import { AlertErrorService } from "src/app/core/services/alert-error.service";
import { CatEmpresasService } from "src/app/core/services/cat-empresas.service";
import { AgenciasService } from "src/app/core/services/dashboard/agencias.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";

@Component({
  selector: "app-captura-agencias",
  templateUrl: "./captura-agencias.component.html",
  styleUrls: ["./captura-agencias.component.css"],
})
export class CapturaAgenciasComponent implements OnInit {
  public formConsultaDatos: FormGroup;
  public catEmpresas: CatEmpresas[];
  public meses = dataMeses;
  public dataMesAgencias: any;

  private fecha = new Date();
  public mes = this.fecha.getMonth();
  public anio = this.fecha.getFullYear();
  public agencia: any;

  public subDivision: any;

  public showTable: boolean = false;

  public hasDatos: boolean = false;
  public existInfo: boolean = true;

  public selecAgencia: boolean = false;
  public selecMes: boolean = false;
  public selecAnio: boolean = false;

  ngOnInit() {
    this.buildForm();
  }

  constructor(
    private catEmpresasService: CatEmpresasService,
    private agenciasService: AgenciasService,
    public alertService: AlertErrorService,
    public formBuilder: FormBuilder
  ) {}

  private buildForm() {
    this.formConsultaDatos = this.formBuilder.group({
      selectDivision: new FormControl(null, Validators.required),
      selectMes: new FormControl(null, Validators.required),
      selectAnio: new FormControl(null, Validators.required),
    });
  }

  get consultaDatosFormControl() {
    return this.formConsultaDatos.controls;
  }

  // public concepto = {
  //   division: null,
  //   entidad: null,
  //   nombre:  null,
  //   id:null,
  //   sub_division: null,
  //   sucursal: "Conceptos"
  // };
  // public total = {
  //   division: null,
  //   entidad: null,
  //   nombre:  null,
  //   id:null,
  //   sub_division: null,
  //   sucursal: "Total"
  // };
  public getAgencias() {
    this.catEmpresasService.getAll(this.subDivision).subscribe(
      (data: ResponseCatEmpresas) => {
        if (data.success) {
          this.catEmpresas = data.data;
          // this.catEmpresas.unshift(this.concepto);
          // this.catEmpresas.push(this.total);
        } else {
          this.alertService.alertError(data.message, data.success);
        }
      },
      (error) => {
        this.alertService.alertError(error, false);
      }
    );
  }

  private getMesAgencia() {
    this.getAgencias();
    this.agenciasService.getAgencias(this.mes, this.anio).subscribe(
      (response) => {
        if (response) {
          this.showTable = true;
          this.dataMesAgencias = response.data;
          const tamanioData = this.dataMesAgencias.length;
          if (tamanioData > 1) {
            this.existInfo = true;
            this.hasDatos = true;
            // console.log("si hay datos");
          } else {
            this.alertService.alertError(
              "No hay información captura en el periodo seleccionado",
              false
            );
            this.existInfo = false;

            this.hasDatos = false;
          }
          // console.log(this.dataMesAgencias);
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

  public onSelectedSdivision(value: number) {
    this.subDivision = value;
    this.selecAgencia = true;
  }

  public onSelectedAnio(value: number) {
    this.anio = value;
    this.selecAnio = true;
  }

  public onSelectedMes(value: number) {
    this.mes = value;
    this.selecMes = true;
  }
}
