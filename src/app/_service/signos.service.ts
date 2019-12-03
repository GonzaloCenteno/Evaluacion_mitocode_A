import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Signos } from '../_model/signos';

@Injectable({
  providedIn: 'root'
})
export class SignosService {

  signosCambio = new Subject<Signos[]>();
  mensajeCambio = new Subject<string>();
  dataPaciente = new Subject<Object>();

  url: string = `${environment.HOST}/signos`;

  constructor(private http: HttpClient) { }

  listarPageable(p: number, s: number) {
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  listarPorId(idSigno: number) {
    return this.http.get<Signos>(`${this.url}/${idSigno}`);
  }

  registrar(signos: Signos) {
    return this.http.post(this.url, signos);
  }

  modificar(signos: Signos) {
    return this.http.put(this.url, signos);
  }

  eliminar(idSigno: number) {
    return this.http.delete(`${this.url}/${idSigno}`);
  }

}
