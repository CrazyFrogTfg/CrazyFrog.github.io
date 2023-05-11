import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, authState } from '@angular/fire/auth';
import { Firestore, collection, addDoc, doc, getDocs, where, query} from '@angular/fire/firestore';
import { User } from '../interfaces/user.interface';
import { getAuth } from "firebase/auth";
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  userInfo: any;
  imageProfile:string=""

  constructor(private auth:Auth, private firestore: Firestore, private storage:Storage) { }

  private readonly authh = getAuth();

  getAuthh(){
    return this.authh
  }

  register({email, password}: any){
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login({email, password}: any){
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout(){
    return signOut(this.auth);
  }

  addUser(user: User) {
    if (user.email.trim() && user.password.trim() && user.username.trim()){
      const userRef = collection(this.firestore, 'users');
      return addDoc(userRef, user);
    } return null

  }

  async getUserInfo(){
    const user = this.authh.currentUser
    if (user !== null) {
      const email = user.email
      const q = query(collection(this.firestore, "users"), where("email", "==", email))
      const querySnapshots = await getDocs(q)
      this.userInfo = querySnapshots.docs[0].data()
      return this.userInfo
    }
  }

  async getImageProfile(username: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const imagesRef = ref(this.storage, `users/${username}`);
        const response = await listAll(imagesRef);
        for (let item of response.items) {
          const url = await getDownloadURL(item);
          resolve(url);
          return;
        }
        throw new Error('No se encontró ninguna imagen de perfil.');
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  uploadImageProfile($event:any, username:string){
    const file = $event.target.files[0];
    console.log("file uploading: " + file)
    const fileRef = ref(this.storage, `users/${username}/imageProfile`)

    uploadBytes(fileRef, file)
    .then(response =>{
    console.log(response);
    this.getImageProfile(username)
    })
    .catch(error => console.log(error));
  }

}
