export class FuncionesTablas<T> {
    private columnaOrdenada: keyof T | '' = '';
    private ascendente = true;
    private datosOriginales: T[] = [];
  
    constructor(private datos: T[]) {
      this.datosOriginales = [...datos]; // Copia original para filtros
    }
  
    ordenar(columna: keyof T): T[] {
      if (this.columnaOrdenada === columna) {
        this.ascendente = !this.ascendente;
      } else {
        this.columnaOrdenada = columna;
        this.ascendente = true;
      }
  
      return this.datos.sort((a, b) => {
        const valorA = a[columna];
        const valorB = b[columna];
  
        if (valorA == null) return this.ascendente ? -1 : 1;
        if (valorB == null) return this.ascendente ? 1 : -1;
  
        if (typeof valorA === 'string') {
          return this.ascendente
            ? valorA.localeCompare(valorB as string)
            : (valorB as string).localeCompare(valorA);
        }
  
        return this.ascendente
          ? (valorA > valorB ? 1 : valorA < valorB ? -1 : 0)
          : (valorA < valorB ? 1 : valorA > valorB ? -1 : 0);
      });
    }
  
    filtrar(query: string, campos: (keyof T)[]): T[] {
      const filtro = query.trim().toLowerCase();
  
      this.datos = this.datosOriginales.filter((item) =>
        campos.some((campo) => {
          const valor = item[campo];
          return valor?.toString().toLowerCase().includes(filtro);
        })
      );
  
      // Si hay orden activa, mantenla
      if (this.columnaOrdenada) {
        this.ordenar(this.columnaOrdenada);
      }
  
      return this.datos;
    }
  
    reset(): T[] {
      this.datos = [...this.datosOriginales];
      return this.datos;
    }
  
    getIcono(columna: keyof T): string {
      if (this.columnaOrdenada !== columna) return '';
      return this.ascendente ? 'bx bx-up-arrow-alt' : 'bx bx-down-arrow-alt';
    }
  }