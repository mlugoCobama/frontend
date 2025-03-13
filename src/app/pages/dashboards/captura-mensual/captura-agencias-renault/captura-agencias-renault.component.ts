import { Component, OnInit } from "@angular/core";
import {
  ResponseCatEmpresas,
  CatEmpresas,
} from "src/app/core/models/cat-empresas";
import dataMeses from "src/environments/meses.json";
import { AlertErrorService } from "src/app/core/services/alert-error.service";
import { CatEmpresasService } from "src/app/core/services/cat-empresas.service";
import { AgenciasRenaultService } from "src/app/core/services/dashboard/agencias-renault.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-captura-agencias-renault',
  templateUrl: './captura-agencias-renault.component.html',
  styleUrls: ['./captura-agencias-renault.component.css']
})

export class CapturaAgenciasRenaultComponent implements OnInit {
  public meses = dataMeses; //datos del select mes
  public dataMesAgencias: any;

  private fecha = new Date();
  public mes = this.fecha.getMonth();
  public anio = this.fecha.getFullYear();

  public showTable: boolean = false; //Bandera para mostrar u ocultar tabla
  public showInstructions: boolean = true; //Bandera para mostrar u ocultar instrucciones
  public isLoad = false;
  public hasDatos: boolean = false; //
  public existInfo: boolean = true;
  public isDisabled: boolean = false; //Bandera para deshabilitar el btn consultar durante el proceso

  public selecMes: boolean = false; // Select del mes
  public selecAnio: boolean = false; // Select del año
  public verBtnConsulta: boolean = true;
  public showBtnAccion: boolean = false;

  public accion: any; // Texto del botón guardar/ actualizar

  public iconoAccion: any; // Icono del botón guardar/ actualizar

  public catEmpresas: CatEmpresas[]; //Catalogo de empresas de la marca
  public headers: string[] = [];// headers obtenidos desde el contenido copiado



  ngOnInit() {
    this.getAgencias();
  }

  constructor(
    private catEmpresasService: CatEmpresasService,
    private agenciasRenaultService: AgenciasRenaultService,
    public alertService: AlertErrorService
  ) { }

