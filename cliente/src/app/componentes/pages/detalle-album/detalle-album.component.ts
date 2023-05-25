import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, collection, doc, getDocs, getDoc, query} from '@angular/fire/firestore';
import { Song } from 'src/app/interfaces/song.interface';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { DbService } from 'src/app/servicios/db.service';
import { FormControl, FormGroup } from '@angular/forms';
import { FireStorageService } from 'src/app/servicios/fire-storage.service';
import { Title} from '@angular/platform-browser';
import { TarjetaCancionComponent } from './tarjeta-cancion/tarjeta-cancion.component';
import { Album } from 'src/app/interfaces/album.interface';

@Component({
  selector: 'app-detalle-album',
  templateUrl: './detalle-album.component.html',
  styleUrls: ['./detalle-album.component.css']
})
export class DetalleAlbumComponent {
  @ViewChild(TarjetaCancionComponent) cancion:any

  userInfo:any
  albumInfo: any
  artistId:string = ""
  albumId:string = ""
  isAdmin:boolean = false
  songs: Song[] = []
  reproduciendo:string = ""
  iteraciones:number=0;
  query:string=""
  edit:boolean=false
  updateAlbum:FormGroup
  currentYear:number = 2023
  myEvent:any

  constructor(private route: ActivatedRoute, private firestore: Firestore, private userService:UsuariosService,
    private db:DbService, private router:Router, private fireStorage:FireStorageService, private title:Title)
    { title.setTitle('Mediafrog - Album')
    
    this.updateAlbum = new FormGroup({
      artistId: new FormControl(this.artistId),
      name: new FormControl(),
      year: new FormControl(),
      image: new FormControl(),
    })
    
  }

    receiveMessage($event:any) {
      this.reproduciendo = $event;
    }

  async ngOnInit() {
    this.userInfo = await this.userService.getUserInfo()
    if(this.userInfo.admin) this.isAdmin = true
    this.route.queryParams.subscribe(async params => {
      //sacar parametros url
      this.artistId = params['idArtist']
      this.albumId = params['idAlbum']
      //sacar datos album
      const albumRef = doc(this.firestore, "albums", this.albumId);
      const albumSnap = await getDoc(albumRef);
      this.albumInfo = albumSnap.data();

      //cambiar a canciones con idalbum tal
      const songsRef = collection(this.firestore, "songs", );
      const songsSnapshot = await getDocs(songsRef);
      songsSnapshot.forEach((songDoc) => {
          const song = {
            name: songDoc.data()['name'],
            order: songDoc.data()['order'],
            lyrics: songDoc.data()['lyrics'],
            file: songDoc.data()['file'],
            albumId: songDoc.data()['albumId']
          };
          this.songs.push(song);
          this.iteraciones++;
        });
    });
  }

  async onSubmit(){
    if(this.updateAlbum)
    {
      console.log("Controlar error de año, que puede ser mayor a la fecha actual")
      await this.db.updateAlbumDb(this.albumId, this.updateAlbum.value, this.albumInfo);
      if(this.myEvent)
      {
        if(this.updateAlbum.value.name)
        {
          this.uploadImageAlbum(this.myEvent, this.artistId, this.updateAlbum.value.name,this.albumId)
        }else
        this.uploadImageAlbum(this.myEvent, this.artistId, this.albumInfo.name,this.albumId)
      }
      this.router.navigate(['/home'])
    }
  }

  uploadImageAlbum($event:any, artistId:string, albumName:string, aid:string){
    this.fireStorage.uploadImageAlbum($event, artistId, albumName, aid)
  }

  setMyEvent($event:any){
    this.myEvent = $event
  }

  deleteAlbum(){
    this.db.deleteAlbum(this.albumId)
    this.router.navigate(['/buscador'])
  }


  toggleEdit(){
    this.edit = !this.edit
  }

  goToNewSong(){
    this.router.navigate(['/newsong'], {queryParams: {artistaId: this.artistId, albumId: this.albumId, order: this.iteraciones} });
  }
}
