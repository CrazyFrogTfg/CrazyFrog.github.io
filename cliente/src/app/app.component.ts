import { Component } from '@angular/core';
import 'bootstrap/dist/js/bootstrap.min.js';
import { DbService } from './servicios/db.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public userInfo:any

  constructor(private db:DbService){}

  ngOnInit(){
    
  }
}
