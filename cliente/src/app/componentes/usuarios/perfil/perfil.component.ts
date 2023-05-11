import { Component } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {

  userInfo:any
  email:string = ""
  username:string = ""
  password:string = ""
  imageProfile:string = ""
  images:string[]

  constructor(private userService:UsuariosService,
              private storage:Storage){
                this.images = [];
              }

  async ngOnInit() {
    this.userInfo = await this.userService.getUserInfo()
    this.email = this.userInfo.email
    this.username = this.userInfo.username
    this.password = this.userInfo.password
    this.imageProfile = await this.userService.getImageProfile(this.username)
  }

  uploadImageProfile($event:any){
    this.userService.uploadImageProfile($event, this.username)
  }
}
