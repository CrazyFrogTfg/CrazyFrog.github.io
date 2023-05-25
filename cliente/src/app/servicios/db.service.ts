import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc, query, where, getDocs, getDoc } from '@angular/fire/firestore';
import { Artist } from '../interfaces/artist.interface';
import { Album } from '../interfaces/album.interface';
import { Observable } from 'rxjs';
import { Playlist } from '../interfaces/playlist.interface';
import { Song } from '../interfaces/song.interface';
import { FireStorageService } from './fire-storage.service';


@Injectable({
  providedIn: 'root'
})
export class DbService {

  playlists:Playlist[] = []
  artistsFav:Array<any> = []
  albumsFav:Array<any> = []
  artistsFavInfo:Array<any> = []
  albumsFavInfo:Array<any> = []

  constructor(private firestore:Firestore, private fireStorage:FireStorageService) {
    let savedAlbumsFav = localStorage.getItem("albumsFav") || "[]"
    this.albumsFav = JSON.parse(savedAlbumsFav);

    let savedArtistsFav = localStorage.getItem("artistsFav") || "[]"
    this.artistsFav = JSON.parse(savedArtistsFav)
  }

  async addArtist(artist:Artist, file:any){
    const q = query(collection(this.firestore, "artists"), where("name", "==", artist.name))
    const querySnapshots = await getDocs(q)
    if(querySnapshots.docs.length === 0)
    {
      const artistRef = collection(this.firestore, 'artists');
      addDoc(artistRef, artist);

      const artistId = await this.getArtistUIDByName(artist.name)
      this.uploadImageArtist(file, artistId)
    }else{
      window.confirm("Ese nombre de artista ya está en uso.\nSerás redirigido al buscador.")
    }
  }

  uploadImageArtist(event:any, artistId:string){
    this.fireStorage.uploadImageArtist(event, artistId)
  }

  getArtists(): Observable<Artist[]>{
    const artistaRef = collection(this.firestore, 'artists')
    return collectionData(artistaRef, { idField: 'id'}) as Observable<Artist[]>;
  }

  async updateArtist(artistId:any, artist:Artist, oldArtist:Artist, file:any){
    const artistaRef = doc(this.firestore, 'artists', artistId);
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

        if(file){
          this.uploadImageArtist(file, artistId)
        }
  }

  async deleteArtist(uid:string){
    await deleteDoc(doc(this.firestore, "artists", uid));
  }

  async addAlbum(album:Album, file:any){
    const q = query(collection(this.firestore, "albums"), where("name", "==", album.name))
    const querySnapshots = await getDocs(q)
    if(querySnapshots.docs.length === 0)
    {
      const albumRef = collection(this.firestore, 'albums');
      await addDoc(albumRef, album);

      const q = query(collection(this.firestore, "albums"), where("name", "==", album.name))
      const querySnapshots = await getDocs(q)
      let albumId = querySnapshots.docs[0].id;
      this.uploadImageAlbum(file, album.artistId, album.name, albumId)
    }else{
      window.confirm("Ese nombre de album ya está en uso.\nSerás redirigido al buscador.")
    }
  }

  uploadImageAlbum(event:any, artistId:string, albumName:string, albumId:string){
    this.fireStorage.uploadImageAlbum(event, artistId, albumName, albumId)
  }

  getAlbums(): Observable<Album[]>{
    const albumRef = collection(this.firestore, 'albums')
    return collectionData(albumRef, { idField: 'id'}) as Observable<Album[]>;
  }

  async updateAlbum(albumId:string, album:Album, oldAlbum:Album, file:any){
    const albumRef = doc(this.firestore, 'albums', albumId);
        //Actualizamos Nombre album si ha cambiado
        if(album.name && album.name != oldAlbum.name)
        await updateDoc(albumRef, {
          name:album.name,
        })

        //Actualizamos año si ha cambiado
        if(album.year && album.year != oldAlbum.year){
          await updateDoc(albumRef, {
            year:album.year,
          })
        }

        //event:any, artistId:string, albumName:string, albumId:string
        if(file){
          this.uploadImageAlbum(file, album.artistId, album.name, albumId)
        }
  }

  async deleteAlbum(albumId:any){
    await deleteDoc(doc(this.firestore, "albums", albumId));
  }

  getSongs(): Observable<Song[]>{
    const songRef = collection(this.firestore, 'songs')
    return collectionData(songRef, { idField: 'id'}) as Observable<Song[]>;
  }

  addSong2(newSong:Song, file:any){
    const albumRef = collection(this.firestore, `songs`);
    return addDoc(albumRef, newSong);
  }

  async addSong(song:Song, file:any){
    console.log("Entrando a dbservice addSong")
    console.log("song arti id:" +song.artistId)
    const q = query(collection(this.firestore, "songs"), where("name", "==", song.name))
    const querySnapshots = await getDocs(q)
    if(querySnapshots.docs.length === 0)
    {
      console.log("Comprobado que no existe cancion con mismo nombre")
      const songRef = collection(this.firestore, 'songs');
      await addDoc(songRef, song);
      console.log("Cancion subida a database")

      const q = query(collection(this.firestore, "songs"), where("name", "==", song.name))
      const querySnapshots = await getDocs(q)
      let songId = querySnapshots.docs[0].id;
      console.log("recogido songId: "+ songId)
      this.uploadSong(file, song, songId)
    }else{
      window.confirm("Ese nombre de la canción ya está en uso.\nSerás redirigido al buscador.")
    }
  }

  uploadSong(file:any, song:Song, songId:string){
    this.fireStorage.uploadSong(file, song, songId)
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

  async getAlbumUIDByName( albumName:string){
    let uid = ""
    if (albumName !== null) {
      const q = query(collection(this.firestore, 'albums'), where("name", "==", albumName))
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
        id: doc.id,
        name: doc.data()['name'],
        private: doc.data()['private'],
        owner: doc.data()['owner'],
        songs: []
      };
      this.playlists.push(playlist);
    })
    console.log(this.playlists)
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
  setAlbumFav(favorite:string){
    if(!this.albumsFav.includes(favorite)){
      this.albumsFav.push(favorite)
      localStorage.setItem("albumsFav", JSON.stringify(this.albumsFav))
    }
  }

  delAlbumFav(favorite:string){
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
      const docRef = doc(this.firestore, 'albums', album);
      const docSnap = await getDoc(docRef);
      const albumInfo = docSnap.data();
      if(albumInfo){
        albumInfo['id'] = album;
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

  addSongToPlaylist(playlist:Playlist, song:Song){
    console.log(playlist, song)
    const playlistRef = collection(this.firestore, `playlists/${playlist.id}/songs`);
    addDoc(playlistRef, song);
  }

}
