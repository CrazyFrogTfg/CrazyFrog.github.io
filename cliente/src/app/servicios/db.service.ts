import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Artista } from '../interfaces/artista.interface';
import { Album } from '../interfaces/album.interface';
import { Cancion } from '../interfaces/cancion.interface';
import { Observable } from 'rxjs';
import { Playlist } from '../interfaces/playlist.interface';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class DbService {

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

  addPlaylist(playlist:Playlist){
    const playlistRef = collection(this.firestore, 'playlists');
    return addDoc(playlistRef, playlist);
  }

  async getArtistaUID(artista:Artista){
    let uid = ""
    if (artista !== null) {
      const q = query(collection(this.firestore, "artistas"), where("nombre", "==", artista.nombre))
      const querySnapshots = await getDocs(q)
      uid = querySnapshots.docs[0].id;
    }
    return uid
  }

  async getPlaylistByUser(uid:string){
    const q = query(collection(this.firestore, "playlists"), where("propietario", "==", uid))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(element => {
      
    });
  }
}
