import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-tarjeta-cancion',
  templateUrl: './tarjeta-cancion.component.html',
  styleUrls: ['./tarjeta-cancion.component.css']
})
export class TarjetaCancionComponent {
@Input() song:any
@Output() messageEvent = new EventEmitter<string>();

  reproduciendo:string = ""

reproducir(song:string){
  this.reproduciendo = song
  this.messageEvent.emit(this.reproduciendo);
}
}
