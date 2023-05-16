import { Component } from '@angular/core';
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

  constructor(private userService:UsuariosService, private router: Router){}

  async ngOnInit() {
    this.userInfo = await this.userService.getUserInfo()
      if(this.userInfo.admin) {
        this.isAdmin = true
        this.users = await this.userService.getAllUsers()
      }
  }

  // async deleteUser(user:any){
  //   console.log(user+" Boton clicado")
  //   this.userService.deleteUser(user)
  // }

  async deleteUser(user:User){
    const response = await this.userService.deleteUser(user)
    console.log(response)
  }

}
