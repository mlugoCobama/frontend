import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiCodigosPostalesService {

  httpOptions = {
    headers: new HttpHeaders({
        'Access-Control-Allow-Methods':'GET, POST, PATCH, DELETE, PUT, OPTIONS',
        'Access-Control-Allow-Headers':'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
        'Content-Type':  'application/json',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials' : 'true',
    })
  };

  requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  constructor(private http: HttpClient) { }

  public search(cp: number) {
    return this.http.get(environment.apiUrl + 'search-cp/' + cp, this.httpOptions);
  }

}
