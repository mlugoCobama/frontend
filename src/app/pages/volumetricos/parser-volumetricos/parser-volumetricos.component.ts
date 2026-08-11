import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { UsuariosService } from 'src/app/core/services/compras/usuarios.service';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';
import { VisorVolumetricosService } from 'src/app/core/services/volumetricos/visor-volumetricos.service';
import { VolumetricosExportService } from 'src/app/core/services/volumetricos/volumetricos-export-service.service';
import { PermisosService } from 'src/app/core/services/permisos.service';

@Component({
  selector: 'app-parser-volumetricos',
  templateUrl: './parser-volumetricos.component.html',
  styleUrl: './parser-volumetricos.component.css'
})
export class ParserVolumetricosComponent implements OnInit {
  form!: FormGroup;
  empresas: any[] = [];
  jsonPreview: any = null;
  public rawEmpresas: any;
  public isLoading: boolean = false;

  @Input() idReporte:any =  null;
  @Output() finished = new EventEmitter<any>();

  constructor(private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private localStorage: LocalStorageServiceService,
    private alertasService: SwalComprsServiceService,
    private volumetricos: VisorVolumetricosService,
    private exportService: VolumetricosExportService,
    private permisosService: PermisosService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      archivo: [null, Validators.required],
      formato: [''],
      empresa: ['', Validators.required],
    });

    this.getEmpresas();

    // if(this.idReporte){
    //   this.form.patchValue({
    //     empresa: this.idReporte
    //   });
    // }
  }
  rawContent: string | null = null
  onFileChange(event: any) {
    this.jsonPreview = null;
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ archivo: file });
    }


  }


  /**
   * Recupera el catalogo de empresas (Select empresa)
   */
  public getEmpresas() {
    this.usuariosService.getEmpresas().subscribe(
      (response) => {
        if (response) {
          const rawData = response.data;
          /**Filtro para solo mostrar las empresas que tienen acceso a macrotaller */
          this.rawEmpresas = rawData.filter(
            (objeto:any) => objeto.isAgencia === false
          );
          this.getUsuarioActivo();
          // this.isLoading = false;
        } else {
          this.alertasService.mostrarAlerta(
            "Error", response.message, "error", "danger" );
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta(
          "Error", `Error fetching data: ${error}`, "error", "danger"
        );
      }
    );
  }

  public getUsuarioActivo() {
    const currentUser = this.localStorage.getItem("currentUser");
    const usuarioActivo = currentUser["usuarioActivo"][0];
    const multiselect = usuarioActivo.multiselect;
    const intercompania = usuarioActivo.intercompania;
    const enpresa = usuarioActivo.empresa;
    const enpresas = usuarioActivo.empresas;

    this.empresas = this.rawEmpresas;
  }



  generarArchivo() {
  if (this.form.invalid) {
    this.alertasService.mostrarAlerta( "Error", `Debes llenar todos los campos`, "error", "danger");
        this.form.markAllAsTouched();
        this.isLoading = false;
    return;
  }
  this.isLoading = true;
  const formData = new FormData();

  formData.append('file',this.form.get('archivo')?.value);


  this.volumetricos.parse(formData)
    .subscribe({
      next: (resp) => {
       this.alertasService.mostrarAlerta( "Listo", `Archivo Generado Correctamente`,  "success",  "success");
        this.jsonPreview = resp;
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    });
}

public  guardar() {
if (this.form.invalid) {
    this.alertasService.mostrarAlerta("Error", `Debes llenar todos los campos`, "error","danger");
        this.form.markAllAsTouched();
        this.isLoading = false;
    return;

  }
  this.isLoading = true;
  const formData = new FormData();

  formData.append('archivo',this.form.get('archivo')?.value);
  formData.append('empresa',this.form.get('empresa')?.value);
  formData.append('formato',this.form.get('formato')?.value);
  formData.append('tipo', this.jsonPreview.ClaveInstalacion);
  formData.append('descripcion', this.jsonPreview.DescripcionInstalacion)
  formData.append('fecha_reporte', this.jsonPreview.FechaYHoraReporteMes)

  this.volumetricos.store(formData)
    .subscribe({
      next: (resp) => {
        if(resp.success){
          this.alertasService.mostrarAlerta("Listo",`Archivo Guardado Correctamente`,"success","success");
        this.form.reset();
        this.jsonPreview = null;
        this.isLoading = false;
        }else{
           this.alertasService.mostrarAlerta( "Error", `Ocrrio un error al guardar los datos`,  "error",  "danger");
          this.isLoading = false;
        }

      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    });
}

public  update() {
if (this.form.invalid) {
    this.alertasService.mostrarAlerta("Error",`Debes llenar todos los campos`,"error","danger");
        this.form.markAllAsTouched();
        this.isLoading = false;
    return;

  }
  this.isLoading = true;
  const formData = new FormData();

  formData.append('archivo',this.form.get('archivo')?.value);
  formData.append('empresa',this.form.get('empresa')?.value);
  formData.append('formato',this.form.get('formato')?.value);
  formData.append('tipo', this.jsonPreview.ClaveInstalacion);
  formData.append('descripcion', this.jsonPreview.DescripcionInstalacion);
  formData.append('fecha_reporte', this.jsonPreview.FechaYHoraReporteMes);
  formData.append('_method', 'PUT');

  this.volumetricos.update( this.idReporte ,formData)
    .subscribe({
      next: (resp) => {
        if(resp.success){
            this.alertasService.mostrarAlerta("Listo", `Archivo Guardado Correctamente`,"success","success");
          this.form.reset();
          this.jsonPreview = resp;
          this.isLoading = false;
          this.finished.emit();
        }else{
           this.alertasService.mostrarAlerta("Error",`Ocurrio un error al guardar los datos`,"error","danger"
        );
          this.form.reset();
          this.isLoading = false;
        }

      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    });
}


  descargarJson() {
    this.exportService.descargarJson(this.jsonPreview);
  }

  descargarXml() {
    this.exportService.descargarXml(this.jsonPreview);
  }

    tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }
}


