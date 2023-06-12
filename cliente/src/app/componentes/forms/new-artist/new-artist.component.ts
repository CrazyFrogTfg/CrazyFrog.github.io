import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Album } from 'src/app/interfaces/album.interface';
import { DbService } from 'src/app/servicios/db.service';
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
  createError:boolean=false

  constructor(private router:Router, private db:DbService, private fb:FormBuilder, private title:Title){
    title.setTitle('Mediafroggy - Nuevo Artista')
    this.newArtist = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
    })
  }

  goBack(){
    this.router.navigate(['/buscador']);
  }

  async onSubmit(){
    if(this.newArtist.invalid) {
      return Object.values(this.newArtist.controls).forEach( control=>{
        control.markAllAsTouched()
      })
    } else if(this.newArtist.valid && this.file) {
      let created:boolean = false
      created = await this.db.addArtist(this.newArtist.value, this.file)
      if(created){
        this.router.navigate(['/buscador'])
      }
      else this .createError=true
    }
  }

  get nameInvalid(){
    return this.newArtist.get('name')?.invalid && this.newArtist.get('name')?.touched
  }

  get descriptionInvalid(){
    return this.newArtist.get('description')?.invalid && this.newArtist.get('description')?.touched
  }

  setFile($event:any){
    this.file = $event
    this.isFile = true
  }

  closeModalError()
  {
    this.createError=false
  }
}
