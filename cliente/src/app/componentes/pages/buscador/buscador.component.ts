import { Component, ViewChild } from '@angular/core';
import { FireStorageService } from 'src/app/servicios/fire-storage.service';
import { DbService } from 'src/app/servicios/db.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Song } from 'src/app/interfaces/song.interface';
import { TarjetaCancionComponent } from '../detalle-album/tarjeta-cancion/tarjeta-cancion.component';
import { ByNamePipe } from 'src/app/filtros/by-name.pipe';
import { Artist } from 'src/app/interfaces/artist.interface';
import { Album } from 'src/app/interfaces/album.interface';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent {
  @ViewChild(TarjetaCancionComponent) cancion:any

  cboxArtist:boolean=true
  cboxAlbum:boolean=true
  cboxSong:boolean=true
  artists:any
  albums:any
  songs:Song[] = []
  isAdmin:boolean = false
  userInfo:any
  pagArtist:number=0
  pagAlbum:number=0
  pagSong:number=0
  playlists:any
  userUID:string = ""
  reproduciendo:string = ""
  filteredArtistsLength:number = 0;
  filteredAlbumsLength:number = 0;
  filteredSongsLength:number = 0;

  constructor(private db:DbService,
              private fireStorage:FireStorageService,
              private userService:UsuariosService,
              private router:Router,
              private title:Title){ title.setTitle('Mediafrog - Buscador')}

  async ngOnInit(){
    this.userUID = await this.userService.getUID()
    this.playlists = this.db.getPlaylistByUser(this.userUID)
    this.db.getArtists().subscribe(artists =>{
      this.artists = artists
    })
    this.db.getAlbums().subscribe(albums =>{
      this.albums = albums
    })
    this.db.getSongs().subscribe(songs =>{
      this.songs = songs
    })
    this.userInfo = await this.userService.getUserInfo()
    if(this.userInfo.admin) this.isAdmin = true
  }

  // increasePaginator() {
  //   const filteredArtistas:any = this.artistas | byName:getFilterName();
  //   const totalPages = Math.ceil(filteredArtistas.length / 3);
  //   if (this.paginator < totalPages - 1) {
  //     this.paginator += 1;
  //   }
  //   console.log("paginator: " + this.paginator);
  //   console.log("totalPages: " + totalPages);
  // }
  // decreasePaginator() {
  //   if (this.paginator > 0) {
  //     this.paginator -= 1;
  //   }

  increasePagArtist(){
    if(this.filteredArtistsLength == 0 && this.artists.length>5 && this.pagArtist+1<=this.artists.length-5)
      this.pagArtist= this.pagArtist+5
    if(this.filteredArtistsLength>5 && this.pagArtist+1<=this.filteredArtistsLength-5)
      this.pagArtist= this.pagArtist+5
  }

  decreasePagArtist(){
    if(this.pagArtist+1>5)
    this.pagArtist= this.pagArtist-5
    console.log("paginator: "+this.pagArtist)
  }

  increasePagAlbum(){
    if(this.filteredAlbumsLength == 0 && this.albums.length>5 && this.pagAlbum+1<=this.albums.length-5)
      this.pagAlbum= this.pagAlbum+5
    if(this.filteredAlbumsLength>5 && this.pagAlbum+1<=this.filteredAlbumsLength-5)
      this.pagAlbum= this.pagAlbum+5
  }

  decreasePagAlbum(){
    if(this.pagAlbum+1>5)
    this.pagAlbum= this.pagAlbum-5
    console.log("paginator: "+this.pagAlbum)

  }
  increasePagSong(){
    if(this.filteredSongsLength == 0 && this.songs.length>10 && this.pagSong+1<=this.songs.length-10)
      this.pagSong= this.pagSong+10
    if(this.filteredSongsLength>10 && this.pagSong+1<=this.filteredSongsLength-10)
      this.pagSong= this.pagSong+10
  }

  decreasePagSong(){
    if(this.pagSong+1>10)
    this.pagSong= this.pagSong-10
    console.log("paginator: "+this.pagSong)
  }

  getFilterName():string{
    return this.fireStorage.getFilterName()
  }

  receiveSong($event:any) {
    this.reproduciendo = $event;
  }

  setFilterName(search:string){
    this.fireStorage.setFilterName(search)
    this.pagArtist = 0
    this.pagAlbum = 0
    this.pagSong = 0
    this.filteredArtistsLength = this.artists.filter((searched: Artist) => searched.name.toLowerCase().includes(search.toLowerCase())).length;
    this.filteredAlbumsLength = this.albums.filter((searched: Album) => searched.name.toLowerCase().includes(search.toLowerCase())).length;
    this.filteredSongsLength = this.songs.filter((searched: Song) => searched.name.toLowerCase().includes(search.toLowerCase())).length;
  }

  toogleCboxArtist(){
    return this.cboxArtist = !this.cboxArtist
  }
  toogleCboxAlbum(){
    this.cboxAlbum = !this.cboxAlbum
  }
  toogleCboxSong(){
    this.cboxSong = !this.cboxSong
  }
  newArtista(){
    this.router.navigate(['/newartist']);
  }
}
