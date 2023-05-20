import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
//import { user } from '../../../interfaces/user.interface'

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  defaultImageProfile = "/assets/defaultImageProfile.jpg"

  formReg: FormGroup;
  showImage:boolean=false

  constructor(private userService:UsuariosService, private router: Router, private title:Title){
    title.setTitle('Mediafrog - Registro')
    this.formReg = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
      username:new FormControl(),
      imageProfile: new FormControl(this.defaultImageProfile)
    })
  }

  ngOnInit(): void {}

  async onSubmit() {
    this.showImage=true
    await this.userService.register(this.formReg.value)
    .then(async () =>
      await this.userService.addUser(this.formReg.value))

      await this.userService.logout()
      await this.router.navigate(['/login'])
    //controlar errores
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }

}
