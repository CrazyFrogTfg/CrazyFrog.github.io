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

  constructor(private route: ActivatedRoute,private router:Router,private firestore: Firestore,private userService:UsuariosService, private fireStorage:FireStorageService){}
  playlistId:string = ""
  playlistInfo:any = []
  canciones: Cancion[] = []
  reproduciendo:string = ""

  async ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      //sacar parametros url
      this.playlistId = params['idPlaylist']
      //sacar datos playlist
      const playlistRef = doc(this.firestore, "playlists", this.playlistId);
      const playlistSnap = await getDoc(playlistRef);
      this.playlistInfo = playlistSnap.data();
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

}