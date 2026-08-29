# Desarrollo - Infra

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

# 🚀 Liberaciones
---
**Fecha de liberación:** 18 de abril de 2026.
---
## Módulo de Compras
### Nuevos Permisos
- Se integran nuevos permisos en el módulo de Compras para mayor control de acceso.
### Mejoras Visuales
- Se realizaron mejoras en la interfaz de usuario del módulo de Compras.
### Corrección de Bug
- Se corrigieron errores detectados en el módulo de Compras.
---
## Módulo de Parque Vehicular
### Nuevos Permisos
- Se integran nuevos permisos en el módulo de Parque Vehicular.
### Gestión de Dispersión de Recursos de Combustibles
- Se agrega el apartado de gestión de dispersión de recursos de combustibles.
---
## Nuevo Módulo: Gestión de Comisiones
Se integra el nuevo módulo de Gestión de Comisiones con los siguientes apartados:
- **Concentrado**
- **Cortes**
- **Nuevos**
- **Financiamientos**
- **Toma de Unidad**
- **Seguros**
- **Accesorios**
---
**Fecha de liberación:** 25 de abril de 2026
## Compras — Cotizaciones
- Se integra el flujo para recotizacion de compras cuando se encuentren en estado de orden de compra y en surtido

## Comisiones — Seguros, Financiamientos
- Se integra la capacidad de visualizar archivos previamente cargados
---
## **Fecha de liberación:** 15 de mayo de 2026
## Módulo de Compras
### Nuevos Indicadores en la vista de Kanban
- Se agregan indicadores de estados de documentos (entregas, facturas, pagos y complementos de pago)
---
## **Fecha de liberación:** 27 de mayo de 2026
## Compras-Parque vehicular
- Se agrega el calculo de distancias recorridas en el apartado de recarga toka
---
## **Fecha de liberación:** 13 de junio de 2026
## Parque vehicular - Toka
- Se integra un formulario para la captura de información como periodo de inicio, periodo de fin y precio de combustible, ademas el calculo de saldo se calcula automáticamente a partir de el precio de el combustible y la cantidad de litros requerida.
## Compras - Catalogo de tarjetas Toka
- Se genera un catalogo de tarjetas de toka de las empresas
## Compras - Dispersiones de diesel
- Se genera un apartado especifico para la dispersion de tajetas toka, dividiendo la solicitud y dispersion en dos pasos, ademas de poder consultar solicitudes dispersion y solicitudes ya dispersadas

---
## **Fecha de liberación:** 3 de julio de 2026
## Compras - Dispersiones de diesel
- Se integra un nuevo estado en el apartado de dispersiones de diesel para identificar con mayor facilidad, solicitudes pendientes, guardadas y realizadas ( notificadas ).
- Se agrega un fitro de fechas pendientes (fecha de solicitud), guardadas y realizadas (fecha de dispersion).
- Se modifica el encabezado de datos de solicitud
## Compras - Catalogo de Tags
- Se genera un catalogo de tarjetas de tags para las empresas

## UCOIP - MODAL UCOIP
- Asignación de sistemas y almacenado de credenciales
- Asignación de recursos de red

---
## **Fecha de liberación:**- 17 de julio de 2026

### Parque vehicular
* **Segmentación del Parque Vehicular:** Se dividió el parque vehicular en las categorías de **Vehículos Operativos** y **Vehículos Utilitarios** para mejorar el control analítico y la asignación de recursos.
* **Actualización del Catálogo de Tags:** Se ajustó y homologó el catálogo de TAGs vehiculares tomando como base la estructura y datos del layout en Excel proporcionado por el equipo de Compras.

### Comisiones
* **Optimización de Recuperación de Ventas:** Se actualizó y corrigió el comando encargado de consultar y recuperar el flujo de datos de ventas de autos nuevos.


### UCOIP
* **Ampliación del Catálogo de Software:** Se extendió el alcance del catálogo para brindar soporte nativo al registro y seguimiento de **Hardware de Infraestructura**.
* **Módulo de Intercambios Inter-compañías:** Se implementó el registro y trazabilidad de intercambios de hardware entre las diferentes empresas del grupo.
* **Catálogo de Puestos:** Se generó e integró formalmente el catálogo de puestos específicos por Marca.
* **Control de Asignación de Compras:** Se revisó y optimizó la lógica de asignación de compras, asegurando la correcta vinculación de insumos tanto a nivel de Equipos como a nivel de Usuarios individuales.

---
## **Fecha de liberación:**- 11 de agosto de 2026

### Volumetricos
* **Convertir excel a json:** Se intrega la funcionalidad de poder convertir un formato de excel a un json valido
* **Visor de reporte** Se grega un card para visualizar las sumotoria de volumenes por consceptos de autoconsumo, trapasos y movimientos sin cfdi
- Se agregan nuevos valores, como un nombre de empresa legibe y fecha de periodo reportado
- Se integra actualizacion de registros y archivos ademas de borrado fisico
---
### Volumetricos
*Fecha de liberación: 29 de Agosto, 2026*
* **Validación de Plantilla:** Verificación automática para asegurar que la plantilla pertenezca a la empresa correspondiente.
* **Soporte para Comercializadoras:** Incorporación del perfil y lógica para empresas comercializadoras.
* **Gestión de Estatus:** Flujo de seguimiento con los estados: `Generado` ➔ `Enviado` ➔ `Aceptado`.
* **Carga de Acuses:** Soporte para subir y adjuntar acuses de **Envío** y de **Aceptación** (rechazado o aceptado).
* **Filtros Avanzados:** Consultas por **Empresa**, **Periodo** y **Tipo de Instalación**.
