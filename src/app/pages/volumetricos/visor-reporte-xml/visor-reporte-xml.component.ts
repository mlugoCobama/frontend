import { Component, Input, OnInit } from '@angular/core';
import { VolumetricosExportService } from 'src/app/core/services/volumetricos/volumetricos-export-service.service';
import { ReporteVolumetricoPdfService } from 'src/app/core/services/volumetricos/reporte-volumetrico-pdf.service';

interface SumatoriaVolumenes {
  sinCfdi: number;
  autoconsumo: number;
  traspaso: number;
}

@Component({
  selector: 'app-visor-reporte-xml',
  templateUrl: './visor-reporte-xml.component.html',
  styleUrl: './visor-reporte-xml.component.css'
})
export class VisorReporteXmlComponent implements OnInit{
  @Input() dataJson:any = [];
  public producto:any;
  public recepciones:any;
  public entregas:any;
  public existencias:any;

  public aclaracionesEntregas:any;
  public aclaracionesRecepciones:any;


  constructor(
      private exportService: ReporteVolumetricoPdfService,
    ){}

  ngOnInit(): void {
    this.getPrincipalBlock();

  }

  public getPrincipalBlock(){
    this.dataJson.NumPermiso = this.dataJson.Caracter[0].NumPermiso
    this.dataJson.ModalidadPermiso = this.dataJson.Caracter[0].ModalidadPermiso
    this.dataJson.Caracter = this.dataJson.Caracter[0].TipoCaracter
    this.producto = (this.dataJson['Producto'][0]) ? this.dataJson['Producto'][0] : null;
    this.recepciones = (this.producto['ReporteDeVolumenMensual']['Recepciones']) ? this.producto['ReporteDeVolumenMensual']['Recepciones'][0] : null;
    this.entregas = (this.producto['ReporteDeVolumenMensual']['Entregas']) ? this.producto['ReporteDeVolumenMensual']['Entregas'][0] : null;
    this.existencias = (this.producto['ReporteDeVolumenMensual']['ControlDeExistencias']) ? this.producto['ReporteDeVolumenMensual']['ControlDeExistencias']: null;
    this.existencias.VolumenExistenciasMes = this.existencias.VolumenExistenciasMes.ValorNumerico
    this.aclaracionesEntregas = this.obtenerSumatoriasPorAclaracion(this.entregas['Complemento']['Complemento_Almacenamiento']['Nacional']);
    this.aclaracionesRecepciones = this.obtenerSumatoriasPorAclaracion(this.recepciones['Complemento']['Complemento_Almacenamiento']['Nacional']);
  }

 public formatJson() {
  const newJson = structuredClone(this.dataJson);
  const productoClonado = newJson['Producto']?.[0];

  if (productoClonado) {
    const reporte = productoClonado['ReporteDeVolumenMensual'];

    if (reporte) {
      const rawRecepcionObj = reporte['Recepciones']?.[0] ?? reporte['Recepciones']?.[0];
      const rawEntregaObj   = reporte['Entregas']?.[0]    ?? reporte['Entregas']?.[0];
      delete reporte['Recepciones'];
      delete reporte['Entregas'];
      reporte['Recepciones'] = rawRecepcionObj ? structuredClone(rawRecepcionObj) : {};
      reporte['Entregas']    = rawEntregaObj   ? structuredClone(rawEntregaObj)   : {};
      if (this.recepciones) {
        reporte['Recepciones']['Complemento'] = structuredClone(
          this.recepciones['Complemento']['Complemento_Almacenamiento']['Nacional']
        );
      }
      if (this.entregas) {
        reporte['Entregas']['Complemento'] = structuredClone(
          this.entregas['Complemento']['Complemento_Almacenamiento']['Nacional']
        );
      }
    }
  }

  return newJson;
}
  descargarPdf() {
    this.exportService.generar(this.formatJson());
  }


  public obtenerSumatoriasPorAclaracion(complementos: any[]): SumatoriaVolumenes {
    const totales: SumatoriaVolumenes = {
      sinCfdi: 0,
      autoconsumo: 0,
      traspaso: 0
    };

    for (const comp of complementos) {
      if (!comp.Aclaracion) continue;

      const aclaracion = comp.Aclaracion.toLowerCase();
      let volumen = 0;

      if (comp.VolumenDocumentado?.ValorNumerico) {
        volumen = Number(comp.VolumenDocumentado.ValorNumerico);
      } else if (comp.Nacional && Array.isArray(comp.Nacional)) {
        for (const nac of comp.Nacional) {
          for (const cfdi of nac.CFDIs || []) {
            volumen += Number(cfdi.VolumenDocumentado?.ValorNumerico || 0);
          }
        }
      } else {
        const regexVolumen = /volumen:\s*([\d.]+)|([\d.]+)\s*litros/i;
        const match = aclaracion.match(regexVolumen);
        if (match) {
          volumen = parseFloat(match[1] || match[2]);
        }
      }

      if (isNaN(volumen) || volumen === 0) continue;

      if (aclaracion.includes('sin cfdi') || aclaracion.includes('sin cdfi')) {
        totales.sinCfdi += volumen;
      } else if (aclaracion.includes('autoconsumo')) {
        totales.autoconsumo += volumen;
      } else if (aclaracion.includes('traspaso')) {
        totales.traspaso += volumen;
      }
    }

    return totales;
  }


  }
