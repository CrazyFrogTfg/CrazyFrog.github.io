import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-playlist',
  templateUrl: './new-playlist.component.html',
  styleUrls: ['./new-playlist.component.css']
})
export class NewPlaylistComponent {

  constructor(private router: Router){}

  goHome(){
    this.router.navigate(['/home']);
  }
}
