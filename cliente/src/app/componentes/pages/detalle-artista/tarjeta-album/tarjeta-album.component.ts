import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/servicios/db.service';
import { FormControl, FormGroup } from '@angular/forms';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-tarjeta-album',
  templateUrl: './tarjeta-album.component.html',
  styleUrls: ['./tarjeta-album.component.css']
})
export class TarjetaAlbumComponent {
  @Input() album:any
  @Input() artista:any

  updateAlbum:FormGroup
  myEvent:any
  isAdmin:boolean = false
  userInfo:any
  albumFav:any


  constructor(private db:DbService, private router:Router, private userService:UsuariosService){
    this.updateAlbum = new FormGroup({
      id: new FormControl(),
      name: new FormControl(),
      year: new FormControl(),
    })
  }

  async ngOnInit()
  {
    this.userInfo = await this.userService.getUserInfo()
    if(this.userInfo.admin) this.isAdmin = true
    setTimeout( () => undefined, 2000)
  }

  setMyEvent($event:any){
    this.myEvent = $event
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

  async goToDetails(album: any) {
    this.router.navigate(['/album'], { queryParams: { idArtist: this.artista, idAlbum: album.id } });
  }

  setAlbumFav(){
    this.db.setAlbumFav(this.album.id)
  }

  delAlbumFav(){
    this.db.delAlbumFav(this.album.id)
  }

  isAlbumFav(){
    return this.db.isAlbumFav(this.album.id)
  }
}
