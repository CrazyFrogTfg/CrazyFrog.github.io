import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-new-playlist',
  templateUrl: './new-playlist.component.html',
  styleUrls: ['./new-playlist.component.css']
})

export class NewPlaylistComponent {

  newPlaylist: FormGroup;
  userInfo:any
  owner:string = '';
  canCreate:boolean=false
  createError:boolean=false

  async ngOnInit() {
    this.userInfo = await this.userService.getUserInfo()
    this.owner = await this.userService.getUID()
    this.newPlaylist.patchValue({
      owner: this.owner
    });
  }

  constructor(private router: Router, private userService:UsuariosService, private db:DbService,
    private title:Title, private fb:FormBuilder) {
     title.setTitle('Mediafrog - Nueva Playlist')
    this.newPlaylist = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(17)]],
      private: new FormControl(false),
      owner: new FormControl('')
    })
  }
  get nameInvalid(){
    return this.newPlaylist.get('name')?.invalid && this.newPlaylist.get('name')?.touched
  }

  goBack(){
    this.router.navigate(['/home']);
  }

  toogleCanCreate(){
    if(this.newPlaylist.value.name.trim() != "")
    this.canCreate = true
    else this.canCreate = false
  }

  async onSubmit(){
    if(this.newPlaylist.invalid){
      return Object.values(this.newPlaylist.controls).forEach( control=>{
        control.markAllAsTouched()
      })
    }else
    if(this.newPlaylist.valid){
      let created:boolean = false
      created = await this.db.addPlaylist(this.newPlaylist.value)
      if(created){
        this.router.navigate(['/home'])
      }
      else this.createError=true
    }
  }

  closeModalError(){
    this.createError=false
  }
}
