export const estatusColores = [
    { color: "#28a745", dsc: "Activa" },
    { color: "#df2727ff", dsc: "Fuera de circulación" },
    { color: "#ffc107", dsc: "En taller" },
    { color: "#17a2b8", dsc: "Vendida" },
    { color: "#343a40", dsc: "No identificada" },
    { color: "#e83e8c", dsc: "Descompuesta" },
    { color: "#007bff", dsc: "En Fiscalía" },
    { color: "#6610f2", dsc: "En Depósito vehicular" },
    { color: "#495057", dsc: "Chatarra" },
    { color: "#fd7e14", dsc: "Vendida como chatarra" },
    { color: "#dc3545", dsc: "Baja" },
    { color: "#adb5bd", dsc: "Desconocido" },
  ];

export const categorias = [
    { id: 1, descripcion: "Propia", abreviatura: "PPA" },
    {
      id: 2,
      descripcion: "Propia prestada a comisionista",
      abreviatura: "PPC",
    },
    { id: 3, descripcion: "Comisionista", abreviatura: "CTA" },
    { id: 4, descripcion: "No especificado", abreviatura: "NES" },
  ];

export const  categoriasGPS = [
    {
      id: 1,
      descripcion: "SI, REPORTANDO",
      estilo: "fas fa-satellite-dish text-success",
    },
    {
      id: 2,
      descripcion: "SI, NO REPORTA",
      estilo: "fas fa-exclamation-triangle text-warning",
    },
    { id: 3, descripcion: "NO TIENE", estilo: "fas fa-ban text-danger" },
  ];

  export const modelFiltrado = [
    "entidad",
      "marca_vehiculo",
      "submarca",
      "modelo",
      "no_serie",
      "placas",
      "marca_tanque",
      "anio_fabricacion",
      "capacidad",
      "tipo_medidor",
      "serie",
      "eco",
  ];