import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Playlist } from 'src/app/interfaces/playlist.interface';
import { DbService } from 'src/app/servicios/db.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

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
  imageProfile:string =""
  showImage: boolean = false;
  uid:string = ""
  playlists:Playlist[] = []

  constructor(private userService:UsuariosService, private router: Router, private db:DbService){}

  async ngOnInit() {
    this.userInfo = await this.userService.getUserInfo()
    this.uid = await this.userService.getUID()
      if(this.userInfo.admin) {
        this.isAdmin = true
        this.userService.getAllUsers()
      }
    this.imageProfile = this.userInfo.imageProfile
    this.getImageProfile()
    this.playlists = await this.db.getPlaylistByUser(this.uid)
  }

  reproducir() {
    this.miaudio = '../../../assets/Amazing_Harmonica_Street_Musician_192_kbps.mp3';
    this.isVisible = true;
  }

  goToNewPlaylist(){
    this.router.navigate(['/newplaylist']);
  }

  async getImageProfile()
  {
    this.imageProfile = await this.userService.getImageProfile(this.uid)
    console.log(this.imageProfile)
    this.showImage = true;
  }

}
