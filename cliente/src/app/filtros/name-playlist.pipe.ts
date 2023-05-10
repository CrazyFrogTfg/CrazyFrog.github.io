import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'namePlaylist'
})
export class NamePlaylistPipe implements PipeTransform {

  transform(arraySearched: any[], param: string): any[] {
    const arrayFiltred:any[] = arraySearched.filter( searched => searched.nombre.toLowerCase().includes(param.toLowerCase()));
    return arrayFiltred
  }

}
