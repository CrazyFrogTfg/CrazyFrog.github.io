import { Component, Input, EventEmitter, Output } from '@angular/core';
import { DbService } from 'src/app/servicios/db.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-tarjeta-cancion',
  templateUrl: './tarjeta-cancion.component.html',
  styleUrls: ['./tarjeta-cancion.component.css']
})
export class TarjetaCancionComponent {
@Input() song:any
@Output() messageEvent = new EventEmitter<string>();

  reproduciendo:string = ""
  userUID:any
  playlists:any

  constructor(private userService:UsuariosService, private db:DbService){}

  async ngOnInit(){
    this.userUID = await this.userService.getUID()
    this.playlists = await this.db.getPlaylistByUser(this.userUID)
  }

reproducir(song:string){
  this.reproduciendo = song
  this.messageEvent.emit(this.reproduciendo);
}
}
