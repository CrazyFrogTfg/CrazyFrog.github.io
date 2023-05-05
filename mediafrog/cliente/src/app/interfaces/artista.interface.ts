export interface Artista {
  nombre:string,
	descripcion:string,
	albumes: [
		{
			nombre:string,
			año:number,
			canciones: [
				{
				titulo:string,
				orden:number,
				letra:string,
        archivo:string,
        token:string
        }
			]
		}
	]
}
