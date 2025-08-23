import { Component } from '@angular/core';

@Component({
  selector: 'app-almacen',
  templateUrl: './almacen.component.html',
  styleUrl: './almacen.component.css'
})
export class AlmacenComponent {
    public mecanicos = [
        { nombre: "JORGE PALOMINO", tipo: "MECANICO", empresa: "SATELITE" },
        { nombre: "GREGORIO CAMPA", tipo: "MECANICO", empresa: "SATELITE" },
        { nombre: "GERARDO LUNA", tipo: "MECANICO", empresa: "FLAMAZUL" },
        { nombre: "REFUGIO CASTELLANOS", tipo: "MECANICO", empresa: "SERVIGAS" },
        { nombre: "RAFAEL VITE", tipo: "MECANICO", empresa: "SERVIGAS" },
        { nombre: "IVAN PORRAS (AYUDANTE)", tipo: "AYUDANTE", empresa: "SERVIGAS" },
        { nombre: "ALBERTO ESTUDILLO", tipo: "MECANICO", empresa: "SERVIGAS" },
        { nombre: "ANGEL FLORES", tipo: "MECANICO", empresa: "GAS PREMIO" },
        { nombre: "NORBERTO COLIN", tipo: "MECANICO", empresa: "GAS PREMIO" },
        { nombre: "EDGAR", tipo: "MECANICO", empresa: "GAS URBANO" },
        { nombre: "ISRAEL (AYUDANTE)", tipo: "AYUDANTE", empresa: "GAS URBANO" },
        { nombre: "PENDIENTE", tipo: "MECANICO", empresa: "GARZA SUR" },
        { nombre: "PENDIENTE", tipo: "MECANICO", empresa: "GARZA SUR" },
        { nombre: "PENDIENTE", tipo: "MECANICO", empresa: "GARZA SUR" },
        { nombre: "PENDIENTE", tipo: "MECANICO", empresa: "GARZA SUR" },
        { nombre: "FEDERICO RODRIGUEZ", tipo: "MECANICO", empresa: "TANQUES GARZA GAS" },
        { nombre: "FRANCISCO NONINGO", tipo: "MECANICO", empresa: "TANQUES GARZA GAS" },
        { nombre: "JUAN CARLOS PICHARDO", tipo: "MECANICO", empresa: "TANQUES GARZA GAS" },
        { nombre: "JOSE LUIS ISIDRO MARTINEZ", tipo: "MECANICO", empresa: "TANQUES GARZA GAS" },
        { nombre: "VICENTE DELGADO", tipo: "MECANICO", empresa: "TANQUES GARZA GAS" },
        { nombre: "SEVERO CERON", tipo: "MECANICO", empresa: "TANQUES GARZA GAS" },
        { nombre: "ALBERTO SILVA", tipo: "MECANICO", empresa: "TANQUES GARZA GAS" }
    ];



}
