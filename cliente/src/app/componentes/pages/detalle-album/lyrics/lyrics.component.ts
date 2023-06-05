import { Component, Input } from '@angular/core';
import { ReproductorService } from 'src/app/servicios/reproductor.service';

@Component({
  selector: 'app-lyrics',
  templateUrl: './lyrics.component.html',
  styleUrls: ['./lyrics.component.css']
})
export class LyricsComponent {
@Input() lyrics:any

constructor(protected reproductorService:ReproductorService){}

ngOnInit()
{
  this.getLyricsFromReproductor()
}
getLyricsFromReproductor()
{
  this.lyrics = this.reproductorService.reproducing().lyrics
}

}
