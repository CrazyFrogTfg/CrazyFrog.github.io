import { Component, Input } from '@angular/core';
import { ReproductorService } from 'src/app/servicios/reproductor.service';

@Component({
  selector: 'app-reproductor',
  template: `
  <audio src="{{reproduciendo}}"></audio>
  <button (click)="reproducir()">Reproducir</button>
  <button (click)="playPausa()">PlayPausa</button>
  <button (click)="detener()">Detener</button>
`,
  styleUrls: ['./reproductor.component.css']
})
export class ReproductorComponent {
@Input() reproduciendo:any
isPaused:boolean=true

constructor(private reproductorService:ReproductorService){}

reproducir() {
  const cancion = this.reproduciendo;
  this.reproductorService.reproducir(cancion);
}

playPausa() {
  this.reproductorService.playPausa();
}

detener() {
  this.reproductorService.detener();
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

// Establecer el estado de silencio
audioElement.muted = true; // Silenciar el audio
Loop: Obtiene o establece si el audio debe repetirse en bucle.
typescript
Copy code
// Obtener el estado de bucle
const isLooping = audioElement.loop;

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
