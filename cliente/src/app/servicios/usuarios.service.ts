import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, authState, updateEmail, updatePassword } from '@angular/fire/auth';
import { Firestore, collection, addDoc, doc, getDocs, getDoc, where, query} from '@angular/fire/firestore';
import { User } from '../interfaces/user.interface';
import { getAuth } from "firebase/auth";
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';
import { updateDoc } from 'firebase/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  userInfo: any;
  imageProfile:string=""
  username:string = ""

  constructor(private auth:Auth, private firestore: Firestore, private storage:Storage, private router:Router) { }

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

  async getUID(){
    const user = this.authh.currentUser
    let uid = ""
    if (user !== null) {
      const email = user.email
      const q = query(collection(this.firestore, "users"), where("email", "==", email))
      const querySnapshots = await getDocs(q)
      uid = querySnapshots.docs[0].id;
    }
    return uid
  }

  async getUserInfo(){
    const currentUser = this.getAuthh().currentUser;
    if (currentUser !== null) {
      const email = currentUser.email
      const q = query(collection(this.firestore, "users"), where("email", "==", email))
      const querySnapshots = await getDocs(q)
      this.userInfo = querySnapshots.docs[0].data()
      return this.userInfo
    }
  }

  async getAllUsers(): Promise<User[]> {
    const querySnapshot = await getDocs(collection(this.firestore, "users"));
    const documents = querySnapshot.docs.map((doc) => doc.data() as User);
    return documents;
  }

  async updateUserDb(uid:any, user:User, email:string){
    const userRef = doc(this.firestore, 'users', uid);
    if(user !== null && user.email && user.password && user.username){
      if (user.email.toString() !== email.toString()) {
        const currentUser = this.getAuthh().currentUser;
          if (currentUser !== null) {
            await updateEmail(currentUser, user.email)
              .then(async () => {
                await updatePassword(currentUser, user.password)
                await updateDoc(userRef, {
                  email:user.email,
                  username:user.username,
                  password:user.password,
                })
                this.logout();
                this.router.navigate(['/login']);
              })
              .catch((error) => {
                console.log(error)
              });
          }
      } else {
        this.router.navigate(['/home']);
      }
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
  }})}

  uploadImageProfile($event:any, userInfo:any){
    const file = $event.target.files[0];
    console.log("file uploading: " + file)
    const fileRef = ref(this.storage, `users/${userInfo.username}/imageProfile`)

    uploadBytes(fileRef, file)
    .then(response =>{
    console.log(response);
    this.getImageProfile(userInfo.email)
    })
    .catch(error => console.log(error));
  }

  // async getImageProfile(userInfo:any): Promise<string> {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const imagesRef = ref(this.storage, `users/${userInfo.username}/${userInfo.imageProfile}`);
  //       const response = await listAll(imagesRef);
  //       for (let item of response.items) {
  //         const url = await getDownloadURL(item);
  //         resolve(url);
  //         return;
  //       }
  //       throw new Error('No se encontró ninguna imagen de perfil.');
  //     } catch (error) {
  //       console.log(error);
  //       reject(error);
  //     }
  //   });
  // }

  // uploadImageProfile($event:any, userInfo:any){
  //   const file = $event.target.files[0];
  //   console.log("file uploading: " + file)
  //   const fileRef = ref(this.storage, `users/${userInfo.username}/${file.name}`)

  //   uploadBytes(fileRef, file)
  //   .then(response =>{
  //   console.log(response);
  //   console.log(this.getImageProfile(userInfo))
  //   })
  //   .catch(error => console.log(error));
  // }

}
