import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tarjeta-fav',
  templateUrl: './tarjeta-fav.component.html',
  styleUrls: ['./tarjeta-fav.component.css']
})
export class TarjetaFavComponent {

  @Input() favArtist:any
  @Input() favAlbum:any

  constructor(private router:Router){}

  ngOnInit(){}

  async goToDetails(fav: any) {
    if(fav.artistId){
      this.router.navigate(['/album'], { queryParams: { idArtist: fav.artistId, idAlbum: fav.id } });
    } else {
      this.router.navigate(['/artista'], { queryParams: { id: fav.id } });
    }
  }

  setFav(fav:any){

  }

  delFav(fav:any){

  }

  isFav(fav:any){
    return true
  }
}
