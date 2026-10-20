export class FuncionesTablasObj<T> {
  private columnaOrdenada: string = '';
  private ascendente = true;
  private datosOriginales: T[] = [];
  private datos: T[] = [];

  private collator = new Intl.Collator('es-MX', { sensitivity: 'base', numeric: true });

  private indiceBusqueda = new Map<T, string>();
  private indiceCampos: string[] | null = null;

  constructor(datos: T[]) {
    const seguroDatos = Array.isArray(datos) ? datos : [];
    this.datosOriginales = [...seguroDatos];
    this.datos = [...seguroDatos];
  }

  /**
   * Obtiene el valor de una propiedad de forma anidada de manera segura.
   * Si 'path' llega como número u otro tipo, se convierte a string sin problemas.
   */
  private obtenerValorAnidado(obj: any, path: string | number): any {
    if (!obj || path == null) return undefined;

    // Convertimos a string por si acaso pasan un número u otro tipo
    const pathStr = String(path);
    const partes = pathStr.split('.');

    let actual = obj;
    for (const parte of partes) {
      if (actual == null) return undefined;
      actual = actual[parte];
    }
    return actual;
  }

  // -------------------------------------------------------------------
  // Ordenamiento
  // -------------------------------------------------------------------

  ordenar(columna: string | number): T[] {
    const colStr = String(columna);
    if (this.columnaOrdenada === colStr) {
      this.ascendente = !this.ascendente;
    } else {
      this.columnaOrdenada = colStr;
      this.ascendente = true;
    }

    this.aplicarOrdenActual();
    return this.datos;
  }

  private aplicarOrdenActual(): void {
    if (!this.columnaOrdenada) return;

    const columna = this.columnaOrdenada;
    const dir = this.ascendente ? 1 : -1;

    this.datos.sort((a, b) => {
      const valorA = this.obtenerValorAnidado(a, columna);
      const valorB = this.obtenerValorAnidado(b, columna);

      if (valorA == null && valorB == null) return 0;
      if (valorA == null) return dir * -1;
      if (valorB == null) return dir * 1;

      if (typeof valorA === 'string') {
        return dir * this.collator.compare(valorA, valorB as string);
      }

      if (valorA instanceof Date && valorB instanceof Date) {
        return dir * (valorA.getTime() - valorB.getTime());
      }

      return dir * (valorA > valorB ? 1 : valorA < valorB ? -1 : 0);
    });
  }

  // -------------------------------------------------------------------
  // Filtrado
  // -------------------------------------------------------------------

  private construirIndice(campos: (string | number)[]): void {
    const camposStr = campos.map(c => String(c));

    const mismosCampos =
      this.indiceCampos &&
      this.indiceCampos.length === camposStr.length &&
      this.indiceCampos.every((c, i) => c === camposStr[i]);

    if (mismosCampos && this.indiceBusqueda.size > 0) return;

    this.indiceBusqueda.clear();
    for (const item of this.datosOriginales) {
      const texto = camposStr
        .map((c) => {
          const val = this.obtenerValorAnidado(item, c);
          return val?.toString().toLowerCase() ?? '';
        })
        .join(' | ');
      this.indiceBusqueda.set(item, texto);
    }
    this.indiceCampos = camposStr;
  }

  filtrar(query: string, campos: (string | number)[]): T[] {
    this.construirIndice(campos);
    const filtro = query.trim().toLowerCase();

    this.datos = filtro
      ? this.datosOriginales.filter((item) =>
          (this.indiceBusqueda.get(item) ?? '').includes(filtro)
        )
      : [...this.datosOriginales];
    this.aplicarOrdenActual();

    return this.datos;
  }

  reset(): T[] {
    this.datos = [...this.datosOriginales];
    this.aplicarOrdenActual();
    return this.datos;
  }

  actualizarDatos(datos: T[]): void {
    this.datosOriginales = [...datos];
    this.datos = [...datos];
    this.indiceBusqueda.clear();
    this.indiceCampos = null;
    this.aplicarOrdenActual();
  }

  getIcono(columna: string | number): string {
    const colStr = String(columna);
    if (this.columnaOrdenada !== colStr) return '';
    return this.ascendente ? 'bx bx-up-arrow-alt' : 'bx bx-down-arrow-alt';
  }
}
