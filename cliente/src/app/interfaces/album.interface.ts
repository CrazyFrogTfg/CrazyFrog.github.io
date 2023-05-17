import { Cancion } from "./cancion.interface"

export interface Album {
  id?:string,
  nombre:string,
  anyo:number,
  image:string,
  canciones?: Cancion[]
}
