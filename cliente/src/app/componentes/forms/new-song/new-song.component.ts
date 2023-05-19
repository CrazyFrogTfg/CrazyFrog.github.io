import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { DbService } from 'src/app/servicios/db.service';
import { FireStorageService } from 'src/app/servicios/fire-storage.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-new-song',
  templateUrl: './new-song.component.html',
  styleUrls: ['./new-song.component.css']
})
export class NewSongComponent {

  newSong: FormGroup;
  userInfo:any
  propietario:string = '';
  artistaId:string=""
  albumId:string=""
  isAdmin:boolean = false;
  myEvent:any

  async ngOnInit() {
    this.userInfo = await this.userService.getUserInfo()
    if(this.userInfo.admin) this.isAdmin = true
    await this.route.queryParams.subscribe(async params => {
      this.artistaId = params['artistaId']
      this.albumId = params['albumId']
    })
  }

  constructor(private router: Router, private userService:UsuariosService, private db:DbService, private title:Title, private route:ActivatedRoute, private fireStorage:FireStorageService) {
     title.setTitle('Mediafrog-Nueva Cancion')
    this.newSong = new FormGroup({
      nombre: new FormControl(),
      orden: new FormControl(),
      letra: new FormControl()
    })
  }

  goHome(){
    this.router.navigate(['/home']);
  }

  setMyEvent($event:any){
    this.myEvent = $event
  }

  // uploadImageSong($event:any, artistId:string, albumId:string, aid:string){
  //   this.fireStorage.uploadImageSong($event, artistId, albumId, aid)
  // }

  async onSubmit(){
    await this.db.addSong(this.artistaId, this.albumId, this.newSong.value)
    this.router.navigate(['/home']);
  }

}
