import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OtrosService } from 'src/app/core/services/renault/otros.service';

interface Registro {
  idConcepto: number;
  concepto: string;
  observaciones: string;
  importe: number;
  tipo: number;
}
@Component({
  selector: 'app-add-otro-form',
  templateUrl: './add-otro-form.component.html',
  styleUrl: './add-otro-form.component.css'
})
export class AddOtroFormComponent implements OnInit{
  form: FormGroup;
  conceptos:any = [];
  registros: Registro[] = [];
  public data:any = [];
  public isLoad:boolean = false;

  constructor(private fb: FormBuilder, private otrosService: OtrosService) {
    
  }


  ngOnInit(): void {
    this.buscarDatos();
    this.buildForm();
  }

  buildForm(){
    this.form = this.fb.group({
          concepto: ['', Validators.required],
          observaciones: [''],
          tipo: ['', Validators.required],
          importe: [0, [Validators.required, Validators.min(1)]],
        });
  }

get f() {
  return this.form.controls;
}

  agregarRegistro() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const nuevo: Registro = {
        idConcepto: this.form.value.concepto,
        concepto: this.getDescripcion(this.form.value.concepto),
        observaciones: this.form.value.observaciones,
        tipo: this.form.value.tipo,
        importe: parseFloat(this.form.value.importe),
      };
      this.registros.push(nuevo);
      this.resetForm();
    }
    
  }


    buscarDatos(){
    this.isLoad = true;
    this.conceptos = [];
    this.otrosService.getAll().subscribe(
      (response: any) => {
        if (response) {
          this.conceptos = response.data;
          // this.totales = this.obtenerTotales(response.data);
          this.isLoad = false;
        } else {
          console.log(response.message);
          this.isLoad = false;
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
        this.isLoad = false;
      },
    );
  }

  getDescripcion(id:any){
    const resultado = this.conceptos.find((p:any) => p.id === (Number(id)));
    return resultado ? resultado.nombre : 'No disponible';
  }

  public getTotal(key:any): number {
    return this.registros.reduce((acc, item) => acc + (Number(item[key]) || 0), 0);
  }

  private resetForm(){
    this.form.reset();
    this.form.patchValue({
      concepto: '',
      observaciones: '',
      tipo: '',
      importe: 0,
    });
  }

  public getItems(){
    return this.registros;
  }

  quitarRegistro(index: number) {
  this.registros.splice(index, 1);
}

}
