import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AdministracionService } from 'src/app/core/services/capacitaciones/administracion.service';
@Component({
  selector: 'app-nav-vertical',
  templateUrl: './nav-vertical.component.html',
  styleUrl: './nav-vertical.component.css'
})
export class NavVerticalComponent implements OnInit {

  @Input() tabs:any = [];
  public permisos:any = [];

  constructor(
    private sanitizer: DomSanitizer,
    private administracion:  AdministracionService
    ){}

  ngOnInit(): void {
        const permisosRaw = JSON.parse(localStorage.getItem('permisos') || '[]');
        this.permisos = permisosRaw.map((p: any) => p.name); 
  }

  selectTab(selectedTab: any) {
    this.tabs.forEach(tab => tab.active = false);
    selectedTab.active = true;
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  tienePermiso(permiso: string): boolean {
    if (!permiso) return true;
    return this.permisos.includes(permiso);
  }

}
