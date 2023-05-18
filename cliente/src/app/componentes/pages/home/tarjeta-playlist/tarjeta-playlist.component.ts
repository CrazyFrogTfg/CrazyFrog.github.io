import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tarjeta-playlist',
  templateUrl: './tarjeta-playlist.component.html',
  styleUrls: ['./tarjeta-playlist.component.css']
})
export class TarjetaPlaylistComponent {
@Input() playlist:any

}
