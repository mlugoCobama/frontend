import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import Swal from "sweetalert2";
import { AgenciasService } from "src/app/core/services/dashboard/agencias.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-form-tabla-captura",
  templateUrl: "./form-tabla-captura.component.html",
  styleUrls: ["./form-tabla-captura.component.css"],
})
export class FormTablaCapturaComponent implements OnInit {
  public showInstructions: boolean = true;
  public tableData: {
    value: string;
    colspan: number;
  }[][] = [];
  
  public headers: string[] = [];
  public secciones: string[] = [];
  @Input() dataMesAgencias: any;
  @Input() catEmpresas: any;
  @Input() anio: any;
  @Input() mes: any;

  private saveDataNissanSubscripcion: Subscription;
  constructor(private agenciasService: AgenciasService) {}

  ngOnInit() {
    this.saveDataNissanSubscripcion =
      this.agenciasService.guardarDatosNissan$.subscribe(() => {
        this.save();
      });
  }

  ngOnDestroy(): void {
    if (this.saveDataNissanSubscripcion) {
      this.saveDataNissanSubscripcion.unsubscribe();
    }
  }
  /*
   *Maneja el evento de pegar los datos en la tabla
   */
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData?.getData("text");
    if (!clipboardData) return;

    this.showInstructions = false;

    const rows = clipboardData
      .split("\n")
      .map((row) => row.split("\t").map((cell) => cell.trim()));
      
    const filasFiltradas = rows.filter((row) =>
      row.some((cell) => cell.length > 0)
    );
    this.headers = filasFiltradas.length > 0 ? filasFiltradas.shift()! : [];
    this.tableData = this.processMergedCells(filasFiltradas);
    console.log(this.tableData)
  }

  /*
   *Maneja el proceso para combinar celdas en las secciones
   */
  private processMergedCells(rows: string[][]): { value: string; colspan: number }[][] {
    return rows.map((row) => {
      let processedRow: { value: string; colspan: number }[] = [];
      let previousCell = "";

      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        let cell = row[colIndex];

        if (cell === "" && previousCell !== "") {
          processedRow[processedRow.length - 1].colspan += 1;
        } else {
          processedRow.push({ value: cell, colspan: 1 });
          previousCell = cell;
        }
      }
      return processedRow;
    });
  }

  //*Genera estructura: Agencia/Sección/Concepto:Valor
  public procesarDatos(): Record<string,Record<string, Record<string, string>>> {
    let jsonData: Record<string, Record<string, Record<string, string>>> = {};
    let seccion = "";
    const fecha = `${this.anio}-${this.mes.toString().padStart(2, "0")}-01`;
    const headers = this.headers.slice(1);

    //Relación secciónTabla->tablaBD
    const relTablas: Record<string, string> = {
      "UNIDADES VENDIDAS": "ordenes_unidades",
      "ORDENES DE SERVICIO": "ordenes_unidades",
      "VENTAS DE POST VENTA": "ventas_post_venta",
      "TOTAL DE GASTOS OPERATIVOS": "datos_generales",
      "COSTO FINANCIERO CONSOLIDADO": "costos_financieros_prestamos",
      "BONOS MARCA": "complementos",
      "UNO": "datos_generales",
      "ACUMULADO PERSONAL CONSOLIDADO": "datos_generales",
      "UTILIDAD POR AREA": "utilidad_area",
    };

    //Relación campoTabla->campos BD
    const relCampos: Record<string, string> = {
      "Nuevos": "nuevos",
      "UB Nuevos": "utilidad_nuevos",
      "Flotillas": "flotillas",
      "UB Flotillas": "utilidad_flotillas",
      "Seminuevos": "seminuevos",
      "UB Seminuevos": "utilidad_seminuevos",

      "Ordenes de servicios": "servicio",
      "UB O. servicios": "utilidad_servicio",
      "Ordenes de HyP": "hyp",
      "UB Ordenes de HyP": "utilidad_hyp",

      "Ventas Servicio": "ventas_servicio",
      "Total Ventas Refacciones": "total_ventas_ref",
      "Refacciones Servicio": "refacciones_servicio",
      "Refacciones HyP": "refacciones_hyp",
      "Refacciones Mostrador": "refacciones_mostrador",

      "Total de Gastos Operativos": "gasto",

      "CNuevos": "nuevos",
      "CFlotillas": "utilidad_nuevos",
      "Refacciones": "refacciones",
      "Bajio": "bajio",
      "intercias": "intercias",

      "Bonos Marca": "bonos",

      "UNO": "uno",

      "Personal": "personal",

      "Area Comercial": "area_comercial",
      "Area Postventa": "area_postventa",
    };

    //Relación header agencia->id_sucursal BD
    const relAgencias: Record<string, number> = {
      "Campestre": 22,
      "Automotriz": 23,
      "Insurgentes": 24,
      "Universidad": 25,
    };

    this.tableData.forEach((row) => {
      if (row.length === 1) {
        seccion = row[0].value.trim();
        // jsonData[seccion] = {};
      } else if (seccion) {
        let concepto = row[0].value.trim();

        headers.forEach((header, index) => {
          if (header.toLowerCase() !== "total") {
            const agencia = header.trim();
            const value = row[index + 1]?.value?.trim() || "";

            const dbAgencia = relAgencias[agencia] || agencia;
            const dbSeccion = relTablas[seccion] || seccion;
            const dbCampos = relCampos[concepto] || concepto;

            if (!jsonData[dbAgencia]) jsonData[dbAgencia] = {};
            if (!jsonData[dbAgencia][dbSeccion]) jsonData[dbAgencia][dbSeccion] = {};

            if (!jsonData[dbAgencia][dbSeccion].fecha) {
              jsonData[dbAgencia][dbSeccion].fecha = fecha;
            }

            jsonData[dbAgencia][dbSeccion][dbCampos] = value;
          }
        });
      }
    });
    return jsonData;
  }

  public save() {
    Swal.fire({
      title: "¿Estas seguro?",
        text: "Deseas guardar estos datos para Nissan",
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
      if(result.value){
        this.agenciasService.save(this.procesarDatos()).subscribe(
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
          }
        );
      }
    })
  }
}
