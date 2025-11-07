import { Component, OnInit, Input, Output, EventEmitter, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProveedoresService } from 'src/app/core/services/compras/proveedores/proveedores.service';


import { AcuseRecibidoService } from 'src/app/core/services/compras/acuse-recibido.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';

@Component({
  selector: "app-panel-entregas",
  templateUrl: "./panel-entregas.component.html",
  styleUrl: "./panel-entregas.component.css",
})
export class PanelEntregasComponent implements OnInit {
  @Input() ordenCompra: any;
  @Output() actualizarStatus1 = new EventEmitter<void>();

  acuseForm: FormGroup;
  acusesGuardados: any[] = [];

  submitted = false;

  constructor(
    private fb: FormBuilder,
    private acuseRecibido: AcuseRecibidoService,
    private alertasService: SwalComprsServiceService,
    private proveedoresService: ProveedoresService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.cargarAcuses();
  }

  private buildForm() {
    this.acuseForm = this.fb.group({
      archivo: [null, Validators.required],
      observaciones: [""],
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.acuseForm.patchValue({ archivo: file });
  }

  guardar(): void {
    this.submitted = true;

    if (this.acuseForm.invalid) {
      this.alertasService.mostrarAlerta(
        "Falta algo",
        "Debes de adjuntar un archivo",
        "warning",
        "warning"
      );
      return;
    }

    const formData = new FormData();
    formData.append("archivo", this.acuseForm.get("archivo")?.value);
    formData.append(
      "observaciones",
      this.acuseForm.get("observaciones")?.value
    );
    formData.append("orden_compra_id", this.ordenCompra?.id);
    this.acuseRecibido.guardarAcuse(formData).subscribe(
      (response) => {
        if (response.status === "success") {
          this.alertasService.mostrarAlerta(
            "Guardado",
            response.message,
            "success",
            "success"
          );

          this.actualizarStatus1.emit();
          // ESTO VA A CAMBIAR POR UN EVENT EMMITER
          this.acuseForm.reset();
          this.submitted = false;
        } else {
          this.alertasService.mostrarAlerta(
            "Error",
            response.message,
            "warning",
            "warning"
          );

          return;
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta("Error", error, "warning", "warning");
        return;
      }
    );
    this.cargarAcuses();
  }

  cargarAcuses(): void {
    // Simulación de datos desde la base de datos
    if (this.ordenCompra?.acuses_entrega?.length > 0) {
      this.acusesGuardados = this.ordenCompra?.acuses_entrega;
    }
  }

  solicitarSurtido(): void {
    Swal.fire({
      title: "¿Deseas solicitar el surtido de la orden de compra?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
      reverseButtons: true
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        Swal.fire({
          title:
            "¿Deseas enviarle la solicitud de cotización por correo al proveedor?",
          icon: "question",
          reverseButtons: true,
          showCancelButton: true,
          confirmButtonText: "Sí",
          cancelButtonText: "No, lo contactaré por otro medio",
        }).then((respuesta) => {
          const tipo = respuesta.isConfirmed ? 1 : 2;

          const data = {
            tipo: tipo,
            id_orden_compra: this.ordenCompra?.id,
          };
          this.acuseRecibido.solicitarSurtido(data).subscribe(
            (response) => {
              if (response.status === "success") {
                this.alertasService.mostrarAlerta(
                  "Guardado",
                  response.message,
                  "success",
                  "success"
                );

                this.actualizarStatus1.emit(); // ESTO VA A CAMBIAR POR UN EVENT EMMITER
              } else {
                this.alertasService.mostrarAlerta(
                  "Error",
                  response.message,
                  "warning",
                  "warning"
                );

                return;
              }
            },
            (error) => {
              this.alertasService.mostrarAlerta(
                "Error",
                error,
                "warning",
                "warning"
              );
              return;
            }
          );
        });
      }
    });
  }

  mostrarBtnSolicitud() {
     return this.ordenCompra?.surtido_solicitado === 0 ? true : false; 
  }

  /**
   * abre los archivos en una pestaña nueva
   * @param prov ruta del archivo
   */
  verArchivos(prov: any) {
    this.proveedoresService.abrirArchivo(prov);
  }
}