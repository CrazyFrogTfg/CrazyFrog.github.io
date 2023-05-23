import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { collection, getDocs } from 'firebase/firestore';
import { Firestore, query, where } from '@angular/fire/firestore';
import { FireStorageService } from 'src/app/servicios/fire-storage.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Title} from '@angular/platform-browser';
import { DbService } from 'src/app/servicios/db.service';


@Component({
  selector: 'app-tarjeta-playlist',
  templateUrl: './tarjeta-playlist.component.html',
  styleUrls: ['./tarjeta-playlist.component.css']
})
export class TarjetaPlaylistComponent {
@Input() playlist:any
uid:string = ""
idPlaylist:string = ""

constructor(private router:Router, private firestore: Firestore,
  private userService:UsuariosService, private fireStorage:FireStorageService,
  private db:DbService){}

async ngOnInit() {
  this.uid = await this.userService.getUID()
  const q = query(collection(this.firestore, "playlists"), where("nombre", "==", this.playlist.nombre), where("propietario", "==", this.uid))
  const querySnapshots = await getDocs(q)
  this.idPlaylist = querySnapshots.docs[0].id;
}

async verDetalles() {
  this.router.navigate(['/playlist'], { queryParams: {idPlaylist: this.idPlaylist} });
}

async deletePlaylist() {
  const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar esta playlist?');
  if (confirmDelete) {
    console.log(this.idPlaylist)
    await this.db.deletePlaylist(this.idPlaylist);
    window.location.reload();
  }
}


}
