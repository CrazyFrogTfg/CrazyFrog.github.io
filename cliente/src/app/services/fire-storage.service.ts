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
  //VARIABLE PARA PIPES.
  filterName:string="";
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
      const imagenArtist = await getDownloadURL(fileRef);
      //const imagenArtist = await this.getImageArtist(artistId)
        //Introducimos dicha variable en el campo "image" del artista
        const artistRef = doc(this.firestore, 'artists', artistId);
        await updateDoc(artistRef, {
          image:imagenArtist,
        })
    })
    .catch(error => console.log(error));
  }

  uploadImageAlbum($event:any, artistaId:string, albumName:string, albumId:any){
    // Prepare the path with the file
    const file = $event.target.files[0];
    const fileRef = ref(this.storage, `artists/${artistaId}/${albumName}`)
    // Uploading the file to Storage
    uploadBytes(fileRef, file)
    .then(async response =>{
      // Taking the url from Storage with the file to set into the doc in Database
      const imagenAlbum = await getDownloadURL(fileRef);
      // Updating the doc with the url with the image
        const albumRef = doc(this.firestore, `albums/${albumId}`);
        await updateDoc(albumRef, {
          image:imagenAlbum,
        })
        //.then(response => console.log(response)) It was using to detail the response in console
    })
    .catch(error => console.log(error));
  }

  uploadSong($event:any, song:Song, songId:string){
    //STORAGE
    const file = $event.target.files[0];
    const fileRef = ref(this.storage, `songs/${song.artistId}/${song.albumId}/${songId}`)
    //subimos la cancion
    uploadBytes(fileRef, file)
    .then(async response =>{
      console.log(response)
      //Despues, obtenemos la imagen, guardamos en una variable
      const songFile = await getDownloadURL(fileRef);
      //const songFile = await this.getSongFile(song,songId)

      // UPDATEAR FIREBASE DATABASE (NO STORAGE)
        const songRef = doc(this.firestore, `songs/${songId}`);
        await updateDoc(songRef, {
          file:songFile,
        })
        .then(response => console.log(response))
    })
    .catch(error => console.log(error));
  }

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

          //ANTIGUAS FUNCIONES GET FILES. ESTABAN LLAMADAS EN LOS UPLOAD FILES.

      //async getImageAlbum(artistaId:any, albumName:any): Promise<string> {
      //const imagesRef = ref(this.storage, `artists/${artistaId}/${albumName}`);
      //async getSongFile(song:Song,songId:string): Promise<string> {
      //const songRef = ref(this.storage, `songs/${song.artistId}/${song.albumId}/${songId}`);
  // async getImageArtist(aid: string): Promise<string> {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const imagesRef = ref(this.storage, `artists/${aid}/imageArtist`);
  //       //const response = await listAll(imagesRef);
  //       //for (let item of response.items) {
  //         const url = await getDownloadURL(imagesRef);
  //         resolve(url);
  //         return;

  //       //}
  //       //throw new Error('No se encontró ninguna imagen de perfil.');
  //     } catch (error) {
  //       console.log(error);
  //       reject(error);
  // }})}
}
