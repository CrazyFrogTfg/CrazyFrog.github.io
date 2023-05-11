import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-new-playlist',
  templateUrl: './new-playlist.component.html',
  styleUrls: ['./new-playlist.component.css']
})
export class NewPlaylistComponent {

  newPlaylist: FormGroup;
  privada:boolean = true;
  userInfo:any
  propietario:string = '';

  async ngOnInit() {
    this.userInfo = await this.userService.getUserInfo()
    this.propietario = this.userInfo.email
    this.newPlaylist.patchValue({
      propietario: this.propietario
    });
  }

  constructor(private router: Router, private userService:UsuariosService){
    this.newPlaylist = new FormGroup({
      namePlaylist: new FormControl(),
      privada: new FormControl(this.privada),
      propietario: new FormControl('')
    })
  }

  // isPrivate(){
  //   if(this.privada == true){
  //     this.foro = ''
  //     console.log(this.foro)
  //     this.foro = "revisiontalentofuncionarios"
  //     console.log("El foro seleccionado es:", this.foro)
  //    }
  // }

  goHome(){
    this.router.navigate(['/home']);
  }

  onSubmit(){
    console.log(this.newPlaylist.value);
  }
}
