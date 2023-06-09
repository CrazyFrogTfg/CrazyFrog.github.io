import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { EmailValidator, FormControl, FormGroup, MinValidator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  defaultImageProfile = "/assets/defaultImageProfile.webp"

  formReg: FormGroup;
  emailError:string=""
  passwordError:string=""
  userNameError:string=""
  formPass:boolean=true

  constructor(private userService:UsuariosService, private router: Router, private title:Title, private fb:FormBuilder){
    title.setTitle('Mediafrog - Registro')
    this.formReg = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      username: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      imageProfile: new FormControl(this.defaultImageProfile)
    })
  }

  ngOnInit(): void {}

  async onSubmit() {
    if(this.formReg.valid){
      await this.userService.register(this.formReg.value)
      .then(async () =>
        await this.userService.addUser(this.formReg.value))
  
        await this.userService.logout()
        await this.router.navigate(['/login'])
    }else window.confirm("Formulario inválido.")
  }

  get usernameInvalid(){
    return this.formReg.get('username')?.invalid && this.formReg.get('username')?.touched
  }
  get emailInvalid(){
    return this.formReg.get('email')?.invalid && this.formReg.get('email')?.touched
  }
  get passwordInvalid(){
    return this.formReg.get('password')?.invalid && this.formReg.get('password')?.touched
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }

}
