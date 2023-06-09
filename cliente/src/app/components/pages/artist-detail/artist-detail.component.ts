import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, collection, doc, getDocs, getDoc, query, where } from '@angular/fire/firestore';
import { Album } from 'src/app/interfaces/album.interface';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { DbService } from 'src/app/services/db.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FireStorageService } from 'src/app/services/fire-storage.service';
import { Title} from '@angular/platform-browser';

@Component({
  selector: 'app-artist-detail.',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.css']
})
export class ArtistDetailComponent {

  artistId:string = "";
  artistInfo: any
  albums: Album[] = []
  userInfo:any
  isAdmin:boolean = false
  edit:boolean = false
  updateArtist:FormGroup
  file:any=null
  query:string=""
  deletePrompt:boolean = false
  formDelete: FormGroup;

  constructor(private route: ActivatedRoute, private firestore: Firestore, private userService:UsuariosService,
    private db:DbService, private router:Router, private fireStorage:FireStorageService,
    private title:Title, private fb:FormBuilder) { title.setTitle('Mediafroggy - Artista'),
      this.updateArtist = this.fb.group({
        id: new FormControl(this.artistId),
        name: ['', [Validators.minLength(2), Validators.maxLength(20)]],
        description: ['', [Validators.maxLength(100)]],
        image: new FormControl(),
      })
      this.formDelete = new FormGroup({
        prompt: new FormControl(),
      })
    }

  get nameInvalid(){
    return this.updateArtist.get('name')?.invalid && this.updateArtist.get('name')?.touched
  }
  get descriptionInvalid(){
    return this.updateArtist.get('description')?.invalid && this.updateArtist.get('description')?.touched
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

  async deleteArtist(){
    this.db.delArtistFav(this.artistId)
    await this.db.deleteArtist(this.artistId)
    this.router.navigate(['/buscador']);
  }

  checkDeleteName(){
    const promptControl = this.formDelete.get('prompt');
    if (promptControl) {
      if(promptControl.value == this.artistInfo.name){
        this.deleteArtist()
      }
    }
  }

  deleteQuestion(){
    this.deletePrompt = true;
  }

  closeModalError(){
    this.deletePrompt=false
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
    this.file = $event.target.files[0]
  }

  async onSubmit(){
    if(this.updateArtist.valid)
    {
      await this.db.updateArtist(this.artistId, this.updateArtist.value, this.artistInfo, this.file);
      setTimeout(()=>window.location.reload(),1000)
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
