import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { collection, getDocs } from 'firebase/firestore';
import { Firestore, query, where } from '@angular/fire/firestore';
import { FireStorageService } from 'src/app/services/fire-storage.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { DbService } from 'src/app/services/db.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-playlist-card',
  templateUrl: './playlist-card.component.html',
  styleUrls: ['./playlist-card.component.css']
})
export class PlaylistCardComponent {
  @Input() playlist:any
  uid:string = ""
  idPlaylist:string = ""
  edit:boolean = false
  updatePlaylist:FormGroup
  confirmDelete:boolean = false

  constructor(private router:Router, private firestore: Firestore,
    private userService:UsuariosService, private db:DbService, private fb:FormBuilder){
      this.updatePlaylist = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(17)]],
      })
    }
    get nameInvalid(){
      return this.updatePlaylist.get('name')?.invalid && this.updatePlaylist.get('name')?.touched
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

  confirmDeletePlaylist(){
    this.confirmDelete = true;
  }

  closeModalError(){
    this.confirmDelete=false
  }

  async deletePlaylist() {
    await this.db.deletePlaylist(this.idPlaylist);
  }

  toggleEdit(){
    this.edit = !this.edit
  }

  async onSubmit(){
    await this.db.updatePlaylist(this.updatePlaylist.value, this.playlist)
  }

}
