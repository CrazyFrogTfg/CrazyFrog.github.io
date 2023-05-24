import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, collection, doc, getDocs, getDoc, query} from '@angular/fire/firestore';
import { Song } from 'src/app/interfaces/song.interface';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { DbService } from 'src/app/servicios/db.service';
import { FormControl, FormGroup } from '@angular/forms';
import { FireStorageService } from 'src/app/servicios/fire-storage.service';
import { Title} from '@angular/platform-browser';
import { TarjetaCancionComponent } from './tarjeta-cancion/tarjeta-cancion.component';

@Component({
  selector: 'app-detalle-album',
  templateUrl: './detalle-album.component.html',
  styleUrls: ['./detalle-album.component.css']
})
export class DetalleAlbumComponent {
  @ViewChild(TarjetaCancionComponent) cancion:any

  userInfo:any
  albumInfo: any
  artistId:string = ""
  albumId:string = ""
  isAdmin:boolean = false
  canciones: Song[] = []
  reproduciendo:string = ""
  iteraciones:number=0;
  query:string=""

  constructor(private route: ActivatedRoute, private firestore: Firestore, private userService:UsuariosService,
    private db:DbService, private router:Router, private fireStorage:FireStorageService, private title:Title){ title.setTitle('Mediafrog - Album')}

    receiveMessage($event:any) {
      this.reproduciendo = $event;
    }

  async ngOnInit() {
    this.userInfo = await this.userService.getUserInfo()
    if(this.userInfo.admin) this.isAdmin = true
    this.route.queryParams.subscribe(async params => {
      //sacar parametros url
      this.artistId = params['idArtist']
      this.albumId = params['idAlbum']
      //sacar datos album
      const albumRef = doc(this.firestore, "artistas", this.artistId, "albumes", this.albumId);
      const albumSnap = await getDoc(albumRef);
      this.albumInfo = albumSnap.data();
      const cancionesRef = collection(this.firestore, "artistas", this.artistId, "albumes", this.albumId, "canciones");
      const cancionesSnapshot = await getDocs(cancionesRef);
        cancionesSnapshot.forEach((cancionDoc) => {
          const cancion = {
            name: cancionDoc.data()['name'],
            order: cancionDoc.data()['order'],
            lyrics: cancionDoc.data()['lyrics'],
            file: cancionDoc.data()['file'],
            albumId: cancionDoc.data()['albumId']
          };
          this.canciones.push(cancion);
          this.iteraciones++;
        });
    });
  }

  // getFilterName():string{
  //   return this.fireStorage.getFilterName()
  // }
  //            FUNCIONAMIENTO ANTERIOR PARA PIPES. ACTUALIZADO A VARIABLE QUERY, FUNCIONAMIENTO OPTIMIZADO
  // setFilterName(search:string){
  //   this.fireStorage.setFilterName(search)
  // }

  goToNewSong(){
    this.router.navigate(['/newsong'], {queryParams: {artistaId: this.artistId, albumId: this.albumId, order: this.iteraciones} });
  }
}
