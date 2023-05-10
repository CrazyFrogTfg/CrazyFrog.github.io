import { Cancion } from "./cancion.interface"

export interface Playlist {
  nombre:string,
  propietario:string,
	privada:boolean,
	canciones: Cancion[]
}
