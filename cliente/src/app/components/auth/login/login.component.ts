import { Component } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  credentialError:string="*Credenciales incorrectas"
  formLogin: FormGroup;
  formIsInvalid:boolean=false

  constructor(private userService:UsuariosService, private router: Router, private title:Title, private fb:FormBuilder){
    title.setTitle('Mediafroggy - Login')
      this.formLogin = this.fb.group({
        email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[a-z]{2,4}$')]],
        password: ['', [Validators.required]]
    })
  }

  async onSubmit(){
    if(this.formLogin.valid)
    {
      const login = await this.userService.login(this.formLogin.value)
        this.credentialError = login
        this.formIsInvalid = true
     } else this.formIsInvalid = true;
  }
  get emailInvalid(){
    return this.formLogin.get('email')?.invalid && this.formLogin.get('email')?.touched
  }

  goToRegister(){
    this.router.navigate(['/registro']);
  }

  goToResetPassword(){
    this.router.navigate(['/resetPassword']);
  }

}
