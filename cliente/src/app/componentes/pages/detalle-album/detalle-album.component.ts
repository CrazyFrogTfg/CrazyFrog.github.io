import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, collection, doc, getDocs, getDoc, query} from '@angular/fire/firestore';
import { Cancion } from 'src/app/interfaces/cancion.interface';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { DbService } from 'src/app/servicios/db.service';
import { FormControl, FormGroup } from '@angular/forms';
import { FireStorageService } from 'src/app/servicios/fire-storage.service';

@Component({
  selector: 'app-detalle-album',
  templateUrl: './detalle-album.component.html',
  styleUrls: ['./detalle-album.component.css']
})
export class DetalleAlbumComponent {

  userInfo:any
  albumInfo: any
  artistaId:string = ""
  albumId:string = ""
  isAdmin:boolean = false
  canciones: Cancion[] = []

  constructor(private route: ActivatedRoute, private firestore: Firestore, private userService:UsuariosService,
    private db:DbService, private router:Router, private fireStorage:FireStorageService) {}

  async ngOnInit() {
    this.userInfo = await this.userService.getUserInfo()
    if(this.userInfo.admin) this.isAdmin = true
    this.route.queryParams.subscribe(async params => {
      //sacar parametros url
      this.artistaId = params['idArtista']
      this.albumId = params['idAlbum']
      //sacar datos album
      const albumRef = doc(this.firestore, "artistas", this.artistaId, "albumes", this.albumId);
      const albumSnap = await getDoc(albumRef);
      this.albumInfo = albumSnap.data();
      const cancionesRef = collection(this.firestore, "artistas", this.artistaId, "albumes", this.albumId, "canciones");
      const cancionesSnapshot = await getDocs(cancionesRef);
        cancionesSnapshot.forEach((cancionDoc) => {
          const cancion = {
            titulo: cancionDoc.data()['titulo'],
            orden: cancionDoc.data()['orden'],
            letra: cancionDoc.data()['letra'],
            archivo: cancionDoc.data()['archivo'],
            token: cancionDoc.data()['token'],
          };
          this.canciones.push(cancion);
        });
    });
  }
}
