import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Input } from '@angular/core';
import { Storage } from '@angular/fire/storage';
import { DbService } from 'src/app/servicios/db.service';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-artista',
  templateUrl: './artista.component.html',
  styleUrls: ['./artista.component.css']
})
export class ArtistaComponent {
@Input() artista:any;
  //imageArtist:string=""
  formulario: FormGroup
  isAdmin:boolean = false
  userInfo:any

  constructor(private db: DbService, private storage:Storage, private router:Router, private userService:UsuariosService){
  this.formulario = new FormGroup({
    nombre: new FormControl(),
    descripcion:new FormControl()
    })
  }

  async ngOnInit(){
    this.userInfo = await this.userService.getUserInfo()
    if(this.userInfo.admin) this.isAdmin = true
    }

  async onSubmit() {
    const response = await this.db.addArtista(this.formulario.value)
  }

  async verDetalles(artista: any) {
    let uid = await this.db.getArtistaUID(artista)
    this.router.navigate(['/artista'], { queryParams: { id: uid} });
  }
}


