import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Artista } from '../../../interfaces/artista.interface'
import { Album } from '../../../interfaces/album.interface'
import { Cancion } from '../../../interfaces/cancion.interface'
import { ArtistasService } from 'src/app/servicios/artistas.service';
import { Input } from '@angular/core';
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';


@Component({
  selector: 'app-artista',
  templateUrl: './artista.component.html',
  styleUrls: ['./artista.component.css']
})
export class ArtistaComponent {
@Input() artista:any;
  imageArtist:string=""
  formulario: FormGroup
  

  constructor(private artistaService: ArtistasService,
              private storage:Storage){
  this.formulario = new FormGroup({
    nombre: new FormControl(),
    descripcion:new FormControl()
    })
  }
  ngOnInit(){
    }

  async onSubmit() {
    console.log(this.formulario.value)
    const response = await this.artistaService.addArtista(this.formulario.value)
    console.log(response)
  }

  //PRUEBAS PARA PODER MOSTRAR IMAGEN DEL ARTISTA. ME TENGO QUE IR, COMMITEO.

  getimageArtist(artistName:string)
  {
    const imagesRef = ref(this.storage, `${artistName}`)
    listAll(imagesRef)
    .then(async response =>{
      console.log(response)

      for(let item of response.items){
        this.imageArtist = await getDownloadURL(item);
      }
    })
    .catch(error => console.log(error))
  }

  uploadimageArtist($event:any){
    const file = $event.target.files[0];
    console.log("file uploading: " + file)
    const fileRef = ref(this.storage, `${this.artista.name}/imageArtist`)

    uploadBytes(fileRef, file)
    .then(response =>{
    console.log(response);
    })
    .catch(error => console.log(error));
  }

}


