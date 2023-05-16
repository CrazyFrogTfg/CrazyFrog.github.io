import { Component } from '@angular/core';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user.interface';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {

  userInfo:any
  users:User[] = []
  isAdmin:boolean = false
  uids:Array<string> = []

  constructor(private userService:UsuariosService, private router: Router, private firestore:Firestore){}

  async ngOnInit() {
    this.userInfo = await this.userService.getUserInfo()
      if(this.userInfo.admin) {
        this.isAdmin = true
        //Obtenemos array de users ya filtrados para no aparecers los Administradores y evitar eliminarlos.
        this.users = await (await this.userService.getAllUsers()).filter( user =>!user.admin)
        this.users.forEach(async user => {
          const q = query(collection(this.firestore, "users"), where("email", "==", user.email))
          const querySnapshots = await getDocs(q)
          user.id = querySnapshots.docs[0].id
        });
      }
  }

  async deleteUser(user:User){
    const response = await this.userService.deleteUser(user)
    console.log(response)
  }
  
}
