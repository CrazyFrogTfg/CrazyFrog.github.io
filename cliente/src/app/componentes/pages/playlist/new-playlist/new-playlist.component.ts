import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DbService } from 'src/app/servicios/db.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-new-playlist',
  templateUrl: './new-playlist.component.html',
  styleUrls: ['./new-playlist.component.css']
})
export class NewPlaylistComponent {

  newPlaylist: FormGroup;
  userInfo:any
  propietario:string = '';

  async ngOnInit() {
    this.userInfo = await this.userService.getUserInfo()
    this.propietario = await this.userService.getUID()
    console.log(this.propietario)
    this.newPlaylist.patchValue({
      propietario: this.propietario
    });
  }

  constructor(private router: Router, private userService:UsuariosService, private db:DbService){
    this.newPlaylist = new FormGroup({
      nombre: new FormControl(),
      privada: new FormControl(false),
      propietario: new FormControl('')
    })
  }

  goHome(){
    this.router.navigate(['/home']);
  }

  async onSubmit(){
    await this.db.addPlaylist(this.newPlaylist.value)
    this.router.navigate(['/home']);
  }
}
