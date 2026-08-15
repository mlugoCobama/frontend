import { Component, Input, OnInit } from '@angular/core';

interface Recepcion {

    fecha: string;
    proveedor: string;
    rfc: string;
    cfdi: string;
    tipoCfdi:string;
    volumen:number;
    precio:number;

}

interface MovimientoVolumen {

    fecha:string;

    nombre:string;

    rfc:string;

    cfdi:string;

    tipoCfdi:string;

    volumen:number;

    precio:number;

    aclaracion?:string;

}

@Component({
  selector: 'app-tabs-resumenes',
  templateUrl: './tabs-resumenes.component.html',
  styleUrl: './tabs-resumenes.component.css'
})
export class TabsResumenesComponent implements OnInit {
 activeTab: string = 'general';
  @Input() data:any
  recepciones: MovimientoVolumen[] = [];
  entregas: MovimientoVolumen[] = [];

  ngOnInit(): void {
    this.getEntregas()
    this.getRecepciones()
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  columnasRecepcion = [

{
    key:'fecha',
    label:'Fecha Transacción',

},
{
    key:'nombre',
    label:'Proveedor',
    class:'fw-bold'
},
{
    key:'rfc',
    label:'RFC'
},
{
    key:'cfdi',
    label:'UUID CFDI / Tipo',
    template:(x:Recepcion)=>`
        ${x.cfdi}
        <span class="badge bg-secondary">
            ${x.tipoCfdi}
        </span>
    `
},
{
    key:'volumen',
    label:'Volumen Doc.',
    class:'text-end',
},
{
    key:'precio',
    label:'Precio Compra',
    class:'text-end  fw-bold  text-success',
},

{
    key:'aclaracion',
    label:'Aclaracion',
}

];


columnasEntrega = [

{
    key:'fecha',
    label:'Fecha',
},
{
    key:'nombre',
    label:'Cliente',
    class:'fw-bold'
},
{
    key:'rfc',
    label:'RFC'
},
{
    key:'cfdi',
    label:'UUID CFDI',
    template:(x:any)=>`
        ${x.cfdi}
        <span class="badge bg-secondary">
            ${x.tipoCfdi}
        </span>
    `
},
{
    key:'volumen',
    label:'Volumen',
    class:'text-end',

},
{
    key:'precio',
    label:'Precio Venta',
    class:'text-end fw-bold text-danger',

},

{
    key:'aclaracion',
    label:'Aclaracion',
}

];


public getRecepciones() {

    this.recepciones =
        this.mapearMovimientos('Recepciones');

    // console.log(this.recepciones);

}

public getEntregas() {

    this.entregas =
        this.mapearMovimientos('Entregas');

    // console.log(this.entregas);

}


// private mapearMovimientos(
//     tipo:'Recepciones' | 'Entregas'
// ): MovimientoVolumen[] {

//     const complemento =
//         this.data.Producto[0]
//         ?.ReporteDeVolumenMensual?.[tipo]
//         ?.Complemento || [];

//     console.log(complemento)

//     return complemento.flatMap((comp:any) =>



//         (comp.Nacional || []).flatMap((nacional:any) =>

//             (nacional.CFDIs || []).map((cfdi:any) => ({

//                 fecha: cfdi.FechaYHoraTransaccion,

//                 nombre: nacional.NombreClienteOProveedor,

//                 rfc: nacional.RfcClienteOProveedor,

//                 cfdi: cfdi.Cfdi,

//                 tipoCfdi: cfdi.TipoCfdi,

//                 volumen:
//                     cfdi.VolumenDocumentado?.ValorNumerico ??
//                     cfdi.VolumenDocumented?.ValorNumerico ??
//                     0,

//                 precio:
//                     cfdi.PrecioVentaOCompraOContrap ?? 0

//             }))
//         )
//     );
// }

private mapearMovimientos(
    tipo:'Recepciones'|'Entregas'
): MovimientoVolumen[] {

    const complemento =
        this.data.Producto[0]
        ?.ReporteDeVolumenMensual?.[tipo]
        ?.Complemento || [];

    return complemento.flatMap((comp:any) => {

        // Caso especial: aclaración sin CFDI
        if(comp.TipoComplemento && !comp.Nacional){
             const volumen = Number(
                    comp.Aclaracion
                        ?.match(/Volumen:\s*([\d,.]+)/)?.[1]
                        ?.replace(/,/g,'')
                ) || 0;
            return [{
                fecha:'',
                nombre: comp.TipoComplemento,
                rfc:'-',
                cfdi:'Sin CFDI',
                tipoCfdi:'',
                volumen:volumen,
                precio:0,
                aclaracion: comp.Aclaracion
            }];
        }

        // Flujo normal
        return (comp.Nacional || []).flatMap(
            (nacional:any)=>

            (nacional.CFDIs || []).map(
                (cfdi:any)=>({

                    fecha:
                        this.formatearFecha(cfdi.FechaYHoraTransaccion),

                    nombre:
                        nacional.NombreClienteOProveedor,

                    rfc:
                        nacional.RfcClienteOProveedor,

                    cfdi:
                        cfdi.Cfdi,

                    tipoCfdi:
                        cfdi.TipoCfdi,

                    volumen:
                        cfdi.VolumenDocumentado?.ValorNumerico ??
                        cfdi.VolumenDocumented?.ValorNumerico ??
                        0,

                    precio:
                        cfdi.PrecioVentaOCompraOContrap ?? 0,

                    aclaracion:null

                })
            )
        );

    });

}

private formatearFecha(fecha: string): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return fecha;

    const dd   = String(d.getDate()).padStart(2, '0');
    const mm   = String(d.getMonth() + 1).padStart(2, '0');
    const aaaa = d.getFullYear();
    const hh   = String(d.getHours()).padStart(2, '0');
    const min  = String(d.getMinutes()).padStart(2, '0');
    const ss   = String(d.getSeconds()).padStart(2, '0');

    return `${dd}/${mm}/${aaaa} ${hh}:${min}:${ss}`;
}
}
