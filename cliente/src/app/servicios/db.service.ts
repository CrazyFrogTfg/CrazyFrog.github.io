import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc, query, where, getDocs } from '@angular/fire/firestore';
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
  favs:Array<any> = []

  constructor(private firestore:Firestore) {
    let savedFavs = localStorage.getItem("favs") || "[]"
    this.favs = JSON.parse(savedFavs)
  }

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

  async deletePlaylist(playlistId:string){
    await deleteDoc(doc(this.firestore, "playlists", playlistId));
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

  async updatePlaylist(playlistId:any, playlist:Playlist, oldPlaylist:Playlist){
    const playlistRef = doc(this.firestore, 'playlists', playlistId);

        //Actualizamos Nombre playlist si ha cambiado
        if(playlist.nombre && playlist.nombre != oldPlaylist.nombre)
        await updateDoc(playlistRef, {
          nombre:playlist.nombre,
        })

        //Actualizamos privacidad si ha cambiado
        if(playlist.privada && playlist.privada != oldPlaylist.privada){
          await updateDoc(playlistRef, {
            privada:playlist.privada,
          })
        }
      //}
  }
  setFav(favorito:Album){
    if(!this.favs.includes(favorito)){
      this.favs.push(favorito)
      localStorage.setItem("favs", JSON.stringify(this.favs))
    }
  }

  delFav(favorito:any){
    let posicion = this.favs.indexOf(favorito)
    if (posicion != -1){
      this.favs.splice(posicion, 1)
      localStorage.setItem("favs", JSON.stringify(this.favs))
    }
  }

  isFav(favorito:any){
    return this.favs.includes(favorito)
  }

  getFavs():Array<any>{
    return this.favs
  }

}
