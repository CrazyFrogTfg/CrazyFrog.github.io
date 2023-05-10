import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'namePlaylist'
})
export class NamePlaylistPipe implements PipeTransform {

  transform(arraySearched: any[], param: string, arrayFiltred: any[] ): any[] {
    arrayFiltred = arraySearched.filter( searched => searched.nombre.includes(param));
    return arrayFiltred
  }

}
