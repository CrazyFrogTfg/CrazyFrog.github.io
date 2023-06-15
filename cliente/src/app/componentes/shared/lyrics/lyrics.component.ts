import { Component, Input } from '@angular/core';
import { ReproductorService } from 'src/app/servicios/reproductor.service';

@Component({
  selector: 'app-lyrics',
  templateUrl: './lyrics.component.html',
  styleUrls: ['./lyrics.component.css']
})
export class LyricsComponent {

  lyrics:string = "¿No has seleccionado una canción aún? Clica en su nombre!"

constructor(protected reproductorService:ReproductorService){}


}
