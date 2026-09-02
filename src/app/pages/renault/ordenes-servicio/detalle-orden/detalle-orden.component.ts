import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventoCita } from 'src/app/core/models/renault/eventos-cita';
import { LocalPreview, TestigoFotografico } from 'src/app/core/models/renault/media-file-cita';
import { EventosCitaService } from 'src/app/core/services/renault/eventos-cita.service';
import { OrdenesServicioService } from 'src/app/core/services/renault/ordenes-servicio.service';
import Swal from 'sweetalert2';

export const TIPO_EVENTO = {
  ENTRADA: 1,
  TALLER: 2,
  LAVADO: 3,
  CALIDAD: 4,
  ENTREGA: 6
};

@Component({
  selector: "app-detalle-orden",
  templateUrl: "./detalle-orden.component.html",
  styleUrl: "./detalle-orden.component.css",
})
export class DetalleOrdenComponent implements OnInit {
  public tempPreviews: LocalPreview[] = [];
  public dataEntrada: any = [];
  folio: string | null = null;
  id: any;
  @Input() cita: any;
  @Output() setActiveCita = new EventEmitter<any>();
  @Output() reload = new EventEmitter<any>();

  public isLoad: boolean = false;
  isLoading = false;
  isLoading12 = false;

  canUploadEntrada: boolean = true;
  canUploadProceso: boolean = true;

  public catEventos = [
    { id: 1, nombre: "Entrada" },
    { id: 2, nombre: "Taller" },
    { id: 3, nombre: "Lavado" },
    { id: 4, nombre: "Control de Calidad" },
    { id: 6, nombre: "Entrega" },
  ];

  public eventosEstado: { [tipoEvento: number]: EventoCita | null } = {
    [TIPO_EVENTO.ENTRADA]: null,
    [TIPO_EVENTO.TALLER]: null,
    [TIPO_EVENTO.LAVADO]: null,
    [TIPO_EVENTO.CALIDAD]: null,
    [TIPO_EVENTO.ENTREGA]: null,
  };

  public loadingEventos: { [tipoEvento: number]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private ordenesServicio: OrdenesServicioService,
    private eventosCitaService: EventosCitaService,
  ) {}

  ngOnInit() {
    this.folio = this.route.snapshot.paramMap.get("folio");
    this.id = this.route.snapshot.paramMap.get("id");
    this.getDatosEntrada(this.cita.id);
    // ahora puedes usar this.id para cargar datos
  }

  goBack() {
    this.setActiveCita.emit(false);
    this.reload.emit();
    // this.router.navigate(['/renault/ordenes-servicio']);
  }

  ngOnDestroy() {
    this.tempPreviews.forEach((item) => URL.revokeObjectURL(item.url));
  }


  public getDatosEntrada(id: any) {
    this.isLoad = false;
    this.ordenesServicio.getOne(id).subscribe((data) => {
      if (data.status == "success") {
        this.dataEntrada = data.data;
        this.cargarEventosCita();

        if (this.dataEntrada.num_entrada) {
        }
        this.isLoad = true;
      } else {
        console.log(data.message);
        this.isLoad = true;
      }
    });
  }

  public cargarEventosCita(): void {
    if (this.dataEntrada?.eventosCita) {
      this.dataEntrada.eventosCita.forEach((evento: EventoCita) => {
        this.eventosEstado[evento.ren_cat_eventos_id] = evento;
      });
    }
  }

  descargarPdf(id: number) {
    this.isLoading = true;

    this.ordenesServicio.descargarPdfOrdenServicio(id).subscribe(
      (archivo: Blob) => {
        const fileURL = URL.createObjectURL(archivo);
        const a = document.createElement("a");
        a.href = fileURL;
        a.download =
          "orden_reparacion_mecanica_no_entrada_" +
          this.dataEntrada.num_entrada +
          ".pdf";
        a.click();
        URL.revokeObjectURL(fileURL);
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        Swal.fire("Ocurrio un error", error, "error");
      },
    );
  }

  descargarEncuestaPdf(id: number) {
    this.isLoading12 = true;

    this.ordenesServicio.descargarPdfEncuesta(id).subscribe(
      (archivo: Blob) => {
        const fileURL = URL.createObjectURL(archivo);
        const a = document.createElement("a");
        a.href = fileURL;
        a.download =
          "encuesta_de_satisfaccion" +
          this.cita.folio +
          ".pdf";
        a.click();
        URL.revokeObjectURL(fileURL);
        this.isLoading12 = false;
      },
      (error) => {
        this.isLoading12 = false;
        Swal.fire("Ocurrio un error", error, "error");
      },
    );
  }



