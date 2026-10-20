import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { FinanciamientoService } from 'src/app/core/services/renault/financiamiento.service';

@Component({
  selector: 'app-form-financiamiento',
  templateUrl: './form-financiamiento.component.html',
  styleUrl: './form-financiamiento.component.css'
})
export class FormFinanciamientoComponent {

  selectedFile: File | null = null;
  isLoading: boolean = false;
  isSaving: boolean = false;
  extractedData: any = null;
  errorMessage: string = '';

  @Input() dataVenta: any;

  @Output() setFinanciamiento =  new EventEmitter<any>();
  @Output() refresh: EventEmitter<any> = new EventEmitter();

  private financiamientoService =  inject(FinanciamientoService);
  private alertas =  inject(SwalComprsServiceService);
  constructor(
    // private http: HttpClient
  ) {}

onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))) {
      this.selectedFile = file;
      this.errorMessage = '';
    } else {
      this.selectedFile = null;
      this.errorMessage = 'Por favor selecciona un archivo PDF válido.';
    }
  }

  onSubmit(): void {
    if (!this.selectedFile) return;

    this.isLoading = true;
    this.extractedData = null;
    this.errorMessage = '';

    this.financiamientoService.extractPdfData(this.selectedFile).subscribe({
      next: (response) => {
        this.extractedData = response;
        this.setFinanciamiento.emit(this.extractedData);
        // console.log(this.extractedData)
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al procesar el PDF', error);
        this.errorMessage = 'Ocurrió un error al procesar el archivo en el servidor.';
        this.isLoading = false;
      }
    });
  }

  public guardarFinanciamiento(){

  this.isSaving = true;
  const formData = new FormData();

    const payload = { ...this.extractedData,
      id: null,
      agencia: this.dataVenta.agencia,
      com_vendedores_id: this.dataVenta.id_vendedor,
      tipo_financiamiento: this.dataVenta.tipo_venta,
      com_datos_venta_id: this.dataVenta.id
    };

    Object.keys(payload).forEach(key => {formData.append(`financiamientos[0][${key}]`, payload[key]);});
    if(this.selectedFile){
      formData.append(`financiamientos[0][archivo]`, this.selectedFile , this.selectedFile.name);
    }

  this.financiamientoService.create(formData).subscribe({
    next: (response: any) => {
      if (response.status === 'success') {
        this.alertas.mostrarAlerta('Listo!', response.message, 'success', 'success');
        this.refresh.emit();
        this.isSaving = false;
        // this.event.emit();
        // this.cerrarModal();
      } else {
        this.isSaving = false;
        this.alertas.mostrarAlerta('Error!', response.message, 'error', 'danger');
      }
      // this.loading = false;
    },
    error: (error) => {
      this.isSaving = false;
      console.error(error);
      this.alertas.mostrarAlerta('Error!', error, 'error', 'danger');
      // this.loading = false;
    }
  });

  }
}
