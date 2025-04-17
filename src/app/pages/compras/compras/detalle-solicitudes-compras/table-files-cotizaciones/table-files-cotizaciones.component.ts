import { Component, Input, Output, OnInit, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { ProveedoresService } from "src/app/core/services/compras/proveedores/proveedores.service";
import { ComprasService } from "src/app/core/services/compras/compras.service";
import { OrdenesCompraService } from "src/app/core/services/compras/ordenesCompra/ordenes-compra.service";
import { UsuariosService } from 'src/app/core/services/compras/usuarios.service';
import { CotizacionesService } from "src/app/core/services/compras/cotizaciones/cotizaciones.service";
import {FormBuilder, FormControl, FormGroup, Validators, } from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: 'app-table-files-cotizaciones',
  templateUrl: './table-files-cotizaciones.component.html',
  styleUrl: './table-files-cotizaciones.component.css'
})
export class TableFilesCotizacionesComponent implements OnInit{
@Input() solicitudCompra: any;
@Input() cotProv: any;
@Input() detalles: any;
@Input() mostrarObs: any;
@Input() ordenCompra: any;
// @Input() isLoad: any;

@Output() savePrices = new EventEmitter<void>();
@Output() selectCotizacion = new EventEmitter<object>();

public formOrdenCompra: FormGroup;

text: string = "";
longitudMaxima: number = 150;
caracteresRestantes: number = this.longitudMaxima;

public selectedFiles: { [key: number]: File } = {};
public proveedorSelec: any;
public empresas: any;
public isLoading: boolean = true;
public isLoad: boolean = true;

constructor(
  private proveedoresService: ProveedoresService,
  private cotizacionesService: CotizacionesService,
  private usuariosService: UsuariosService,
  public formBuilder: FormBuilder,
){}

ngOnInit(): void {
  this.getEmpresas();
  this.buildForm();
}

validarSatus(){
  if (
    this.solicitudCompra.estatus === 3 ||
    this.solicitudCompra.estatus === 4 ||
    this.solicitudCompra.estatus > 5
  ) {
    // this.getOrdenCompra();
  }
}

guardarPrecios() {
  this.savePrices.emit();
}

manejoCheck(prov: any) {
  this.selectCotizacion.emit(prov);
}

/**
 * construye el formulario
 */
private buildForm() {
  this.formOrdenCompra = this.formBuilder.group({
    entrega: new FormControl(null, Validators.required),
    observaciones: new FormControl(null),
  });

}

get ordenCompraFormControl() {
  return this.formOrdenCompra.controls;
}

/**
 * Cuenta la longitud de caracteres y lo muestra en pantalla
 */
public contarCaracteres() {
  this.caracteresRestantes = this.longitudMaxima - this.text.length;
  this.setValuesForm();
}

/**
 *  Envía los valores del formulario al servicio
 */
public setValuesForm(){
  this.cotizacionesService.setForm(this.formOrdenCompra);
}

/**
 * Maneja los archivos almacenados en los inputs
 * @param event cambio de archivo en el input
 * @param proveedorId id del proveedor/input
 */
onFileChange(event: Event, proveedorId: number) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.cotizacionesService.setSelectedFile(proveedorId, input.files[0]);
  }
}

//Recupera los archivos de los input file de la tabla proveedores
onFileChange1(event: Event, proveedorId: number) {  
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFiles[proveedorId] = input.files[0];
  }
}

/**
 * abre los archivos en una pestaña nueva
 * @param prov ruta del archivo
 */
verArchivos(prov: any) {
  this.proveedoresService.abrirArchivo(prov);
}

/**
 * Recupera el catalogo de empresas (Select empresa) 
 */
public getEmpresas() {
  if(this.solicitudCompra.estatus === 2){
    this.usuariosService.getEmpresas().subscribe(
      (response) => {
        if (response) {
          this.empresas = response.data;
          this.isLoading = false;
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }
}
}
