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
  file:any
  albumes:Album[]=[]
  isFile:boolean = false

  constructor(private router:Router, private db:DbService, private fireStorage:FireStorageService, private title:Title){
    title.setTitle('Mediafrog - New Artist')
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
    if(this.newArtist.value && this.file)
    {
      await this.db.addArtist(this.newArtist.value, this.file)
      this.router.navigate(['/buscador'])
    }
  }

  setFile($event:any){
    this.file = $event
    this.isFile = true
  }
}
