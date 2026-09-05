import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class ReporteVolumetricoPdfService {

  generar(data: any): void {

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // ============================
    // ENCABEZADO
    // ============================

    this.agregarEncabezado(pdf, data);

    // ============================
    // INFORMACIÓN GENERAL
    // ============================

    let y = 30;

    y = this.agregarInformacionGeneral(pdf, data, y);

    // ============================
    // INFRAESTRUCTURA
    // ============================

    y = this.agregarInfraestructura(pdf, data, y);

    // ============================
    // PRODUCTOS
    // ============================

    const productos = data?.Producto ?? [];

    for (const producto of productos) {

      y = this.agregarProducto(
        pdf,
        producto,
        y
      );
    }

    // ============================
    // FOOTER
    // ============================

    this.agregarFooter(pdf);

    // ============================
    // DESCARGAR
    // ============================

    const nombre = this.generarNombreArchivo(data);

    pdf.save(nombre);
  }


  // ============================================================
  // ENCABEZADO
  // ============================================================

  private agregarEncabezado(
    pdf: jsPDF,
    data: any
  ): void {

    const fecha = data?.FechaYHoraReporteMes
      ? new Date(data.FechaYHoraReporteMes)
      : null;

    const mes = fecha
      ? fecha.toLocaleDateString(
          'es-MX',
          {
            month: 'long',
            year: 'numeric'
          }
        )
      : 'N/A';

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(17);

    pdf.text(
      `Reporte de control volumétrico - ${mes}`,
      15,
      18
    );

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);

    pdf.text(
      data?.DescripcionInstalacion ?? 'N/A',
      15,
      25
    );

    pdf.setLineWidth(0.6);

    pdf.line(
      15,
      29,
      195,
      29
    );
  }


  // ============================================================
  // INFORMACIÓN GENERAL
  // ============================================================

  private agregarInformacionGeneral(
    pdf: jsPDF,
    data: any,
    y: number
  ): number {

    y = this.agregarTituloSeccion(
      pdf,
      'Identificación Fiscal y Permisos',
      y
    );

    autoTable(pdf, {
      startY: y,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 2
      },
      headStyles: {
        fontStyle: 'bold'
      },
      body: [

        [
          'Fecha del reporte',
          this.formatearFecha(
            data?.FechaYHoraReporteMes
          ),
          '',
          ''
        ],

        [
          'Instalación',
          data?.DescripcionInstalacion ?? 'N/A',
          'Número de permiso',
          data?.NumPermiso ?? 'N/A'
        ],

        [
          'RFC contribuyente',
          data?.RfcContribuyente ?? 'N/A',
          'RFC REP. LEGAL',
          data?.RfcRepresentanteLegal ?? 'N/A'
        ],
        [
          'Modalidad',
          `${data?.Caracter ?? 'N/A'} (${data?.ModalidadPermiso ?? 'N/A'})`,
          'Clave instalación',
          data?.ClaveInstalacion ?? 'N/A'
        ]

      ],

      columnStyles: {
        0: {
          fontStyle: 'bold',
          cellWidth: 35
        },
        1: {
          cellWidth: 60
        },
        2: {
          fontStyle: 'bold',
          cellWidth: 35
        },
        3: {
          cellWidth: 50
        }
      },

      didParseCell: (hookData) => {

        // Primera fila: fecha ocupa visualmente más espacio
        if (
          hookData.row.index === 0 &&
          hookData.column.index === 1
        ) {
          hookData.cell.colSpan = 3;
        }

      }

    });

    return this.obtenerUltimoY(pdf) + 2;
  }


  // ============================================================
  // INFRAESTRUCTURA
  // ============================================================

  private agregarInfraestructura(
    pdf: jsPDF,
    data: any,
    y: number
  ): number {

    y = this.agregarTituloSeccion(
      pdf,
      'Infraestructura Declarada',
      y
    );
    const producto =
      data?.Producto?.[0];

    autoTable(pdf, {
      startY: y,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 2
      },
      body: [
        [
          'Producto declarado', (producto?.ClaveProducto ?? 'N/A'),'','','',''
        ],
        [
          'Pozos', (data?.NumeroPozos ?? 0),
          'Tanques', (data?.NumeroTanques ?? 0),
          'Dispensarios',(data?.NumeroDispensarios ?? 0)
        ]
      ],
      columnStyles: {

        0: {
          fontStyle: 'bold'
        },

        2: {
          fontStyle: 'bold'
        },

        4: {
          fontStyle: 'bold'
        }

      },
       didParseCell: (hookData) => {

        if (
          hookData.row.index === 0 &&
          hookData.column.index === 1
        ) {
          hookData.cell.colSpan = 5;
        }

      }

    });

    return this.obtenerUltimoY(pdf) + 2;
  }


  // ============================================================
  // PRODUCTO
  // ============================================================

  private agregarProducto(
    pdf: jsPDF,
    producto: any,
    y: number
  ): number {

    const reporte =
      producto?.ReporteDeVolumenMensual ?? {};

    const existencias =
      reporte?.ControlDeExistencias ?? {};

    const recepciones =
      reporte?.Recepciones ?? {};

    const entregas =
      reporte?.Entregas ?? {};

    // ----------------------------------
    // RESUMEN
    // ----------------------------------

    y = this.agregarTituloSeccion(
      pdf,
      `Resumen - Producto ${producto?.ClaveProducto ?? 'N/A'}`,
      y
    );

    autoTable(pdf, {

      startY: y,

      theme: 'grid',

      styles: {
        fontSize: 9,
        cellPadding: 2,
        halign: 'center'
      },

      body: [

        [
          {
            content: 'EXISTENCIAS EN MES',
            colSpan: 2
          },
          {
            content:
              `${this.numero(
                existencias?.VolumenExistenciasMes
              )} L`,
              colSpan: 2,
            styles: {
              fontStyle: 'bold',
              fontSize: 12
            }
          }
        ],

        [

          {
            content: 'TOTAL RECEPCIONES '
          },
          {
            content:
              `${recepciones?.TotalRecepcionesMes ?? 0} - ` +
              `${recepciones?.TotalDocumentosMes ?? 0} docs`,
            styles: {
              fontStyle: 'bold'
            }
          },
          {
            content: 'TOTAL ENTREGAS '
          },
          {
            content:
              `${entregas?.TotalEntregasMes ?? 0} - ` +
              `${entregas?.TotalDocumentosMes ?? 0} docs`,
            styles: {
              fontStyle: 'bold'
            }
          }

        ],

        [
          {
            content: 'VOLUMENES RECIBIDOS '
          },
          {
            content:
              `${this.numero(
                recepciones
                  ?.SumaVolumenRecepcionMes
                  ?.ValorNumerico
              )} L`,
            styles: {
              fontStyle: 'bold'
            }
          },

          {
            content: 'VOLUMENES ENTREGADOS '
          },
          {
            content:
              `${this.numero(
            entregas
              ?.SumaVolumenEntregadoMes
              ?.ValorNumerico
          )} L`,
            styles: {
              fontStyle: 'bold'
            }
          },


        ],

        [

          {
            content: 'VOLUMENES ENTREGADOS '
          },

          {
            content:
             `$ ${this.numero(
            recepciones
              ?.ImporteTotalRecepcionesMensual
          )}`,
            styles: {
              fontStyle: 'bold'
            }
          },

          {
            content: 'VOLUMENES ENTREGADOS '
          },

          {
            content:
            `$ ${this.numero(
            entregas
              ?.ImporteTotalEntregasMes
          )}`,
            styles: {
              fontStyle: 'bold'
            }
          },

        ]

      ],

    });

    y = this.obtenerUltimoY(pdf) + 2;

    // ----------------------------------
    // ACLARACIONES RECEPCIONES
    // ----------------------------------

    const aclaracionesRecepciones =
      this.calcularAclaraciones(
        recepciones?.Complemento ?? []
      );

    y = this.agregarAclaraciones(
      pdf,
      'Aclaraciones Recepciones',
      aclaracionesRecepciones,
      y
    );

    // ----------------------------------
    // ACLARACIONES ENTREGAS
    // ----------------------------------

    const aclaracionesEntregas =
      this.calcularAclaraciones(
        entregas?.Complemento ?? []
      );

    y = this.agregarAclaraciones(
      pdf,
      'Aclaraciones Entregas',
      aclaracionesEntregas,
      y
    );

    return y;
  }


  // ============================================================
  // ACLARACIONES
  // ============================================================

  private agregarAclaraciones(
    pdf: jsPDF,
    titulo: string,
    aclaraciones: AclaracionesResumen,
    y: number
  ): number {

    // Si no cabe, crear página nueva
    if (y > 250) {

      pdf.addPage();

      y = 20;
    }

    y = this.agregarTituloSeccion(
      pdf,
      titulo,
      y
    );

    autoTable(pdf, {

      startY: y,

      theme: 'grid',

      styles: {
        fontSize: 9,
        cellPadding: 4,
        halign: 'center'
      },

      body: [

        [

          {
            content:
              `TOTAL ALCLARACIONES: ${this.numero(
                aclaraciones.total
              )} L`,
              colSpan: 3,
            styles: {
              fontStyle: 'bold',
              fontSize: 12
            }
          }
        ],

        [
          {content:`${this.numero(
            aclaraciones.sinCfdi
          )} L`, styles: {
              fontStyle: 'bold',
              fontSize: 12
            }},
          {content:`${this.numero(
            aclaraciones.traspaso
          )} L`, styles: {
              fontStyle: 'bold',
              fontSize: 12
            }},
          {content:`${this.numero(
            aclaraciones.autoconsumo
          )} L`, styles: {
              fontStyle: 'bold',
              fontSize: 12
            }},
        ],

        [
          'SIN CFDI',
          'TRASPASO',
          'AUTOCONSUMO'
        ]

      ]

    });

    return this.obtenerUltimoY(pdf) + 2;
  }


  // ============================================================
  // CALCULAR ACLARACIONES
  // ============================================================

  private calcularAclaraciones(
    complementos: any[]
  ): AclaracionesResumen {

    const resultado: AclaracionesResumen = {

      sinCfdi: 0,

      autoconsumo: 0,

      traspaso: 0,

      total: 0

    };

    for (const comp of complementos ?? []) {

      const aclaracion =
        comp?.Aclaracion;

      if (!aclaracion) {
        continue;
      }

      const texto =
        aclaracion.toLowerCase();

      const volumen =
        this.obtenerVolumen(comp);

      if (volumen <= 0) {
        continue;
      }

      if (
        texto.includes('sin cfdi') ||
        texto.includes('sin cdfi')
      ) {

        resultado.sinCfdi += volumen;

      }
      else if (
        texto.includes('autoconsumo')
      ) {

        resultado.autoconsumo += volumen;

      }
      else if (
        texto.includes('traspaso')
      ) {

        resultado.traspaso += volumen;
      }
    }

    resultado.total =
      resultado.sinCfdi +
      resultado.traspaso +
      resultado.autoconsumo;

    return resultado;
  }


  // ============================================================
  // OBTENER VOLUMEN
  // ============================================================

  private obtenerVolumen(
    comp: any
  ): number {

    // ----------------------------------
    // VolumenDocumentado directo
    // ----------------------------------

    if (
      comp?.VolumenDocumentado?.ValorNumerico !==
      undefined &&
      comp.VolumenDocumentado.ValorNumerico !== ''
    ) {

      return Number(
        comp.VolumenDocumentado.ValorNumerico
      );
    }


    // ----------------------------------
    // Nacional -> CFDIs
    // ----------------------------------

    if (
      Array.isArray(comp?.Nacional)
    ) {

      return comp.Nacional.reduce(
        (
          total: number,
          nacional: any
        ) => {

          return total +
            (nacional?.CFDIs ?? [])
              .reduce(
                (
                  subtotal: number,
                  cfdi: any
                ) => {

                  return subtotal +
                    Number(
                      cfdi
                        ?.VolumenDocumentado
                        ?.ValorNumerico ?? 0
                    );
                },
                0
              );

        },
        0
      );
    }


    // ----------------------------------
    // Volumen dentro de Aclaracion
    // ----------------------------------

    const aclaracion =
      comp?.Aclaracion ?? '';

    const regex =
      /volumen:\s*([\d.]+)|([\d.]+)\s*litros/i;

    const match =
      aclaracion.match(regex);

    return Number(
      match?.[1] ??
      match?.[2] ??
      0
    );
  }


  // ============================================================
  // TITULO DE SECCIÓN
  // ============================================================

  private agregarTituloSeccion(
    pdf: jsPDF,
    titulo: string,
    y: number
  ): number {

    if (y > 260) {

      pdf.addPage();

      y = 20;
    }

    pdf.setFillColor(
      16,
      19,
      49
    );

    pdf.rect(
      15,
      y,
      180,
      8,
      'F'
    );

    pdf.setTextColor(
      255,
      255,
      255
    );

    pdf.setFont(
      'helvetica',
      'bold'
    );

    pdf.setFontSize(10);

    pdf.text(
      titulo,
      18,
      y + 5.5
    );

    pdf.setTextColor(
      51,
      51,
      51
    );

    return y + 10;
  }


  // ============================================================
  // FOOTER
  // ============================================================

  private agregarFooter(
    pdf: jsPDF
  ): void {

    const paginas =
      pdf.getNumberOfPages();

    for (
      let i = 1;
      i <= paginas;
      i++
    ) {

      pdf.setPage(i);

      pdf.setFont(
        'helvetica',
        'normal'
      );

      pdf.setFontSize(8);

      pdf.setTextColor(
        120,
        120,
        120
      );

      pdf.text(
        'Reporte Volumétrico Mensual',
        105,
        290,
        {
          align: 'center'
        }
      );

      pdf.text(
        `Página ${i} de ${paginas}`,
        195,
        290,
        {
          align: 'right'
        }
      );
    }
  }


  // ============================================================
  // UTILIDADES
  // ============================================================

  private obtenerUltimoY(
    pdf: jsPDF
  ): number {

    const ultimo =
      (pdf as any).lastAutoTable;

    return ultimo?.finalY ?? 20;
  }


  private numero(
    valor: any
  ): string {

    return Number(
      valor ?? 0
    ).toLocaleString(
      'es-MX',
      {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
      }
    );
  }


  private formatearFecha(
    fecha: string | null
  ): string {

    if (!fecha) {
      return 'N/A';
    }

    const date =
      new Date(fecha);

    return date.toLocaleDateString(
      'es-MX',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  }


  private generarNombreArchivo(
    data: any
  ): string {

    const instalacion =
      data?.ClaveInstalacion ??
      'reporte';

    return `Reporte_Volumetrico_${instalacion}.pdf`;
  }
}


// ============================================================
// INTERFAZ
// ============================================================

interface AclaracionesResumen {

  sinCfdi: number;

  autoconsumo: number;

  traspaso: number;

  total: number;
}
