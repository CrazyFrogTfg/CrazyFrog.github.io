import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  formLogin: FormGroup;

  constructor(private userService:UsuariosService, private router: Router){
    this.formLogin = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    })
  }

  ngOnInit(): void {}

  onSubmit(){
    this.userService.login(this.formLogin.value)
      .then(response => {
        this.router.navigate(['/home']);
      })
      //habria que imprimir algo en pantalla con este error, pero no sé muy bien qué
      .catch(error => console.log(error));
  }

  goToRegistro(){
    this.router.navigate(['/registro']);
  }

}
