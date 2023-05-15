import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
// import { Artista } from '../../../interfaces/artista.interface'
// import { Album } from '../../../interfaces/album.interface'
// import { Cancion } from '../../../interfaces/cancion.interface'
import { Input } from '@angular/core';
import { Storage } from '@angular/fire/storage';
import { DbService } from 'src/app/servicios/db.service';
import { Router } from '@angular/router';
// import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';
// import { delay } from 'rxjs';


@Component({
  selector: 'app-artista',
  templateUrl: './artista.component.html',
  styleUrls: ['./artista.component.css']
})
export class ArtistaComponent {
@Input() artista:any;
  //imageArtist:string=""
  formulario: FormGroup


  constructor(private db: DbService, private storage:Storage, private router:Router){
  this.formulario = new FormGroup({
    nombre: new FormControl(),
    descripcion:new FormControl()
    })
  }

  ngOnInit(){
    }

  async onSubmit() {
    console.log(this.formulario.value)
    const response = await this.db.addArtista(this.formulario.value)
    console.log(response)
  }

  verDetalles(artista: any) {
    const idSinEspacios = artista.nombre.replace(/\s/g, '%');
    this.router.navigate(['/artista'], { queryParams: { id: idSinEspacios } });
  }

  //PRUEBAS PARA PODER MOSTRAR IMAGEN DEL ARTISTA. ME TENGO QUE IR, COMMITEO.


  /*getImageArtist(artistName:any){
    this.setImageArtist(artistName)
    return this.imageArtist
  }

  setImageArtist(artistName:string)
  {
    const imagesRef = ref(this.storage, `artists/${artistName}`)
    listAll(imagesRef)
    .then(async response =>{
      console.log(response)

      for(let item of response.items){
        this.imageArtist = await getDownloadURL(item);
      }
    })
    .catch(error => console.log(error))
  }

  uploadImageArtist($event:any){
    const file = $event.target.files[0];
    console.log("file uploading: " + file)
    const fileRef = ref(this.storage, `artists/${this.artista.name}/imageArtist`)

    uploadBytes(fileRef, file)
    .then(response =>{
    console.log(response);
    })
    .catch(error => console.log(error));
  }

  async onClickDelete(artista:Artista){
    const response = await this.db.deleteArtista(artista)
    console.log(response)
  }

  */

}