  /**
   * Recupera las agencias que pertenecen a Renault;
   */
  public getAgencias() {
    this.catEmpresasService.getAll(4).subscribe(
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
   * Recupera los datos de captura mensual
   * de agencias Renault
   */
  private getMesAgencia() {
    this.isLoad = false;
    this.isDisabled = true;
    this.getAgencias();
    this.agenciasRenaultService.getMesAgencias(this.mes, this.anio).subscribe(
      (response) => {
        if (response) {
          this.showTable = true;
          this.dataMesAgencias = response.data;
          if (response.size > 1) {
            this.isDisabled = false;
            this.existInfo = true;
            this.hasDatos = true;
            this.showInstructions = false;
            this.accion = "Actualizar"
            this.iconoAccion = "bx bx-pencil"
            this.isLoad = true;
            this.verBtnConsulta = false;
          } else {
            this.iconoAccion = "bx bxs-save "
            this.accion = "Guardar"
            this.showInstructions = true;
            this.isDisabled = false;
            
            this.alertService.alertError(
              "No hay información captura en el periodo seleccionado",
              false
            );
            this.existInfo = false;
            this.hasDatos = false;
            this.isLoad = true;
            this.verBtnConsulta = false;
          }
        } 
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
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
    navigator.clipboard?.readText().then(text => {
      this.hasDatos = true;
      const filas = text.split("\n").map((row) => row.split("\t").map((cell) => cell.trim()));
      const filasFiltradas = filas.filter((row) => row.some((cell) => cell.length > 0));
      this.headers = filasFiltradas.length > 0 ? filasFiltradas.shift()! : [];
      this.showInstructions = false;
      this.dataMesAgencias = this.procesarCeldasCombinadas(filasFiltradas);
      this.showBtnAccion = true;
      if (this.dataMesAgencias.length === 0) {
        Swal.fire({
          title: 'Falta algo',
          text: 'Selecciona nuevamente el contenido a pegar',
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
    })
      .catch(err => {
        console.error('Error al leer del portapapeles:', err);
      });

  }

  /**
  * Captura mediante un CTRL + V los datos copiados en el portapapeles
  * ------------------------------------------------------------------
  */
  public onPaste(evento: ClipboardEvent) {
    evento.preventDefault();
    const datosPortapaeles = evento.clipboardData?.getData("text");

    this.hasDatos = true;
    const filas = datosPortapaeles.split("\n").map((row) => row.split("\t").map((cell) => cell.trim()));
    const filasFiltradas = filas.filter((row) => row.some((cell) => cell.length > 0));
    this.headers = filasFiltradas.length > 0 ? filasFiltradas.shift()! : [];
    this.showInstructions = false;
    this.dataMesAgencias = this.procesarCeldasCombinadas(filasFiltradas);


    if (this.dataMesAgencias.length === 0) {
      return;
    }
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
    })
  }

  /**
   * Maneja la funcionalidad del botón guardar/actualizar
   * Si existe información ejecutara -> update
   * Si no exist ejecutara -> el método save
   */
  public btnSoU() {
    if (this.existInfo) {
      this.update();
      
    } else {
      this.save();
    }
  }

  /**
   * Guarda los datos en la base de datos
   */
  public save() {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "Deseas guardar estos datos para Renault",
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
      this.isLoad = false;
      if (result.value) {
        const data = {
          dataMesAgencias :this.dataMesAgencias,
          anio : this.anio,
          mes : this.mes,
          headers: this.headers
        }
        this.isLoad = false;
        this.agenciasRenaultService.save(data).subscribe(
        // this.agenciasRenaultService.save(this.procesarDatos()).subscribe(
          (response) => {
            if (response.status === "success") {
              Swal.fire({
                title: "Guardado",
                text: "Datos guardados correctamente",
                buttonsStyling: false,
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-success px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
              this.getMesAgencia();
            } else {
              Swal.fire({
                title: response.error,
                text: response.message,
                buttonsStyling: false,
                icon: "error",
                customClass: {
                  confirmButton: "btn btn-success px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
              this.isLoad = false;
            }
          },
          (error) => {
            Swal.fire({
              title: "Algo salio mal",
              text: `Error fetching data:, ${error}`,
              buttonsStyling: false,
              icon: "error",
              customClass: {
                confirmButton: "btn btn-success px-4",
                cancelButton: "btn btn- ms-2 px-4",
              },
            });
            this.getMesAgencia();
            // this.isLoad = false;
          }
        );
      }
    })
  }


  /**
   * Actualiza los datos en las base de datos
   */
  public update() {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "Deseas actualizar estos datos para  este periodo de Renault",
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
        const data = {
          dataMesAgencias :this.dataMesAgencias,
          anio : this.anio,
          mes : this.mes,
          headers: this.headers
        }
        this.isLoad = false;
        this.agenciasRenaultService.update(data).subscribe(
        // this.agenciasRenaultService.update(this.procesarDatos()).subscribe(
          (response) => {
            if (response.status === "success") {
              Swal.fire({
                title: "Guardado",
                text: "Datos actualizados correctamente",
                buttonsStyling: false,
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-success px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
              this.getMesAgencia();
            } else {
              this.isLoad = false;
              Swal.fire({
                title: response.error,
                text: response.message,
                buttonsStyling: false,
                icon: "error",
                customClass: {
                  confirmButton: "btn btn-success px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
              this.isLoad = true;
            }
          },
          (error) => {
            Swal.fire({
              title: "Algo salio mal",
              text: `Error fetching data:, ${error}`,
              buttonsStyling: false,
              icon: "error",
              customClass: {
                confirmButton: "btn btn-success px-4",
                cancelButton: "btn btn- ms-2 px-4",
              },
            });
            this.getMesAgencia();
          }
        );
      }
    })
  }
}



