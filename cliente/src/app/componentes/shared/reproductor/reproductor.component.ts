import { Component, Input } from '@angular/core';
import { Song } from 'src/app/interfaces/song.interface';
import { ReproductorService } from 'src/app/servicios/reproductor.service';

@Component({
  selector: 'app-reproductor',
  templateUrl: './reproductor.component.html',
  styleUrls: ['./reproductor.component.css']
})
export class ReproductorComponent {
@Input() reproduciendo:any
@Input() playlist:any
isSticky: boolean = false;
volume:number = 0.5;
muted:boolean=false
cancionSonando:any

constructor(protected reproductorService:ReproductorService){}

ngOnInit()
{
 this.reproducing()
 this.volume = this.getVolumelocal()
 this.updateVolume()
}

ngOnChanges()
{
  if(this.reproduciendo)
  {
    this.reproducir()
  }
  if(this.playlist){
    this.reproducirPlaylist()
  }
  this.reproducing()
  
}

reproducir() {
  //const cancion = this.reproduciendo.file;
  this.reproductorService.reproducir(this.reproduciendo);
}

reproducirPlaylist() {
  const songs = this.playlist
  this.reproductorService.reproducirPlaylist(songs);
}

reproducing()
{
  this.cancionSonando = this.reproductorService.reproducing()
}

playPausa() {
  //const cancion = this.reproduciendo.file;
  return this.reproductorService.playPausa();
}

detener() {
  this.reproductorService.detener();
}

updateVolume() {
  this.reproductorService.updateVolume(this.volume)
}
getVolumelocal()
{
  return this.reproductorService.getVolumeLocal()
}

isPlaying(): boolean {
  return !this.reproductorService.isPaused;
}

muteUnmuted(){
  this.muted = !this.muted
  this.reproductorService.muteUnmuted()
}
/*

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
