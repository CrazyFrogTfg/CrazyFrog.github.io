import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Playlist } from 'src/app/interfaces/playlist.interface';
import { DbService } from 'src/app/servicios/db.service';
import { FireStorageService } from 'src/app/servicios/fire-storage.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Title} from '@angular/platform-browser';
import { Artist } from 'src/app/interfaces/artist.interface';
import { Album } from 'src/app/interfaces/album.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {

  userInfo:any
  isAdmin:boolean = false
  playlists:Playlist[] = []
  artistsFav:Artist[] = []
  albumsFav:Album[] = []

  constructor(private userService:UsuariosService, private router: Router, private db:DbService,
      private fireStorage:FireStorageService, private title:Title){ title.setTitle('MediaFroggy - Home')}

  async ngOnInit() {
    this.playlists=[]
    this.artistsFav=[]
    this.albumsFav=[]
    this.userInfo = await this.userService.getUserInfo()
      if(this.userInfo.admin) {
        this.isAdmin = true
        this.userService.getAllUsers()
      }
    this.db.getPlaylistByUser(this.userInfo.id).subscribe(playlists =>{
      this.playlists = playlists
    })
    this.artistsFav = await this.db.getArtistsFav()
    this.albumsFav = await this.db.getAlbumsFav()
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

  getAlbumsFav():Array<Album>{
    if(this.albumsFav)
    return this.albumsFav
    else return []
  }

  getArtistsFav():Array<Artist>{
    if(this.artistsFav)
    return this.artistsFav
    else return []
  }
}
