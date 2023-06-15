import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, collection, doc, getDocs, getDoc, query, where } from '@angular/fire/firestore';
import { Song } from 'src/app/interfaces/song.interface';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { DbService } from 'src/app/servicios/db.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FireStorageService } from 'src/app/servicios/fire-storage.service';
import { Title} from '@angular/platform-browser';
import { SongCardComponent } from '../../cards/song-card/song-card.component';
import { ReproductorService } from 'src/app/servicios/reproductor.service';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.css']
})
export class AlbumDetailComponent {
  @ViewChild(SongCardComponent) cancion:any

  userInfo:any
  albumInfo: any
  artistId:string = ""
  albumId:string = ""
  isAdmin:boolean = false
  songs: Song[] = []
  sendedSong:any
  iteraciones:number=0;
  query:string=""
  edit:boolean=false
  updateAlbum:FormGroup
  currentYear: number = new Date().getFullYear();
  file:any
  isFile:boolean=false
  playlists:any
  userUID:string = ""
  visible:boolean = false
  deletePrompt:boolean = false
  formDelete: FormGroup;

  constructor(private route: ActivatedRoute, private firestore: Firestore, private userService:UsuariosService,
    private db:DbService, private reproductorService:ReproductorService, private router:Router, private fireStorage:FireStorageService,
    private title:Title, private fb:FormBuilder)
    { title.setTitle('Mediafroggy - Album')
    this.updateAlbum = this.fb.group({
      name: ['', [Validators.minLength(2), Validators.maxLength(20)]],
      year: ['', [Validators.min(0), Validators.max(this.currentYear)]],
      image: new FormControl(),
    })
    this.formDelete = new FormGroup({
      prompt: new FormControl(),
    })
  }
  get nameInvalid(){
    return this.updateAlbum.get('name')?.invalid && this.updateAlbum.get('name')?.touched
  }
  get yearInvalid(){
    return this.updateAlbum.get('year')?.invalid && this.updateAlbum.get('year')?.touched
  }

  receiveSong($event:any) {
    this.sendedSong = $event;
    this.reproduceAlbum(this.songs, this.sendedSong.order-1)
  }

  reproduceAlbum(playlist:any = this.songs, songOrder:number = -1)
  {
    if(songOrder === -1)
    songOrder = Math.floor(Math.random()*playlist.length-0)
    this.reproductorService.reproducePlaylist(playlist, songOrder)
  }

  async ngOnInit() {
    this.userInfo = await this.userService.getUserInfo()
    this.userUID = await this.userService.getUID()
    if(this.userInfo.admin) this.isAdmin = true
    this.playlists = await this.db.getPlaylistByUser(this.userUID)
    this.route.queryParams.subscribe(async params => {
      //sacar parametros url
      this.albumId = params['idAlbum']
      //sacar datos album
      const albumRef = doc(this.firestore, "albums", this.albumId);
      const albumSnap = await getDoc(albumRef);
      this.albumInfo = albumSnap.data();
      this.artistId = this.albumInfo.artistId
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
        this.songs.sort((a,b)=>a.order-b.order)
    });
    setTimeout(() => {
      this.visible = true
    }, 800)
  }

  async onSubmit(){
    if(this.updateAlbum)
    {
      await this.db.updateAlbum(this.albumId, this.updateAlbum.value, this.albumInfo, this.file);
      window.location.reload()
    }
  }

  setFile($event:any){
    this.file = $event
    this.isFile=true
  }

  deleteAlbum(){
    this.db.delAlbumFav(this.albumId)
    this.db.deleteAlbum(this.albumId)
    this.router.navigate(['/artista'], {queryParams: {id: this.artistId}});
  }

  deleteQuestion(){
    this.deletePrompt = true;
  }

  checkDeleteName(){
    const promptControl = this.formDelete.get('prompt');
    if (promptControl) {
      if(promptControl.value == this.albumInfo.name){
        this.deleteAlbum()
      }
    }
  }

  closeModalError(){
    this.deletePrompt=false
  }

  toggleEdit(){
    this.edit = !this.edit
  }

  goToNewSong(){
    this.router.navigate(['/newsong'], {queryParams: {artistId: this.artistId, albumId: this.albumId, order: this.iteraciones} });
  }

  setAlbumFav(){
    this.db.setAlbumFav(this.albumId)
  }

  delAlbumFav(){
    this.db.delAlbumFav(this.albumId)
  }

  isAlbumFav(){
    return this.db.isAlbumFav(this.albumId)
  }

  goToArtist(){
    this.router.navigate(['/artista'], {queryParams: {id: this.artistId}});
  }

}
