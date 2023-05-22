import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReproductorService {
  private audioElement: HTMLAudioElement;
  private isPaused:boolean=true
  constructor() {
    this.audioElement = new Audio();
  }

  reproducir(cancion: string) {
    this.audioElement.src = cancion;
    this.audioElement.play();
  }

  playPausa():boolean {
    if(this.audioElement.paused){
      this.isPaused=false
      this.audioElement.play();
    }else {
      this.audioElement.pause()
      this.isPaused=true;
    }
    return this.isPaused
  }

  detener() {
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
  }


}
