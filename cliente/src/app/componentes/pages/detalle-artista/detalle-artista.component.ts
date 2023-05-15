import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, addDoc, doc, getDocs, getDoc, where, query} from '@angular/fire/firestore';
import { Album } from 'src/app/interfaces/album.interface';
import { Cancion } from 'src/app/interfaces/cancion.interface';

@Component({
  selector: 'app-detalle-artista',
  templateUrl: './detalle-artista.component.html',
  styleUrls: ['./detalle-artista.component.css']
})
export class DetalleArtistaComponent {

  artistaId:string = "";
  artistaInfo: any
  uidArtista:any
  albumes: Album[] = []
  canciones: Cancion[] = []

  constructor(private route: ActivatedRoute, private firestore: Firestore) { }

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      const idConEspacios = params['id'].replace(/%/g, ' '); // Reemplazar guiones por espacios
      this.artistaId = idConEspacios;
      const q = query(collection(this.firestore, "artistas"), where("nombre", "==", this.artistaId))
      const querySnapshots = await getDocs(q)
      this.artistaInfo = querySnapshots.docs[0].data()
      this.uidArtista = querySnapshots.docs[0].id;
      const artistasRef = collection(this.firestore, 'artistas');
      const artistaRef = doc(artistasRef, this.uidArtista);
      const albumesRef = collection(artistaRef, 'albumes');
      const q2 = query(albumesRef);
      const querySnapshot = await getDocs(q2);

      querySnapshot.forEach(async (doc) => {
        const uidAlbum = doc.id
        const cancionesRef = collection(albumesRef, uidAlbum, 'canciones');
        const cancionesSnapshot = await getDocs(cancionesRef);
        cancionesSnapshot.forEach((cancionDoc) => {
          const cancion = {
            titulo: cancionDoc.data()['titulo'],
            orden: cancionDoc.data()['orden'],
            letra: cancionDoc.data()['letra'],
            archivo: cancionDoc.data()['archivo'],
            token: cancionDoc.data()['token'],
          };
          this.canciones.push(cancion);
        });
        const album = {
          nombre: doc.data()['nombre'],
          anyo: doc.data()['año'],
          canciones: this.canciones
        };
        this.albumes.push(album);
      });
    });
  }


}
