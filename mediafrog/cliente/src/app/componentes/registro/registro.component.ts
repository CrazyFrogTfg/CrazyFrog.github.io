import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  formReg: FormGroup;

  constructor(private userService:UsuariosService, private router: Router){
    this.formReg = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
      usuario:new FormControl()
    })
  }

  ngOnInit(): void {}

  async onSubmit() {
      await this.userService.addUser(this.formReg.value)
      await this.userService.register(this.formReg.value)
      await this.userService.logout()
      await this.router.navigate(['/login'])
    //controlar errores
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }

}
