import { Component } from '@angular/core';
import { Title} from '@angular/platform-browser';
@Component({
  selector: 'app-detalle-album',
  templateUrl: './detalle-album.component.html',
  styleUrls: ['./detalle-album.component.css']
})
export class DetalleAlbumComponent {
  
  constructor(private title:Title){ title.setTitle('Mediafrog-Album')}

}
