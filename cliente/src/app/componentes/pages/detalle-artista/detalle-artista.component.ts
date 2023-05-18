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

  artistaId:string = "";
  artistaInfo: any
  albumes: Album[] = []
  userInfo:any
  isAdmin:boolean = false
  edit:boolean = false
  updateArtist:FormGroup
  myEvent:any

  constructor(private route: ActivatedRoute, private firestore: Firestore, private userService:UsuariosService,
    private db:DbService, private router:Router, private fireStorage:FireStorageService, private title:Title) { title.setTitle('Mediafrog-Artista'),
      this.updateArtist = new FormGroup({
        id: new FormControl(this.artistaId),
        nombre: new FormControl(),
        descripcion: new FormControl(),
      })
    }

  async ngOnInit() {

    this.userInfo = await this.userService.getUserInfo()
    if(this.userInfo.admin) this.isAdmin = true
    this.route.queryParams.subscribe(async params => {
      this.artistaId = params['id']
      const docRef = doc(this.firestore, 'artistas', this.artistaId);
      const docSnap = await getDoc(docRef);
      this.artistaInfo = docSnap.data();
      const artistasRef = collection(this.firestore, 'artistas');
      const artistaRef = doc(artistasRef, this.artistaId);
      const albumesRef = collection(artistaRef, 'albumes');
      const q = query(albumesRef);
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => {
        const album = {
          artistaId: this.artistaInfo.id,
          id: doc.id,
          nombre: doc.data()['nombre'],
          anyo: doc.data()['anyo'],
          image: doc.data()['image']
        };
        this.albumes.push(album);
      });
    });
  }

  getFilterName():string{
    return this.fireStorage.getFilterName()
  }

  setFilterName(search:string){
    this.fireStorage.setFilterName(search)
  }

  async deleteArtist(artistaInfo: any){
    const pregunta="Si deseas eliminar "+artistaInfo.nombre+" escribe su nombre aquí";
    if( prompt(pregunta) == artistaInfo.nombre)
    {
      //artistaInfo.id
      let uid = await this.db.getArtistaUID(artistaInfo)
      this.db.deleteArtist(uid)
      this.router.navigate(['/buscador']);
    }
  }

  async verDetalles(artista: any) {
    let uid = await this.db.getArtistaUID(artista)
    this.router.navigate(['/artista'], { queryParams: { id: uid} });
  }

  goToNewAlbum(){
    this.router.navigate(['/newalbum'], {queryParams: {artistaId: this.artistaId} });
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
      await this.userService.updateArtistaDb(this.artistaId, this.updateArtist.value, this.userInfo);
      if(this.myEvent)
      {
        this.uploadImageArtist(this.myEvent, this.artistaId)
      }
      //this.userService.logout();
      setTimeout(() => this.router.navigate(['/home']), 2000)

    }
  }

  uploadImageArtist($event:any, artist:string){
    this.fireStorage.uploadImageArtist($event, artist)
  }

}
