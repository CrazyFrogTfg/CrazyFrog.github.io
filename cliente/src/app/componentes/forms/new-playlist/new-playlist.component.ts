import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DbService } from 'src/app/servicios/db.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-new-playlist',
  templateUrl: './new-playlist.component.html',
  styleUrls: ['./new-playlist.component.css']
})
export class NewPlaylistComponent {

  newPlaylist: FormGroup;
  userInfo:any
  propietario:string = '';
  canCreate:boolean=false

  async ngOnInit() {
    this.userInfo = await this.userService.getUserInfo()
    this.propietario = await this.userService.getUID()
    this.newPlaylist.patchValue({
      owner: this.propietario
    });
  }

  constructor(private router: Router, private userService:UsuariosService, private db:DbService, private title:Title) {
     title.setTitle('Mediafrog - Nueva Playlist')
    this.newPlaylist = new FormGroup({
      name: new FormControl(),
      private: new FormControl(false),
      owner: new FormControl('')
    })
  }

  goHome(){
    this.router.navigate(['/home']);
  }

  toogleCanCreate(){
    if(this.newPlaylist.value.name.trim() != "")
    this.canCreate = true
    else this.canCreate = false
  }

  async onSubmit(){
    if(this.newPlaylist.value.name){
      await this.db.addPlaylist(this.newPlaylist.value)
      this.router.navigate(['/home']);
    }
  }
}