  onUploadFiles(event: any): void {
    const { items, category } = event;

    if (!this.dataEntrada.testigos_fotograficos) {
      this.dataEntrada.testigos_fotograficos = [];
    }

    items.forEach((itemData:any) => {
      const file = itemData.file;

      // Asegurar que sea una instancia válida de File
      if (file instanceof File) {
        const previewUrl = URL.createObjectURL(file);

        const nuevoTestigo: TestigoFotografico = {
          imagen: previewUrl,
          categoria: category,
          descripcion: itemData.descripcion || "",
          media_type: file.type.startsWith("video/") ? "video" : "image",
          nombre: file.name,
          file: file,
        };

        this.dataEntrada.testigos_fotograficos.push(nuevoTestigo);
      }
    });
    this.guardarCambiosTestigos();
  }

  guardarCambiosTestigos(): void {
    const testigos: TestigoFotografico[] =
      this.dataEntrada.testigos_fotograficos || [];

    const existentesIds: number[] = testigos.filter((t) => t.id !== undefined && t.id !== null)
      .map((t) => t.id as number);

    const nuevosArchivos: TestigoFotografico[] = testigos.filter((t) => t.file instanceof File);

    const formData = new FormData();

    existentesIds.forEach((id, index) => {formData.append(`fotos_existentes_ids[${index}]`, id.toString())});

    nuevosArchivos.forEach((item, index) => {
      if (item.file) {
        formData.append(`nuevas_fotos[${index}][file]`,item.file,item.file.name);
        formData.append(`nuevas_fotos[${index}][categoria]`,item.categoria || "");
        formData.append(`nuevas_fotos[${index}][mediaType]`, item.media_type);
        formData.append(`nuevas_fotos[${index}][descripcion]`, item.descripcion || "");
      }
    });

    formData.append("_method", "PUT");

    this.ordenesServicio
      .update(this.dataEntrada.id_entrada, formData)
      .subscribe({
        next: (res) => {
          console.log("Archivos subidos con éxito", res);
          this.getDatosEntrada(this.cita.id);
        },
        error: (err) => {
          console.error("Error al subir archivos", err);
        },
      });
  }

  /**
   * Evalúa si un evento ya fue finalizado (fin_evento NO es nulo)
   */
  public isFinalizado(tipoEvento: number): boolean {
    const evento = this.eventosEstado[tipoEvento];
    return !!(evento && evento.fin_evento);
  }

  /**
   * Evalúa si un evento está actualmente en proceso (inicio_evento existe pero fin_evento es nulo)
   */
  public isEnProceso(tipoEvento: number): boolean {
    const evento = this.eventosEstado[tipoEvento];
    return !!(evento && evento.inicio_evento && !evento.fin_evento);
  }

  /**
   * Obtiene las observaciones del evento finalizado
   */
  public getObservaciones(tipoEvento: number): string {
    return (
      this.eventosEstado[tipoEvento]?.observaciones ||
      "Sin observaciones registradas."
    );
  }

  public async manejarEvento( activar: boolean, tipoEvento: number): Promise<void> {
    const citaId = this.cita?.id;

    if (!citaId) {
      Swal.fire("Error", "No se encontró la cita.", "error");
      return;
    }

    if (activar) {
      this.loadingEventos[tipoEvento] = true;

      const payload = {
        tipo_evento: tipoEvento,
        cita_id: citaId,
      };

      this.eventosCitaService.save(payload).subscribe({
        next: (res) => {
          this.loadingEventos[tipoEvento] = false;
          if (res.status === "success") {
            this.eventosEstado[tipoEvento] = res.data;
          }
        },
        error: () => (this.loadingEventos[tipoEvento] = false),
      });
    } else {
      const eventoActual = this.eventosEstado[tipoEvento];

      if (!eventoActual) return;

      const { isConfirmed, value: observaciones } = await Swal.fire({
        title: "Finalizar Proceso",
        text: "¿Deseas agregar alguna observación al concluir?",
        input: "textarea",
        inputPlaceholder: "Escribe aquí tus observaciones...",
        showCancelButton: true,
        confirmButtonText: "Finalizar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#ffc107",
        reverseButtons:  true
      });

      if (!isConfirmed) return;

      this.loadingEventos[tipoEvento] = true;

      const payload = { observaciones: observaciones || "Sin observaciones"};

      this.eventosCitaService.edit(eventoActual.id, payload).subscribe({
        next: (res) => {
          this.loadingEventos[tipoEvento] = false;
          if (res.status === "success") {
            this.eventosEstado[tipoEvento] = res.data;
            Swal.fire("Finalizado", res.message, "success");
          }
        },
        error: () => (this.loadingEventos[tipoEvento] = false),
      });
    }
  }


}
