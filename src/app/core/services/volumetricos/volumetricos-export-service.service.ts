import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient  } from '@angular/common/http';
import { SwalComprsServiceService } from '../compras/swal-comprs-service.service';
@Injectable({
  providedIn: 'root'
})
export class VolumetricosExportService {

  constructor(private http: HttpClient, private alerta: SwalComprsServiceService) { }

  descargarExcelDesdeServidor(reporteId: number, nombrePersonalizado?: string): void {
    const url = `${environment.apiUrl}reportes/${reporteId}/descargar-excel`;

    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        const fileName = nombrePersonalizado || `Reporte_Volumetrico_${reporteId}.xlsx`;
        this.triggerDownload(blob, fileName);
      },
      error: (err) => {
        this.alerta.mostrarAlerta('error',`'Error al descargar el archivo:', ${err}`,'error', 'danger' )
        console.error('Error al descargar el archivo Excel:', err);
      }
    });
  }

  descargarAcuse(acuseId: number, nombrePersonalizado?: string): void {
    const url = `${environment.apiUrl}reportes/${acuseId}/descargar-acuse`;

    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        const fileName = nombrePersonalizado || `Reporte_Volumetrico_${acuseId}.pdf`;
        this.triggerDownload(blob, fileName);
      },
      error: (err) => {
        this.alerta.mostrarAlerta('error',`'Error al descargar el archivo:', ${err}`,'error', 'danger' )
        console.error('Error al descargar el archivo Excel:', err);
      }
    });
  }


    descargarJsonDesdeServidor(reporteId: number, nombrePersonalizado?: string): void {
    const url = `${environment.apiUrl}reportes/${reporteId}/descargar-reporte`;

    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        const fileName = nombrePersonalizado ;
        this.triggerDownload(blob, fileName);
      },
      error: (err) => {
        this.alerta.mostrarAlerta('error',`'Error al descargar el archivo:', ${err}`,'error', 'danger' )
        console.error('Error al descargar el archivo Excel:', err);
      }
    });
  }

  /**
   * Descarga el objeto de reporte en formato JSON usando Blob (más eficiente para archivos grandes)
   */
  descargarJson(data: any, uuid?:any, fileName?: string): void {
    if (!data) return;

    const nombreArchivo = fileName || this.createSatFileName(data, uuid);
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });

    this.triggerDownload(blob, `${nombreArchivo}_JSON.json`);
  }

  /**
   * Transforma el objeto a XML y lo descarga en el navegador
   */
  descargarXml(data: any, uuid?:any, fileName?: string): void {
    if (!data) return;

    const nombreArchivo = fileName || this.createSatFileName(data, uuid);
    const xmlData = this.jsonToXml(data);
    const blob = new Blob([xmlData], { type: 'application/xml;charset=utf-8;' });

    this.triggerDownload(blob, `${nombreArchivo}_XML.xml`);
  }

  /**
   * Genera el nombre estandarizado del archivo según datos del SAT
   */
  createSatFileName(d: any, reportId:any ): string {
    if (!d) return 'reporte_volumetrico';

    const fecha = d.FechaYHoraReporteMes ? new Date(d.FechaYHoraReporteMes) : new Date();
    const mesFormateado = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-31`;

    const uuid = reportId || crypto.randomUUID();
    const clave = (d.ClaveInstalacion || "").trim().toUpperCase();
    const tipo = clave.substring(0, 3);
    const caracter = this.setTipoComplemento(tipo);

    return `M_${uuid.toUpperCase()}_${d.RfcContribuyente || ''}_${d.RfcProveedor || ''}_${mesFormateado}_${d.ClaveInstalacion || ''}_${caracter}`;
  }

  private setTipoComplemento(tipoComplemento: string): string {
    switch (tipoComplemento) {
        case 'EXO':
            return 'EXO';
        case 'PDD':
            return 'DIS';
        case 'CMN':
            return 'CMN';
        default:
            return 'DIS';
    }
}

  /**
   * Convierte objetos JS/JSON a string XML
   */
  jsonToXml(obj: any): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<Volumetricos>\n';

    const buildNodes = (node: any, indent: string = '  '): string => {
      let str = '';
      for (const key in node) {
        if (Object.prototype.hasOwnProperty.call(node, key)) {
          const value = node[key];
          if (Array.isArray(value)) {
            value.forEach((item) => {
              if (typeof item === 'object' && item !== null) {
                str += `${indent}<${key}>\n${buildNodes(item, indent + '  ')}${indent}</${key}>\n`;
              } else {
                str += `${indent}<${key}>${this.escapeXml(item)}</${key}>\n`;
              }
            });
          } else if (typeof value === 'object' && value !== null) {
            str += `${indent}<${key}>\n${buildNodes(value, indent + '  ')}${indent}</${key}>\n`;
          } else {
            str += `${indent}<${key}>${this.escapeXml(value)}</${key}>\n`;
          }
        }
      }
      return str;
    };

    xml += buildNodes(obj);
    xml += '</Volumetricos>';
    return xml;
  }

  /**
   * Helper privado para forzar la descarga de un Blob en el navegador
   */
  private triggerDownload(blob: Blob, fullName: string): void {
    const url = window.URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = fullName;

    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();

    // Limpieza
    downloadAnchor.remove();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Sanitiza caracteres especiales para XML
   */
  private escapeXml(value: any): string {
    if (value === null || value === undefined) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

}
