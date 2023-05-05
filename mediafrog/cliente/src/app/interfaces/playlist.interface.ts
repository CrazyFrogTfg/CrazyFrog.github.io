export interface Playlist {
  nombre:string,
  propietario:string,
	privada:boolean,
	canciones: [
		{
			titulo:string,
			orden:number,
			letra:string,
      archivo:string, //referencia a storage
      token:string
		}
  ]
}
