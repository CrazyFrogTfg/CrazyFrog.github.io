import { Component, inject } from '@angular/core';
import { ArtistasService } from 'src/app/servicios/artistas.service';
import { Artista } from '../../interfaces/artista.interface'
import { FireStorageService } from 'src/app/servicios/fire-storage.service';

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

  constructor(private artistaService:ArtistasService,
              private fireStorage:FireStorageService){ }
  
  ngOnInit():void{
      this.artistaService.getArtistas().subscribe(artistas =>{
      console.log(artistas)
      this.artistas = artistas
    })
  }

  getFilterName():string{
    return this.fireStorage.getFilterName()
  }
  
  setFilterName(search:string){
    this.fireStorage.setFilterName(search)
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
