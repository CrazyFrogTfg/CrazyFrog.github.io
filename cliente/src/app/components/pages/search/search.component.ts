import { Component, ViewChild } from '@angular/core';
import { FireStorageService } from 'src/app/services/fire-storage.service';
import { DbService } from 'src/app/services/db.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Song } from 'src/app/interfaces/song.interface';
import { Artist } from 'src/app/interfaces/artist.interface';
import { Album } from 'src/app/interfaces/album.interface';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  cboxArtist:boolean=true
  cboxAlbum:boolean=true
  cboxSong:boolean=true
  cboxNew:boolean=true
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
  sendedSong:string = ""
  filteredNewsLength:number = -1;
  filteredArtistsLength:number = -1;
  filteredAlbumsLength:number = -1;
  filteredSongsLength:number = -1;
  visible:boolean = false
  novedades:any=[]
  carArtToRight:boolean=false
  carArtToRightEnd:boolean=false
  carArtToLeft:boolean=false
  carArtToLeftEnd:boolean=false
  carAlbToRight:boolean=false
  carAlbToRightEnd:boolean=false
  carAlbToLeft:boolean=false
  carAlbToLeftEnd:boolean=false
  carSongToRight:boolean=false
  carSongToRightEnd:boolean=false
  carSongToLeft:boolean=false
  carSongToLeftEnd:boolean=false
  pagArtBlocked:boolean=false
  pagAlbBlocked:boolean=false
  pagSongBlocked:boolean=false

  constructor(private db:DbService,
              private firestore:Firestore,
              private fireStorage:FireStorageService,
              private userService:UsuariosService,
              private router:Router,
              private title:Title){ title.setTitle('Mediafroggy - Buscador')}

  async ngOnInit(){
    this.userUID = await this.userService.getUID()
    this.playlists = this.db.getPlaylistByUser(this.userUID)
    // Getear novedades
    let qDate = this.getDateForNovedades()
    const q = query(collection(this.firestore, "artists"), where("dateCreation", ">", qDate))
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        const artist = {
          id: doc.id,
          name: doc.data()['name'],
          image: doc.data()['image'],
          dateCreation: doc.data()['dateCreation']
        };
        this.novedades.push(artist);
      });
    this.novedades.sort((a:any,b:any)=>a.dateCreation - b.dateCreation)
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

    setTimeout(() => {
      this.visible = true
    }, 800)
  }

  getDateForNovedades(){
    let currentDate = new Date();   // Creamos new Date y restamos 2 semanas.
    currentDate.setDate(currentDate.getDate() - 14);
    let dDate = currentDate.getDate().toString()
    if(dDate.length < 2) dDate = 0+dDate
    // Preparamos el dia. Necesario formato 2 numeros.
    let mDate = (currentDate.getMonth()+1).toString()
    if(mDate.length < 2) mDate = 0+mDate
    // Preparamos mes. Necesario formato 2 numeros. Enero = 0, sumamos 1.
    let yDate = currentDate.getFullYear().toString()
    let qDate = yDate+"/"+mDate+"/"+dDate
    return qDate
  }

  increasePagArtist(){
    if(!this.pagArtBlocked)
    {
      //if is not filtered yet
      if(this.filteredArtistsLength < 1 && this.artists.length>4 && this.pagArtist+1<=this.artists.length-4)
      {
        this.pagArtBlocked=true
        this.carArtToLeftEnd=false
        this.carArtToLeft=true
        setTimeout(()=> {this.pagArtist+=4},600)
        setTimeout(()=>{
          this.carArtToLeft=false
          this.carArtToLeftEnd=true
        }, 600)
        setTimeout(()=> 
        {
          this.carArtToLeftEnd=false
          this.pagArtBlocked=false
        }, 1000)
      }
      //if has been filtered
      if(this.filteredArtistsLength > 4 && this.pagArtist+1<=this.filteredArtistsLength-4)
      {
        this.pagArtBlocked=true
        this.carArtToLeftEnd=false
        this.carArtToLeft=true
        setTimeout(()=> {this.pagArtist+=4},600)
        setTimeout(()=>{
          this.carArtToLeft=false
          this.carArtToLeftEnd=true
        }, 600)
        setTimeout(()=> 
        {
          this.carArtToLeftEnd=false
          this.pagArtBlocked=false
        }, 1000)
      }
    }
  }

  decreasePagArtist(){
    if(!this.pagArtBlocked)
    {
      if(this.pagArtist+1>4)
      {
        this.pagArtBlocked=true
        this.carArtToRightEnd=false
        this.carArtToRight=true
        setTimeout(()=> {this.pagArtist-=4},600)
        setTimeout(()=> {
          this.carArtToRight=false
          this.carArtToRightEnd=true
        }, 600)
        setTimeout(()=> 
        {
          this.carArtToRightEnd=false
          this.pagArtBlocked=false
        }, 1000)
      }

    }
  }

  increasePagAlbum(){
    if(!this.pagAlbBlocked)
    {
      if(this.filteredAlbumsLength < 1 && this.albums.length>4 && this.pagAlbum+1<=this.albums.length-4)
      {
        this.pagAlbBlocked=true
        this.carAlbToLeftEnd=false
        this.carAlbToLeft=true
        setTimeout(()=> {this.pagAlbum+=4},600)
        setTimeout(()=>{
          this.carAlbToLeft=false
          this.carAlbToLeftEnd=true
        }, 600)
        setTimeout(()=>
        {
          this.carAlbToLeftEnd=false
          this.pagAlbBlocked=false
        }, 1000)
      }
      if(this.filteredAlbumsLength > 4 && this.pagAlbum+1<=this.filteredAlbumsLength-4)
      {
        this.pagAlbBlocked=true
        this.carAlbToLeftEnd=false
        this.carAlbToLeft=true
        setTimeout(()=> {this.pagAlbum+=4},600)
        setTimeout(()=>{
          this.carAlbToLeft=false
          this.carAlbToLeftEnd=true
        }, 600)
        setTimeout(()=>
        {
          this.carAlbToLeftEnd=false
          this.pagAlbBlocked=false
        }, 1000)
      }
    }
  }

  decreasePagAlbum(){
    if(!this.pagAlbBlocked)
    {
      if(this.pagAlbum+1>4)
      {
        this.pagAlbBlocked=true
        this.carAlbToRightEnd=false
        this.carAlbToRight=true
        setTimeout(()=> {this.pagAlbum-=4},600)
        setTimeout(()=> {
          this.carAlbToRight=false
          this.carAlbToRightEnd=true
        }, 600)
        setTimeout(()=> 
        {
          this.carAlbToRightEnd=false
          this.pagAlbBlocked=false
        }, 1000)
      }
    }
  }

  increasePagSong(){
    if(this.filteredSongsLength < 1 && this.songs.length>10 && this.pagSong+1<=this.songs.length-10)
      this.pagSong+=10
    if(this.filteredSongsLength > 10 && this.pagSong+1<=this.filteredSongsLength-10)
      this.pagSong+=10
  }

  decreasePagSong(){
    if(this.pagSong+1>10)
      this.pagSong-=10
  }

  getFilterName():string{
    return this.fireStorage.getFilterName()
  }

  receiveSong($event:any) {
    this.sendedSong = $event;
  }

  setFilterName(search:string){
    this.fireStorage.setFilterName(search)
    this.pagArtist = 0
    this.pagAlbum = 0
    this.pagSong = 0
    this.filteredNewsLength = this.novedades.filter((searched: Artist) => searched.name.toLowerCase().includes(search.toLowerCase())).length;
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
  toogleCboxNew(){
    this.cboxNew = !this.cboxNew
  }

  newArtista(){
    this.router.navigate(['/newartist']);
  }
}
