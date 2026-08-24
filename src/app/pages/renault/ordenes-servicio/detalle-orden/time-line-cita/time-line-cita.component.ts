import { Component, Input } from '@angular/core';
import { PasoLineaTiempo } from 'src/app/core/models/renault/eventos-cita';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-time-line-cita',
  templateUrl: './time-line-cita.component.html',
  styleUrl: './time-line-cita.component.css'
})
export class TimeLineCitaComponent {


  @Input() catEventos:any;
  @Input() eventosEstado:any;
  @Input() cita:any

    get lineaDelTiempo(): PasoLineaTiempo[] {
      return this.catEventos.map((cat:any) => {
        const ev = this.eventosEstado[cat.id];

        let estatus: "pendiente" | "en_proceso" | "completado" = "pendiente";
        let fecha: string | null = null;

        if (ev) {
          if (ev.fin_evento) {
            estatus = "completado";
            fecha = ev.fin_evento;
          } else if (ev.inicio_evento) {
            estatus = "en_proceso";
            fecha = ev.inicio_evento;
          }
        }

        return {
          idCat: cat.id,
          nombre: cat.nombre,
          estatus: estatus,
          fecha: fecha,
          completado: estatus === "completado",
          enProceso: estatus === "en_proceso",
        };
      });
    }

    /**
     * Calcula el porcentaje dinamico de la barra de progreso
     */
    get porcentajeProgreso(): number {
      const total = this.lineaDelTiempo.length;
      if (total === 0) return 0;

      const completados = this.lineaDelTiempo.filter((p) => p.completado).length;
      const enProceso = this.lineaDelTiempo.filter((p) => p.enProceso).length;

      const avance = completados + enProceso * 0.5;
      return Math.round((avance / total) * 100);
    }

    mostrarTexto(texto: string) {
     const cliente = `${this.cita?.nombre ?? ''} ${this.cita?.apellido_paterno ?? ''}`.trim();
    const vehiculo = `${this.cita?.modelo ?? ''} ${this.cita?.anio ?? ''}`.trim();
    const color = this.cita?.color ? `color ${this.cita.color}` : '';

    const newText = `Hola, ${cliente || 'estimado(a) cliente'}. Le informamos que su vehículo ${vehiculo} ${color} ha pasado a la siguiente etapa: ${texto}.`.replace(/\s+/g, ' ');
      Swal.fire({
        title: "Información",
        html: `
        <div class="text-start">
          <p id="textoCopiar" class="border rounded p-3 bg-light">
            ${newText}
          </p>
          <div class="d-flex justify-content-end aling-items center gap-3">
            <button id="btnWhatsApp" class="btn btn-success">
              <i class="fab fa-whatsapp  me-1"></i>
              Enviar texto
            </button>
            <button id="btnCopiar" class="btn btn-primary">
              <i class="fas fa-copy me-1"></i>
              Copiar texto
            </button>
          </div>

        </div>
      `,
        showConfirmButton: false,
        showCloseButton: true,
        didOpen: () => {
          const btn = document.getElementById("btnCopiar");

          btn?.addEventListener("click", async () => {
            const copiado = await this.copiarTexto(newText);

            if (copiado) {
              btn.innerHTML = `
          <i class="fas fa-check me-1"></i>
          ¡Copiado!
        `;

              btn.classList.replace("btn-primary", "btn-success");
            } else {
              Swal.showValidationMessage("No fue posible copiar el texto");
            }
          });
        },
      });

      const btnWhatsApp = document.getElementById('btnWhatsApp');

        btnWhatsApp?.addEventListener('click', () => {

          const url = `https://wa.me/?text=${encodeURIComponent(newText)}`;

          window.open(url, '_blank');

        });
    }

    async copiarTexto(texto: string): Promise<boolean> {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(texto);
          return true;
        }

        const textarea = document.createElement("textarea");

        textarea.value = texto;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);

        textarea.focus();
        textarea.select();

        const resultado = document.execCommand("copy");

        document.body.removeChild(textarea);

        return resultado;
      } catch (error) {
        console.error("Error al copiar:", error);
        return false;
      }
    }

}
