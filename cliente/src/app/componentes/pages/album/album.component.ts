import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/servicios/db.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent {
@Input() album:any

constructor(private db:DbService,
            private router:Router){}

ngOnInit()
{
  setTimeout( () => undefined, 2000)
}
// async verDetalles(artista: any) {
//   let uid = await this.db.getArtistaUID(artista)
//   this.router.navigate(['/artista'], { queryParams: { id: uid} });
// }
}
