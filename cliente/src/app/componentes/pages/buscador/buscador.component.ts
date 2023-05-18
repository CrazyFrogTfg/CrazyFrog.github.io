import { Component, inject } from '@angular/core';
import { Artista } from '../../../interfaces/artista.interface'
import { FireStorageService } from 'src/app/servicios/fire-storage.service';
import { DbService } from 'src/app/servicios/db.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Router } from '@angular/router';

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
  isAdmin:boolean = false
  userInfo:any

  constructor(private db:DbService,
              private fireStorage:FireStorageService,
              private userService:UsuariosService,
              private router:Router){ }

  async ngOnInit(){
      this.db.getArtistas().subscribe(artistas =>{
      this.artistas = artistas
    })
    this.userInfo = await this.userService.getUserInfo()
    if(this.userInfo.admin) this.isAdmin = true
  }

  // getAlbumes(artista:Artista){
  //   this.albumes = this.db.getAlbumes(artista)
  // }

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
  newArtista(){
    this.router.navigate(['/newartist']);
  }
}
