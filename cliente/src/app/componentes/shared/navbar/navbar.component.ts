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
  userInfo:any
  isAdmin:boolean = false

  constructor(private userService:UsuariosService, private router: Router){}

  async ngOnInit() {
    this.userInfo = await this.userService.getUserInfo()
    if(this.userInfo.admin) this.isAdmin = true
  }

  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  onClick(){
    this.userService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => console.log(error));
  }

}
