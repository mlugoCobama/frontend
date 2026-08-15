import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { UsuariosService } from 'src/app/core/services/compras/usuarios.service';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';
import { VisorVolumetricosService } from 'src/app/core/services/volumetricos/visor-volumetricos.service';
import { XMLParser } from 'fast-xml-parser';

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

  constructor(private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private localStorage: LocalStorageServiceService,
    private alertasService: SwalComprsServiceService,
    private volumetricos: VisorVolumetricosService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      archivo: [null, Validators.required],
      empresa: ["", Validators.required],
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

  // onFileChange(event: any) {
  //   this.jsonPreview = null;
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.form.patchValue({ archivo: file });
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.rawContent = reader.result as string; // guardamos el contenido crudo
  //       try {
  //         this.jsonPreview = JSON.parse(this.rawContent); // intentamos parsear JSON
  //       } catch (e) {
  //         this.jsonPreview = null;
  //         this.alertasService.mostrarAlerta("Error",
  //         `El archivo no es un JSON válido`,"error","danger"
  //       );
  //       }
  //     };
  //     reader.readAsText(file);
  //   }
  // }

  onFileChange(event: any) {
    this.jsonPreview = null;
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
        const parsedXml = this.parser.parse(content);

        console.log(parsedXml);
        // Extraer la raíz de Controles Volumétricos (si existe) para unificar la lectura
        this.jsonPreview = convertirClavesSAT(parsedXml.ControlesVolumetricos || parsedXml);


      } catch (e) {
        this.jsonPreview = null;
        this.alertasService.mostrarAlerta("Error", "El archivo XML no es válido", "error", "danger");
      }
    } else {
      try {
        this.jsonPreview = JSON.parse(content);
      } catch (e) {
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
          /**Filtro para solo mostrar las empresas que tienen acceso a macrotaller */
          this.rawEmpresas = rawData.filter(
            (objeto) => objeto.isAgencia === false
          );
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
          "Error",
          `Debes llenar todos los campos`,
          "error",
          "danger"
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


private parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  parseTagValue: false,       // Recomendado: mantiene valores como string para conservar decimales exactos
  parseAttributeValue: false,
  removeNSPrefix: true,       // Elimina los prefijos alm:, exp:, etc.

  // Normaliza nodos específicos de MAYÚSCULAS a PascalCase según la norma JSON del SAT
  transformTagName: (tagName) => {
    const mapaNombres = {
      'NACIONAL': 'Nacional',
      'EXTRANJERO': 'Extranjero',
      'ACREDITACION': 'Acreditacion'
    };
    return mapaNombres[tagName] || tagName;
  },

  // Asegura que los nodos repetitivos siempre se parseen como Arrays en JSON
  isArray: (name) => [
    'Nacional', 'NACIONAL',
    'Extranjero', 'EXTRANJERO',
    'CFDIs', 'CFDI',
    // 'RECEPCIONES', 'Recepciones', 'RECEPCION', 'Recepcion',
    // 'ENTREGAS', 'Entregas', 'ENTREGA', 'Entrega',
    'Tanque', 'TANQUE', 'Manguera', 'MANGUERA'
  ].includes(name)
});


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const xmlString = reader.result as string;
      const jsonResult = this.convertirXmlAJson(xmlString);

      console.log('JSON procesado de Controles Volumétricos:', jsonResult);
    };

    reader.readAsText(file);
  }

  private convertirXmlAJson(xmlContent: string): ControlVolumetrico {
    return this.parser.parse(xmlContent) as ControlVolumetrico;
  }



}

function convertirClavesSAT(obj) {
  if (Array.isArray(obj)) {
    return obj.map(convertirClavesSAT);
  } else if (obj !== null && typeof obj === 'object') {
    const nuevoObjeto = {};

    // Nodos que la norma del SAT exige que SIEMPRE sean arreglos [...]
    const camposArrayObligatorios = [
      'Caracter',
      'Producto',
      'Bitacora',
      'Nacional',
      'Extranjero',
      'CFDIs',
      'CFDI',
      'Recepciones',
      'Recepcion',
      'Entregas',
      'Entrega',
      'Tanque',
      'Manguera',
      'Dispensario',
      'Mangueras',
      'Dispensarios'
    ];

    for (const [key, value] of Object.entries(obj)) {
      // 1. Mapeo de claves a PascalCase
      const dicEspeciales = {
        'UM':'UM',
        'BITACORA': 'Bitacora',
        'PRODUCTO': 'Producto',
        'CARACTER': 'Caracter',
        'GEOLOCALIZACION': 'Geolocalizacion',
        'REPORTEDEVOLUMENMENSUAL': 'ReporteDeVolumenMensual',
        'NACIONAL': 'Nacional',
        'EXTRANJERO': 'Extranjero',
        'RECEPCIONES': 'Recepciones',
        'ENTREGAS': 'Entregas',
        'CONTROLDEEXISTENCIAS': 'ControlDeExistencias'
      };

      let nuevaClave = dicEspeciales[key];

      if (!nuevaClave) {
        if (key === key.toUpperCase() && key !== '?xml') {
          nuevaClave = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
        } else {
          nuevaClave = key;
        }
      }

      // Procesar hijos recursivamente
      let valorProcesado = convertirClavesSAT(value);

      // 2. Si el nodo requiere ser Array y vino como Object único, lo envuelve en [...]
      if (camposArrayObligatorios.includes(nuevaClave) && !Array.isArray(valorProcesado)) {
        valorProcesado = [valorProcesado];
      }

      nuevoObjeto[nuevaClave] = valorProcesado;
    }

    return nuevoObjeto;
  }
  return obj;
}
