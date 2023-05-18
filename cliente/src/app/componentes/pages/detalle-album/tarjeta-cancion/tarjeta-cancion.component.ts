import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-tarjeta-cancion',
  templateUrl: './tarjeta-cancion.component.html',
  styleUrls: ['./tarjeta-cancion.component.css']
})
export class TarjetaCancionComponent {
@Input() cancion:any
@Output() messageEvent = new EventEmitter<string>();

  reproduciendo:string = ""

reproducir(cancion:string){
  this.reproduciendo = cancion
  this.messageEvent.emit(this.reproduciendo);
}
}
