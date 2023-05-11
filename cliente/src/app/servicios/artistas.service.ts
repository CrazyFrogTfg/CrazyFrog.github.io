import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc } from '@angular/fire/firestore';
import { Artista } from '../interfaces/artista.interface';
import { Album } from '../interfaces/album.interface';
import { Cancion } from '../interfaces/cancion.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArtistasService {

  constructor(private firestore:Firestore) { }

  addArtista(artista:Artista){
    const artistaRef = collection(this.firestore, 'artistas');
    return addDoc(artistaRef, artista);
  }

  getArtistas(): Observable<Artista[]>{
    const artistaRef = collection(this.firestore, 'artistas')
    return collectionData(artistaRef, { idField: 'name'}) as Observable<Artista[]>;
  }

  deleteArtista(artista:Artista){
    const artistaDocRef = doc(this.firestore, `artists/${artista.id}`);
    return deleteDoc(artistaDocRef)
  }

  
}
