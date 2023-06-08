import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Song } from 'src/app/interfaces/song.interface';
import { ReproductorService } from 'src/app/servicios/reproductor.service';

@Component({
  selector: 'app-reproductor',
  templateUrl: './reproductor.component.html',
  styleUrls: ['./reproductor.component.css']
})
export class ReproductorComponent {
@Input() receivedSong:any
@Input() songsToPlay:any

volume:number = 0.5;
muted:boolean=false
randomize:boolean = false
loopMode:boolean = false

constructor(protected reproductorService:ReproductorService){
 }

ngOnInit()
{
  this.getLocals()
}

ngOnChanges()
{
  if(this.receivedSong)
  {
    this.reproduceFromBuscador()
  }
}

//Esta función es necesaria para poder reproducir una canción enviada desde buscador. Sin lista.
reproduceFromBuscador() {
  this.reproductorService.reproduce(this.receivedSong);
}

playPause() {
  return this.reproductorService.playPause();
}

detener() {
  this.reproductorService.detener();
}

updateVolume() {
  this.reproductorService.updateVolume(this.volume)
}

getLocals() {
  this.volume = this.getVolumeLocal()
  this.loopMode = this.getLoopLocal()
  this.randomize = this.getRandomizeLocal()
}

getVolumeLocal() {
  return this.reproductorService.getVolumeLocal()
}

getLoopLocal() {
  return this.reproductorService.getLoopLocal()
}

getRandomizeLocal() {
  return this.reproductorService.getRandomizeLocal()
}

setRandomizeLocal(){
  this.randomize = !this.randomize
  this.reproductorService.setRandomizeLocal(this.randomize)
}

setLoopLocal(){
  this.loopMode = !this.loopMode
  this.reproductorService.setLoopLocal(this.loopMode)
}

isPlaying(): boolean {
  return !this.reproductorService.isPaused;
}

previousSong(){
 this.reproductorService.previousSong()
}

nextSong(){
  this.reproductorService.nextSong()
}

muteUnmuted(){
  this.muted = !this.muted
  this.reproductorService.muteUnmuted()
}

/*

// Obtener la posición actual
const currentTime = audioElement.currentTime;

// Establecer la posición actual
audioElement.currentTime = 30; // Ir a los 30 seconds
Duration: Obtiene la duración total del audio (en seconds).
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
