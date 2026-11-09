export interface Proveedor {
  id: number;
  nombre: string;
}

export interface Producto {
  id: number;
  clave_interna: string;
  descripcion_planta: string;
  unidad_medida?: { nombre: string };
}

export interface PrecioProveedor {
  com_productos_id: number;
  com_proveedores_id: number;
  precio: number;
}

export interface PreciosPayload {
  productosArray: {
    producto_id: number;
    preciosProveedores: { proveedor_id: number; precio: number | null }[];
  }[];
}
