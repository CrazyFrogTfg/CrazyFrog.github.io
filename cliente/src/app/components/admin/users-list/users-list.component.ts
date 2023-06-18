import { Component } from '@angular/core';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user.interface';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Title } from '@angular/platform-browser';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent {

  userInfo:any
  users:User[] = []
  isAdmin:boolean = false
  deletePrompt:boolean = false
  formDelete: FormGroup;
  userDelete!: User;
  pagUser:number=0
  page:number=1;
  maxPages:number=0

  constructor(private userService:UsuariosService, private router: Router, private firestore:Firestore, private title:Title){ title.setTitle('Mediafroggy - Lista Usuarios')
  this.formDelete = new FormGroup({
    prompt: new FormControl(),
  })}

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
      this.maxPages=Math.ceil(this.users.length/10)
  }

  async deleteUser(){
    await this.userService.deleteUser(this.userDelete)
    window.location.reload();
  }

  deleteQuestion(user:User){
    this.deletePrompt = true;
    this.userDelete = user;
  }

  checkDeleteName(){
    const promptControl = this.formDelete.get('prompt');
    if (promptControl) {
      if(promptControl.value == this.userDelete.username){
        this.deleteUser()
      }
    }
  }

  closeModalError(){
    this.deletePrompt=false
  }

  increasePagUser(){
    if(this.users.length>10 && this.pagUser+1<=this.users.length-10)
    {
      this.pagUser+=10
      this.page++
    }
  }
  decreasePagUser(){
    if(this.pagUser+1>10)
    {
      this.pagUser-=10
      this.page--
    }
  }


}
