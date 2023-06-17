import { Component, EventEmitter, Output } from '@angular/core';
import { FireStorageService } from 'src/app/services/fire-storage.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Firestore } from '@angular/fire/firestore';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Song } from 'src/app/interfaces/song.interface';
import { DbService } from 'src/app/services/db.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReproductorService } from 'src/app/services/reproductor.service';
import { Renderer2 } from '@angular/core';


@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.css']
})
export class PlaylistDetailComponent {
  @Output() messageEvent = new EventEmitter<any>();

  playlistId:string = ""
  playlistInfo:any = []
  songs: Song[] = []
  sendedSong:any
  owner:any
  imageOwner:string = ""
  isVisible:boolean = false
  isMyPlaylist:boolean = false
  query:string=""
  playlists:any
  userUID:string = ""
  edit:boolean=false
  updatePlaylist:FormGroup
  privateChecked:boolean=false
  visible:boolean = false
  confirmDelete:boolean = false

  constructor(private route: ActivatedRoute,private renderer: Renderer2,
    private firestore: Firestore,private userService:UsuariosService, private fireStorage:FireStorageService,
    private db:DbService, private reproductorService:ReproductorService, private fb:FormBuilder,
    private router:Router){
      this.updatePlaylist = this.fb.group({
        name: ['', [Validators.minLength(3), Validators.maxLength(17)]],
        private: [''],
      })
    }
    get nameInvalid(){
      return this.updatePlaylist.get('name')?.invalid && this.updatePlaylist.get('name')?.touched
    }

  async ngOnInit() {
    this.userUID = await this.userService.getUID()
    this.playlists = this.db.getPlaylistByUser(this.userUID)

    this.route.queryParams.subscribe(async params => {
      //sacar parametros url
      this.playlistId = params['idPlaylist']
      //sacar datos playlist
      const playlistRef = doc(this.firestore, "playlists", this.playlistId);
      const playlistSnap = await getDoc(playlistRef);
      this.playlistInfo = playlistSnap.data();
      this.playlistInfo.id = this.playlistId
      //var private for form edit Playlist actualized by info playlist
      this.updatePlaylist.controls['private'].setValue(this.playlistInfo.private)
      const userRef = doc(this.firestore, "users", this.playlistInfo.owner);
      const userSnap = await getDoc(userRef);
      this.owner = userSnap.data()
      const songsRef = collection(this.firestore, "playlists", this.playlistId, "songs");
      const songsSnapshot = await getDocs(songsRef);
        songsSnapshot.forEach(async (songDoc) => {
          if(songDoc.data()['songId']){
            const songsRef = doc(this.firestore, "songs", songDoc.data()['songId']);
            const song = await getDoc(songsRef);
            if (song.exists()) {
              const songObject: Song = {
                id:songDoc.id,
                name:song.data()['name'],
                order:song.data()['order'],
                lyrics:song.data()['lyrics'],
                file:song.data()['file'],
                albumId:song.data()['albumId'],
                artistId:song.data()['artistId'],
              };
              this.songs.push(songObject);
          }
        }});
        this.visibility()
      });
      setTimeout(() => {
        this.visible = true
      }, 1000)
  }

  async onSubmit(){
    if(this.updatePlaylist.value)
    {
      await this.db.updatePlaylist(this.updatePlaylist.value, this.playlistInfo)
      location.reload();
    }
  }

  confirmDeletePlaylist(){
    this.confirmDelete = true;
  }

  closeModalError(){
    this.confirmDelete=false
  }

  async deletePlaylist() {
    await this.db.deletePlaylist(this.playlistId);
    this.router.navigate(['/home'])
  }

  getFilterName():string{
    return this.fireStorage.getFilterName()
  }
  setFilterName(search:string){
    this.fireStorage.setFilterName(search)
  }
  receiveSong($event:any) {
    this.sendedSong = $event;
    this.reproducePlaylist()
  }

  visibility(){
    if(this.userUID == this.playlistInfo.owner){
      this.isMyPlaylist = true
      this.isVisible = true
    } else {
      if(this.playlistInfo.private == false)
        this.isVisible = true
    }
  }

  toggleEdit(){
    this.edit = !this.edit
  }

  reproducePlaylist()
  {
    const index = this.songs.findIndex(song => song.name === this.sendedSong.name);
    this.reproductorService.reproducePlaylist(this.songs, index)
  }

  reproduceRandomPlaylist(){
    let random = Math.floor(Math.random()*this.songs.length-0)
    this.reproductorService.reproducePlaylist(this.songs, random)
  }

  copyUrlToClipboard() {
    const url = window.location.href;
    const inputElement = this.renderer.createElement('input');
    this.renderer.setAttribute(inputElement, 'value', url);
    this.renderer.appendChild(document.body, inputElement);
    inputElement.select();
    document.execCommand('copy');
    this.renderer.removeChild(document.body, inputElement);
  }

}
