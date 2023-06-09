import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from 'src/app/servicios/db.service';
import { FireStorageService } from 'src/app/servicios/fire-storage.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Album } from 'src/app/interfaces/album.interface';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Title} from '@angular/platform-browser';

@Component({
  selector: 'app-new-album',
  templateUrl: './new-album.component.html',
  styleUrls: ['./new-album.component.css']
})
export class NewAlbumComponent {

  newAlbum:FormGroup
  file:any
  userInfo:any
  isAdmin:boolean = false;
  artistId:string="";
  currentYear:number = 2023
  isFile:boolean = false;


  constructor(private route:ActivatedRoute,
    private userService:UsuariosService, private router:Router, private db:DbService,
    private fireStorage:FireStorageService, private title:Title, private fb:FormBuilder) { title.setTitle('Mediafrog - Nuevo Album')

    this.newAlbum = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      year: ['', [Validators.required, Validators.min(0), Validators.max(this.currentYear)]],
      image: new FormControl(),
      artistId: new FormControl(),
    })
  }

  async ngOnInit() {
    this.userInfo = await this.userService.getUserInfo()
    if(this.userInfo.admin) this.isAdmin = true
    this.route.queryParams.subscribe(async params => {
      this.artistId = params['artistId']
    });
    this.newAlbum.controls['artistId'].setValue(this.artistId)
  }

  goBack(){
    this.router.navigate(['/artista'], { queryParams: { id: this.artistId } });
  }

  async onSubmit(){
    if(this.artistId && this.newAlbum.value && this.file)
    {
      console.log("Controlar error de año, que puede ser mayor a la fecha actual")
      await this.db.addAlbum(this.newAlbum.value, this.file)
      // if(this.file)
      // {
      //   const aid = await this.db.getAlbumUIDByName(this.newAlbum.value.name)
      //   this.uploadImageAlbum(this.file, this.artistId, this.newAlbum.value, aid)
      // }
      setTimeout( () => this.router.navigate(['/artista'], { queryParams: { id: this.artistId } }), 1200)
    }
  }

  uploadImageAlbum($event:any, artistId:string, albumName:Album, aid:string){
    this.fireStorage.uploadImageAlbum($event, artistId, albumName.name, aid)
  }

  get nameInvalid(){
    return this.newAlbum.get('name')?.invalid && this.newAlbum.get('name')?.touched
  }
  get yearInvalid(){
    return this.newAlbum.get('year')?.invalid && this.newAlbum.get('year')?.touched
  }

  setFile($event:any){
    this.file = $event
    this.isFile = true
  }

}
