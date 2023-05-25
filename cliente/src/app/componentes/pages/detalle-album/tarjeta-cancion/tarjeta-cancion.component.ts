import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Playlist } from 'src/app/interfaces/playlist.interface';
import { DbService } from 'src/app/servicios/db.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-tarjeta-cancion',
  templateUrl: './tarjeta-cancion.component.html',
  styleUrls: ['./tarjeta-cancion.component.css']
})
export class TarjetaCancionComponent {
@Input() song:any
@Input() playlists:any
@Output() messageEvent = new EventEmitter<string>();

  reproduciendo:string = ""
  userUID:any
  edit:boolean=false
  updateSong:FormGroup
  userInfo:any
  isAdmin:boolean=false

  constructor(private userService:UsuariosService, private db:DbService, private router:Router){
    this.updateSong = new FormGroup({
      name: new FormControl(),
    })
  }

async ngOnInit(){
  this.userInfo = await this.userService.getUserInfo()
    if(this.userInfo.admin) this.isAdmin = true
  this.userUID = await this.userService.getUID()
}

reproducir(song:string){
  this.reproduciendo = song
  this.messageEvent.emit(this.reproduciendo);
}

addSongToPlaylist(playlist:Playlist){
  this.db.addSongToPlaylist(playlist, this.song)
}

toggleEdit(){
  this.edit = !this.edit
}

async onSubmit()
{
  if(this.updateSong.value)
    {
      console.log("Controlar error de año, que puede ser mayor a la fecha actual")
      await this.db.updateSong(this.updateSong.value, this.song);
      this.router.navigate(['/home'])
    }
}

deleteSong()
{
  this.db.deleteSong(this.song.id)
  this.router.navigate(['/buscador'])
}

}
