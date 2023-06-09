import { Component } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Storage } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  userInfo:any;
  uid:any;
  file:any;
  passwordError:string=""
  updateUser: FormGroup;

  constructor(private userService:UsuariosService, private storage:Storage, private router:Router,
    private title:Title, private fb:FormBuilder) { title.setTitle('Mediafroggy - Perfil')
    this.updateUser = this.fb.group({
      email: ['', [Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[a-z]{2,4}$')]],
      password: ['', [Validators.minLength(6), Validators.maxLength(40)]],
      username: ['', [Validators.minLength(4), Validators.maxLength(20)]],
      imageProfile: new FormControl(),
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  async ngOnInit() {
    this.userInfo = await this.userService.getUserInfo()
    this.uid = await this.userService.getUID()
  }

  async onSubmit() {
    if(this.updateUser.invalid){
      return Object.values(this.updateUser.controls).forEach( control=>{
        control.markAllAsTouched()
      })
    }else if(this.updateUser.valid)
    {
      if(this.updateUser.value.currentPassword === this.userInfo.password)
      {
        await this.userService.updateUserDb(this.updateUser.value, this.userInfo, this.file);
        setTimeout(() => this.router.navigate(['/home']), 1500)

      }else
      this.passwordError = "*Contraseña errónea"
    }
  }

  get usernameInvalid(){
    return this.updateUser.get('username')?.invalid && this.updateUser.get('username')?.touched
  }
  get emailInvalid(){
    return this.updateUser.get('email')?.invalid && this.updateUser.get('email')?.touched
  }
  get passwordInvalid(){
    return this.updateUser.get('password')?.invalid && this.updateUser.get('password')?.touched
  }

  setFile($event:any){
    this.file = $event
  }

  uploadImageProfile($event:any){
    this.userService.uploadImageProfile($event, this.uid)
  }

  goHome(){
    this.router.navigate(['/home']);
  }
}
