import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from 'src/app/servicios/db.service';
import { FireStorageService } from 'src/app/servicios/fire-storage.service';
import { Firestore, collection, addDoc, doc, getDocs, getDoc, where, query} from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { Album } from 'src/app/interfaces/album.interface';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Artista } from 'src/app/interfaces/artista.interface';
import { Title} from '@angular/platform-browser';

@Component({
  selector: 'app-new-album',
  templateUrl: './new-album.component.html',
  styleUrls: ['./new-album.component.css']
})
export class NewAlbumComponent {

  newAlbum:FormGroup
  myEvent:any
  albumes:Album[]=[]
  userInfo:any
  isAdmin:boolean = false;
  artistaId:string="";


  constructor(private firestore:Firestore, private route:ActivatedRoute,
    private userService:UsuariosService, private router:Router, private db:DbService,
    private fireStorage:FireStorageService, private title:Title) { title.setTitle('Mediafrog-Nuevo Album')

    this.newAlbum = new FormGroup({
      nombre: new FormControl(),
      anyo: new FormControl(),
      image: new FormControl(),
    })
  }

  async ngOnInit() {

    this.userInfo = await this.userService.getUserInfo()
    if(this.userInfo.admin) this.isAdmin = true
    await this.route.queryParams.subscribe(async params => {
    this.artistaId = params['artistaId']
      // const docRef = doc(this.firestore, 'artistas', this.artista.id);
      // const docSnap = await getDoc(docRef);
      // this.artistaInfo = docSnap.data();
      // const artistasRef = collection(this.firestore, 'artistas');
      // const artistaRef = doc(artistasRef, this.artistaId);
      // const albumesRef = collection(artistaRef, 'albumes');
      // const q = query(albumesRef);
      // const querySnapshot = await getDocs(q);

      // querySnapshot.forEach(async (doc) => {
      //   const album = {
      //     id: doc.id,
      //     nombre: doc.data()['nombre'],
      //     anyo: doc.data()['año'],
      //     image: doc.data()['image']
      //   };
      //   this.albumes.push(album);
      // });
    });
  }

  goHome(){
    this.router.navigate(['/home']);
  }

  async onSubmit(){
    if(this.artistaId && this.newAlbum.value)
    {
        await this.db.addAlbum(this.artistaId, this.newAlbum.value)
      //No se puede subir imagen al Storage porque no se termina de definir correctamente la url
      //de subida... Ya lo veremos ;)
        if(this.myEvent)
        {
          const aid = await this.db.getAlbumUIDByArtistaIdyNombre(this.artistaId, this.newAlbum.value.nombre)
          this.uploadImageAlbum(this.myEvent, this.artistaId, this.newAlbum.value, aid)
        }
      setTimeout( () => this.router.navigate(['/artista'], { queryParams: { id: this.artistaId} }), 1200)

    }
  }

  uploadImageAlbum($event:any, artistId:string, albumName:Album, aid:string){
    this.fireStorage.uploadImageAlbum($event, artistId, albumName.nombre, aid)
  }

  setMyEvent($event:any){
    this.myEvent = $event
  }

}
