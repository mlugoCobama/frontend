export class FuncionesTablas<T> {
  private columnaOrdenada: keyof T | '' = '';
  private ascendente = true;
  private datosOriginales: T[] = [];
  private datos: T[] = [];

  private collator = new Intl.Collator('es-MX', { sensitivity: 'base', numeric: true });

  // Índice de búsqueda: se construye una sola vez (o cuando cambian los datos),
  // no en cada tecla presionada por el usuario.
  private indiceBusqueda = new Map<T, string>();
  private indiceCampos: (keyof T)[] | null = null;

  constructor(datos: T[]) {
    this.datosOriginales = [...datos];
    this.datos = [...datos];
  }

  // -------------------------------------------------------------------
  // Ordenamiento
  // -------------------------------------------------------------------

  ordenar(columna: keyof T): T[] {
    if (this.columnaOrdenada === columna) {
      this.ascendente = !this.ascendente;
    } else {
      this.columnaOrdenada = columna;
      this.ascendente = true;
    }

    this.aplicarOrdenActual();
    return this.datos;
  }

  /**
   */
  private aplicarOrdenActual(): void {
    if (!this.columnaOrdenada) return;

    const columna = this.columnaOrdenada;
    const dir = this.ascendente ? 1 : -1;

    this.datos.sort((a, b) => {
      const valorA = a[columna];
      const valorB = b[columna];

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

  private construirIndice(campos: (keyof T)[]): void {
    const mismosCampos =
      this.indiceCampos &&
      this.indiceCampos.length === campos.length &&
      this.indiceCampos.every((c, i) => c === campos[i]);

    if (mismosCampos && this.indiceBusqueda.size > 0) return;

    this.indiceBusqueda.clear();
    for (const item of this.datosOriginales) {
      const texto = campos
        .map((c) => item[c]?.toString().toLowerCase() ?? '')
        .join(' | ');
      this.indiceBusqueda.set(item, texto);
    }
    this.indiceCampos = campos;
  }

  filtrar(query: string, campos: (keyof T)[]): T[] {
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

  /**
   * Llamar cuando cambian los datos de origen (nuevo @Input) para
   * reconstruir el índice de búsqueda y reiniciar el estado de orden/filtro.
   */
  actualizarDatos(datos: T[]): void {
    this.datosOriginales = [...datos];
    this.datos = [...datos];
    this.indiceBusqueda.clear();
    this.indiceCampos = null;
    this.aplicarOrdenActual();
  }

  getIcono(columna: keyof T): string {
    if (this.columnaOrdenada !== columna) return '';
    return this.ascendente ? 'bx bx-up-arrow-alt' : 'bx bx-down-arrow-alt';
  }
}
