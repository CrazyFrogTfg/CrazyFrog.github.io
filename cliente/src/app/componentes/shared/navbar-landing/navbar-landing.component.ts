import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-navbar-landing',
  templateUrl: './navbar-landing.component.html',
  styleUrls: ['./navbar-landing.component.css']
})
export class NavbarLandingComponent {


  isNavbarOpen = false;

  constructor(private userService:UsuariosService, private router: Router){}

  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  onClick(){
    this.router.navigate(['/login']);
  }

}
