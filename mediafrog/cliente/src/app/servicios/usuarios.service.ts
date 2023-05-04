import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, authState } from '@angular/fire/auth';
import { Firestore, collection, addDoc, doc, getDocs, where, query} from '@angular/fire/firestore';
import { User } from '../interfaces/user.interface';
import { getAuth } from "firebase/auth";
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  userInfo: any;

  constructor(private auth:Auth, private firestore: Firestore) { }

  private readonly authh = getAuth();


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

}
