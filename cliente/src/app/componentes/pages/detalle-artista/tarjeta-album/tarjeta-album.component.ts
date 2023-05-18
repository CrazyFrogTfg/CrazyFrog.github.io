import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/servicios/db.service';
import { FormControl, FormGroup } from '@angular/forms';
import { UsuariosService } from 'src/app/servicios/usuarios.service';


@Component({
  selector: 'app-tarjeta-album',
  templateUrl: './tarjeta-album.component.html',
  styleUrls: ['./tarjeta-album.component.css']
})
export class TarjetaAlbumComponent {
@Input() album:any
@Input() artista:any

edit:boolean=false
updateAlbum:FormGroup
myEvent:any
isAdmin:boolean = false
userInfo:any


constructor(private db:DbService, private router:Router, private userService:UsuariosService){
  this.updateAlbum = new FormGroup({
    id: new FormControl(),
    nombre: new FormControl(),
    anyo: new FormControl(),
  })
}

async ngOnInit()
{
  this.userInfo = await this.userService.getUserInfo()
  if(this.userInfo.admin) this.isAdmin = true
  setTimeout( () => undefined, 2000)
}
// async verDetalles(artista: any) {
//   let uid = await this.db.getArtistaUID(artista)
//   this.router.navigate(['/artista'], { queryParams: { id: uid} });
// }

onSubmit(){

}

toggleEdit(){
  this.edit = !this.edit
}

setMyEvent($event:any){
  this.myEvent = $event
}
//POR EDITAR
async deleteAlbum(artistaInfo: any){
  const pregunta="Si deseas eliminar "+artistaInfo.nombre+" escribe su nombre aquí";
  if( prompt(pregunta) == artistaInfo.nombre)
  {
    let uid = await this.db.getArtistaUID(artistaInfo)
    this.db.deleteArtist(uid)
    this.router.navigate(['/buscador']);
  }
}

async verDetalles(album: any) {
  this.router.navigate(['/album'], { queryParams: { idArtista: this.artista, idAlbum: album.id } });
}

}
