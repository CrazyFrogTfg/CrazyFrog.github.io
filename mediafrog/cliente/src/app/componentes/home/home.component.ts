import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  miaudio:any
  isVisible = false;

  reproducir() {
    this.miaudio = '../../../assets/Amazing_Harmonica_Street_Musician_192_kbps.mp3';
    this.isVisible = true;
}
}
