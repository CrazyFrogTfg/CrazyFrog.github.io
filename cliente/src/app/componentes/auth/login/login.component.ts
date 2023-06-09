import { Component } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
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
    this.formLogin = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
      //  VERSION NUEVA:
      // this.formLogin = this.fb.group({
      //   email: ['', [Validators.required, Validators.email]],
      //   password: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {}

  async onSubmit(){
    //habria que imprimir algo en pantalla con este error, pero no sé muy bien qué
    //Quizas tambien agregar mensaje que se imprima en Home diciendo que los cambios han surtido efecto
    if(this.formLogin.value.email.trim() != "" && this.formLogin.value.password.trim() != "")
    {
      try{
        await this.userService.login(this.formLogin.value)  
        this.router.navigate(['/home']);

      }catch(error){
        console.log(error)
        console.log("No consigo atajar el error POST que salta en consola aun usando trycatch. Ni en service")
        this.formIsInvalid=true
      }
    };
  }

  // onSubmit(){        CODIGO ACTUALIZADO. NO CATCHEA EL ERROR - NO FUNCIONA PERO ES VERSION MEJOR.
  //   //habria que imprimir algo en pantalla con este error, pero no sé muy bien qué
  //   //Quizas tambien agregar mensaje que se imprima en Home diciendo que los cambios han surtido efecto
  //   if(this.formLogin.invalid){
  //     return Object.values(this.formLogin.controls).forEach( control=>{
  //       control.markAllAsTouched()
  //       this.formIsInvalid=true
  //     })
  //   }else
  //   if(this.formLogin.valid)
  //   {
  //     this.formIsInvalid=false
  //     try{
  //       this.userService.login(this.formLogin.value)  
  //       this.router.navigate(['/home']);

  //     }catch(error){
  //       console.log(error)
  //       console.log("No consigo atajar el error que salta en consola aun usando trycatch")
  //       this.formIsInvalid=true
  //     }
  //   }
  // }
  

  goToRegister(){
    this.router.navigate(['/registro']);
  }

}
