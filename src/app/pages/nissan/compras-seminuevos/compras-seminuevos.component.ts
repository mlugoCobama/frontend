import { ApiCodigosPostalesService } from './../../../core/services/api-codigos-postales.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertErrorService } from 'src/app/core/services/alert-error.service';

import Swal from 'sweetalert2';

import dataEstados from '../../../../environments/cat_estados.json';
import dataMarcas from '../../../../environments/cat_marcas.json';
import dataBancos from '../../../../environments/cat_bancos.json';
import dataMeses from '../../../../environments/meses.json';

import { CompraSeminuevosService } from 'src/app/core/services/nissan/compra-seminuevos.service';

@Component({
  selector: 'app-compras-seminuevos',
  templateUrl: './compras-seminuevos.component.html',
  styleUrls: ['./compras-seminuevos.component.css']
})
export class ComprasSeminuevosComponent implements OnInit {

  public modalRef?: BsModalRef;

  public submitted: boolean = false;

  public formDatosProveedor: FormGroup;

  public formSolicitudCFDI: FormGroup;

  public formDatosVehiculo: FormGroup;

  public formDatosBancarios: FormGroup;

  public formDatosAngecia: FormGroup;

  public disableAuto:boolean = true;

  private data = {};

  public CatEstados: any = dataEstados;

  public CatMarcas: any = dataMarcas;

  public CatBancos: any = dataBancos;

  public CatMeses: any = dataMeses;

  public cp:any = 0;

  public dataCP: any = {};

  public colonia: any =  [];

  public ciudad: string = '';

  public delegacion: string =  '';

  public isDisabled: boolean = false;

  private fecha = new Date();

  public mes =  this.fecha.getMonth();

  constructor(
    public formBuilder: FormBuilder,
    public alertService: AlertErrorService,
    private modalService: BsModalService,
    private codigoPostalServico: ApiCodigosPostalesService,
    private CompraSeminuevosServicio: CompraSeminuevosService
  ) { }

  public ngOnInit(): void {
    this.buildFormDatosProveedor();
    this.buildFormSolicitudCFDI();
    this.buildFormDatosVehiculo();
    this.buildFormDatosBancarios();
    this.buildFormDatosAgencia();
  }

  private buildFormDatosProveedor() {
    return new Promise( (resolve, reject) => {
      this.formDatosProveedor = this.formBuilder.group({
        nombre: new FormControl(null, Validators.required),
        apellido_paterno: new FormControl(null, Validators.required),
        apellido_materno: new FormControl(null, Validators.required),
        calle: new FormControl(null, Validators.required),
        num_exterior: new FormControl(null, Validators.required),
        num_interior: new FormControl(null, Validators.required),
        cp: new FormControl(null, Validators.required),
        colonia: new FormControl(null),
        ciudad: new FormControl(null),
        delegacion_municipio: new FormControl(null),
        estado: new FormControl(null),
        tipo_identificacion: new FormControl(null, Validators.required),
        num_identificacion: new FormControl(null, Validators.required),
        mes_comprobante: new FormControl(null, Validators.required),
      });
      resolve(true);
    } )
  }

  private buildFormSolicitudCFDI() {
    return new Promise( (resolve, reject) => {
      this.formSolicitudCFDI = this.formBuilder.group({
        nombre: new FormControl(null, Validators.required),
        apellido_paterno: new FormControl(null, Validators.required),
        apellido_materno: new FormControl(null, Validators.required),
        correo: new FormControl(null, Validators.required),
        telefono_fijo: new FormControl(null, Validators.required),
        telefono_movil: new FormControl(null, Validators.required),
        fecha_nacimiento: new FormControl(null, Validators.required),
        entidad_nacimiento: new FormControl(null, Validators.required),
        curp: new FormControl(null, Validators.required),
        pais: new FormControl(null),
        actividad_prepoderante: new FormControl(null, Validators.required),
        regimen_fiscal: new FormControl('', Validators.required),
        rfc: new FormControl(null, Validators.required),
      });
      resolve(true);
    } )
  }

