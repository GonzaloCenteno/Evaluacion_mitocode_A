import { LoginService } from './_service/login.service';
import { Menu } from './_model/menu';
import { MenuService } from './_service/menu.service';
import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { environment } from '../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  menus: Menu[];

  constructor(
    private menuService: MenuService,
    public loginService : LoginService,
    public jwtHelper: JwtHelperService,
    private router: Router
    ) {

  }

  ngOnInit() {
    this.menuService.menuCambio.subscribe(data => {
      this.menus = data;
    });

    interval(3000).subscribe(data => {
      let token = sessionStorage.getItem(environment.TOKEN_NAME);
      if(token){
        if(this.jwtHelper.getTokenExpirationDate() < new Date())
        {
          sessionStorage.clear();
          this.router.navigate(['login']);
        }
      }
    });

  }
  
}
