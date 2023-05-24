import { Song } from "./song.interface"

export interface Playlist {
  name:string,
  owner:string,
	private:boolean,
	songs: Song[]
}
