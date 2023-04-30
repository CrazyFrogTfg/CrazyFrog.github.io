import { Component } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  isNavbarOpen = false;

  constructor(private userService:UsuariosService, private router: Router){}

  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  onClick(){
    this.userService.logout()
      .then(() => {
        this.router.navigate(['/registro']);
      })
      .catch(error => console.log(error));
  }

}
