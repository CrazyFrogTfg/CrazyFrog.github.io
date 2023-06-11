import { Injectable,  } from '@angular/core';
import { Observable, Subject, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReproductorService {

  audioElement: HTMLAudioElement;
  isPaused:boolean=true
  currentProgress: number = 0;
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
    this.audioElement.addEventListener('ended', () => {
      this.handleSongEnd();
    });

    let savedVolumeLocal = localStorage.getItem("volumeLocal") || "[]"
    this.volumeLocal = JSON.parse(savedVolumeLocal);
    this.audioElement.volume=this.volumeLocal

    let savedLoopLocal = localStorage.getItem("loopLocal") || "[]"
    this.loopLocal = JSON.parse(savedLoopLocal);
    this.audioElement.loop=this.loopLocal

    let savedRandomizeLocal = localStorage.getItem("randomizeLocal") || "[]"
    this.randomizeLocal = JSON.parse(savedRandomizeLocal);
  }

  ngOnInit(){
    this.audioElement.autoplay=true
  }

  reproduceFromBuscador(song:any) {
    this.songs=[]
    this.songPlaying = song;
    this.songPlaying.lyrics = this.songPlaying.lyrics.replace(/&#10;/g, '\n')
    this.audioElement.src = this.songPlaying.file;
    this.audioElement.play();
    this.isPaused=false
  }

  reproduce(song:any) {
    if(!this.songs.includes(song)){
      this.songs=[]
    }
    this.songPlaying = song;
    if(this.songPlaying.lyrics) //Evita error si no posee atributo 'lyrics'
    this.songPlaying.lyrics = this.songPlaying.lyrics.replace(/&#10;/g, '\n')
    this.audioElement.src = this.songPlaying.file;
    //El timeout es para evitar un error de consola por "falta de tiempo" para 'load' el file de canción.
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

  pauseByLogout(){
    this.audioElement.pause()
    this.isPaused = true;
  }

  detener(){
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this.isPaused = true;
  }

  previousSong(){
    //Si existe anterior
    if(this.positionPlaying>0){
      this.positionPlaying--
      this.reproduce(this.songs[this.positionPlaying])
      return this.songs[this.positionPlaying]
      //Si no está en la lista
    }else if(!this.songs.includes(this.songPlaying)){
      return this.songPlaying
    }
    else //Si es la primera de la lista
    return this.songs[this.positionPlaying]
  }

  nextSong(){
        // Controlamos si el modo aleatorio está activo
    if(this.randomizeLocal == true){
      // Creamos un valores aleatorios hasta que no sea el mismo que el 'actual sonando'
      let positionToPlay = Math.floor(Math.random()*this.songs.length)
      while (this.positionPlaying == positionToPlay){
        positionToPlay = Math.floor(Math.random()*this.songs.length)
      }
      this.positionPlaying = positionToPlay
      this.reproduce(this.songs[this.positionPlaying])
    } else {
        // No está el modo aleatorio activo entonces:
        // Comprobamos si existe una canción siguiente y la reproducimos
        if(this.songs.length>this.positionPlaying+1){
          this.positionPlaying++
          this.reproduce(this.songs[this.positionPlaying])
        } else {
          //Si es la última de la lista sin modo aleatorio
          if(this.positionPlaying == this.songs.length-1){
            this.positionPlaying = 0
            this.reproduce(this.songs[this.positionPlaying])
          }
        }
    }
  }

  updateVolume(volume:any) {
    this.volumeLocal = volume
    this.audioElement.volume = volume;
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

  getVolumeLocal(){
    return this.volumeLocal
  }
  getLoopLocal(){
    return this.loopLocal
  }
  getRandomizeLocal(){
    return this.randomizeLocal
  }

  onProgressChange() {
    this.audioElement.currentTime = this.currentProgress;
  }

  handleSongEnd(){
    setTimeout(() => this.nextSong(), 600)
  }

// Establecer el estado de silencio
  muteUnmuted(){
    //editar boton pa que cambie su imagen segun estado
    this.audioElement.muted = !this.audioElement.muted; // Silenciar el audio
  }
}
