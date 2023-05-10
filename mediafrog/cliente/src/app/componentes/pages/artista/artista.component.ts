import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import Artista from '../../../interfaces/artista.interface'
import Album from '../../../interfaces/album.interface'
import Cancion from '../../../interfaces/cancion.interface'
import { ArtistasService } from 'src/app/servicios/artistas.service';

@Component({
  selector: 'app-artista',
  templateUrl: './artista.component.html',
  styleUrls: ['./artista.component.css']
})
export class ArtistaComponent {

  formulario: FormGroup

  constructor(private artistaService: ArtistasService){
  this.formulario = new FormGroup(
  {
    nombre: new FormControl(),
    descripcion:new FormControl(),
  })

    onSubmit() {
      console.log(this.formulario.value)
      this.artistaService.addArtista(this.formulario.value)
    }
  }

}
