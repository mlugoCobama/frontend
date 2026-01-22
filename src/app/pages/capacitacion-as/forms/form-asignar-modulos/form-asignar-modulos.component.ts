import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, AbstractControl, Validators, ValidatorFn, } from '@angular/forms';
import { AdministracionService } from 'src/app/core/services/capacitaciones/administracion.service';

interface Funcion {
  id: number;
  nombre: string;
  permiso: string;
  // idPermiso: number;
  ruta_video: string;
  catalogos_submodulos_as_id : number;
  activo: boolean;
}

interface Submodulo {
  id: number;
  nombre: string;
  permiso: string;
  // idPermiso: number;
  funciones: Funcion[];
  activo: boolean;
}

interface Modulo {
  id: number;
  nombre: string;
  permiso: string;
  // idPermiso: number;
  submodulos: Submodulo[];
  activo: boolean;
}

@Component({
  selector: "app-form-asignar-modulos",
  templateUrl: "./form-asignar-modulos.component.html",
  styleUrl: "./form-asignar-modulos.component.css",
})
export class FormAsignarModulosComponent implements OnInit {
  permisosForm!: FormGroup;
  formReady = false; // Controla cuándo mostrar el form

  @Input() data:any = [];
  @Input() nombrePuesto : any = ""; 

  public faltanOpciones: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.buildForm();
    // console.log(this.nombrePuesto)
  }

  private buildForm() {
    this.permisosForm = this.formBuilder.group({
      puesto: [ this.nombrePuesto ?? "", Validators.required],

      modulos: this.formBuilder.array(
        this.data.map((mod) => this.createModulo(mod))
      ),
      
    },{ validators: jerarquiaValida }
);

    // Forzar renderizado después de la carga del formulario
    setTimeout(() => {
      this.formReady = true;
      this.cdr.detectChanges();
    });
  }

  get puesto(): FormControl {
    return this.permisosForm.get("puesto") as FormControl;
  }

  get modulos(): FormArray {
    return this.permisosForm.get("modulos") as FormArray;
  }

  createModulo(modulo: any): FormGroup {
    const moduloGroup = this.formBuilder.group({
      id: [modulo.id],
      nombre: [modulo.nombre],
      permiso: [modulo.permiso],
      // idPermiso: [modulo.idPermiso],
      activo: [modulo.activo],
      submodulos: this.formBuilder.array(
        modulo.submodulos.map((sub: any) => this.createSubmodulo(sub))
      ),
    });
    moduloGroup.get("activo")?.valueChanges.subscribe((isActive: boolean) => {
      // if (!isActive) {
      //   const submodulosArray = moduloGroup.get("submodulos") as FormArray;
      //   submodulosArray.controls.forEach((submoduloGroup) => {
      //     submoduloGroup.get("activo")?.setValue(false);
      //     const funcionesArray = submoduloGroup.get("funciones") as FormArray;
      //     funcionesArray.controls.forEach((funcionGroup) => {
      //       funcionGroup.get("activo")?.setValue(false);
      //     });
      //   });
      // }

      const submodulosArray = moduloGroup.get("submodulos") as FormArray;
        submodulosArray.controls.forEach((submoduloGroup) => {
          submoduloGroup.get("activo")?.setValue( isActive == true ? !isActive : isActive , { emitEvent: false });
          const funcionesArray = submoduloGroup.get("funciones") as FormArray;
          funcionesArray.controls.forEach((funcionGroup) => {
            funcionGroup.get("activo")?.setValue(isActive == true ? !isActive : isActive, { emitEvent: false });
          });
        });

    });

    return moduloGroup;
  }

  createSubmodulo(sub: any): FormGroup {
    const submoduloGroup = this.formBuilder.group({
      id: [sub.id],
      nombre: [sub.nombre],
      permiso: [sub.permiso],
      // idPermiso: [sub.idPermiso],
      activo: [sub.activo],
      funciones: this.formBuilder.array(
        sub.funciones.map((f: any) => this.createFuncion(f))
      ),
    });

    // submoduloGroup
    //   .get("activo")
    //   ?.valueChanges.subscribe((isActive: boolean) => {
    //     if (!isActive) {
    //       const funcionesArray = submoduloGroup.get("funciones") as FormArray;
    //       funcionesArray.controls.forEach((funcionGroup) => {
    //         funcionGroup.get("activo")?.setValue(false);
    //       });
    //     }
    //   });

    submoduloGroup.get("activo")?.valueChanges.subscribe((isActive: boolean) => {
      const funcionesArray = submoduloGroup.get("funciones") as FormArray;
      funcionesArray.controls.forEach((funcionGroup) => {
        funcionGroup.get("activo")?.setValue(isActive == true ? !isActive : isActive, { emitEvent: false });
      });
    });

    return submoduloGroup;
  }

  createFuncion(func: any): FormGroup {
    return this.formBuilder.group({
      id: [func.id],
      nombre: [func.nombre],
      ruta_video: [func.ruta_video],
      permiso: [func.permiso],
      // idPermiso: [func.idPermiso],
      catalogos_submodulos_as_id: [func.catalogos_submodulos_as_id],
      activo: [func.activo],
    });
  }

  // Métodos para acceder en la plantilla
  getSubmodulos(modulo: any): FormArray {
    return modulo.get("submodulos") as FormArray;
  }

  getFunciones(submodulo: any): FormArray {
    return submodulo.get("funciones") as FormArray;
  }

  guardar(){
    const permisosPlanos = this.getPermisosPlanosConTipo();
    const puesto = this.puesto.value;
    
    const dataToSend = {
      puesto :puesto,
      permisos : permisosPlanos,
    }

    return dataToSend;
  }

  public formValido(){
    this.faltanOpciones = false;
    const permisosPlanos = this.getPermisosPlanosConTipo();
    if(this.permisosForm.valid && permisosPlanos.length > 0){
      return true;
    }else{
      this.permisosForm.markAllAsTouched();
      this.faltanOpciones = true;
      return false;
    }
  }

