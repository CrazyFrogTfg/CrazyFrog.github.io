import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReproductorService {
  private audioElement: HTMLAudioElement;
  isPaused:boolean=true
  currentProgress: number = 0;
  totalDuration: any;
  playlist:any
  sonando:number=0
  songs:any[]=[]
  cancionSonando:any
  volumeLocal:number

  constructor() {
    this.audioElement = new Audio();
    this.audioElement.addEventListener('timeupdate', () => {
      this.currentProgress = this.audioElement.currentTime;
    });
    this.audioElement.addEventListener('loadedmetadata', () => {
      this.totalDuration = this.audioElement.duration
      console.log("Duracion total: "+this.totalDuration)
    });
    this.audioElement.addEventListener('ended', () => {
      this.handleSongEnd();
    });

    let savedVolumeLocal = localStorage.getItem("volumeLocal") || "[]"
    this.volumeLocal = JSON.parse(savedVolumeLocal);
  }

  ngOnInit()
  {
    this.audioElement.autoplay=true

  }
  ngOnChanges()
  {
    this.getTotalDuration()
  }

  reproducir(cancion:any) {
    this.cancionSonando = cancion;
    this.audioElement.src = this.cancionSonando;
    this.audioElement.play();
    this.isPaused=false
    return this.getTotalDuration()
  }
  
  reproducirPlaylist(songs: any[], reproduciendo: string) {
  this.songs = songs;
  const index = this.songs.findIndex(song => song.file === reproduciendo);
  this.sonando = index;

  if (index !== -1) {
    this.reproducir(this.songs[index].file);
  } else {
    console.log(`No se encontró la canción con el archivo '${reproduciendo}'.`);
  }
}

//Funcion que devuelve 
  reproducing()
  {
    return this.cancionSonando
  }

  playPausa():boolean {
    // if (this.audioElement.src !== cancion && cancion) {
    //   this.audioElement.src = cancion;
    //   this.audioElement.load();
    // }
    //if(this.audioElement.src){
      if (this.audioElement.paused) {
        this.audioElement.play();
        this.isPaused = false;
      } else {
        this.audioElement.pause();
        this.isPaused = true;
      //}
    }

    return this.isPaused;
  }

  detener() {
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this.isPaused = true;
  }

  previousSong(){
    console.log("click previousSong")
    console.log(this.sonando)
    if(this.sonando>1)
    {
      this.sonando--
      console.log(this.sonando)
      this.reproducir(this.songs[this.sonando].file)
    }
  }

  nextSong(){
    this.handleSongEnd()
  }

  updateVolume(volume:any) {
    this.audioElement.volume = volume;
    this.setVolumeLocal(volume)
  }

  setVolumeLocal(volume:number){
    this.volumeLocal = volume
    localStorage.setItem("volumeLocal", JSON.stringify(this.volumeLocal))
  }

  getVolumeLocal()
  {
    return this.volumeLocal
  }

  onProgressChange() {
    this.audioElement.currentTime = this.currentProgress;
  }

  handleSongEnd()
  {
    console.log("La canción "+this.sonando+" ha terminado de reproducirse")
    this.sonando++
    console.log(this.sonando)

    if(this.songs.length<=this.sonando)
    {
      this.reproducir(this.songs[this.sonando].file)
    }
  }

  async getTotalDuration()
  {
    return this.totalDuration
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
