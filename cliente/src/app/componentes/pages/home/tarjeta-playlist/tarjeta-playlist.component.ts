import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { collection, getDocs } from 'firebase/firestore';
import { Firestore, query, where } from '@angular/fire/firestore';
import { FireStorageService } from 'src/app/servicios/fire-storage.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Title} from '@angular/platform-browser';
import { DbService } from 'src/app/servicios/db.service';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-tarjeta-playlist',
  templateUrl: './tarjeta-playlist.component.html',
  styleUrls: ['./tarjeta-playlist.component.css']
})
export class TarjetaPlaylistComponent {
  @Input() playlist:any
  uid:string = ""
  idPlaylist:string = ""
  edit:boolean = false
  updatePlaylist:FormGroup

  constructor(private router:Router, private firestore: Firestore,
    private userService:UsuariosService, private fireStorage:FireStorageService,
    private db:DbService){
      this.updatePlaylist = new FormGroup({
        name: new FormControl(),
      })
    }

async ngOnInit() {
  this.uid = await this.userService.getUID()
  const q = query(collection(this.firestore, "playlists"), where("name", "==", this.playlist.name), where("owner", "==", this.uid))
  const querySnapshots = await getDocs(q)
  this.idPlaylist = querySnapshots.docs[0].id;
}

async goToDetails() {
  this.router.navigate(['/playlist'], { queryParams: {idPlaylist: this.idPlaylist} });
}

async deletePlaylist() {
  const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar esta playlist?');
  if (confirmDelete) {
    await this.db.deletePlaylist(this.idPlaylist);
    location.reload();
  }
}

toggleEdit(){
  this.edit = !this.edit
}

async onSubmit(){
  await this.db.updatePlaylist(this.idPlaylist, this.updatePlaylist.value, this.playlist )
  location.reload();
}

}
