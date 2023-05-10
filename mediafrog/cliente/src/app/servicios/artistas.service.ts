import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import Artista from '../interfaces/artista.interface';
import Album from '../interfaces/album.interface';
import Cancion from '../interfaces/cancion.interface';

@Injectable({
  providedIn: 'root'
})
export class ArtistasService {

  constructor(private firestore:Firestore) { }

  addArtista(artista:Artista){
    const artistaRef = collection(this.firestore, 'artistas');
    return addDoc(artistaRef, artista);

  }
}
