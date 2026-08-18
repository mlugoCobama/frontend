import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { UsuariosService } from 'src/app/core/services/compras/usuarios.service';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';
import { VisorVolumetricosService } from 'src/app/core/services/volumetricos/visor-volumetricos.service';
import { ProcessVolumetricosService } from 'src/app/core/services/volumetricos/process-volumetricos.service';

export interface ControlVolumetrico {
  '?:xml'?: any;
  ControlsVolumetricos?: {
    '@_Version': string;
    '@_RfcContribuyente': string;
    CaracteristicasRepresentativas?: any;
    ResumenDiario?: any;
    [key: string]: any;
  };
}

@Component({
  selector: 'app-carga-volumenes',
  templateUrl: './carga-volumenes.component.html',
  styleUrl: './carga-volumenes.component.css'
})
export class CargaVolumenesComponent implements OnInit {
  form!: FormGroup;
  empresas: any[] = [];
  jsonPreview: any = null;
  public rawEmpresas: any;
  public isLoading: boolean = false;

  public selectedViewer =  'json';

  constructor(private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private localStorage: LocalStorageServiceService,
    private alertasService: SwalComprsServiceService,
    private volumetricos: VisorVolumetricosService,
    private processVolumetricos: ProcessVolumetricosService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      archivo: [null, Validators.required],
      empresa: ["", Validators.required],
    });

    this.getEmpresas();
    this.empresas = [
    ];
  }

  rawContent: string | null = null

  onFileChange(event: any) {
    this.jsonPreview = null;
    this.selectedViewer = 'json';
    const file = event.target.files[0];

    if (file) {
      this.form.patchValue({ archivo: file });
      const reader = new FileReader();

      reader.onload = () => {
        this.rawContent = reader.result as string;
        this.procesarArchivo(file.name, this.rawContent);
      };

      reader.readAsText(file);
    }
  }

  private procesarArchivo(fileName: string, content: string): void {
    const esXml = fileName.toLowerCase().endsWith('.xml') || content.trim().startsWith('<');
    if (esXml) {
      try {
        this.selectedViewer = 'xml';
        const parsedXml = this.processVolumetricos.convertirXml(content)
        this.jsonPreview = parsedXml.ControlesVolumetricos;


      } catch (e) {
        this.selectedViewer = 'json';
        this.jsonPreview = null;
        this.alertasService.mostrarAlerta("Error", "El archivo XML no es válido", "error", "danger");
      }
    } else {
      try {
        this.selectedViewer = 'json';
        this.jsonPreview = JSON.parse(content);
      } catch (e) {
        this.selectedViewer = 'json';
        this.jsonPreview = null;
        this.alertasService.mostrarAlerta("Error", "El archivo no es un JSON o XML válido", "error", "danger");
      }
    }
  }

  previsualizar() {
    const file = this.form.get('archivo')?.value;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          this.jsonPreview = JSON.parse(reader.result as string);
        } catch (e) {
          this.alertasService.mostrarAlerta(
          "Error",
          `El archivo no es un JSON válido`,
          "error",
          "danger"
        );
        }
      };
      reader.readAsText(file);
    }
  }

  // guardar() {
  //   if (this.form.valid) {
  //     console.log('Formulario válido:', this.form.value);
  //     alert('Formulario guardado correctamente');
  //   } else {
  //     alert('Completa todos los campos obligatorios');
  //   }
  // }

  /**
   * Recupera el catalogo de empresas (Select empresa)
   */
  public getEmpresas() {
    this.usuariosService.getEmpresas().subscribe(
      (response) => {
        if (response) {
          const rawData = response.data;
          const intercompaniasExcluidas = [200, 119, 201, 700, 333, 119, 200 ];
          this.rawEmpresas = rawData.filter((objeto: any) => {
          const noEsAgencia = objeto.isAgencia === false; // o simplemente !objeto.isAgencia
          const noEsIntercompaniaExcluida = !intercompaniasExcluidas.includes(objeto.intercompania);

          return noEsAgencia && noEsIntercompaniaExcluida;
        });
          this.getUsuarioActivo();
          // this.isLoading = false;
        } else {
          this.alertasService.mostrarAlerta(
            "Error",
            response.message,
            "error",
            "danger"
          );
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta(
          "Error",
          `Error fetching data: ${error}`,
          "error",
          "danger"
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



  guardar() {
  if (this.form.invalid) {
    this.alertasService.mostrarAlerta(
          "Error",`Debes llenar todos los campos`,"error","danger"
        );
        this.form.markAllAsTouched();
        this.isLoading = false;
    return;

  }

  if(!this.jsonPreview){
    this.alertasService.mostrarAlerta(
          "Error",`Debes de cargar un archivo valido`,"error","danger"
        );
        this.form.markAllAsTouched();
        this.isLoading = false;
    return;
  }

  this.isLoading = true;
  const formData = new FormData();

  formData.append('archivo',this.form.get('archivo')?.value);
  formData.append('empresa',this.form.get('empresa')?.value);
  formData.append('tipo', this.jsonPreview.ClaveInstalacion);
  formData.append('descripcion', this.jsonPreview.DescripcionInstalacion)
  formData.append('fecha_reporte', this.jsonPreview.FechaYHoraReporteMes)


  this.volumetricos.store(formData)
    .subscribe({
      next: (resp) => {
        if(resp.success){
          this.alertasService.mostrarAlerta(
            "Guardado Correctamente",
            `El archivo fue almacenado y esta disponible para consultarlo`,
            "success",
            "success"
          );
          this.form.reset();
          this.jsonPreview = null;
          this.isLoading = false;
        }else{
          this.alertasService.mostrarAlerta(
            "Ocurrio un error inesperado",
            `Ocurrio un error al guardarlo`,
            "error",
            "danger"
          );
        }

      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    });
}

}
