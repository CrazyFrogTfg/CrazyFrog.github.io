import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, collection, doc, getDocs, getDoc, query, where } from '@angular/fire/firestore';
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
  file:any=null
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
      //extraer albumes where idartist tal
      const q = query(collection(this.firestore, "albums"), where("artistId", "==", this.artistId))
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        const album = {
          id: doc.id,
          name: doc.data()['name'],
          year: doc.data()['year'],
          image: doc.data()['image'],
          artistId: doc.data()['artistId'],
        };
        this.albums.push(album);
      });
    });
  }

  async deleteArtist(artistInfo: any){
    const pregunta="Si deseas eliminar "+artistInfo.name+" escribe su nombre aquí";
    if( prompt(pregunta) == artistInfo.name)
    {
      this.db.delArtistFav(this.artistId)
      this.db.deleteArtist(this.artistId)
      this.router.navigate(['/buscador']);
    }
  }

  async goToDetails(artist: any) {
    let uid = await this.db.getArtistUID(artist)
    this.router.navigate(['/artista'], { queryParams: { id: uid} });
  }

  goToNewAlbum(){
    this.router.navigate(['/newalbum'], {queryParams: {artistId: this.artistId} });
  }

  toggleEdit(){
    this.edit = !this.edit
  }

  setFile($event:any){
    this.file = $event
  }

  async onSubmit(){
    if(this.updateArtist)
    {
      await this.db.updateArtist(this.artistId, this.updateArtist.value, this.artistInfo, this.file);
      this.router.navigate(['/home'])
    }
  }

  setArtistFav(){
    this.db.setArtistFav(this.artistId)
  }

  delArtistFav(){
    this.db.delArtistFav(this.artistId)
  }

  isArtistFav(){
    return this.db.isArtistFav(this.artistId)
  }

}
