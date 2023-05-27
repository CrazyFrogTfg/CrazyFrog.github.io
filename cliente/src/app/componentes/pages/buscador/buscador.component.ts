import { Component } from '@angular/core';
import { FireStorageService } from 'src/app/servicios/fire-storage.service';
import { DbService } from 'src/app/servicios/db.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Song } from 'src/app/interfaces/song.interface';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent {

  cboxArtist:boolean=true
  cboxAlbum:boolean=true
  cboxSong:boolean=true
  artists:any
  albums:any
  songs:Song[] = []
  isAdmin:boolean = false
  userInfo:any
  paginator:number=0
  playlists:any
  userUID:string = ""

  constructor(private db:DbService,
              private fireStorage:FireStorageService,
              private userService:UsuariosService,
              private router:Router,
              private title:Title){ title.setTitle('Mediafrog - Buscador')}

  async ngOnInit(){
    this.userUID = await this.userService.getUID()
    this.playlists = await this.db.getPlaylistByUser(this.userUID)
    console.log(this.playlists)
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

  increasePaginator(){
    if(this.artists.length>3 && this.paginator+1<this.artists.length-3)
    {
      console.log("artistas length: "+this.artists.length)
      this.paginator= this.paginator+3
    }
    console.log("paginator: "+this.paginator)
    console.log("artistas length: "+this.artists.length)
  }

  decreasePaginator(){
    if(this.paginator+1>3)
    this.paginator= this.paginator-3
    console.log("paginator: "+this.paginator)

  }

  getFilterName():string{
    return this.fireStorage.getFilterName()
  }

  setFilterName(search:string){
    this.fireStorage.setFilterName(search)
   this.paginator = 0

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
