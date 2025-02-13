import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";

import { EnergeticosGaserasService } from "src/app/core/services/dashboard/energeticos-gaseras.service";
import {
  ResponseCatEmpresas,
  CatEmpresas,
} from "src/app/core/models/cat-empresas";
import { AlertErrorService } from "src/app/core/services/alert-error.service";
import { CatEmpresasService } from "src/app/core/services/cat-empresas.service";

import dataMeses from "src/environments/meses.json";
import { EnergeticosGaseras } from "src/app/core/models/dashboard/energeticos-gaseras";


@Component({
  selector: "app-captura-gasolinerias",
  templateUrl: "./captura-gasolinerias.component.html",
  styleUrls: ["./captura-gasolinerias.component.css"],
})
export class CapturaGasolineriasComponent implements OnInit {
  public dataEmpresas: EnergeticosGaseras[];

  public catEmpresas: CatEmpresas[];

  public mostrar: boolean = false;

  public formDatosEnergeticos: FormGroup;

  public meses = dataMeses;

  private fecha = new Date();

  public mes = this.fecha.getMonth();

  public anio = this.fecha.getFullYear();

  public isDisabled: boolean = false;

  public existInfo: boolean = true;

  private modelInputs = {
    venta_litros: "",
    ventas: "",
    eficiencia: "",
    gasto: "",
    utilidad_bruta: "",
    ubo: "",
    // personal: "",
    uno: "",
  };

  constructor(
    private catEmpresasService: CatEmpresasService,
    public alertService: AlertErrorService,
    public formBuilder: FormBuilder,
    private energerticosGaseras: EnergeticosGaserasService
  ) {}

  ngOnInit(): void {
    this.getAllEmpresas();
    //this.getInfoMes();
  }

  public getAllEmpresas() {
    this.catEmpresasService.getAll(2).subscribe(
      (data: ResponseCatEmpresas) => {
        if (data.success) {
          this.catEmpresas = data.data;
          console.log(this.catEmpresas);
          // this.buildFormDatosEnergeticos();
        } else {
          this.alertService.alertError(data.message, data.success);
        }
      },
      (error) => {
        this.alertService.alertError(error, false);
      }
    );
  }

  indexTotals: any;
  private buildFormDatosEnergeticos() {
    const fields = {};

    this.formDatosEnergeticos = this.formBuilder.group({});

    if (this.existInfo) {
      Object.entries(this.dataEmpresas).forEach((data) => {
        for (const field of Object.keys(this.modelInputs)) {
          this.formDatosEnergeticos.addControl(
            field + "_" + data[1].id,
            this.formBuilder.control(data[1][field], Validators.required)
          );
          this.indexTotals = this.dataEmpresas.length - 1;

          
        }
      });
    } else {
      Object.entries(this.catEmpresas).forEach((data) => {
        for (const field of Object.keys(this.modelInputs)) {
          this.formDatosEnergeticos.addControl(
            field + "_" + data[1].id,
            this.formBuilder.control(0, Validators.required)
          );
        }
      });
    }

    this.mostrar = true;
    this.isDisabled = false;
  }

  public saveInfo() {
    console.warn(this.formDatosEnergeticos.value);
    if (this.formDatosEnergeticos.valid) {
      const formData = this.formDatosEnergeticos.value;
      const datos = [];

      const fecha = `${this.anio}-${this.mes.toString().padStart(2, "0")}-01`;

      Object.entries(formData).forEach(([key, value]) => {
        //  Separa la columna del id
        const lastIndex = key.length;
        const lastGuion = key.lastIndexOf("_");
        const sucursales_id = key.substring(lastGuion + 1, lastIndex);
        const field = key.substring(0, lastGuion);

        let datosEmpresa = datos.find(
          (item) => item.sucursales_id === Number(sucursales_id)
        );
        if (
          !datosEmpresa
          // && !isNaN(Number(sucursales_id))
        ) {
          datosEmpresa = {
            sucursales_id: Number(sucursales_id),
            fecha: fecha,
            isNew: !this.existInfo,
          };
          datos.push(datosEmpresa);
        }
        datosEmpresa[field] = value;
      });
      Swal.fire({
        title: "¿Estas seguro?",
        text: "Deseas capturar estos datos",
        icon: "warning",
        confirmButtonText: "SI",
        showCancelButton: true,
        cancelButtonText: "NO",
        customClass: {
          confirmButton: "btn btn-success px-4",
          cancelButton: "btn btn-danger ms-2 px-4",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.energerticosGaseras.save(datos).subscribe((response) => {
            if (response.status === "success") {
              Swal.fire({
                title: "Listo",
                text: "Datos Guardados correctamente",
                buttonsStyling: false,
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-success px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
              this.getInfoMes();
            } else {
              console.log(response.message);
            }
          });
        }
      });
    }
  }

  public getInfoMes() {
    this.isDisabled = true;
    this.dataEmpresas = [];

    this.energerticosGaseras
      .getGasolinerias(this.mes, this.anio)
      .subscribe((data) => {
        if (data.success && data.data.length > 1) {
          this.dataEmpresas = data.data;
          this.existInfo = true;
        } else {
          this.alertService.alertError(
            "No hay información captura en el periodo seleccionado",
            false
          );
          this.dataEmpresas = [];
          this.getAllEmpresas();
          this.existInfo = false;
        }

        this.buildFormDatosEnergeticos();

        // if (data.success) {
        //   this.dataEmpresas = data.data;

        //   if (Object.entries(this.dataEmpresas).length > 1) {
        //     this.buildFormDatosEnergeticos();
        //     this.existInfo = true;
        //   } else {
        //     this.alertService.alertError('No hay información captura en el periodo seleccionado', false);
        //     this.dataEmpresas = [];
        //     this.existInfo = false;
        //     this.getAllEmpresas();
        //   }
        // } else {
        //   this.alertService.alertError(data.message, false);
        // }
      });
  }
  public selecAnio: boolean = false;
  public onSelectedAnio(value: number) {
    this.anio = value;
    this.selecAnio = true;
  }

  public selecMes: boolean = false;
  public onSelectedMes(value: number) {
    this.mes = value;
    this.selecMes = true;
  }

  public calcTotal() {}
}
