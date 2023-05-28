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
@Output() sendSong = new EventEmitter<any>();
@Output() sendLyrics = new EventEmitter<any>();

  reproduciendo:string = ""
  userUID:any
  edit:boolean=false
  updateSong:FormGroup
  userInfo:any
  isAdmin:boolean=false
  urlPlaylist:boolean=false
  letraPrueba:string="letraPrueba"

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

  ngAfterViewInit()
  {
    if(this.router.url.includes("playlist"))
    this.urlPlaylist=true
  }

  reproducir(song:any){
    this.reproduciendo = song
    this.sendLyrics.emit(this.song.lyrics)
    this.sendSong.emit(this.reproduciendo);
  }

  addSongToPlaylist(playlist:Playlist){
    this.db.addSongToPlaylist(playlist, this.song)
  }

  deleteSongPlaylist(playlist:Playlist)
  {
    console.log("deleteSongPlaylist (tarjetaCancion.ts) - playlist: ")
    console.log(playlist)
    console.log(this.song)
    this.db.deleteSongPlaylist(playlist, this.song)
    console.log("deleteSongPlaylist (tarjetaCancion.ts) - FIN")
    location.reload()
    //this.router.navigate(['/buscador'])
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
    this.db.deleteSong(this.song)
    this.router.navigate(['/buscador'])
  }

}
