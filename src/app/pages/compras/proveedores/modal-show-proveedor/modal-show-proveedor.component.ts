import { Component, Input, OnInit, EventEmitter  } from "@angular/core";
import { ProveedoresService } from "src/app/core/services/compras/proveedores/proveedores.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";
@Component({
  selector: 'app-modal-show-proveedor',
  templateUrl: './modal-show-proveedor.component.html',
  styleUrls: ['./modal-show-proveedor.component.css']
})
export class ModalShowProveedorComponent implements OnInit {

    public event: EventEmitter<any> = new EventEmitter();
    public proveedor: any;
    public expediente: any;
    public archivos:any;
    public tamanioExp:any;
    public downloadable: boolean = false;
    public isLoad: boolean = false;

    constructor(
      private alertasService : SwalComprsServiceService,
      private proveedoresService: ProveedoresService,
      private modalService: BsModalService,
      public bsModalRef: BsModalRef,
    ){}

  public ngOnInit(): void {
    this.getExpediente();
  }
  public descargarExpediente(){ //Recupera un archivo zip con el expediente y lo descarga 
    this.proveedoresService.descargarExpediente(this.proveedor.id).subscribe((response)=>{

      const blob = new Blob([response], {type: 'application/zip'});
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `Expediente_${this.proveedor.nombre}.zip`;
      link.click();
      window.URL.revokeObjectURL(url);

    },
    (error) => {
      this.alertasService.mostrarAlerta(error,'No se encontraron archivos para descargar',"error", "danger" )
    })
  }

    private getExpediente() {
      this.proveedoresService.getExp(this.proveedor.id).subscribe(
        (response) => {
          if (response) {
            this.expediente = response.data;
            this.downloadable =  response.descargable;
            this.archivos = this.expediente; //El elemento seleccionado se convierte en las rutas de los archivos
            this.tamanioExp = response.tamanio;
            this.isLoad = true; 
            
          } else {
            console.log(response.message);
          }
        },
        (error) => {
          console.error("Error fetching data:", error);
        }
      );
    }



  openFile(rutaArchivo: string) { // Funcion para abrir pdfs
    this.proveedoresService.abrirArchivo(rutaArchivo); 
   }

   public cerrarModal(): void {
    this.bsModalRef.hide();
  }
}
