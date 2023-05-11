import { Album } from "./album.interface"

export interface Artista {
	nombre:string,
	descripcion:string,
	image:string,
	albumes: Album[]
}
