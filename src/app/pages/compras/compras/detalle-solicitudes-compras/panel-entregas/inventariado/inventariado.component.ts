import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatHardwareService } from 'src/app/core/services/ucoip/cat-hardware.service';
import { AlertErrorService } from 'src/app/core/services/alert-error.service';
import { UsuariosService } from 'src/app/core/services/compras/usuarios.service';


@Component({
  selector: 'app-inventariado',
  templateUrl: './inventariado.component.html',
  styleUrl: './inventariado.component.css'
})
export class InventariadoComponent implements OnInit {


  @Input() productos:any[]=[];
  @Input() intercompania:any = '';

  inventarioForm!:FormGroup;

  constructor(
    private fb:FormBuilder,
    private catHardwareService: CatHardwareService,
    private alertService: AlertErrorService,
    private usuariosService:UsuariosService 
  ){}

  ngOnInit(){

    this.inventarioForm=this.fb.group({
      activos:this.fb.array([])
    });
    this.getCatHardware()
    this.generarActivos();
    this.getUsuarios(this.intercompania);

  }

  get activosArray():FormArray{
    return this.inventarioForm.get('activos') as FormArray;
  }

  getControl(index:number,nombre:string){
    return this.activosArray.at(index).get(nombre);
  }

  inventarioValido(){

    this.inventarioForm.markAllAsTouched();

    return this.inventarioForm.valid;
  }

  generarActivos(){

    this.productos.forEach(producto=>{

      // Se crean tantos activos como recibidos
      const cantidad = producto.recibidos || producto.cantidad;

      for(let i=0;i<cantidad;i++){
        this.activosArray.push(
          this.fb.group({
            detalleId:[producto.id],
            descripcion:[producto.descripcion],
            tipo:[ null,Validators.required],
            marca:['',[Validators.required]],
            modelo:['',[Validators.required]],
            serie:['',[Validators.required]],
            caracteristcas:['',[Validators.required]],
            usuario_asignar:[null]
          })
        );
      }
    });
  }

  public dataCatHardware = [];
  private getCatHardware() {
    this.catHardwareService.getAll().subscribe(
      (data: any) => {
        if (data.success) {
          this.dataCatHardware = data.data;
        } else {
          this.alertService.alertError(data.message, data.success);
        }
      },
      (error) => {
        this.alertService.alertError(error, false);
      }
    );
  }

  public usuarios:any = [];
  /**
   * Recupera los usuarios que pertenecen a las empresas (Select usuario)
   * @param intercompania num de intercompania
   */
  public getUsuarios(intercompania: any) {
    this.usuarios = [];
    // this.isLoad = false;
    // this.disabled = false;
    // this.isAgencia = this.interAgencias.some((num) => num === Number(intercompania));
    if (intercompania != "") {
      this.usuariosService.getUsuariosEmpresas(intercompania).subscribe(
        (response) => {
          if (response) {
            if (response.data.length > 0) {
              this.usuarios = [
                {id: null, firstname: "No asignar", realname: "", puesto: "" },
                ...response.data,
              ];
              console.log(this.usuarios)
              // this.isLoad = true;
            } else {
              this.usuarios = [
                { id: null, firstname: "No asignar", realname: "", puesto: "" },
              ];
              // this.isLoad = true;
              // this.disabled = true;
            }
          } else {
            console.log(response.message);
          }
        },
        (error) => {
          console.error("Error fetching data:", error);
        }
      );
    } else {
      this.usuarios = [
        { id: null, firstname: "No asignar", realname: "", puesto: "" },
      ];
      // this.isLoad = true;
      // this.disabled = true;
    }
  }

}
