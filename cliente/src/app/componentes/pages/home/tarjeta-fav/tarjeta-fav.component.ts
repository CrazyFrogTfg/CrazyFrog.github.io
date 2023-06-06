import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/servicios/db.service';

@Component({
  selector: 'app-tarjeta-fav',
  templateUrl: './tarjeta-fav.component.html',
  styleUrls: ['./tarjeta-fav.component.css']
})
export class TarjetaFavComponent {

  @Input() favArtist:any
  @Input() favAlbum:any

  constructor(private router:Router, private db:DbService){}

  ngOnInit(){}

  async goToDetails(fav: any) {
    if(fav.artistId){
      this.router.navigate(['/album'], { queryParams: { idArtist: fav.artistId, idAlbum: fav.id } });
    } else {
      this.router.navigate(['/artista'], { queryParams: { id: fav.id } });
    }
  }

  setAlbumFav(){
    this.db.setAlbumFav(this.favAlbum.id)
  }

  setArtistFav(){
    this.db.setArtistFav(this.favArtist.id)
  }

  delAlbumFav(){
    this.db.delAlbumFav(this.favAlbum.id)
  }

  delArtistFav(){
    this.db.delArtistFav(this.favArtist.id)
  }

  isAlbumFav(){
    return this.db.isAlbumFav(this.favAlbum.id)
  }

  isArtistFav(){
    return this.db.isArtistFav(this.favArtist.id)
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
