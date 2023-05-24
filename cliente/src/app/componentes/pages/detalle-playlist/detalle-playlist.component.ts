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
  canciones: Song[] = []
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
      const cancionesRef = collection(this.firestore, "playlists", this.playlistId, "canciones");
      const cancionesSnapshot = await getDocs(cancionesRef);
        cancionesSnapshot.forEach((cancionDoc) => {
          const cancion = {
            name: cancionDoc.data()['name'],
            order: cancionDoc.data()['order'],
            lyrics: cancionDoc.data()['lyrics'],
            file: cancionDoc.data()['file'],
            albumId : cancionDoc.data()['albumId']
          }; console.log(cancion)
          this.canciones.push(cancion);
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
