import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Playlist } from 'src/app/interfaces/playlist.interface';
import { DbService } from 'src/app/servicios/db.service';
import { FireStorageService } from 'src/app/servicios/fire-storage.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Title} from '@angular/platform-browser';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  miaudio:any
  isVisible = false;
  userInfo:any
  isAdmin:boolean = false
  uid:string = ""
  playlists:Playlist[] = []

  constructor(private userService:UsuariosService, private router: Router, private db:DbService,
      private fireStorage:FireStorageService, private title:Title){ title.setTitle('MediaFrog - Home')}

  async ngOnInit() {
    this.playlists=[]
    this.userInfo = await this.userService.getUserInfo()
    this.uid = await this.userService.getUID()
      if(this.userInfo.admin) {
        this.isAdmin = true
        this.userService.getAllUsers()
      }
    this.playlists = await this.db.getPlaylistByUser(this.uid)
  }

  reproducir() {
    this.miaudio = '../../../assets/Amazing_Harmonica_Street_Musician_192_kbps.mp3';
    this.isVisible = true;
  }

  getFilterName():string{
    return this.fireStorage.getFilterName()
  }

  setFilterName(search:string){
    this.fireStorage.setFilterName(search)
  }

  goToNewPlaylist(){
    this.router.navigate(['/newplaylist']);
  }
}
