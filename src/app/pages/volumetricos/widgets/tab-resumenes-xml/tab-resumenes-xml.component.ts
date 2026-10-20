import { Component, Input, OnInit } from '@angular/core';
import { ProcessVolumetricosService } from 'src/app/core/services/volumetricos/process-volumetricos.service';
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
  selector: 'app-tab-resumenes-xml',
  templateUrl: './tab-resumenes-xml.component.html',
  styleUrl: './tab-resumenes-xml.component.css'
})
export class TabResumenesXmlComponent implements OnInit {
 activeTab: string = 'general';
  @Input() data:any
  recepciones: MovimientoVolumen[] = [];
  entregas: MovimientoVolumen[] = [];

  constructor(
    private processVolumetricos: ProcessVolumetricosService
  ){

  }

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


private mapearMovimientos(
    tipo: 'Recepciones' | 'Entregas'
): MovimientoVolumen[] {

    const complementos =
        this.data.Producto?.[0]
            ?.ReporteDeVolumenMensual?.[tipo]
            ?.[0]?.Complemento?.Complemento_Almacenamiento?.Nacional
            || [];

    return complementos.flatMap((nacional: any) => {

        const nombre = nacional.NombreClienteOProveedor ?? '';
        const rfc = nacional.RfcClienteOProveedor ?? '';

        const cfdis = nacional.CFDIs || [];

        // Si el padre tiene hijos, cada hijo genera una línea
        if (cfdis.length > 0) {

            return cfdis.map((cfdi: any) => ({

                fecha: this.processVolumetricos.fecha(
                    cfdi.FechaYHoraTransaccion
                ),

                // Heredados del padre
                nombre: nombre,
                rfc: rfc,

                // Datos propios del hijo
                cfdi: cfdi.Cfdi ?? '',
                tipoCfdi: cfdi.TipoCFDI ?? '',

                volumen: this.processVolumetricos.numero(
                    Number(
                        cfdi.VolumenDocumentado?.ValorNumerico ??
                        cfdi.VolumenDocumented?.ValorNumerico ??
                        0
                    )),

                precio : this.processVolumetricos.moneda(
                    Number(
                        cfdi.PrecioVentaOCompraOContrap ?? 0
                    )),

                aclaracion: null

            }));
        }

        // Padre sin CFDI
        return [{
            fecha: '',
            nombre: nombre,
            rfc: rfc,
            cfdi: 'Sin CFDI',
            tipoCfdi: '',
            volumen: 0,
            precio: 0,
            aclaracion: ''
        }];
    });
}
}
