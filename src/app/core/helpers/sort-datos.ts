
export class SortDatos {
  
  /**
   * Ordena los datos de mayor a menor en base al concepto especificado
   * @param data Datos recuperados de la base de datos
   * @param concepto Campo por el cual ordenar los datos
   */
  static ordenarDatos(data: any, concepto: string): void {
    if (data["mes"]?.length > 1) {
      const arrayReferencia = this.generarArrayReferencia(data["mes"], concepto);
      
      data["mes"] = this.ordenarPeriodo(data["mes"], arrayReferencia);
      data["mesAnt"] = this.ordenarPeriodo(data["mesAnt"], arrayReferencia);
      data["anioAnt"] = this.ordenarPeriodo(data["anioAnt"], arrayReferencia);
    }
  }

  /**
   * Genera un array de referencia para ordenar arrays similares
   * @param arrayBase datos del mes que se ordena de mayor a menor
   * @param concepto campo por el cual se va a ordenar
   * @returns array ordenado de mayor a menor que funciona como referencia
   */
  private static generarArrayReferencia(arrayBase: any[], concepto: string): Array<{index: number, value: any}> {
    if (arrayBase?.length > 1) {
      const arrayReferencia = arrayBase.map((item, index) => ({
        index, 
        value: item[concepto]
      }));
      
      return arrayReferencia.sort((a, b) => b.value - a.value);
    }
    return [];
  }

  /**
   * Ordena los datos en base al array de referencia
   * @param dataMes datos del mes a ordenar
   * @param arrayReferencia array que se utilizará como referencia para ordenar los datos
   * @returns array ordenado basado en el array de referencia
   */
  private static ordenarPeriodo(dataMes: any[], arrayReferencia: Array<{index: number, value: any}>): any[] {
    if (dataMes?.length > 1 && arrayReferencia?.length > 0) {
      return arrayReferencia.map((item) => dataMes[item.index]);
    }
    return dataMes || [];
  }

  /**
   * Método que retorna los datos ordenados sin modificar el original
   * @param data Datos a ordenar
   * @param concepto Campo por el cual ordenar
   * @returns Copia de los datos ordenados
   */
  static obtenerDatosOrdenados(data: any, concepto: string): any {
    const dataCopia = JSON.parse(JSON.stringify(data)); 
    this.ordenarDatos(dataCopia, concepto);
    return dataCopia;
  }
}

// Uso del helper:
// import { DataSortingHelper } from '../helpers/data-sorting.helper';
// DataSortingHelper.ordenarDatos(miData, 'miCampo');