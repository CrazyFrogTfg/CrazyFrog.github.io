import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FireStorageService } from 'src/app/servicios/fire-storage.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { ActivatedRoute } from '@angular/router';
import { Song } from 'src/app/interfaces/song.interface';
import { DbService } from 'src/app/servicios/db.service';
import { FormControl, FormGroup } from '@angular/forms';
import { TarjetaCancionComponent } from '../detalle-album/tarjeta-cancion/tarjeta-cancion.component';
import { ReproductorService } from 'src/app/servicios/reproductor.service';


@Component({
  selector: 'app-detalle-playlist',
  templateUrl: './detalle-playlist.component.html',
  styleUrls: ['./detalle-playlist.component.css']
})
export class DetallePlaylistComponent {
  @Output() messageEvent = new EventEmitter<any>();
  @ViewChild(TarjetaCancionComponent) cancion:any

  playlistId:string = ""
  playlistInfo:any = []
  songs: Song[] = []
  sendedSong:any
  owner:string = ""
  imageOwner:string = ""
  isVisible:boolean = false
  query:string=""
  playlists:any
  userUID:string = ""
  edit:boolean=false
  updatePlaylist:FormGroup
  privateChecked:boolean=false
  obtainedLyrics:string="¿Aún no has seleccionado ninguna canción? ¡Clica en su título!"

  constructor(private route: ActivatedRoute,private router:Router,
    private firestore: Firestore,private userService:UsuariosService,
    private fireStorage:FireStorageService, private db:DbService, private reproductorService:ReproductorService){
      this.updatePlaylist = new FormGroup({
        name: new FormControl(),
        private: new FormControl(),
      })
    }

  async ngOnInit() {
    this.userUID = await this.userService.getUID()
    this.playlists = this.db.getPlaylistByUser(this.userUID)  
    console.log(this.playlists)
    this.route.queryParams.subscribe(async params => {
      //sacar parametros url
      this.playlistId = params['idPlaylist']
      //sacar datos playlist
      const playlistRef = doc(this.firestore, "playlists", this.playlistId);
      const playlistSnap = await getDoc(playlistRef);
      this.playlistInfo = playlistSnap.data();
      this.playlistInfo.id = this.playlistId
      this.privateChecked=this.playlistInfo.private
      const userRef = doc(this.firestore, "users", this.playlistInfo.owner);
      const userSnap = await getDoc(userRef);
      this.owner = userSnap.data()?.['username'];
      this.imageOwner = userSnap.data()?.['imageProfile'];
      const songsRef = collection(this.firestore, "playlists", this.playlistId, "songs");
      const songsSnapshot = await getDocs(songsRef);
        songsSnapshot.forEach((songDoc) => {
          const song = {
            id: songDoc.id,
            name: songDoc.data()['name'],
            order: songDoc.data()['order'],
            lyrics: songDoc.data()['lyrics'],
            file: songDoc.data()['file'],
            albumId : songDoc.data()['albumId'],
            artistId : songDoc.data()['artistId'],
          };
          this.songs.push(song);
        });
      });
      await this.visibility()
  }

  async onSubmit(){
    if(this.updatePlaylist.value)
    {
      await this.db.updatePlaylist(this.updatePlaylist.value, this.playlistInfo)
      location.reload();
    }
  }

  obtainLyrics(lyrics:string){
    this.obtainedLyrics=lyrics.replace(/&#10;/g, '\n');
  }

  getFilterName():string{
    return this.fireStorage.getFilterName()
  }
  setFilterName(search:string){
    this.fireStorage.setFilterName(search)
  }
  receiveSong($event:any) {
    this.sendedSong = $event;
    this.reproducePlaylist()
  }

  async visibility(){
    if(await this.userService.getUID() == this.playlistInfo.owner){
      this.isVisible = true
    } else {
      if(this.playlistInfo.privada == false){
        this.isVisible = true
      } else {
        this.isVisible = false
      }
    }
  }

  toggleEdit(){
    this.edit = !this.edit
  }

  reproducePlaylist()
  {
    const index = this.songs.findIndex(song => song.name === this.sendedSong.name);
    this.reproductorService.reproducePlaylist(this.songs, index)
  }

  reproducirPlaylist(){
    console.log("click en nombre playlist. Pero no se envia al servicio")
    console.log(this.songs)
    window.confirm("linea 124 detPlaylist.ts: Linea siguiente no estaba, no enviaba nada al service. Tengo que cortar vuelvo luego")
    this.reproductorService.reproducePlaylist(this.songs, this.sendedSong)
    this.messageEvent.emit(this.songs);
  }

}
