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
        const imagesRef = ref(this.storage, `artists/${aid}`);
        const response = await listAll(imagesRef);
        for (let item of response.items) {
          const url = await getDownloadURL(item);
          console.log(url)
          resolve(url);
          return;
          
        }
        throw new Error('No se encontró ninguna imagen de perfil.');
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
    //Preparamos la imagen dandole ruta
    const file = $event.target.files[0];
    const fileRef = ref(this.storage, `artists/${artistaId}`)

    //subimos la imagen
    uploadBytes(fileRef, file)
    .then(async response =>{
      //Despues, obtenemos la imagen, guardamos en una variable
      const imagenAlbum = await this.getImageAlbum(artistaId,albumName)
        //Introducimos dicha variable en el campo "image" del album. Me falta idAlbum
        const albumRef = doc(this.firestore, 'artistas', artistaId,'albumes', albumId );
        await updateDoc(albumRef, {
          image:imagenAlbum,
        })
      
    })
    .catch(error => console.log(error));
  }

  async getImageAlbum(aid: string, albumName:string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const imagesRef = ref(this.storage, `artists/${aid}/${albumName}`);
        const response = await listAll(imagesRef);
        for (let item of response.items) {
          const url = await getDownloadURL(item);
          console.log(url)
          resolve(url);
          return;
          
        }
        throw new Error('No se encontró ninguna imagen de perfil.');
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
