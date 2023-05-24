import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Album } from 'src/app/interfaces/album.interface';
import { Artist } from 'src/app/interfaces/artist.interface';
import { DbService } from 'src/app/servicios/db.service';
import { FireStorageService } from 'src/app/servicios/fire-storage.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-new-artist',
  templateUrl: './new-artist.component.html',
  styleUrls: ['./new-artist.component.css']
})
export class NewArtistComponent {

  newArtist:FormGroup
  myEvent:any
  albumes:Album[]=[]

  constructor(private router:Router, private db:DbService, private fireStorage:FireStorageService, private title:Title){
    title.setTitle('Mediafrog - Nuevo Artista')
    this.newArtist = new FormGroup({
      name: new FormControl(),
      description: new FormControl(),
      image: new FormControl(),
    })
  }

  goHome(){
    this.router.navigate(['/home']);
  }

  async onSubmit(){
    if(this.newArtist.value)
    {
      await this.db.addArtist(this.newArtist.value)

      if(this.myEvent)
      {
        const aid = await this.db.getArtistUIDByName(this.newArtist.value.name)
        console.log(aid)
        this.uploadImageArtist(this.myEvent, aid)
      }
      setTimeout(() => this.router.navigate(['/home']), 2000)
    }
  }

  uploadImageArtist($event:any, artist:string){
    this.fireStorage.uploadImageArtist($event, artist)
  }

  setMyEvent($event:any){
    this.myEvent = $event
  }
}
