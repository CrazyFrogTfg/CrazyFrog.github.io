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

  playlists:Playlist[] = []

  constructor(private firestore:Firestore) { }

  addArtista(artista:Artista){
    const artistaRef = collection(this.firestore, 'artistas');
    return addDoc(artistaRef, artista);
  }

  getArtistas(): Observable<Artista[]>{
    const artistaRef = collection(this.firestore, 'artistas')
    return collectionData(artistaRef, { idField: 'name'}) as Observable<Artista[]>;
  }

  async deleteArtist(uid:string){
    await deleteDoc(doc(this.firestore, "artistas", uid));
  }

  addPlaylist(playlist:Playlist){
    const playlistRef = collection(this.firestore, 'playlists');
    return addDoc(playlistRef, playlist);
  }

  addArtist(artist:Artista){
    const artistRef = collection(this.firestore, 'artistas');
    return addDoc(artistRef, artist);
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
  
  async getArtistaUIDByNombre(artistaNombre:string){
    let uid = ""
    if (artistaNombre !== null) {
      const q = query(collection(this.firestore, "artistas"), where("nombre", "==", artistaNombre))
      const querySnapshots = await getDocs(q)
      uid = querySnapshots.docs[0].id;
    }
    return uid
  }

  async getPlaylistByUser(uid:string){
    //Con la linea siguiente vaciamos el array para que no se llene continuamente.
    this.playlists=[]
    const q = query(collection(this.firestore, "playlists"), where("propietario", "==", uid))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      const playlist = {
        nombre: doc.data()['nombre'],
        privada: doc.data()['privada'],
        propietario: doc.data()['propietario'],
        canciones: []
      };
      this.playlists.push(playlist);
    })
    return this.playlists
  }
}
