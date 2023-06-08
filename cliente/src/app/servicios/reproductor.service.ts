import { Injectable,  } from '@angular/core';
import { Observable, Subject, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReproductorService {
  private audioElement: HTMLAudioElement;

  isPaused:boolean=true
  currentProgress: number = 0;
  totalDuration: any
  positionPlaying:number=0
  songs:any[]=[]
  songPlaying:any
  volumeLocal:number
  randomizeLocal:boolean;
  loopLocal:boolean
  rangeDuration:number = 0

  constructor() {
    
    this.audioElement = new Audio();
    this.audioElement.addEventListener('timeupdate', () => {
      this.currentProgress = this.audioElement.currentTime;
    });
    this.audioElement.addEventListener('loadedmetadata', () => {
      this.rangeDuration = 0;
      this.rangeDuration = this.audioElement.duration;
      this.totalDuration = this.converseDuration(this.rangeDuration)
    });
    this.audioElement.addEventListener('ended', () => {
      this.handleSongEnd();
    });

    let savedVolumeLocal = localStorage.getItem("volumeLocal") || "[]"
    this.volumeLocal = JSON.parse(savedVolumeLocal);

    let savedLoopLocal = localStorage.getItem("loopLocal") || "[]"
    this.loopLocal = JSON.parse(savedLoopLocal);

    let savedRandomizeLocal = localStorage.getItem("randomizeLocal") || "[]"
    this.randomizeLocal = JSON.parse(savedRandomizeLocal);
  }

  ngOnInit()
  {
    this.audioElement.autoplay=true
  }

  reproduceFromBuscador(song:any) {
    this.songs=[]
    this.songPlaying = song;
    this.audioElement.src = this.songPlaying.file;
    this.audioElement.play();
    this.isPaused=false
  }

  reproduce(song:any) {
    if(!this.songs.includes(song))
    {
      this.songs=[]
    }
    this.songPlaying = song;
    this.audioElement.src = this.songPlaying.file;
    //El timeout es para evitar un error de consola por "falta de tiempo" para load la canción mp3.
    setTimeout( () => this.audioElement.play(), 1)
    this.isPaused=false
  }

  reproducePlaylist(songs: any[], songOrder: number) {

    this.songs = songs;
    this.positionPlaying=songOrder
    this.songPlaying=this.songs[songOrder]
    this.reproduce(this.songs[songOrder]);
  }

  playPause():boolean {
      if (this.audioElement.paused) {
        this.audioElement.play();
        this.isPaused = false;
      } else {
        this.audioElement.pause();
        this.isPaused = true;
    }
    return this.isPaused;
  }

  pauseByLogout()
  {
    this.audioElement.pause()
    this.isPaused = true;
  }

  detener() {
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this.isPaused = true;
  }

  previousSong(){
    //Si existe anterior
    if(this.positionPlaying>0)
    {
      this.positionPlaying--
      this.reproduce(this.songs[this.positionPlaying])
      return this.songs[this.positionPlaying]
      //Si no está en la lista
    }else if(!this.songs.includes(this.songPlaying))
    {
      return this.songPlaying
    }
    else //Si es la primera de la lista
    return this.songs[this.positionPlaying]
  }

  nextSong(){
        // Controlamos si el modo aleatorio está activo
    if(this.randomizeLocal == true)
    {   // Creamos un valores aleatorios hasta que no sea el mismo que el 'actual sonando'
      let positionToPlay = Math.floor(Math.random()*this.songs.length)
      while (this.positionPlaying == positionToPlay) {
        positionToPlay = Math.floor(Math.random()*this.songs.length)
      } 
      this.positionPlaying = positionToPlay
      this.reproduce(this.songs[this.positionPlaying])

    } else  // No está el modo aleatorio activo entonces:
      {     // Comprobamos si existe una canción siguiente y la reproducimos
        if(this.songs.length>this.positionPlaying+1)
        {
          this.positionPlaying++
          this.reproduce(this.songs[this.positionPlaying])
        }
        else //Si es la última de la lista sin modo aleatorio
        {
          if(this.loopLocal && this.positionPlaying == this.songs.length-1)
          {
            this.positionPlaying = 0
            this.reproduce(this.songs[this.positionPlaying])
          }
        }
      }
  }

  converseDuration(duration: number): string {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    const secondsFormateados = seconds < 10 ? `0${seconds}` : `${seconds}`;
  
    return `${minutes}:${secondsFormateados}`;
  }
  updateVolume(volume:any) {
    this.audioElement.volume = volume;
    this.volumeLocal = volume
    localStorage.setItem("volumeLocal", JSON.stringify(this.volumeLocal))
  }
 
  setLoopLocal(loop:boolean){
    this.loopLocal = loop
    this.audioElement.loop = this.loopLocal
    localStorage.setItem("loopLocal", JSON.stringify(this.loopLocal))
  }
  setRandomizeLocal(randomize:boolean){
    this.randomizeLocal = randomize
    localStorage.setItem("randomizeLocal", JSON.stringify(this.randomizeLocal))
  }

  getVolumeLocal()
  {
    return this.volumeLocal
  }
  getLoopLocal()
  {
    return this.loopLocal
  }
  getRandomizeLocal()
  {
    return this.randomizeLocal
  }

  onProgressChange() {
    this.audioElement.currentTime = this.currentProgress;
  }

  handleSongEnd()
  {
    setTimeout(() => this.nextSong(), 600)
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
