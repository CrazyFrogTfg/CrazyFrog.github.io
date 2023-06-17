import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  defaultImageProfile = "/assets/defaultImageProfile.webp"

  formReg: FormGroup;
  emailError:string=""
  passwordError:string=""
  userNameError:string=""
  formPass:boolean=true
  emailRepeated:boolean = false

  constructor(private userService:UsuariosService,
              private router: Router,
              private title:Title,
              private fb:FormBuilder){
    title.setTitle('Mediafroggy - Registro')
    
    this.formReg = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[a-z]{2,4}$')]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
      imageProfile: new FormControl(this.defaultImageProfile),
      securityQuestion: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      news: new FormControl(false)
    })
  }

  async onSubmit() {
    if(!this.formReg.valid){
      return Object.values(this.formReg.controls).forEach( control=>{
        control.markAllAsTouched()
      })
    }else if(this.formReg.valid){
      try {
      this.userService.register(this.formReg.value)
      .then(async () =>
        await this.userService.addUser(this.formReg.value))
        await this.userService.logout()
        await this.router.navigate(['/login'])
      } catch (error) {
      this.emailRepeated = true;
      }
    }
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
  get securityQuestionInvalid(){
    return this.formReg.get('securityQuestion')?.invalid && this.formReg.get('securityQuestion')?.touched
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }

}
