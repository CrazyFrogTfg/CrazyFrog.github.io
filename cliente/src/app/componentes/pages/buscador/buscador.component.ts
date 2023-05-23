import { Component, inject } from '@angular/core';
import { Artista } from '../../../interfaces/artista.interface'
import { FireStorageService } from 'src/app/servicios/fire-storage.service';
import { DbService } from 'src/app/servicios/db.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Router } from '@angular/router';
import { Title} from '@angular/platform-browser';

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
  paginator:number=0

  constructor(private db:DbService,
              private fireStorage:FireStorageService,
              private userService:UsuariosService,
              private router:Router,
              private title:Title){ title.setTitle('Mediafrog - Buscador')}

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


  // increasePaginator() {
  //   const filteredArtistas:any = this.artistas | byName:getFilterName();
  //   const totalPages = Math.ceil(filteredArtistas.length / 3);
  //   if (this.paginator < totalPages - 1) {
  //     this.paginator += 1;
  //   }
  //   console.log("paginator: " + this.paginator);
  //   console.log("totalPages: " + totalPages);
  // }
  // decreasePaginator() {
  //   if (this.paginator > 0) {
  //     this.paginator -= 1;
  //   }

  increasePaginator(){
    if(this.artistas.length>3 && this.paginator+1<this.artistas.length-3)
    {
      console.log("artistas length: "+this.artistas.length)
      this.paginator= this.paginator+3
    }
    console.log("paginator: "+this.paginator)
    console.log("artistas length: "+this.artistas.length)
  }

  decreasePaginator(){
    if(this.paginator+1>3)
    this.paginator= this.paginator-3
    console.log("paginator: "+this.paginator)

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
  newArtista(){
    this.router.navigate(['/newartist']);
  }
}
