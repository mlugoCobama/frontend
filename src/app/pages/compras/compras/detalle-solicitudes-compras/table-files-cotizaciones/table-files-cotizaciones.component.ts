import { Component, Input, Output, OnInit, OnChanges, SimpleChanges, EventEmitter, AfterViewInit } from '@angular/core';
import { ProveedoresService } from "src/app/core/services/compras/proveedores/proveedores.service";
import { UsuariosService } from 'src/app/core/services/compras/usuarios.service';
import { CotizacionesService } from "src/app/core/services/compras/cotizaciones/cotizaciones.service";
import {FormBuilder, FormControl, FormGroup, Validators, } from "@angular/forms";
import { EstadoSolicitud } from '../../estado-solicitud.enum';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';

@Component({
  selector: 'app-table-files-cotizaciones',
  templateUrl: './table-files-cotizaciones.component.html',
  styleUrl: './table-files-cotizaciones.component.css'
})
export class TableFilesCotizacionesComponent implements AfterViewInit{
@Input() solicitudCompra: any = {};
@Input() cotProv: any = [];
@Input() detalles: any = [];
@Input() mostrarObs: any = [];
@Input() ordenCompra: any = {};
// @Input() isLoad: any;

@Output() savePrices = new EventEmitter<void>();
@Output() selectCotizacion = new EventEmitter<object>();

public formOrdenCompra: FormGroup;

text: string = "";
longitudMaxima: number = 150;
caracteresRestantes: number = this.longitudMaxima;

public selectedFiles: { [key: number]: File } = {};
public proveedorSelec: any;
public empresas: any = [];
public isLoading: boolean = true;
public isLoad: boolean = true;
public enEsts = EstadoSolicitud;

constructor(
  private proveedoresService: ProveedoresService,
  private cotizacionesService: CotizacionesService,
  private usuariosService: UsuariosService,
  public formBuilder: FormBuilder,
  private alertasService: SwalComprsServiceService
){}

ngAfterViewInit(): void {
  this.getEmpresas();
  this.buildForm();
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
  return new Promise((resolve, reject) => {
  this.formOrdenCompra = this.formBuilder.group({
    entrega: new FormControl("", Validators.required),
    observaciones: new FormControl(null),
  });
    resolve(true);
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
// onFileChange1(event: Event, proveedorId: number) {  
//   const input = event.target as HTMLInputElement;
//   if (input.files && input.files.length > 0) {
//     this.selectedFiles[proveedorId] = input.files[0];
//   }
// }

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
  if(this.solicitudCompra.estatus === this.enEsts.EnCotizacion){
    this.usuariosService.getEmpresas().subscribe(
      (response) => {
        if (response) {
          this.empresas = response.data;
          this.isLoading = false;
        } else {
          this.alertasService.mostrarAlerta("Error", response.message, "error", "danger");
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta("Error", error, "error", "danger");
      }
    );
  }
}

public autorizarCotizacion(prov){
  // console.log(prov.id, prov.autorizado, prov.seleccionado)
}
}
