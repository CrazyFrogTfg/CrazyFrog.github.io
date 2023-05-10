import { Cancion } from "./cancion.interface"

export interface Album {
  nombre:string,
  año:number,
  canciones: Cancion[]
}
