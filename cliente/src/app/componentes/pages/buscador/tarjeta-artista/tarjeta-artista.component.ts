import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Storage } from '@angular/fire/storage';
import { DbService } from 'src/app/servicios/db.service';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-tarjeta-artista',
  templateUrl: './tarjeta-artista.component.html',
  styleUrls: ['./tarjeta-artista.component.css']
})
export class TarjetaArtistaComponent {
@Input() artist:any;
  isAdmin:boolean = false
  userInfo:any

  constructor(private db: DbService, private storage:Storage, private router:Router, private userService:UsuariosService){}

  async ngOnInit(){
    this.userInfo = await this.userService.getUserInfo()
    if(this.userInfo.admin) this.isAdmin = true
    }

  async goToDetails() {
    this.router.navigate(['/artista'], { queryParams: {id: this.artist.id} });
  }

  setArtistFav(){
    this.db.setArtistFav(this.artist.id)
  }

  delArtistFav(){
    this.db.delArtistFav(this.artist.id)
  }

  isArtistFav(){
    return this.db.isArtistFav(this.artist.id)
  }
}


