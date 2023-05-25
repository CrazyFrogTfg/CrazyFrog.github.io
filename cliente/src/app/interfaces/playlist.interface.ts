import { Song } from "./song.interface"

export interface Playlist {
  id:string,
  name:string,
  owner:string,
	private:boolean,
	songs: Song[]
}
