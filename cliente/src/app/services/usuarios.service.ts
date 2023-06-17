import { Injectable } from '@angular/core';
import { Auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateEmail, updatePassword } from '@angular/fire/auth';
import { Firestore, collection, addDoc, doc, getDocs, where, query, deleteDoc } from '@angular/fire/firestore';
import { User } from '../interfaces/user.interface';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { getDoc, updateDoc } from 'firebase/firestore';
import { Router } from '@angular/router';
import { ReproductorService } from './reproductor.service';
import { FirebaseError } from 'firebase-admin';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  userInfo: any;
  imageProfile:string=""
  username:string = ""

  constructor(private auth:Auth, private firestore: Firestore, private storage:Storage, private router:Router, private reproductorService:ReproductorService) { }
  private readonly authh = getAuth();

  getAuthh(){
    return this.authh
  }

  register({email, password}: any){
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async login({email, password}: any){
    let errorCatched:string=""
    if(await this.userExist(email))
    {
      await signInWithEmailAndPassword(this.auth, email, password)
      .then(()=> {
        errorCatched = "Login existoso"
        this.router.navigate(['/home'])
      })
      .catch((error: FirebaseError) => {
        if (error.code === 'auth/wrong-password') {
          errorCatched = "Contraseña incorrecta"
        } else if(error.code === 'auth/too-many-requests') {
          errorCatched = "Demasiados intentos. Espere o recupere su contraseña"
        } else {
          errorCatched = "Error de Firebase"
        }
      });
    } else errorCatched = "El usuario no existe"
    return errorCatched
  }


  logout(){
    this.reproductorService.pauseByLogout()
    return signOut(this.auth);
  }

  addUser(user: User) {
    if (user.email.trim() && user.password.trim() && user.username.trim()){
      const userRef = collection(this.firestore, 'users');
      return addDoc(userRef, user);
    } return null
  }

  deleteUser(user:User){
    const userDocRef = doc(this.firestore, `users/${user.id}`);
    return deleteDoc(userDocRef)
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
      this.userInfo.id = querySnapshots.docs[0].id
      return this.userInfo
    }
  }

  async userExist(email: string) {
    const q = query(collection(this.firestore, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size > 0;
  }

  async getUserByEmail(email: string) {
    const q = query(collection(this.firestore, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
      const user:User = {
        id: querySnapshot.docs[0].id,
        email: querySnapshot.docs[0].data()['email'],
        imageProfile: querySnapshot.docs[0].data()['imageProfile'],
        news: querySnapshot.docs[0].data()['news'],
        password: querySnapshot.docs[0].data()['password'],
        securityQuestion: querySnapshot.docs[0].data()['securityQuestion'],
        username: querySnapshot.docs[0].data()['username'],
      }
    return user
  }
  

  async resetPasswordByEmail(formUserToReset:any)
  {
    if(await this.userExist(formUserToReset.email))
    {
      const userToReset = await this.getUserByEmail(formUserToReset.email)
      if(userToReset.securityQuestion == formUserToReset.securityQuestion)
      {
        this.resetPassword(formUserToReset.newPassword, userToReset)
        return true
      }
      else return false

    }
    else return false
  }

  async resetPassword(newPassword:string, userToReset:any){
    await signInWithEmailAndPassword(this.auth, userToReset.email, userToReset.password)
    const currentUser = await this.getAuthh().currentUser;
    if(currentUser)
    await updatePassword(currentUser, newPassword)
    const userRef = doc(this.firestore, 'users', userToReset.id);
    await updateDoc(userRef, {
      password:newPassword,
    })
    setTimeout( () =>{
      this.logout();
      this.router.navigate(['/login'])
    } , 2000)
  }
  
  async getAllUsers(): Promise<User[]> {
    const querySnapshot = await getDocs(collection(this.firestore, "users"));
    const documents = querySnapshot.docs.map((doc) => doc.data() as User);
    return documents;
  }

  async updateUserDb(user:any, oldUser:any, file?:any){
    //Obtenemos documento de Database
    const userRef = doc(this.firestore, 'users', oldUser.id);

      //Comprobamos los datos de Auth
      const currentUser = this.getAuthh().currentUser;
      if (currentUser) {
        //Actualizamos Nombre usuario si ha cambiado
        if(user.username && user.username != oldUser.username)
        await updateDoc(userRef, {
          username:user.username,
        })
        //Actualizamos password si ha cambiado
        if(user.password && user.password != oldUser.password){
            await updatePassword(currentUser, user.password)
            .then(async () =>{
              await updateDoc(userRef, {
                password:user.password,
              })
              .catch((error) => {
                console.log(error)
                });
            })
        }
        //Actualizamos email si ha cambiado
        if(user.email && user.email.toLowerCase().trim() != oldUser.email)
        {
          await updateEmail(currentUser, user.email)
            .then(async () => {
                await updateDoc(userRef, {
                email:user.email.toLowerCase(),
              })
              this.logout();
              this.router.navigate(['/login']);
            })
            .catch((error) => {
              console.log(error)
            });
        }
        //Actualizamos imagen usuario
        if(file)
        {
          this.uploadImageProfile(file, oldUser.id)
        }
      }
  }

  uploadImageProfile($event:any, uid:string){
    //Preparamos la imagen dandole ruta
    const file = $event.target.files[0];
    const fileRef = ref(this.storage, `users/${uid}/imageProfile`)

    //subimos la imagen
    uploadBytes(fileRef, file)
    .then(async response =>{
      //Despues, obtenemos la imagen, guardamos en una variable
      const imagenProfile = await getDownloadURL(fileRef);
      //Introducimos dicha variable en el campo "imageProfile" del usuario
      const userRef = doc(this.firestore, 'users', uid);
      await updateDoc(userRef, {
        imageProfile:imagenProfile,
      })
    console.log(response);
    })
    .catch(error => console.log(error));
  }

  async userNews(uid:string){
    const userRef = doc(this.firestore, 'users', uid);
    await updateDoc(userRef, {
      news:true,
    })
    .catch((error) => {
      console.log(error)
    });
  }
}
