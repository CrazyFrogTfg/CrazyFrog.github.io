import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReproductorService {
  private audioElement: HTMLAudioElement;
  isPaused:boolean=true
  constructor() {
    this.audioElement = new Audio();
  }

  reproducir(cancion: string) {
    this.audioElement.src = cancion;
    this.audioElement.play();
  }

  playPausa(cancion: string): boolean {
    if (this.audioElement.src !== cancion) {
      this.audioElement.src = cancion;
      this.audioElement.load();
    }
    if(this.audioElement.src){
      if (this.audioElement.paused) {
        this.audioElement.play();
        this.isPaused = false;
      } else {
        this.audioElement.pause();
        this.isPaused = true;
      }
    }

    return this.isPaused;
  }

  detener() {
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this.isPaused = true;
  }

  updateVolume(volume:any) {
    this.audioElement.volume = volume;
  }


  /*
audioElement.play();
Pause: Pausa la reproducción del audio.
typescript
Copy code
audioElement.pause();
Stop: Detiene la reproducción del audio y lo reinicia al principio.
typescript
Copy code
audioElement.pause();
audioElement.currentTime = 0;
CurrentTime: Obtiene o establece la posición actual de reproducción del audio (en segundos).
typescript
Copy code
// Obtener la posición actual
const currentTime = audioElement.currentTime;

// Establecer la posición actual
audioElement.currentTime = 30; // Ir a los 30 segundos
Duration: Obtiene la duración total del audio (en segundos).
typescript
Copy code
const duration = audioElement.duration;
Volume: Obtiene o establece el volumen del audio (entre 0 y 1).
typescript
Copy code
// Obtener el volumen actual
const volume = audioElement.volume;

// Establecer el volumen
audioElement.volume = 0.5; // Establecer volumen al 50%
Muted: Obtiene o establece si el audio está silenciado.
typescript
Copy code
// Obtener el estado de silencio
const isMuted = audioElement.muted;

*/

// Establecer el estado de silencio
muteUnmuted(){
  //editar boton pa que cambie su imagen segun estado
  this.audioElement.muted = !this.audioElement.muted; // Silenciar el audio

}

//Loop: Obtiene o establece si el audio debe repetirse en bucle.
/*
// Obtener el estado de bucle
const isLooping = audioElement.loop;
/*
// Establecer el estado de bucle
audioElement.loop = true; // Repetir en bucle
Ended: Evento que se dispara cuando la reproducción del audio ha finalizado.
typescript
Copy code
audioElement.addEventListener('ended', () => {
  // Acciones a realizar cuando el audio ha finalizado
});
*/


}
