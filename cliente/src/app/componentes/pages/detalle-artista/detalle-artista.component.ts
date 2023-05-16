import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, collection, addDoc, doc, getDocs, getDoc, where, query} from '@angular/fire/firestore';
import { Album } from 'src/app/interfaces/album.interface';
import { Cancion } from 'src/app/interfaces/cancion.interface';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { DbService } from 'src/app/servicios/db.service';
import { FormControl, FormGroup } from '@angular/forms';
import { FireStorageService } from 'src/app/servicios/fire-storage.service';
import { waitForPendingWrites } from 'firebase/firestore';

@Component({
  selector: 'app-detalle-artista',
  templateUrl: './detalle-artista.component.html',
  styleUrls: ['./detalle-artista.component.css']
})
export class DetalleArtistaComponent {

  artistaId:string = "";
  artistaInfo: any
  uidArtista:any
  albumes: Album[] = []
  canciones: Cancion[] = []
  userInfo:any
  isAdmin:boolean = false
  edit:boolean = false
  updateArtist:FormGroup

  constructor(private route: ActivatedRoute, private firestore: Firestore, private userService:UsuariosService,
    private db:DbService, private router:Router, private fireStorage:FireStorageService) {
      this.updateArtist = new FormGroup({
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
        const uidAlbum = doc.id
        const cancionesRef = collection(albumesRef, uidAlbum, 'canciones');
        const cancionesSnapshot = await getDocs(cancionesRef);
        cancionesSnapshot.forEach((cancionDoc) => {
          const cancion = {
            titulo: cancionDoc.data()['titulo'],
            orden: cancionDoc.data()['orden'],
            letra: cancionDoc.data()['letra'],
            archivo: cancionDoc.data()['archivo'],
            token: cancionDoc.data()['token'],
          };
          this.canciones.push(cancion);
        });
        const album = {
          nombre: doc.data()['nombre'],
          anyo: doc.data()['año'],
          canciones: this.canciones
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
    let uid = await this.db.getArtistaUID(artistaInfo)
    this.db.deleteArtist(uid)
    this.router.navigate(['/buscador']);
  }

  toggleEdit(){
    this.edit = !this.edit
  }

  onSubmit(){

  }

}
