import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario: string;
  roles: any[];

  constructor(public jwtHelper: JwtHelperService) { }

  ngOnInit() {
    const token = new JwtHelperService();
    let tokedecodificado = token.decodeToken(sessionStorage.getItem(environment.TOKEN_NAME));

    this.usuario = tokedecodificado.user_name;
    this.roles = tokedecodificado.authorities;
  }

}
