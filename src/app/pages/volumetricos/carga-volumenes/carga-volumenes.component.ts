import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { UsuariosService } from 'src/app/core/services/compras/usuarios.service';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';
import { VisorVolumetricosService } from 'src/app/core/services/volumetricos/visor-volumetricos.service';

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
   public isLoading: boolean = true;

  constructor(private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private localStorage: LocalStorageServiceService,
    private alertasService: SwalComprsServiceService,
    private volumetricos: VisorVolumetricosService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      archivo: [null, Validators.required],
      empresa: [null, Validators.required],
    });

    this.getEmpresas();
    // Simulación de consulta de empresas
    this.empresas = [
    ];
  }

  // onFileChange(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.form.patchValue({ archivo: file });
  //   }
  // }

  // jsonPreview: any = null;
  rawContent: string | null = null

  onFileChange(event: any) {
    this.jsonPreview = null;
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ archivo: file });
      const reader = new FileReader();
      reader.onload = () => {
        this.rawContent = reader.result as string; // guardamos el contenido crudo
        try {
          this.jsonPreview = JSON.parse(this.rawContent); // intentamos parsear JSON
        } catch (e) {
          this.jsonPreview = null;
          alert('El archivo no es un JSON válido');
        }
      };
      reader.readAsText(file);
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
          alert('El archivo no es un JSON válido');
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
          /**Filtro para solo mostrar las empresas que tienen acceso a macrotaller */
          this.rawEmpresas = rawData.filter(
            (objeto) => objeto.isAgencia === false
          );
          this.getUsuarioActivo();
          this.isLoading = false;
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

    console.log(this.empresas)
  }

  

  guardar() {
  if (this.form.invalid) {
    alert('Completa todos los campos obligatorios');
    return;
  }

  const formData = new FormData();

  formData.append('archivo',this.form.get('archivo')?.value);
  formData.append('empresa',this.form.get('empresa')?.value);
  formData.append('tipo', this.jsonPreview.ClaveInstalacion);
  formData.append('descripcion', this.jsonPreview.DescripcionInstalacion)
  formData.append('fecha_reporte', this.jsonPreview.FechaYHoraReporteMes)

  this.volumetricos.store(formData)
    .subscribe({
      next: (resp) => {
        console.log(resp);
       this.alertasService.mostrarAlerta(
          "Listo",
          `Archivo Guardado Correctamente`,
          "success",
          "success"
        );
        this.form.reset();
        this.jsonPreview = null;
      },
      error: (err) => {
        console.log(err);
      }
    });
}
}