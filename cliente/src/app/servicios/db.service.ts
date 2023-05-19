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

  async deleteAlbum(albumId:any){
    prompt("Funcion deleteAlbum incompleta. DB-SERVICE")
    //Faltaría artistaId para poder rellenar la ruta para encontrar el Doc a eliminar...
    //await deleteDoc(doc(this.firestore, "artistas", albumId ));
  }

  addPlaylist(playlist:Playlist){
    const playlistRef = collection(this.firestore, 'playlists');
    return addDoc(playlistRef, playlist);
  }

  addArtist(artist:Artista){
    const artistRef = collection(this.firestore, 'artistas');
    return addDoc(artistRef, artist);
  }

  addAlbum(artistId:string, newAlbum:Album){
    const artistRef = collection(this.firestore, `artistas/${artistId}/albumes`);
    return addDoc(artistRef, newAlbum);
  }

  addSong(artistId:string, albumId:string, newSong:Album){
    const albumRef = collection(this.firestore, `artistas/${artistId}/albumes/${albumId}/canciones`);
    return addDoc(albumRef, newSong);
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

  async getAlbumUIDByArtistaIdyNombre(artistaId:string, albumNombre:string){
    let uid = ""
    if (albumNombre !== null) {
      const q = query(collection(this.firestore, `artistas/${artistaId}/albumes`), where("nombre", "==", albumNombre))
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
