import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, collection, doc, getDocs, getDoc, query} from '@angular/fire/firestore';
import { Album } from 'src/app/interfaces/album.interface';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { DbService } from 'src/app/servicios/db.service';
import { FormControl, FormGroup } from '@angular/forms';
import { FireStorageService } from 'src/app/servicios/fire-storage.service';
import { Title} from '@angular/platform-browser';

@Component({
  selector: 'app-detalle-artista',
  templateUrl: './detalle-artista.component.html',
  styleUrls: ['./detalle-artista.component.css']
})
export class DetalleArtistaComponent {

  artistId:string = "";
  artistInfo: any
  albums: Album[] = []
  userInfo:any
  isAdmin:boolean = false
  edit:boolean = false
  updateArtist:FormGroup
  myEvent:any
  query:string=""

  constructor(private route: ActivatedRoute, private firestore: Firestore, private userService:UsuariosService,
    private db:DbService, private router:Router, private fireStorage:FireStorageService, private title:Title) { title.setTitle('Mediafrog - Artista'),
      this.updateArtist = new FormGroup({
        id: new FormControl(this.artistId),
        name: new FormControl(),
        description: new FormControl(),
        image: new FormControl(),
      })
    }

  async ngOnInit() {
    this.userInfo = await this.userService.getUserInfo()
    if(this.userInfo.admin) this.isAdmin = true
    this.route.queryParams.subscribe(async params => {
      this.artistId = params['id']
      const docRef = doc(this.firestore, 'artists', this.artistId);
      const docSnap = await getDoc(docRef);
      this.artistInfo = docSnap.data();
      const artistasRef = collection(this.firestore, 'artists');
      const artistaRef = doc(artistasRef, this.artistId);
      const albumesRef = collection(artistaRef, 'albumes');
      const q = query(albumesRef);
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => {
        const album = {
          artistaId: this.artistInfo.id,
          id: doc.id,
          nombre: doc.data()['nombre'],
          anyo: doc.data()['anyo'],
          image: doc.data()['image']
        };
        this.albums.push(album);
      });
    });
  }

  // getFilterName():string{
  //   return this.fireStorage.getFilterName()
  // }
  //            FUNCIONAMIENTO ANTERIOR PARA PIPES. ACTUALIZADO A VARIABLE QUERY, FUNCIONAMIENTO OPTIMIZADO
  // setFilterName(search:string){
  //   this.fireStorage.setFilterName(search)
  // }

  async deleteArtist(artistInfo: any){
    const pregunta="Si deseas eliminar "+artistInfo.name+" escribe su nombre aquí";
    if( prompt(pregunta) == artistInfo.name)
    {
      let uid = await this.db.getArtistUID(artistInfo)
      this.db.deleteArtist(uid)
      this.router.navigate(['/buscador']);
    }
  }

  async goToDetails(artist: any) {
    let uid = await this.db.getArtistUID(artist)
    this.router.navigate(['/artista'], { queryParams: { id: uid} });
  }

  goToNewAlbum(){
    this.router.navigate(['/newalbum'], {queryParams: {artistaId: this.artistId} });
  }

  toggleEdit(){
    this.edit = !this.edit
  }

  setMyEvent($event:any){
    this.myEvent = $event
  }

  async onSubmit(){
    if(this.updateArtist)
    {
      await this.db.updateArtistDb(this.artistId, this.updateArtist.value, this.artistInfo);
      if(this.myEvent)
      {
        this.uploadImageArtist(this.myEvent, this.artistId)
      }
      this.router.navigate(['/home'])
    }
  }

  uploadImageArtist($event:any, artist:string){
    this.fireStorage.uploadImageArtist($event, artist)
  }

}
