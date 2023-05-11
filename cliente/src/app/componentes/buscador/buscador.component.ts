import { Component, inject } from '@angular/core';
import { Artista } from '../../interfaces/artista.interface'
import { FireStorageService } from 'src/app/servicios/fire-storage.service';
import { DbService } from 'src/app/servicios/db.service';

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

  constructor(private db:DbService,
              private fireStorage:FireStorageService){ }

  ngOnInit():void{
      this.db.getArtistas().subscribe(artistas =>{
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
    return this.artistas = this.db.getArtistas()
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
