import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { collection, getDocs } from 'firebase/firestore';
import { Firestore, query, where } from '@angular/fire/firestore';
import { FireStorageService } from 'src/app/servicios/fire-storage.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Title} from '@angular/platform-browser';


@Component({
  selector: 'app-tarjeta-playlist',
  templateUrl: './tarjeta-playlist.component.html',
  styleUrls: ['./tarjeta-playlist.component.css']
})
export class TarjetaPlaylistComponent {
@Input() playlist:any
uid:string = ""

constructor(private router:Router,private firestore: Firestore,private userService:UsuariosService, private fireStorage:FireStorageService){}

async ngOnInit() {
  this.uid = await this.userService.getUID()
}
async verDetalles(playlist: any) {
  const q = query(collection(this.firestore, "playlists"), where("nombre", "==", playlist.nombre), where("propietario", "==", this.uid))
  const querySnapshots = await getDocs(q)
  const idPlaylist = querySnapshots.docs[0].id;
  this.router.navigate(['/playlist'], { queryParams: {idPlaylist: idPlaylist} });
}

}
