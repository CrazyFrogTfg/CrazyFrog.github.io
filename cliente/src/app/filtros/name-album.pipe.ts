import { Pipe, PipeTransform } from '@angular/core';
import { Album } from '../interfaces/album.interface';

@Pipe({
  name: 'nameAlbum'
})
export class NameAlbumPipe implements PipeTransform {

  transform(arraySearched: Album[], param: string=""): any[] {
    if(param){
      const arrayFiltred:Album[] = arraySearched.filter( searched => searched.nombre.toLowerCase().includes(param.toLowerCase()));
      return arrayFiltred
    }else
     {
       return arraySearched;
     }
  }
}
