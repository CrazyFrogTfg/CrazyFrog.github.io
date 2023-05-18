import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, query, where, getDocs } from '@angular/fire/firestore';
import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';
import { updateDoc } from 'firebase/firestore';
import { DbService } from './db.service';
import { Artista } from '../interfaces/artista.interface';


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

  constructor(private firestore: Firestore, private db:DbService) { }
  
  getFilterName():string{
    return this.filterName
  }

  setFilterName(newName:string){
    this.filterName = newName
  }

  async getImageArtist(aid: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const imagesRef = ref(this.storage, `artists/${aid}/imageArtist`);
        //const response = await listAll(imagesRef);
        //for (let item of response.items) {
          const url = await getDownloadURL(imagesRef);
          console.log(url)
          resolve(url);
          return;
          
        //}
        //throw new Error('No se encontró ninguna imagen de perfil.');
      } catch (error) {
        console.log(error);
        reject(error);
  }})}

  uploadImageArtist($event:any, aid:string){
    //Preparamos la imagen dandole ruta
    const file = $event.target.files[0];
    const fileRef = ref(this.storage, `artists/${aid}/imageArtist`)

    //subimos la imagen
    uploadBytes(fileRef, file)
    .then(async response =>{
      //Despues, obtenemos la imagen, guardamos en una variable
      const imagenArtist = await this.getImageArtist(aid)
        //Introducimos dicha variable en el campo "image" del artista
        const artistRef = doc(this.firestore, 'artistas', aid);
        await updateDoc(artistRef, {
          image:imagenArtist,
        })
      
    })
    .catch(error => console.log(error));
  }
  
  uploadImageAlbum($event:any, artistaId:string, albumName:string, albumId:any){
    console.log("entramos a uploadImageAlbum en fireStorageService")
    //Preparamos la imagen dandole ruta
    const file = $event.target.files[0];
    const fileRef = ref(this.storage, `artists/${artistaId}/${albumName}`)
    console.log("preparamos el file para subirlo a: `artists/"+artistaId+"/"+albumName)
    //subimos la imagen
    uploadBytes(fileRef, file)
    .then(async response =>{
      //const imagenAlbum = getDownloadURL(fileRef)
      console.log("subido el fichero. fichero completo:")
      console.log(response)

      //Despues, obtenemos la imagen, guardamos en una variable
      const imagenAlbum = await this.getImageAlbum(artistaId,albumName)
      
      // SI UPDATEA
        const albumRef = doc(this.firestore, `artistas/${artistaId}/albumes/${albumId}`);
        await updateDoc(albumRef, {
          //nombre:"updateadoElDoc",
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
            console.log("url imagen album =" +url)
            resolve(url);
            return;
       // }
       // throw new Error('No se encontró ninguna imagen de album.');
      } catch (error) {
        console.log(error);
        reject(error);
  }})}






  /*getDownloadURL(imageDown)
  .then((imageURL) => {
    this.srcImage = imageURL
    // Insert url into an <img> tag to "download"
  }) 

  reproducir()
  {
    return this.cancionRef
  }

  
   //FUNCIONES GET/SET PARA EL FILTRADO DE PLAYLISTS!
  getNamePlaylist():string
  {
    return this.namePlaylist;
  }

  setNamePlaylist(newName:string){
    //Código a desarrollar. Esto serviria para setear el newNamePlaylist para el filter!!
    this.namePlaylist = newName;
  }*/
}
