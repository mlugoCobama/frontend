import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AlertErrorService {

  constructor(
    public toastr: ToastrService,
  ) { }

  public alertError(message: string, type:boolean){
    if (type) {
      this.toastr.success(message, 'Confirmación');
    } else {
      this.toastr.error(message, 'Ha ocurrido un error');
    }
  }
}
