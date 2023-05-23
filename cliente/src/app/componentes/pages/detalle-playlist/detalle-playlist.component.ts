import { Component } from '@angular/core';
import { FireStorageService } from 'src/app/servicios/fire-storage.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { ActivatedRoute } from '@angular/router';
import { Cancion } from 'src/app/interfaces/cancion.interface';



@Component({
  selector: 'app-detalle-playlist',
  templateUrl: './detalle-playlist.component.html',
  styleUrls: ['./detalle-playlist.component.css']
})
export class DetallePlaylistComponent {

  playlistId:string = ""
  playlistInfo:any = []
  canciones: Cancion[] = []
  reproduciendo:string = ""
  propietario:string = ""
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
      const userRef = doc(this.firestore, "users", this.playlistInfo.propietario);
      const userSnap = await getDoc(userRef);
      this.propietario = userSnap.data()?.['username'];
      this.imageOwner = userSnap.data()?.['imageProfile'];
      const cancionesRef = collection(this.firestore, "playlists", this.playlistId, "canciones");
      const cancionesSnapshot = await getDocs(cancionesRef);
        cancionesSnapshot.forEach((cancionDoc) => {
          const cancion = {
            nombre: cancionDoc.data()['nombre'],
            orden: cancionDoc.data()['orden'],
            letra: cancionDoc.data()['letra'],
            archivo: cancionDoc.data()['archivo'],
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
    if(await this.userService.getUID() == this.playlistInfo.propietario){
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
