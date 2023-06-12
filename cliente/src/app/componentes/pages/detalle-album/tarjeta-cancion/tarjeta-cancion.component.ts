import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

  userUID:any
  edit:boolean=false
  updateSong:FormGroup
  userInfo:any
  isAdmin:boolean=false
  urlPlaylist:boolean=false
  urlAlbum:boolean=false
  artistName:string = ""
  deletePrompt:boolean = false
  formDelete: FormGroup;

  constructor(private userService:UsuariosService, private db:DbService, private router:Router, private fb:FormBuilder){
    this.updateSong = this.fb.group({
      name: ['', [Validators.minLength(3), Validators.maxLength(20)]],
      lyrics: new FormControl(),
    })
    this.formDelete = new FormGroup({
      prompt: new FormControl(),
    })
  }
  get nameInvalid(){
    return this.updateSong.get('name')?.invalid && this.updateSong.get('name')?.touched
  }

  async ngOnInit(){
    this.userInfo = await this.userService.getUserInfo()
      if(this.userInfo.admin) this.isAdmin = true
    this.userUID = await this.userService.getUID()
    this.db.getPlaylistByUser(this.userUID).subscribe(playlists =>{
      this.playlists = playlists
    })
    this.artistName = await this.db.getArtistByUID(this.song.artistId)
    this.updateSong.controls['lyrics'].setValue(this.song.lyrics)
  }

  ngAfterViewInit()
  {
    if(this.router.url.includes("playlist"))
    this.urlPlaylist=true
    if(this.router.url.includes("album"))
    this.urlAlbum=true
  }

  reproduce(){
   this.sendSong.emit(this.song);
  }

  addSongToPlaylist(playlist:Playlist){
    this.db.addSongToPlaylist(playlist, this.song)
  }

  deleteSongPlaylist()
  {
    this.db.deleteSongPlaylist(this.playlist, this.song.id)
  }

  toggleEdit(){
    this.edit = !this.edit
  }

  async onSubmit()
  {
    if(this.updateSong.value)
      {
        await this.db.updateSong(this.updateSong.value, this.song);
        window.location.reload()
      }
  }

  deleteSong() {
    this.db.deleteSong(this.song)
    setTimeout(() => {
      window.location.reload()
    }, 500);
  }

  deleteQuestion(){
    this.deletePrompt = true;
  }

  checkDeleteName(){
    const promptControl = this.formDelete.get('prompt');
    if (promptControl) {
      if(promptControl.value == this.song.name){
        this.deleteSong()
      }
    }
  }

  closeModalError(){
    this.deletePrompt=false
  }


}
