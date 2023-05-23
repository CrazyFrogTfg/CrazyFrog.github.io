import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Input } from '@angular/core';
import { Storage } from '@angular/fire/storage';
import { DbService } from 'src/app/servicios/db.service';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-tarjeta-artista',
  templateUrl: './tarjeta-artista.component.html',
  styleUrls: ['./tarjeta-artista.component.css']
})
export class TarjetaArtistaComponent {
@Input() artista:any;
  //imageArtist:string=""
  formulario: FormGroup
  isAdmin:boolean = false
  userInfo:any
  artistaId:string = ""

  constructor(private db: DbService, private storage:Storage, private router:Router, private userService:UsuariosService){
  this.formulario = new FormGroup({
    nombre: new FormControl(),
    descripcion:new FormControl()
    })
  }

  async ngOnInit(){
    this.userInfo = await this.userService.getUserInfo()
    if(this.userInfo.admin) this.isAdmin = true
    this.artistaId = await this.db.getArtistaUID(this.artista)
    }

  async onSubmit() {
    const response = await this.db.addArtista(this.formulario.value)
  }

  async verDetalles() {
    this.router.navigate(['/artista'], { queryParams: {id: this.artistaId} });
  }

  setFav(artista:any){
    artista.id = this.artistaId
    artista.tipo = "artista"
    this.db.setFav(artista)
  }

  delFav(artista:any){
    this.db.delFav(artista)
  }

  isFav(artista:any){
    return this.db.isFav(artista)
  }
}


