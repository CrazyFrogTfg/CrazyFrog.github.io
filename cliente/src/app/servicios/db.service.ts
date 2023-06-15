import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc, query, where, getDocs, getDoc, QuerySnapshot } from '@angular/fire/firestore';
import { Artist } from '../interfaces/artist.interface';
import { Album } from '../interfaces/album.interface';
import { Observable } from 'rxjs';
import { Playlist } from '../interfaces/playlist.interface';
import { Song } from '../interfaces/song.interface';
import { FireStorageService } from './fire-storage.service';
import { Storage } from '@angular/fire/storage';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class DbService {

  playlists:Playlist[] = []
  artistsFav:Array<any> = []
  albumsFav:Array<any> = []
  artistsFavInfo:Array<any> = []
  albumsFavInfo:Array<any> = []

  constructor(private firestore:Firestore, private fireStorage:FireStorageService, private storage:Storage, private router:Router) {
    let savedAlbumsFav = localStorage.getItem("albumsFav") || "[]"
    this.albumsFav = JSON.parse(savedAlbumsFav);

    let savedArtistsFav = localStorage.getItem("artistsFav") || "[]"
    this.artistsFav = JSON.parse(savedArtistsFav)
  }

  async addArtist(artist:Artist, file:any){
    const q = query(collection(this.firestore, "artists"), where("name", "==", artist.name))
    const querySnapshots = await getDocs(q)
    if(querySnapshots.docs.length === 0){
      const artistRef = collection(this.firestore, 'artists');
      addDoc(artistRef, artist);

      const artistId = await this.getArtistUIDByName(artist.name)
      this.uploadImageArtist(file, artistId)
      return true
    }
    return false
  }

  uploadImageArtist(event:any, artistId:string){
    this.fireStorage.uploadImageArtist(event, artistId)
  }

  async getNovedades(currentDate:string){
    console.log(currentDate)
    let novedades=[]
    const q = query(collection(this.firestore, "artists"), where("dateCreation", "==", currentDate))
    //const querySnapshots = await getDocs(q)
    return collectionData(q, { idField: 'id'}) as Observable<Artist[]>;
    // querySnapshots.forEach( artist =>{
    //   novedades.push(artist)
    // })
    // return novedades
    // const artistaRef = collection(this.firestore, 'artists')
  }

  getArtists(): Observable<Artist[]>{
    const artistaRef = collection(this.firestore, 'artists')
    return collectionData(artistaRef, { idField: 'id'}) as Observable<Artist[]>;
  }

  async getArtistByUID(artistId: string) {
    const artistRef = doc(this.firestore, 'artists', artistId);
    const artistSnapshot = await getDoc(artistRef);
    const artist = artistSnapshot.data();
    if (artist) return artist['name'];
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

  async deleteArtist(artistId:string){
    const q = query(collection(this.firestore, "albums"), where("artistId", "==", artistId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (albumDoc) => {
      await this.deleteAlbum(albumDoc.id)
    });
    await this.fireStorage.deleteArtistImage(artistId)
    await deleteDoc(doc(this.firestore, "artists", artistId));
  }

  async addAlbum(album:Album, file:any){
    const q = query(collection(this.firestore, "albums"), where("name", "==", album.name))
    const querySnapshots = await getDocs(q)
    if(querySnapshots.docs.length === 0){
      const albumRef = collection(this.firestore, 'albums');
      await addDoc(albumRef, album);
      // The album is created. Now we update it with the atribute "image", taking its ID
      const q = query(collection(this.firestore, "albums"), where("name", "==", album.name))
      const querySnapshots = await getDocs(q)
      let albumId = querySnapshots.docs[0].id;
      this.uploadImageAlbum(file, album.artistId, album.name, albumId)
      return true
    }
    return false
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

        // Actualizamos el file si han añadido uno nuevo
        if(file){
          this.uploadImageAlbum(file, album.artistId, album.name, albumId)
        }
  }

  async deleteAlbum(albumId: any) {
    const q = query(collection(this.firestore, "songs"), where("albumId", "==", albumId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (songDoc) => {
      await this.fireStorage.deleteSongFile(songDoc)
      await deleteDoc(doc(this.firestore, "songs", songDoc.id));
    });
    const albumRef = doc(this.firestore, "albums", albumId);
    const albumSnap = await getDoc(albumRef);
    const album = albumSnap.data();
    await this.fireStorage.deleteAlbumImage(album)
    await deleteDoc(doc(this.firestore, "albums", albumId));
  }

  getSongs(): Observable<Song[]>{
    const songRef = collection(this.firestore, 'songs')
    return collectionData(songRef, { idField: 'id'}) as Observable<Song[]>;
  }

  async addSong(song:Song, file:any){
    // Retornamos si se ha creado o no para controlar error de nombre existente.
    const q = query(collection(this.firestore, "songs"), where("name", "==", song.name))
    const querySnapshots = await getDocs(q)
    if(querySnapshots.docs.length === 0)
    {
      song.lyrics = song.lyrics.replace(/\n/g, '&#10;');
      const songRef = collection(this.firestore, 'songs');
      await addDoc(songRef, song);

      const q = query(collection(this.firestore, "songs"), where("name", "==", song.name))
      const querySnapshots = await getDocs(q)
      let songId = querySnapshots.docs[0].id;
      this.uploadSong(file, song, songId)
      return true
    }
      return false
  }

  uploadSong(file:any, song:Song, songId:string){
    this.fireStorage.uploadSong(file, song, songId)
  }

  async updateSong(song:Song, oldSong:Song){
    const songRef = doc(this.firestore, 'songs', oldSong.id);
        //Actualizamos Nombre album si ha cambiado
        if(song.name && song.name != oldSong.name)
        await updateDoc(songRef, {
          name:song.name,
        })
        if(song.lyrics && song.lyrics != oldSong.lyrics)
        await updateDoc(songRef, {
          lyrics:song.lyrics,
        })
  }

  async deleteSong(song: any) {
    const playlistRef = collection(this.firestore, 'playlists');
    const playlistsSnapshot = await getDocs(playlistRef);
    playlistsSnapshot.forEach(async (playlistDoc) => {
      const q = query(collection(this.firestore, `playlists/${playlistDoc.id}/songs`),  where("id", "==", song.id));
      const songInPlaylist = await getDocs(q);
      if (!songInPlaylist.empty) {
        songInPlaylist.forEach(async (songDoc) => {
          await this.deleteSongPlaylist(playlistDoc.id, songDoc.id);
        });
      }})
    await deleteDoc(doc(this.firestore, 'songs', song.id));
    await this.fireStorage.deleteSongFile(song);
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

  async addPlaylist(playlist:Playlist){
    const q = query(collection(this.firestore, "playlists"), where("name", "==", playlist.name))
    const querySnapshots = await getDocs(q)
    if(querySnapshots.docs.length === 0)
    {
      const playlistRef = collection(this.firestore, 'playlists');
      await addDoc(playlistRef, playlist);
      return true;
    }else{
      return false;
    }
  }

  getPlaylistByUser(uid:string): Observable<Playlist[]>{
    // Con la linea siguiente vaciamos el array para que no se llene continuamente.
    this.playlists=[]
    // Obtenemos el array de manera Observable de las playlist del usuario.
    const q = query(collection(this.firestore, "playlists"), where("owner", "==", uid))
    return collectionData(q, { idField: 'id'}) as Observable<Playlist[]>;
  }

  async getSongById(songId:string)
  {
    const songsRef = doc(this.firestore, "songs", songId);
    const songDoc = await getDoc(songsRef);
    return songDoc.data()
  }

  async updatePlaylist(playlist:Playlist, oldPlaylist:Playlist){
    const playlistRef = doc(this.firestore, 'playlists', oldPlaylist.id);
    //Actualizamos Nombre playlist si ha cambiado
    if(playlist.name && playlist.name != oldPlaylist.name)
        await updateDoc(playlistRef, {
          name:playlist.name,
        })

        //Actualizamos privacidad si ha cambiado
        if(playlist.private != oldPlaylist.private){
          await updateDoc(playlistRef, {
            private:playlist.private,
          })
        }
  }

  async deletePlaylist(playlistId:string){
    const songsRef = collection(this.firestore, "playlists", playlistId, "songs")
    const songsDocs = await getDocs(songsRef)
    songsDocs.forEach(async (songDoc) => {
      this.deleteSongPlaylist(playlistId, songDoc.id)
    });
    await deleteDoc(doc(this.firestore, "playlists", playlistId));
  }

  //Favs de album - pegar un ojo
  setAlbumFav(favorite:string){
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

  addSongToPlaylist2(playlist:Playlist, song:Song){
    const playlistRef = collection(this.firestore, `playlists/${playlist.id}/songs`);
    addDoc(playlistRef, song);
  }

  addSongToPlaylist(playlist:Playlist, song:any){
    const playlistRef = collection(this.firestore, `playlists/${playlist.id}/songs`);
    const songData = { songId: song.id };
    addDoc(playlistRef, songData);
  }

  async updatePlaylist2(albumId:string, album:Album, oldAlbum:Album, file:any){
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

  async deleteSongPlaylist(playlistId:string, songId:string){
    await deleteDoc(doc(this.firestore, `playlists/${playlistId}/songs`, songId))
    location.reload();
  }

}