getPermisosPlanosConTipo(): any[] {
  const permisos: any[] = [];

  this.modulos.controls.forEach((modulo: AbstractControl) => {
    const moduloActivo = modulo.get('activo')?.value;
    if (moduloActivo) {
      permisos.push({
        tipo: 'modulo',
        nombre: modulo.get('nombre')?.value,
        permiso: modulo.get('permiso')?.value,
        // idPermiso: modulo.get('idPermiso')?.value,
      });
    }

    const submodulos = modulo.get('submodulos') as FormArray;
    submodulos.controls.forEach((sub: AbstractControl) => {
      const subActivo = sub.get('activo')?.value;
      if (subActivo) {
        permisos.push({
          tipo: 'submodulo',
          nombre: sub.get('nombre')?.value,
          permiso: sub.get('permiso')?.value,
          // idPermiso: sub.get('idPermiso')?.value,
        });
      }

      const funciones = sub.get('funciones') as FormArray;
      funciones.controls.forEach((func: AbstractControl) => {
        const funcActivo = func.get('activo')?.value;
        if (funcActivo) {
          permisos.push({
            tipo: 'funcion',
            nombre: func.get('nombre')?.value,
            permiso: func.get('permiso')?.value, 
            // idPermiso: func.get('idPermiso')?.value,
          });
        }
      });
    });
  });

  return permisos;
}

}

export const jerarquiaValida: ValidatorFn = (form: AbstractControl): { [key: string]: any } | null => {
  const modulos = form.get('modulos') as FormArray;
  if (!modulos) return null;

  let errorEncontrado = false;

  modulos.controls.forEach(modulo => {
    const moduloActivo = modulo.get('activo')?.value;
    const submodulos = modulo.get('submodulos') as FormArray;

    if (moduloActivo) {
      const submodulosActivos = submodulos.controls.filter(sub => sub.get('activo')?.value);
      if (submodulosActivos.length === 0) {
        errorEncontrado = true;
        return;
      }

      submodulosActivos.forEach(sub => {
        const funciones = sub.get('funciones') as FormArray;
        const funcionesActivas = funciones.controls.filter(func => func.get('activo')?.value);
        if (funcionesActivas.length === 0) {
          errorEncontrado = true;
        }
      });
    }
  });

  return errorEncontrado ? { jerarquiaInvalida: true } : null;
};