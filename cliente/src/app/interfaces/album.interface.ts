import { Cancion } from "./cancion.interface"

export interface Album {
  nombre:string,
  anyo:number,
  image:string,
  canciones: Cancion[]
}
