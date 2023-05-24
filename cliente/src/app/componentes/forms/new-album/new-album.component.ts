import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from 'src/app/servicios/db.service';
import { FireStorageService } from 'src/app/servicios/fire-storage.service';
import { Firestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { Album } from 'src/app/interfaces/album.interface';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Title} from '@angular/platform-browser';

@Component({
  selector: 'app-new-album',
  templateUrl: './new-album.component.html',
  styleUrls: ['./new-album.component.css']
})
export class NewAlbumComponent {

  newAlbum:FormGroup
  myEvent:any
  userInfo:any
  isAdmin:boolean = false;
  artistId:string="";
  currentYear:number = 2023


  constructor(private firestore:Firestore, private route:ActivatedRoute,
    private userService:UsuariosService, private router:Router, private db:DbService,
    private fireStorage:FireStorageService, private title:Title) { title.setTitle('Mediafrog - Nuevo Album')

    this.newAlbum = new FormGroup({
      name: new FormControl(),
      year: new FormControl(),
      image: new FormControl(),
      artisId: new FormControl(),
    })
  }

  async ngOnInit() {
    this.userInfo = await this.userService.getUserInfo()
    if(this.userInfo.admin) this.isAdmin = true
    this.route.queryParams.subscribe(async params => {
      this.artistId = params['artistId']
    });
    this.newAlbum.controls['artistId'].setValue(this.artistId)
  }

  goHome(){
    this.router.navigate(['/home']);
  }

  async onSubmit(){
    if(this.artistId && this.newAlbum.value)
    {
      await this.db.addAlbum(this.artistId, this.newAlbum.value)
      if(this.myEvent)
      {
        const aid = await this.db.getAlbumUIDByArtistaIdyNombre(this.artistId, this.newAlbum.value.name)
        this.uploadImageAlbum(this.myEvent, this.artistId, this.newAlbum.value, aid)
      }
      setTimeout( () => this.router.navigate(['/artista'], { queryParams: { id: this.artistId} }), 1200)
    }
  }

  uploadImageAlbum($event:any, artistId:string, albumName:Album, aid:string){
    this.fireStorage.uploadImageAlbum($event, artistId, albumName.name, aid)
  }

  setMyEvent($event:any){
    this.myEvent = $event
  }

}
