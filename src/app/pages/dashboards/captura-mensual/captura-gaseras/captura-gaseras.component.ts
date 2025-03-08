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
  selector: "app-captura-gaseras",
  templateUrl: "./captura-gaseras.component.html",
  styleUrls: ["./captura-gaseras.component.css"],
})
export class CapturaGaserasComponent implements OnInit {
  public dataEmpresas: EnergeticosGaseras[]; //alacena los datos recuperados del mes
  public catEmpresas: CatEmpresas[]; //Empresas (Gaseras)

  public mostrar: boolean = false;
  public formDatosEnergeticos: FormGroup; //Formulario dinámico
  public meses = dataMeses; //meses en el select
  public isLoad = false; //bandera para mostrar bandera o spiner
  private fecha = new Date();
  public mes = this.fecha.getMonth();
  public anio = this.fecha.getFullYear();
  public isDisabled: boolean = false;
  public existInfo: boolean = false; //Define si existe información capturada en el periodo
  public accion: any; // Texto del botón guardar/ actualizar
  public iconoAccion: any; // Icono del botón guardar/ actualizar
  public selecMes: boolean = false; // bandera para saber si el Select del mes tiene un valor valido
  public selecAnio: boolean = false; // bandera para saber si el Select del año tiene un valor valido
  public hasDatos: boolean = false; //Indica si se ha pagado algo desde el portapapeles
  public headers: string[] = []; // headers obtenidos desde el contenido copiado
  public showInstructions: boolean = true; //Bandera para mostrar u ocultar instrucciones
  public dataMesAgencias: any;
  public showBtnAccion: boolean = false;
  public verBtnConsulta: boolean = true;
  public showTable: boolean = false; //Bandera para mostrar u ocultar tabla
  public dataToSend: any;
  public lastIndex: any;

  constructor(
    private catEmpresasService: CatEmpresasService,
    public alertService: AlertErrorService,
    public formBuilder: FormBuilder,
    private energerticosGaseras: EnergeticosGaserasService
  ) { }

  ngOnInit(): void {
    this.getAllEmpresas();
    //this.getInfoMes();
  }

  /**
   * Recupera los nombres de las gaseras
   */
  public getAllEmpresas() {
    this.catEmpresasService.getAll(1).subscribe(
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

  /**
   * Guarda y actualiza los datos capturados en
   * el formulario
   */
  public saveInfo() {
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
        this.energerticosGaseras.save(this.dataToSend).subscribe((response) => {
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
              title: "Error",
              text: response.message,
              buttonsStyling: false,
              icon: "error",
              customClass: {
                confirmButton: "btn btn-success px-4",
                cancelButton: "btn btn- ms-2 px-4",
              },
            });
            this.getInfoMes();
          }
        });
      }
    });
  }

  /**
   * Recupera la información del mes de gaseras
   * Valida si tiene existe información capturada
   * Genera el formulario de captura
   */
  public getInfoMes() {
    this.isDisabled = true;
    this.dataEmpresas = [];
    this.existInfo = false;
    this.isLoad = false;
    this.showTable =true;

    this.energerticosGaseras.get(this.mes, this.anio).subscribe((data) => {
      if (data.success && data.data.length > 1) {
        this.dataEmpresas = data.data;
        this.isLoad = true;
        this.existInfo = true;
        this.hasDatos = false;
        this.accion = "Actualizar";
        this.iconoAccion = "bx bx-pencil";
        this.verBtnConsulta = false;
        this.showTable = true;
        this.isDisabled = false;
        this.lastIndex = (this.dataEmpresas.length-1)
      } else {
        this.alertService.alertError(
          "No hay información captura en el periodo seleccionado",
          false
        );
        this.verBtnConsulta = false;
        this.showTable = true;
        this.hasDatos = false;
        this.dataMesAgencias = [];
        this.isLoad = true;
        this.iconoAccion = "bx bxs-save";
        this.accion = "Guardar";
        this.dataEmpresas = [];
        this.getAllEmpresas();
        this.existInfo = false;
        this.isDisabled = false;
      }
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
  public clickPaste() {
    const fecha = `${this.anio}-${this.mes.toString().padStart(2, "0")}-01`;
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
        this.dataMesAgencias = filasFiltradas;

        // Transformar en un array de objetos
        const result = filasFiltradas.map((row) => {
          const object = this.headers.reduce((acc, header, index) => {
            if (header === "Planta") {
              const estacion = this.catEmpresas.find((e) => e.nombre === row[index]);
              acc["sucursales_id"] = estacion ? estacion.id : null; // Usar el ID o null si no coincide
            } else {
              acc[header] = row[index];
            }
            return acc;
          }, {} as Record<string, string | number | boolean | null>);
          object["fecha"] = fecha;
          object["isNew"] = !this.existInfo
          return object;
        });

        this.dataToSend = result;
        this.showBtnAccion = true;
        this.mostrar = true;

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
          this.mostrar = false;
          this.showBtnAccion = false;
          this.showTable = false;
          this.verBtnConsulta = true;
          return;
        }

      })
      .catch((err) => {
        console.error("Error al leer del portapapeles:", err);
      });
  }

  /**
   * ------------------------------------------
   * Si anio y  mes tiene un valor valido se muestra
   * el botón de consulta
   * ------------------------------------------
   * Valida que el select tenga un valor valido
   * @param value valor que recupera del select
   */
  public onSelectedAnio(value: number) {
    this.anio = value;
    if (this.anio == 0) {
      this.selecAnio = false;
    } else {
      this.selecAnio = true;
      this.verBtnConsulta = true;
      this.showBtnAccion = false;
    }
  }

  /**
   * Valida que el select tenga un valor valido
   * @param value valor que recupera del select
   */
  public onSelectedMes(value: number) {
    this.mes = value;
    if (this.mes == 0) {
      this.selecMes = false;
    } else {
      this.selecMes = true;
      this.verBtnConsulta = true;
      this.showBtnAccion = false;
    }
  }
}
