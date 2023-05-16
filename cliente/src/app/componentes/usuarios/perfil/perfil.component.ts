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

  userInfo:any;
  uid:any;
  imageProfile:string = "";
  myEvent:any;
  updateUser: FormGroup;

  constructor(private userService:UsuariosService, private storage:Storage, private router:Router){
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
    this.getImageProfile()
  }

  async onSubmit() {
    if(this.updateUser)
    {
      await this.userService.updateUserDb(this.uid, this.updateUser.value, this.userInfo);
      if(this.myEvent)
      {
        this.uploadImageProfile(this.myEvent)
      }
      //this.userService.logout();
      setTimeout(() => this.router.navigate(['/home']), 2000)
      
    }
  }

  setMyEvent($event:any){
    console.log($event)
    this.myEvent = $event
  }

  async getImageProfile()
  {
    this.imageProfile = await this.userService.getImageProfile(this.uid)
    console.log(this.imageProfile)
    return this.imageProfile
  }

  uploadImageProfile($event:any){
    this.userService.uploadImageProfile($event, this.uid)
  }
}
