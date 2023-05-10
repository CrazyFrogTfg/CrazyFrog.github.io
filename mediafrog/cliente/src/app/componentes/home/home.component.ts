import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
  email:string = ""
  username:string = ""
  password:string = ""

  constructor(private userService:UsuariosService, private router: Router){}

  async ngOnInit() {
    this.userInfo = await this.userService.getUserInfo()
    this.email = this.userInfo.email
    this.username = this.userInfo.username
    this.password = this.userInfo.password
  }
  reproducir() {
    this.miaudio = '../../../assets/Amazing_Harmonica_Street_Musician_192_kbps.mp3';
    this.isVisible = true;
  }

  goToNewPlaylist(){
    this.router.navigate(['/newplaylist']);
  }
}
