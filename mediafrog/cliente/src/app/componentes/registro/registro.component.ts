import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  formReg: FormGroup;

  constructor(private userService:UsuariosService, private router: Router){
    this.formReg = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    })
  }

  ngOnInit(): void {
  }

  onSubmit(){
    this.userService.register(this.formReg.value)
      .then(response => {
        console.log("hola")
        console.log(response);
        this.router.navigate(['/login']);
      })
      .catch(error => console.log(error));
  }

}
