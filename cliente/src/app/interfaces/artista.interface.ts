import { Album } from "./album.interface"

export interface Artista {
	id:string,
	nombre:string,
	descripcion:string,
	image:string,
	albumes: Album[]
}
