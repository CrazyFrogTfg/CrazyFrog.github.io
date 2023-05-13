import { Component } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {

  userInfo:any
  email:string = ""
  uid:any
  username:string = ""
  password:string = ""
  imageProfile:string = ""
  images:string[]
  updateUser: FormGroup;

  constructor(private userService:UsuariosService, private storage:Storage, private router:Router){
    this.images = [];
    this.updateUser = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
      username:new FormControl(),
      imageProfile: new FormControl()
    })
  }

  async ngOnInit() {
    this.userInfo = await this.userService.getUserInfo()
    this.uid = await this.userService.getUID()
    this.email = this.userInfo.email
    this.username = this.userInfo.username
    this.password = this.userInfo.password
    this.imageProfile = await this.userInfo.imageProfile.split("\\").pop();
    console.log(this.imageProfile)
    this.getImageProfile()
  }

  onSubmit(){
    this.userService.updateUserDb(this.uid, this.updateUser.value)
    this.router.navigate(['/home']);
  }

  async getImageProfile()
  {
    this.imageProfile = await this.userService.getImageProfile(this.userInfo.username)
    console.log(this.imageProfile)
    return this.imageProfile
  }

  uploadImageProfile($event:any){
    this.userService.uploadImageProfile($event, this.userInfo)
  }
}
