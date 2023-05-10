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
  imageProfile:string=""
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
    this.getImageProfile()
  }

  getImageProfile()
  {
    const imagesRef = ref(this.storage, `${this.username}`)
    listAll(imagesRef)
    .then(async response =>{
      console.log(response)

      for(let item of response.items){
        this.imageProfile = await getDownloadURL(item);
      }
    })
    .catch(error => console.log(error))
  }

  uploadImageProfile($event:any){
    const file = $event.target.files[0];
    console.log("file uploading: " + file)
    const fileRef = ref(this.storage, `${this.username}/imageProfile`)

    uploadBytes(fileRef, file)
    .then(response =>{
    console.log(response);
    this.getImageProfile()
    })
    .catch(error => console.log(error));
  }
}
