import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-artist',
  templateUrl: './new-artist.component.html',
  styleUrls: ['./new-artist.component.css']
})
export class NewArtistComponent {

  newArtist:FormGroup
  myEvent:any

  constructor(private router:Router){
    this.newArtist = new FormGroup({
      nombre: new FormControl(),
      descripcion: new FormControl()
    })
  }

  goHome(){
    this.router.navigate(['/home']);
  }

  onSubmit(){

  }

  setMyEvent($event:any){
    this.myEvent = $event
  }
}
