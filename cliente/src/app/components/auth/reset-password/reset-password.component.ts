import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  resetPassword:FormGroup
  userInfo:any
  uid:any
  errorResetingPassword=""

  constructor(private fb:FormBuilder, private userService:UsuariosService, private router:Router){
    this.resetPassword = this.fb.group({
      email: ['', [Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[a-z]{2,4}$')]],
      securityQuestion: ['', [Validators.required, Validators.minLength(4)]],
      newPassword: ['', [Validators.minLength(6)]],
      newPassword2: ['', [Validators.minLength(6)]],
    })
  }

  get newPasswordInvalid(){
    return this.resetPassword.get('newPassword')?.invalid && this.resetPassword.get('newPassword')?.touched
  }
  get newPassword2Invalid(){
    return this.resetPassword.get('newPassword2')?.invalid && this.resetPassword.get('newPassword2')?.touched
  }
  get securityQuestionInvalid(){
    return this.resetPassword.get('securityQuestion')?.invalid && this.resetPassword.get('securityQuestion')?.touched
  }
  get emailInvalid(){
    return this.resetPassword.get('email')?.invalid && this.resetPassword.get('email')?.touched
  }

  async ngOnInit() {
  }

  async onSubmit() {
    if(this.resetPassword.invalid){
      return Object.values(this.resetPassword.controls).forEach( control=>{
        control.markAllAsTouched()
      })
    }else if(this.resetPassword.valid)
    {
      let passReset:any
      if(this.resetPassword.value.newPassword == this.resetPassword.value.newPassword2)
      {
        passReset = await this.userService.resetPasswordByEmail(this.resetPassword.value)
        if(!passReset)
          this.errorResetingPassword="Respuesta errónea."
      }else this.errorResetingPassword="Las contraseñas no coinciden."      
    }
  }

  goToHome(){
    this.router.navigate(['/home']);
  }
  goToLogin(){
    this.router.navigate(['/login']);
  }
}
