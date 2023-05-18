import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tarjeta-cancion',
  templateUrl: './tarjeta-cancion.component.html',
  styleUrls: ['./tarjeta-cancion.component.css']
})
export class TarjetaCancionComponent {
@Input() cancion:any

reproduciendo:string = ""

reproducir(cancion:string){
  this.reproduciendo = cancion
}
}
