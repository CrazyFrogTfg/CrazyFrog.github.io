import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import 'bootstrap/dist/js/bootstrap.min.js';
import { UsuariosService } from './servicios/usuarios.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title ="MediaFroggy"

  constructor(private router: Router, private userService:UsuariosService) {}

  /*se detecta cuando se ha completado la navegacion y despues
  de 0,5 segundos se cambia la opacidad con una transicion
  si no hacemos esto se carga antes el footer que el contenido y sale por poco tiempo mal posicionado*/
  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          const footer = document.querySelector('app-footer');
          if (footer) {
            (footer as HTMLElement).style.opacity = '1';
          }
        }, 1000);
      }
    });
  }

  //probar
  logoutDeletedUser() {
    setTimeout(async () => {
      const uid = await this.userService.getUID();
      if (!uid || uid.trim() === '') {
        this.userService.logout();
      }
    }, 2000);
  }


}

