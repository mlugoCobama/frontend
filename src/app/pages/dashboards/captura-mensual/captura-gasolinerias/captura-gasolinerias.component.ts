import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";

import {
  ResponseCatEmpresas,
  CatEmpresas,
} from "src/app/core/models/cat-empresas";

import { EnergeticosGasolinerasService } from "src/app/core/services/dashboard/energeticos-gasolineras.service";
import { AlertErrorService } from "src/app/core/services/alert-error.service";
import { CatEmpresasService } from "src/app/core/services/cat-empresas.service";

import { EnergeticosGaseras } from "src/app/core/models/dashboard/energeticos-gaseras";
import dataMeses from "src/environments/meses.json";

@Component({
  selector: "app-captura-gasolinerias",
  templateUrl: "./captura-gasolinerias.component.html",
  styleUrls: ["./captura-gasolinerias.component.css"],
})
export class CapturaGasolineriasComponent implements OnInit {
  public dataEmpresas: EnergeticosGaseras[]; //alacena los datos recuperados del mes
  public catEmpresas: CatEmpresas[]; //Empresas (Gaseras)
  public meses = dataMeses; //meses en el select

  public formDatosEnergeticos: FormGroup; //Formulario dinámico

  private fecha = new Date();
  public mes = this.fecha.getMonth();
  public anio = this.fecha.getFullYear();

  public mostrar: boolean = false;
  public isDisabled: boolean = false;
  public existInfo: boolean = true;
  //Modelo para generar los inputs
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
    private energeticosGasolineras: EnergeticosGasolinerasService
  ) {}

  ngOnInit(): void {
    this.getAllEmpresas();
    //this.getInfoMes();
  }

  /**
   * Recupera los nombres de las gaseras
   */
  public getAllEmpresas() {
    this.catEmpresasService.getAll(2).subscribe(
      (data: ResponseCatEmpresas) => {
        if (data.success) {
          this.catEmpresas = data.data;
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
  /**
   * Genera el formulario
   * Flujo 1: En base a datos recuperados del servidor (Si hay datos de captura)
   * Flujo 2: En base a un modelo y a las estaciones (Si no existen datos de captura)
   */
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
  /**
   * Guarda y actualiza los datos capturados en
   * el formulario
   */
  public saveInfo() {
    // console.warn(this.formDatosEnergeticos.value);
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
          this.energeticosGasolineras.save(datos).subscribe((response) => {
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
              Swal.fire({
                title: "Algo salio mal",
                text: response.message,
                buttonsStyling: false,
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-success px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
            }
          });
        }
      });
    }
  }

  /**
   * Recupera la información del mes de gaseras
   * Valida si tiene existe información capturada
   * Genera el formulario de captura
   */
  public getInfoMes() {
    this.isDisabled = true;
    this.dataEmpresas = [];

    this.energeticosGasolineras
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

      /**
       * Captura mediante un botón los datos copiados en el portapapeles
       * ------------------------------------------------------------------
       * Nota: El funcionamiento puedo variar dependiendo del navegador
       * Navegadores probados: Google Chrome, Firefox, Microsoft Edge
       * ------------------------------------------------------------------
       * Genera dos arreglos uno para los headers (Recuperados del excel),
       * arreglos por filas
       */
      public hasDatos: boolean = false; //
      public headers: string[] = []; // headers obtenidos desde el contenido copiado
      public showInstructions: boolean = true; //Bandera para mostrar u ocultar instrucciones
      public dataMesAgencias: any;
      public showBtnAccion: boolean = false;
      public verBtnConsulta: boolean = true;
      public showTable: boolean = false; //Bandera para mostrar u ocultar tabla
  
      public clickPaste() {
        navigator.clipboard
          ?.readText()
          .then((text) => {
            this.hasDatos = true;
            const filas = text
              .split("\n")
              .map((row) => row.split("\t").map((cell) => cell.trim()));
            const filasFiltradas = filas.filter((row) =>
              row.some((cell) => cell.length > 0)
            );
            this.headers = filasFiltradas.length > 0 ? filasFiltradas.shift()! : [];
            this.showInstructions = false;
            this.dataMesAgencias = this.procesarCeldasCombinadas(filasFiltradas);
            this.showBtnAccion = true;
    
            if (this.dataMesAgencias.length === 0) {
              Swal.fire({
                title: "Falta algo",
                text: "Selecciona nuevamente el contenido a pegar",
                buttonsStyling: false,
                icon: "warning",
                customClass: {
                  confirmButton: "btn btn-success px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
              this.showBtnAccion = false;
              this.showTable = false;
              this.verBtnConsulta = true;
              return;
            }
            console.log(filasFiltradas);
            console.log(this.headers);
            console.log(this.dataMesAgencias);
          })
          .catch((err) => {
            console.error("Error al leer del portapapeles:", err);
          });
      }
  
        /**
     * Procesa el contenido de "filas filtradas"
     * y genera el formato para visualizar la tabla,
     * se agrega la propiedad colspan y el valor de la celda es value
     * ------------------------------------------------------------------
     */
    private procesarCeldasCombinadas(filas: string[][]): { value: string; colspan: number }[][] {
      return filas.map((fila) => {
        let filaProcesada: { value: string; colspan: number }[] = [];
        let celdaAnterior = "";
        for (let colIndex = 0; colIndex < fila.length; colIndex++) {
          let celda = fila[colIndex];
          if (celda === "" && celdaAnterior !== "") {
            filaProcesada[filaProcesada.length - 1].colspan += 1;
          } else {
            filaProcesada.push({ value: celda, colspan: 1 });
            celdaAnterior = celda;
          }
        }
        return filaProcesada;
      });
    }

  /**
   * Maneja el evento y el valor del select Mes
   */
  public selecAnio: boolean = false;
  public onSelectedAnio(value: number) {
    this.anio = value;
    this.selecAnio = true;
  }

  /**
   * Maneja el evento y el valor del select Mes
   */
  public selecMes: boolean = false;
  public onSelectedMes(value: number) {
    this.mes = value;
    this.selecMes = true;
  }
}
