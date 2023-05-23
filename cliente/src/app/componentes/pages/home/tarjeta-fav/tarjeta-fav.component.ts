import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tarjeta-fav',
  templateUrl: './tarjeta-fav.component.html',
  styleUrls: ['./tarjeta-fav.component.css']
})
export class TarjetaFavComponent {

  @Input() fav:any

  constructor(private router:Router){}

  async verDetalles(fav: any) {
    if(fav.tipo === "album"){
      this.router.navigate(['/album'], { queryParams: { idArtista: fav.artistaId, idAlbum: fav.id } });
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
