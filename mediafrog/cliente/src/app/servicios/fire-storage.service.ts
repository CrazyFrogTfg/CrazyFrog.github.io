import { Injectable } from '@angular/core';
import { getStorage, ref, getDownloadURL} from "firebase/storage";

@Injectable({
  providedIn: 'root'
})
export class FireStorageService {
  
  storage = getStorage()
  srcImage:any
  imageDown = ref(this.storage, 'images/rana.jpg')
  cancionRef:string = "gs://mediafrog-816db.appspot.com/songs/Amazing_Harmonica_Street_Musician_192_kbps.mp3";

  //VARIABLE PARA PIPE DE NAMEPLAYLIST.
  private namePlaylist:string ="hola";

  constructor() { }
  

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
