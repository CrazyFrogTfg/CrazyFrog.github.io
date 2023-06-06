import { Component } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Storage } from '@angular/fire/storage';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  userInfo:any;
  uid:any;
  file:any;
  passwordError:string=""
  updateUser: FormGroup;

  constructor(private userService:UsuariosService, private storage:Storage, private router:Router, private title:Title) { title.setTitle('Mediafroggy - Perfil')
    this.updateUser = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
      username:new FormControl(),
      imageProfile: new FormControl(),
      currentPassword: new FormControl(),
    })
  }

  async ngOnInit() {
    this.userInfo = await this.userService.getUserInfo()
    this.uid = await this.userService.getUID()
  }

  async onSubmit() {
    if(this.updateUser.value)
    {
      if(this.updateUser.value.currentPassword === this.userInfo.password)
      {
        await this.userService.updateUserDb(this.uid, this.updateUser.value, this.userInfo, this.file);
        setTimeout(() => this.router.navigate(['/home']), 1500)

      }else 
      this.passwordError = "*Contraseña errónea"
    }
  }

  setFile($event:any){
    this.file = $event
  }

  uploadImageProfile($event:any){
    this.userService.uploadImageProfile($event, this.uid)
  }

  goHome(){
    this.router.navigate(['/home']);
  }
}
