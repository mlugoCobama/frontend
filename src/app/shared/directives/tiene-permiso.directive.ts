import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermisosService } from 'src/app/core/services/permisos.service';

@Directive({
  selector: '[appTienePermiso]',
  // standalone: true
})
export class TienePermisoDirective {
  @Input() set appTienePermiso(permiso: string) {
    if (this.permisosService.tienePermiso(permiso)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permisosService: PermisosService
  ) {}
}