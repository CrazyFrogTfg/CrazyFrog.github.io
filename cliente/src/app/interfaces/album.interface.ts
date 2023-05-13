import { Cancion } from "./cancion.interface"

export interface Album {
  nombre:string,
  anyo:number,
  canciones: Cancion[]
}