  private buildFormDatosVehiculo() {
    return new Promise( (resolve, reject) => {
      this.formDatosVehiculo = this.formBuilder.group({
        factura_ampara: new FormControl(null, Validators.required),
        expedida: new FormControl(null, Validators.required),
        fecha_factura: new FormControl(null, Validators.required),
        marca: new FormControl(null, Validators.required),
        anio_modelo: new FormControl(null, Validators.required),
        color_exterior: new FormControl(null, Validators.required),
        color_interior: new FormControl(null, Validators.required),
        tipo_version: new FormControl(null, Validators.required),
        clase_vehicular: new FormControl(null, Validators.required),
        no_serie: new FormControl(null, Validators.required),
        no_motor: new FormControl(null, Validators.required),
        kilometraje: new FormControl(null, Validators.required),
        no_baja_vehicular: new FormControl(null, Validators.required),
        estado_baja: new FormControl(null, Validators.required),
        fecha_baja: new FormControl(null, Validators.required),
        anio_tenencia: new FormControl(null, Validators.required),
        placas_baja: new FormControl(null, Validators.required),
        no_verificacion: new FormControl(null, Validators.required),
        valor_compra: new FormControl(null, Validators.required),
        valor_guia: new FormControl(null, Validators.required),
        nombre_a_quien_vende: new FormControl(null, Validators.required),
        fecha_factura_final: new FormControl(null, Validators.required),
      });
      resolve(true);
    } )
  }

  private buildFormDatosBancarios() {
    return new Promise( (resolve, reject) => {
      this.formDatosBancarios = this.formBuilder.group({
        costo_adquisicion: new FormControl(null, Validators.required),
        banco: new FormControl(null, Validators.required),
        cuenta: new FormControl(null, Validators.required),
        clabe: new FormControl(null, Validators.required),
        sucursal: new FormControl(null, Validators.required),
        convenio: new FormControl(null, Validators.required),
        referencia: new FormControl(null, Validators.required),
      });
      resolve(true);
    } )
  }

  private buildFormDatosAgencia() {
    return new Promise( (resolve, reject) => {
      this.formDatosAngecia = this.formBuilder.group({
        agencia: new FormControl(null, Validators.required),
        razon_social: new FormControl(null, Validators.required),
        rfc: new FormControl(null, Validators.required),
        domicilio_calle: new FormControl(null, Validators.required),
        colonia_cp: new FormControl(null, Validators.required),
        ciudad_estado: new FormControl(null, Validators.required),
        gerente_general: new FormControl(null, Validators.required),
        gerente_seminuevos: new FormControl(null, Validators.required),
        gerente_administrativo: new FormControl(null, Validators.required),
      });
      resolve(true);
    } )
  }

  public searchCodigoPostal (event) {

    this.isDisabled = true;

    if (this.cp == 0) {

      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Debes ingresar un C.P. valido.',
        showConfirmButton: false,
        timer: 3000,
      });

      this.isDisabled = false;

    } else {

      this.codigoPostalServico
        .search(this.cp)
        .subscribe(
          response => {
            this.dataCP = response;
            this.ciudad = this.dataCP.data[0].Entidad;
            this.delegacion = this.dataCP.data[0].Municipio;

            this.colonia = [];

            for (let i = 0; i < this.dataCP.data.length; i++) {
              this.colonia.push(this.dataCP.data[i].Colonia);
            }

            this.isDisabled = false;

          },
          error => {
              this.alertService.alertError('Error fetching data: ' + error, false);
              this.isDisabled = false;
        });
    }

  }

  public onChange(event: Event) {
    // Get the new input value
    this.cp = (event.target as HTMLInputElement).value;
    // Perform actions based on the new valu e
  }

  public openModal(content: any) {
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: 'modal-xl' });
  }

  public save() {

    if (
      this.formDatosAngecia.valid &&
      this.formDatosBancarios.valid &&
      this.formDatosVehiculo.valid &&
      this.formSolicitudCFDI.valid &&
      this.formDatosProveedor.valid) {

        this.data = [
          this.formDatosProveedor.value,
          this.formSolicitudCFDI.value,
          this.formDatosVehiculo.value,
          this.formDatosBancarios.value,
        ]

        this.CompraSeminuevosServicio.save(this.data)
        .subscribe(
          response => {

            if(response.status) {
              this.alertService.alertError("La información se ha guardado correctamente", true);
              this.modalRef.hide();
              this.submitted = false;
              this.formDatosAngecia.reset();
              this.formDatosBancarios.reset();
              this.formDatosVehiculo.reset();
              this.formSolicitudCFDI.reset();
              this.formDatosProveedor.reset();
            } else {
              this.alertService.alertError("se tuvo un problema al guardar la información", false);
            }

          },
          error => {

              this.isDisabled = false;
        });

    } else {
      this.alertService.alertError("Debe llenar todos los formularios", false);
    }

  }

}
