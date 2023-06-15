import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

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
  isFile:boolean=false
  createError:boolean=false

  async ngOnInit() {
    this.userInfo = await this.userService.getUserInfo()
    if(this.userInfo.admin) this.isAdmin = true
    this.route.queryParams.subscribe(async params => {
      this.artistId = params['artistId']
      this.newSong.controls['artistId'].setValue(this.artistId)
      this.albumId = params['albumId']
      this.newSong.controls['albumId'].setValue(this.albumId)
      this.order = parseInt(params['order'])+1
      this.newSong.controls['order'].setValue(this.order)
    })
  }

  constructor(private router: Router, private userService:UsuariosService, private db:DbService, private title:Title,
    private route:ActivatedRoute, private fb:FormBuilder) {
     title.setTitle('Mediafroggy - Nueva Canción')
    this.newSong = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      order: new FormControl(),
      lyrics: new FormControl("Sin letra o instrumental"),
      albumId: new FormControl(),
      artistId: new FormControl(),
    })
  }

  get nameInvalid(){
    return this.newSong.get('name')?.invalid && this.newSong.get('name')?.touched
  }

  goBack(){
    this.router.navigate(['/album'], { queryParams: { idArtist: this.artistId, idAlbum: this.albumId } });
  }

  setFile($event:any){
    this.file = $event
    this.isFile=true
  }

  toogleHelpOrder()
  {
    this.helpOrder = !this.helpOrder
  }

  async onSubmit(){

    if(this.newSong.invalid){
      return Object.values(this.newSong.controls).forEach( control=>{
        control.markAllAsTouched()
      })
    }else
    if(this.newSong.valid && this.isFile)
    {
      let created = await this.db.addSong(this.newSong.value, this.file)
      if(created)
      {
        setTimeout(() => this.router.navigate(['/album'], { queryParams: { idArtist: this.artistId, idAlbum: this.albumId } }), 1200)
      }else
      this.createError=true
    }
  }

  closeModalError()
  {
    this.createError=false
  }

}
