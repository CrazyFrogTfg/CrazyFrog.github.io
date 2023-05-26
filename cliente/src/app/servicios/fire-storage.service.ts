import { Injectable } from '@angular/core';
import { Firestore, doc } from '@angular/fire/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL,deleteObject } from '@angular/fire/storage';
import { updateDoc } from 'firebase/firestore';
import { Song } from '../interfaces/song.interface';


@Injectable({
  providedIn: 'root'
})
export class FireStorageService {

  storage = getStorage()
  srcImage:any
  imageDown = ref(this.storage, 'images/rana.jpg')
  cancionRef:string = "gs://mediafrog-816db.appspot.com/songs/Amazing_Harmonica_Street_Musician_192_kbps.mp3";
  //VARIABLE PARA PIPES.
  filterName:string="";
  firesbaseStorage="https://firebasestorage.googleapis.com/v0/b/mediafrog-816db.appspot.com/o/"
  rutatotal="https://firebasestorage.googleapis.com/v0/b/mediafrog-816db.appspot.com/o/artists%2FSDlYHnzITTeu418fv2cN%2Fotramas?alt=media&token=5b2885b2-c33a-47e0-a146-3900badd21af"
  private namePlaylist:string ="hola";

  constructor(private firestore: Firestore) { }

  getFilterName():string{
    return this.filterName
  }

  setFilterName(newName:string){
    this.filterName = newName
  }

  uploadImageArtist($event:any, artistId:string){
    //Preparamos la imagen dandole ruta
    const file = $event.target.files[0];
    const fileRef = ref(this.storage, `artists/${artistId}/imageArtist`)

    //subimos la imagen
    uploadBytes(fileRef, file)
    .then(async () => {
      //Despues, obtenemos la imagen, guardamos en una variable
      const imagenArtist = await this.getImageArtist(artistId)
        //Introducimos dicha variable en el campo "image" del artista
        const artistRef = doc(this.firestore, 'artists', artistId);
        await updateDoc(artistRef, {
          image:imagenArtist,
        })
    })
    .catch(error => console.log(error));
  }

  async getImageArtist(aid: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const imagesRef = ref(this.storage, `artists/${aid}/imageArtist`);
        //const response = await listAll(imagesRef);
        //for (let item of response.items) {
          const url = await getDownloadURL(imagesRef);
          resolve(url);
          return;

        //}
        //throw new Error('No se encontró ninguna imagen de perfil.');
      } catch (error) {
        console.log(error);
        reject(error);
  }})}



  uploadImageAlbum($event:any, artistaId:string, albumName:string, albumId:any){
    //Preparamos la imagen dandole ruta
    const file = $event.target.files[0];
    const fileRef = ref(this.storage, `artists/${artistaId}/${albumName}`)
    //subimos la imagen
    uploadBytes(fileRef, file)
    .then(async response =>{
      //const imagenAlbum = getDownloadURL(fileRef)
      //Despues, obtenemos la imagen, guardamos en una variable
      const imagenAlbum = await this.getImageAlbum(artistaId, albumName)

      // SI UPDATEA
        const albumRef = doc(this.firestore, `albums/${albumId}`);
        await updateDoc(albumRef, {
          image:imagenAlbum,
        })
        .then(response => console.log(response))

    })
    .catch(error => console.log(error));
  }

  //LA IMAGEN DEBERIA ESTAR EN artist/artistId/NombreAlbum
  async getImageAlbum(artistaId:any, albumName:any): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        //const link:string =`${artistaId}/${albumName}`
        const imagesRef = ref(this.storage, `artists/${artistaId}/${albumName}`);
        //const response = await listAll(imagesRef);
       // for (let item of response.items) {
            const url = await getDownloadURL(imagesRef);
            resolve(url);
            return;
       // }
       // throw new Error('No se encontró ninguna imagen de album.');
      } catch (error) {
        console.log(error);
        reject(error);
  }})}

  uploadSong($event:any, song:Song, songId:string){
    //STORAGE
    const file = $event.target.files[0];
    const fileRef = ref(this.storage, `songs/${song.artistId}/${song.albumId}/${songId}`)
    //subimos la cancion
    uploadBytes(fileRef, file)
    .then(async response =>{
      console.log(response)
      //Despues, obtenemos la imagen, guardamos en una variable
      const songFile = await this.getSongFile(song,songId)

      // UPDATEAR FIREBASE DATABASE (NO STORAGE)
        const songRef = doc(this.firestore, `songs/${songId}`);
        await updateDoc(songRef, {
          file:songFile,
        })
        .then(response => console.log(response))
    })
    .catch(error => console.log(error));
  }

  async getSongFile(song:Song,songId:string): Promise<string> {
    console.log("getSongFile")
    return new Promise(async (resolve, reject) => {
      try {
        const songRef = ref(this.storage, `songs/${song.artistId}/${song.albumId}/${songId}`);
          const url = await getDownloadURL(songRef);
          console.log("url= "+url)
          resolve(url);
          return;
      } catch (error) {
        console.log(error);
        reject(error);
  }})}

  async deleteSongFile(song:any){
    const songRef = ref(this.storage, `songs/${song.data()['artistId']}/${song.data()['albumId']}/${song.id}`);
    // Delete the file
    deleteObject(songRef).then(() => {
    // File deleted successfully
    }).catch((error) => {
    // Uh-oh, an error occurred!
    });
  }

  async deleteAlbumImage(album:any){
    const albumRefImages = ref(this.storage, `artists/${album.artistId}/${album.name}`);
    deleteObject(albumRefImages).then(() => {
    // File deleted successfully
    }).catch((error) => {
    // Uh-oh, an error occurred!
    });
  }

  async deleteArtistImage(artist:any){
    const albumRefImages = ref(this.storage, `artists/${artist}/imageArtist`);
    deleteObject(albumRefImages).then(() => {
    // File deleted successfully
    }).catch((error) => {
    // Uh-oh, an error occurred!
    });
  }



}
