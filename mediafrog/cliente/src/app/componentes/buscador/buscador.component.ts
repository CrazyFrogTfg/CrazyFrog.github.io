import { Component, inject } from '@angular/core';
import { ArtistasService } from 'src/app/servicios/artistas.service';
import { Artista } from '../../interfaces/artista.interface'

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent {

  cboxArtista:boolean=true
  cboxAlbum:boolean=true
  cboxCancion:boolean=true
  artistas:any

  constructor(private artistaService:ArtistasService){ }
  
  ngOnInit():void{
      this.artistaService.getArtistas().subscribe(artistas =>{
      console.log(artistas)
      this.artistas = artistas
    })
  }

  getArtistas():any{
    return this.artistas = this.artistaService.getArtistas()
  }

  toogleCboxArtista(){
    return this.cboxArtista = !this.cboxArtista
  }
  toogleCboxAlbum(){
    this.cboxAlbum = !this.cboxAlbum
  }
  toogleCboxCancion(){
    this.cboxCancion = !this.cboxCancion
  }
}
