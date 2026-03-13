
export class ValidadorCFDI {
  static esCFDI(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      // Validar extensión
      if (!file.name.toLowerCase().endsWith('.xml')) {
        return resolve(false);
      }

      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const xmlContent = e.target?.result as string;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');

        // Verificar si hubo errores de parseo
        const parserError = xmlDoc.getElementsByTagName('parsererror')[0];
        if (parserError) {
          return resolve(false);
        }

        // Buscar nodo raíz CFDI
        const comprobante = xmlDoc.getElementsByTagName('cfdi:Comprobante')[0];
        if (comprobante) {
          return resolve(true);
        } else {
          return resolve(false);
        }
      };

      reader.onerror = () => resolve(false);

      reader.readAsText(file);
    });
  }
}