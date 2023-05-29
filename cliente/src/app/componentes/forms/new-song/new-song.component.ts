import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { DbService } from 'src/app/servicios/db.service';
import { FireStorageService } from 'src/app/servicios/fire-storage.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-new-song',
  templateUrl: './new-song.component.html',
  styleUrls: ['./new-song.component.css']
})
export class NewSongComponent {

  newSong: FormGroup;
  userInfo:any
  artistId:string=""
  albumId:string=""
  isAdmin:boolean = false;
  file:any
  order:any
  helpOrder:boolean=false


  async ngOnInit() {
    this.userInfo = await this.userService.getUserInfo()
    if(this.userInfo.admin) this.isAdmin = true
    await this.route.queryParams.subscribe(async params => {
      this.artistId = params['artistId']
      this.newSong.controls['artistId'].setValue(this.artistId)
      this.albumId = params['albumId']
      this.newSong.controls['albumId'].setValue(this.albumId)
      this.order = parseInt(params['order'])+1
      this.newSong.controls['order'].setValue(this.order)
      console.log(this.artistId)
    })
  }

  constructor(private router: Router, private userService:UsuariosService, private db:DbService, private title:Title, private route:ActivatedRoute, private fireStorage:FireStorageService) {
     title.setTitle('Mediafrog - Nueva Cancion')
    this.newSong = new FormGroup({
      name: new FormControl(),
      order: new FormControl(),
      lyrics: new FormControl(),
      albumId: new FormControl(),
      artistId: new FormControl(),
    })
  }
  
  goBack(){
    this.router.navigate(['/album'], { queryParams: { idArtist: this.artistId, idAlbum: this.albumId } });
  }

  setFile($event:any){
    this.file = $event
  }

  toogleHelpOrder()
  {
    this.helpOrder = !this.helpOrder
  }

  async onSubmit(){
    await this.db.addSong(this.newSong.value, this.file)
    setTimeout(() => this.router.navigate(['/album'], { queryParams: { idArtist: this.artistId, idAlbum: this.albumId } }), 1500)

  }

}
