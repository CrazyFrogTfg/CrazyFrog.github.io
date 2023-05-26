import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, collection, doc, getDocs, getDoc, query, where } from '@angular/fire/firestore';
import { Song } from 'src/app/interfaces/song.interface';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { DbService } from 'src/app/servicios/db.service';
import { FormControl, FormGroup } from '@angular/forms';
import { FireStorageService } from 'src/app/servicios/fire-storage.service';
import { Title} from '@angular/platform-browser';
import { TarjetaCancionComponent } from './tarjeta-cancion/tarjeta-cancion.component';

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
  file:any
  isFile:boolean=false
  playlists:any
  userUID:string = ""

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
    this.userUID = await this.userService.getUID()
    if(this.userInfo.admin) this.isAdmin = true
    this.playlists = await this.db.getPlaylistByUser(this.userUID)
    this.route.queryParams.subscribe(async params => {
      //sacar parametros url
      this.artistId = params['idArtist']
      this.albumId = params['idAlbum']
      //sacar datos album
      const albumRef = doc(this.firestore, "albums", this.albumId);
      const albumSnap = await getDoc(albumRef);
      this.albumInfo = albumSnap.data();
      const q = query(collection(this.firestore, "songs"), where("albumId", "==", this.albumId))
      const songsSnapshot = await getDocs(q);
      songsSnapshot.forEach((songDoc) => {
          const song = {
            id: songDoc.id,
            name: songDoc.data()['name'],
            order: songDoc.data()['order'],
            lyrics: songDoc.data()['lyrics'],
            file: songDoc.data()['file'],
            albumId: songDoc.data()['albumId'],
            artistId: songDoc.data()['artistId']
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
      await this.db.updateAlbum(this.albumId, this.updateAlbum.value, this.albumInfo, this.file);
      this.router.navigate(['/home'])
    }
  }

  setFile($event:any){
    this.file = $event
    this.isFile=true
  }

  deleteAlbum(){
    this.db.deleteAlbum(this.albumId)
    this.router.navigate(['/buscador'])
  }

  toggleEdit(){
    this.edit = !this.edit
  }

  goToNewSong(){
    this.router.navigate(['/newsong'], {queryParams: {artistId: this.artistId, albumId: this.albumId, order: this.iteraciones} });
  }
}
