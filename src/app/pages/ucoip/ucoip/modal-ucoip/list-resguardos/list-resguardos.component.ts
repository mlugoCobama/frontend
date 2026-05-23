import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-list-resguardos',
  templateUrl: './list-resguardos.component.html',
  styleUrl: './list-resguardos.component.css'
})
export class ListResguardosComponent {
  @Input() data = [];

}
