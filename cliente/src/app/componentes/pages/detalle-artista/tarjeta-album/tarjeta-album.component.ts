import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/servicios/db.service';
import { FormControl, FormGroup } from '@angular/forms';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Album } from 'src/app/interfaces/album.interface';


@Component({
  selector: 'app-tarjeta-album',
  templateUrl: './tarjeta-album.component.html',
  styleUrls: ['./tarjeta-album.component.css']
})
export class TarjetaAlbumComponent {
@Input() album:any

edit:boolean=false
updateAlbum:FormGroup
myEvent:any
isAdmin:boolean = false
userInfo:any


constructor(private db:DbService, private router:Router, private userService:UsuariosService){
  this.updateAlbum = new FormGroup({
    id: new FormControl(),
    nombre: new FormControl(),
    año: new FormControl(),
  })
}

async ngOnInit()
{
  this.userInfo = await this.userService.getUserInfo()
  if(this.userInfo.admin) this.isAdmin = true
  setTimeout( () => undefined, 2000)
}

onSubmit(){
}

toggleEdit(){
  this.edit = !this.edit
}

setMyEvent($event:any){
  this.myEvent = $event
}
//POR EDITAR
async deleteAlbum(album:Album){
  console.log("Recuerda volver a deleteAlbum() de tarjetaAlbum")
  const pregunta="Si deseas eliminar "+album.nombre+" escribe su nombre aquí";
  // if( prompt(pregunta) == album.nombre)
  // {
    this.db.deleteAlbum(album.id)
    //this.router.navigate(['/buscador']);
  //}
}

async verDetalles(album: any) {
  this.router.navigate(['/album'], { queryParams: { id: album.id } });
}

}
