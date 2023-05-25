import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc, query, where, getDocs, getDoc } from '@angular/fire/firestore';
import { Artist } from '../interfaces/artist.interface';
import { Album } from '../interfaces/album.interface';
import { Observable } from 'rxjs';
import { Playlist } from '../interfaces/playlist.interface';


@Injectable({
  providedIn: 'root'
})
export class DbService {

  playlists:Playlist[] = []
  artistsFav:Array<any> = []
  albumsFav:Array<any> = []
  artistsFavInfo:Array<any> = []
  albumsFavInfo:Array<any> = []

  constructor(private firestore:Firestore) {
    let savedAlbumsFav = localStorage.getItem("albumsFav") || "[]"
    this.albumsFav = JSON.parse(savedAlbumsFav);

    let savedArtistsFav = localStorage.getItem("artistsFav") || "[]"
    this.artistsFav = JSON.parse(savedArtistsFav)
  }

  addArtist(artist:Artist){
    const artistRef = collection(this.firestore, 'artists');
    return addDoc(artistRef, artist);
  }

  getArtists(): Observable<Artist[]>{
    const artistaRef = collection(this.firestore, 'artists')
    return collectionData(artistaRef, { idField: 'id'}) as Observable<Artist[]>;
  }

  async updateArtistDb(uid:any, artist:Artist, oldArtist:Artist){
    const artistaRef = doc(this.firestore, 'artists', uid);
        //Actualizamos Nombre artista si ha cambiado
        if(artist.name && artist.name != oldArtist.name)
        await updateDoc(artistaRef, {
          name:artist.name,
        })

        //Actualizamos descripcion si ha cambiado
        if(artist.description && artist.description != oldArtist.description){
          await updateDoc(artistaRef, {
            description:artist.description,
          })
        }
  }

  async deleteArtist(uid:string){
    await deleteDoc(doc(this.firestore, "artists", uid));
  }

  getAlbums(): Observable<Album[]>{
    const albumRef = collection(this.firestore, 'albums')
    return collectionData(albumRef, { idField: 'id'}) as Observable<Album[]>;
  }
  
  addAlbum(artistId:string, newAlbum:Album){
    newAlbum.artistId = artistId
    const albumRef = collection(this.firestore, 'albums');
    return addDoc(albumRef, newAlbum);
  }
  
  async deleteAlbum(albumId:any){
    prompt("Funcion deleteAlbum incompleta. DB-SERVICE")
    //Faltaría artistaId para poder rellenar la ruta para encontrar el Doc a eliminar...
    //await deleteDoc(doc(this.firestore, "artistas", albumId ));
  }
  
  addSong(artistId:string, albumId:string, newSong:Album){
    const albumRef = collection(this.firestore, `artistas/${artistId}/albumes/${albumId}/canciones`);
    return addDoc(albumRef, newSong);
  }
  
  
  async getArtistUID(artist:Artist){
    let uid = ""
    if (artist !== null) {
      const q = query(collection(this.firestore, "artists"), where("name", "==", artist.name))
      const querySnapshots = await getDocs(q)
      uid = querySnapshots.docs[0].id;
    }
    return uid
  }

  async getArtistUIDByName(artistName:string){
    let uid = ""
    if (artistName !== null) {
      const q = query(collection(this.firestore, "artists"), where("name", "==", artistName))
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
  
  addPlaylist(playlist:Playlist){
    const playlistRef = collection(this.firestore, 'playlists');
    return addDoc(playlistRef, playlist);
  }
  
  async getPlaylistByUser(uid:string){
  //Con la linea siguiente vaciamos el array para que no se llene continuamente.
  this.playlists=[]
  const q = query(collection(this.firestore, "playlists"), where("owner", "==", uid))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      const playlist = {
        name: doc.data()['name'],
        private: doc.data()['private'],
        owner: doc.data()['owner'],
        songs: []
      };
      this.playlists.push(playlist);
    })
    return this.playlists
  }
  
  async updatePlaylist(playlistId:any, playlist:Playlist, oldPlaylist:Playlist){
    const playlistRef = doc(this.firestore, 'playlists', playlistId);
    //Actualizamos Nombre playlist si ha cambiado
    if(playlist.name && playlist.name != oldPlaylist.name)
        await updateDoc(playlistRef, {
          name:playlist.name,
        })

        //Actualizamos privacidad si ha cambiado
        if(playlist.private && playlist.private != oldPlaylist.private){
          await updateDoc(playlistRef, {
            private:playlist.private,
          })
        }
      //}
    }
    
    async deletePlaylist(playlistId:string){
      await deleteDoc(doc(this.firestore, "playlists", playlistId));
    }

  //Favs de album - pegar un ojo
  setAlbumFav(favorite:any){
    if(!this.albumsFav.includes(favorite)){
      this.albumsFav.push(favorite)
      localStorage.setItem("albumsFav", JSON.stringify(this.albumsFav))
    }
  }

  delAlbumFav(favorite:any){
    let posicion = this.albumsFav.indexOf(favorite)
    if (posicion != -1){
      this.albumsFav.splice(posicion, 1)
      localStorage.setItem("albumsFav", JSON.stringify(this.albumsFav))
    }
  }

  isAlbumFav(favorite:string){
    return this.albumsFav.includes(favorite)
  }

  async getAlbumsFav():Promise<any[]>{
    this.albumsFavInfo = []
    this.albumsFav.forEach(async album => {
      const docRef = doc(this.firestore, 'artistas', album.idArtista, 'albumes', album.idAlbum);
      const docSnap = await getDoc(docRef);
      const albumInfo = docSnap.data();
      if(albumInfo){
        albumInfo['id'] = album.idAlbum;
        albumInfo['idArtista'] = album.idArtista;
        this.albumsFavInfo.push(albumInfo)
      }
    });
    return this.albumsFavInfo
  }

  //Favs de artista - Pegar un ojo
  setArtistFav(favArtist:string){
    if(!this.artistsFav.includes(favArtist)){
      this.artistsFav.push(favArtist)
      localStorage.setItem("artistsFav", JSON.stringify(this.artistsFav))
    }
  }

  delArtistFav(favArtist:string){
    let posicion = this.artistsFav.indexOf(favArtist)
    if (posicion != -1){
      this.artistsFav.splice(posicion, 1)
      localStorage.setItem("artistsFav", JSON.stringify(this.artistsFav))
    }
  }

  isArtistFav(favorite:string){
    return this.artistsFav.includes(favorite)
  }

  async getArtistsFav():Promise<any[]>{
    this.artistsFavInfo = []
    this.artistsFav.forEach(async artist => {
      const docRef = doc(this.firestore, 'artists', artist);
      const docSnap = await getDoc(docRef);
      const artistInfo = docSnap.data();
      if(artistInfo){
        artistInfo['id'] = artist;
        this.artistsFavInfo.push(artistInfo)
      }
    });
    return this.artistsFavInfo
  }

}
