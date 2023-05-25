import { Component } from '@angular/core';
import { FireStorageService } from 'src/app/servicios/fire-storage.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { ActivatedRoute } from '@angular/router';
import { Song } from 'src/app/interfaces/song.interface';



@Component({
  selector: 'app-detalle-playlist',
  templateUrl: './detalle-playlist.component.html',
  styleUrls: ['./detalle-playlist.component.css']
})
export class DetallePlaylistComponent {

  playlistId:string = ""
  playlistInfo:any = []
  songs: Song[] = []
  reproduciendo:string = ""
  owner:string = ""
  imageOwner:string = ""
  isVisible:boolean = false
  query:string=""

  constructor(private route: ActivatedRoute,private router:Router,private firestore: Firestore,private userService:UsuariosService, private fireStorage:FireStorageService){}

  async ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      //sacar parametros url
      this.playlistId = params['idPlaylist']
      //sacar datos playlist
      const playlistRef = doc(this.firestore, "playlists", this.playlistId);
      const playlistSnap = await getDoc(playlistRef);
      this.playlistInfo = playlistSnap.data();
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
            albumId : songDoc.data()['albumId']
          }; console.log(song)
          this.songs.push(song);
        });
      });
      await this.visibility()
  }

  getFilterName():string{
    return this.fireStorage.getFilterName()
  }
  setFilterName(search:string){
    this.fireStorage.setFilterName(search)
  }
  receiveMessage($event:any) {
    this.reproduciendo = $event;
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

}
