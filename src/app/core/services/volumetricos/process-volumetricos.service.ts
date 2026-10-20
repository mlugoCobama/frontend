import { Injectable } from '@angular/core';
import { XMLParser } from 'fast-xml-parser';

@Injectable({
  providedIn: 'root'
})
export class ProcessVolumetricosService {

  private parser: XMLParser;

  /**
   * Nodos que deben representarse siempre como arreglos.
   */
  private readonly camposArrayObligatorios = [
    'Caracter',
    'Producto',
    'Bitacora',
    'Nacional',
    'Extranjero',
    'CFDIs',
    'CFDI',
    'Recepciones',
    'Recepcion',
    'Entregas',
    'Entrega',
    'Tanque',
    'Manguera',
    'Dispensario',
    'Mangueras',
    'Dispensarios',
    'Geolocalizacion'
  ];

  /**
   * Mapeo de nombres especiales del XML hacia
   * la estructura que requiere la aplicación.
   */
  private readonly dicEspeciales: Record<string, string> = {
    'UM': 'UM',
    'BITACORA': 'Bitacora',
    'PRODUCTO': 'Producto',
    'CARACTER': 'Caracter',
    'GEOLOCALIZACION': 'Geolocalizacion',
    'REPORTEDEVOLUMENMENSUAL': 'ReporteDeVolumenMensual',
    'NACIONAL': 'Nacional',
    'EXTRANJERO': 'Extranjero',
    'RECEPCIONES': 'Recepciones',
    'ENTREGAS': 'Entregas',
    'CONTROLDEEXISTENCIAS': 'ControlDeExistencias',
    'PrecioCompra': 'PrecioVentaOCompraOContrap',
    'TipoCfdi': 'tipoCfdi'
  };

  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
      parseTagValue: false,
      parseAttributeValue: false,
      removeNSPrefix: true,

      transformTagName: (tagName: string) => {

        const mapaNombres: Record<string, string> = {
          'NACIONAL': 'Nacional',
          'EXTRANJERO': 'Extranjero',
          'ACREDITACION': 'Acreditacion'
        };

        return mapaNombres[tagName] || tagName;
      },

      isArray: (name: string) => [
        'Nacional',
        'Extranjero',
        'CFDIs',
        'CFDI',
        'Tanque',
        'Manguera'
      ].includes(name)
    });
  }

  /**
   * Convierte un XML en un objeto JSON y posteriormente
   * adapta las claves a la estructura utilizada por la aplicación.
   */
  public convertirXml(xml: string): any {
    const json = this.parser.parse(xml);
    return this.convertirClavesSAT(json);
  }

  /**
   * Convierte las claves del XML a PascalCase y normaliza
   * los nodos que deben ser arreglos.
   */
  private convertirClavesSAT(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.convertirClavesSAT(item));
    }
    if (obj !== null && typeof obj === 'object') {
      const nuevoObjeto: Record<string, any> = {};
      for (const [key, value] of Object.entries(obj)) {
        let nuevaClave = this.dicEspeciales[key];
        if (!nuevaClave) {
          if (key === key.toUpperCase() && key !== '?xml') {
            nuevaClave =
              key.charAt(0).toUpperCase() +
              key.slice(1).toLowerCase();
          } else {
            nuevaClave = key;
          }
        }

        let valorProcesado = this.convertirClavesSAT(value);

        if (
          this.camposArrayObligatorios.includes(nuevaClave) &&
          !Array.isArray(valorProcesado)
        ) {
          valorProcesado = [valorProcesado];
        }
        nuevoObjeto[nuevaClave] = valorProcesado;
      }
      return nuevoObjeto;
    }
    return obj;
  }

    private formatoNumero = new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4
  });

  private formatoMoneda = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  /**
   * Formatea un número con 4 decimales.
   *
   * Ejemplo:
   * 1234.56789 -> 1,234.5679
   */
  public numero(valor: number | string | null | undefined): string {

    if (valor === null || valor === undefined || valor === '') {
      return this.formatoNumero.format(0);
    }

    const numero = Number(valor);

    if (isNaN(numero)) {
      return '';
    }

    return this.formatoNumero.format(numero);
  }

  /**
   * Formatea un valor como moneda mexicana.
   *
   * Ejemplo:
   * 1234.5 -> $1,234.50
   */
  public moneda(valor: number | string | null | undefined): string {

    if (valor === null || valor === undefined || valor === '') {
      return this.formatoMoneda.format(0);
    }

    const numero = Number(valor);

    if (isNaN(numero)) {
      return '';
    }

    return this.formatoMoneda.format(numero);
  }

  /**
   * Formatea una fecha en formato:
   * DD/MM/YYYY HH:mm:ss
   */
  public fecha(fecha: string | Date | null | undefined): string {

    if (!fecha) {
      return '';
    }

    const d = new Date(fecha);

    if (isNaN(d.getTime())) {
      return String(fecha);
    }

    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const aaaa = d.getFullYear();

    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');

    return `${dd}/${mm}/${aaaa} ${hh}:${min}:${ss}`;
  }
}
