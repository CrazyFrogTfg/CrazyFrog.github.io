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
@Input() playlist:any
@Output() sendSong = new EventEmitter<any>();
@Output() sendLyrics = new EventEmitter<any>();
@Output() sendSongOrder = new EventEmitter<any>();

  reproduciendo:string = ""
  userUID:any
  edit:boolean=false
  updateSong:FormGroup
  userInfo:any
  isAdmin:boolean=false
  urlPlaylist:boolean=false
  urlAlbum:boolean=false
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
    this.db.getPlaylistByUser(this.userUID).subscribe(playlists =>{
      this.playlists = playlists
    })

  }

  ngAfterViewInit()
  {
    if(this.router.url.includes("playlist"))
    this.urlPlaylist=true
    if(this.router.url.includes("album"))
    this.urlAlbum=true
  }

  reproducir(){
    if(this.urlAlbum)
    {
      //Reproducir como playlist
      console.log("estas en playlist o en det album")
      this.sendSongOrder.emit(this.song.order-1);
    }else{
      if(this.urlPlaylist)
      {
        this.sendSong.emit(this.song);

      }else{
        //Reproducir como cancion
        console.log(this.song)
        this.reproduciendo = this.song
        this.sendLyrics.emit(this.song.lyrics)
        this.sendSong.emit(this.song);

      }
    }
  }

  addSongToPlaylist(playlist:Playlist){
    this.db.addSongToPlaylist(playlist, this.song)
  }

  deleteSongPlaylist()
  {
    this.db.deleteSongPlaylist(this.playlist, this.song.id)
    console.log(this.playlist, this.song.id)
    console.log("deleteSongPlaylist (tarjetaCancion.ts) - FIN")
    // location.reload()
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
