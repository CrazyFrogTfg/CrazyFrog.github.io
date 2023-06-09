import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Storage } from '@angular/fire/storage';
import { DbService } from 'src/app/services/db.service';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-artist-card',
  templateUrl: './artist-card.component.html',
  styleUrls: ['./artist-card.component.css']
})
export class ArtistCardComponent {
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

  truncateTitle(title: string, maxLength: number): string {
    if (title.length <= maxLength) {
      return title;
    } else {
      let truncatedTitle = title.slice(0, maxLength);
      if (truncatedTitle.charAt(maxLength - 1) === ' ') {
        truncatedTitle = truncatedTitle.slice(0, maxLength - 1);
      }
      return truncatedTitle + '...';
    }
  }

}


