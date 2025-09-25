import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-visor-video',
  templateUrl: './visor-video.component.html',
  styleUrl: './visor-video.component.css'
})
export class VisorVideoComponent {
public videoUrl
public tab

constructor(
  private sanitizer: DomSanitizer,
){}

getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
