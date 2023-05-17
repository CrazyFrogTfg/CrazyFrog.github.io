import { Injectable } from '@angular/core';
import { Auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, authState, updateEmail, updatePassword } from '@angular/fire/auth';
import { Firestore, collection, addDoc, doc, getDocs, getDoc, where, query, deleteDoc} from '@angular/fire/firestore';
import { User } from '../interfaces/user.interface';
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';
import { updateDoc } from 'firebase/firestore';
import { Router } from '@angular/router';
import { Artista } from '../interfaces/artista.interface';

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


// constructor(private afAuth: AngularFireAuth) {}

// deleteUser(userId: string) {
//   this.afAuth.auth
//     .getUser(userId)
//     .then((user) => {
//       user.delete()
//         .then(() => {
//           console.log('Usuario eliminado correctamente de Firebase Authentication.');
//           // Luego de eliminar el usuario de Firebase Authentication, puedes proceder a eliminar su información correspondiente de Firebase Cloud Firestore
//           this.deleteUserFromFirestore(userId);
//         })
//         .catch((error) => {
//           console.error('Error al eliminar el usuario de Firebase Authentication:', error);
//         });
//     })
//     .catch((error) => {
//       console.error('Error al obtener el usuario de Firebase Authentication:', error);
//     });
// }


  // deleteAuth(user:any)
  // {
  //   user.delete()
  //   .then(() => {
  //     console.log('Successfully deleted user');
  //   })
  // }

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

  // deleteUser(user:any){
  //   const userDocRef = doc(this.firestore, `users/${user}`);
  //   return deleteDoc(userDocRef)
  // }

  //Elimina Doc de user de CloudFirestore
  //Añadir para eliminar el Auth!
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
      return this.userInfo
    }
  }

  async getAllUsers(): Promise<User[]> {
    const querySnapshot = await getDocs(collection(this.firestore, "users"));
    const documents = querySnapshot.docs.map((doc) => doc.data() as User);
    return documents;
  }


  async updateUserDb(uid:any, user:User, oldUser:any){
    const userRef = doc(this.firestore, 'users', uid);
    //Comprobamos que los datos del form son correctos y no vacios.

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
      }
  }

  async updateArtistaDb(uid:any, artista:Artista, oldUser:Artista){
    const artistaRef = doc(this.firestore, 'artistas', uid);
      //Comprobamos los datos de Auth
      // const currentUser = this.getAuthh().currentUser;
      // if (currentUser) {
        //Actualizamos Nombre artista si ha cambiado
        if(artista.nombre && artista.nombre != oldUser.nombre)
        await updateDoc(artistaRef, {
          nombre:artista.nombre,
        })

        //Actualizamos descripcion si ha cambiado
        if(artista.descripcion && artista.descripcion != oldUser.descripcion){ 
          await updateDoc(artistaRef, {
            descripcion:artista.descripcion,
          })
        }
      //}
  }


  async getImageProfile(uid: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const imagesRef = ref(this.storage, `users/${uid}`);
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

  uploadImageProfile($event:any, uid:string){
    //Preparamos la imagen dandole ruta
    const file = $event.target.files[0];
    const fileRef = ref(this.storage, `users/${uid}/imageProfile`)

    //subimos la imagen
    uploadBytes(fileRef, file)
    .then(async response =>{
      //Despues, obtenemos la imagen, guardamos en una variable
      const imagenProfile = await this.getImageProfile(uid);
      //Introducimos dicha variable en el campo "imageProfile" del usuario
      const userRef = doc(this.firestore, 'users', uid);
      await updateDoc(userRef, {
        imageProfile:imagenProfile,
      })
    console.log(response);
    })
    .catch(error => console.log(error));
  }
}
