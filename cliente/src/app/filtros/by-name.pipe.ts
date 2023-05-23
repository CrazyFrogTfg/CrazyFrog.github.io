import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'byName'
})
export class ByNamePipe implements PipeTransform {

  transform(arraySearched: any[], param: string=""): any[] {
    if(param){
      const arrayFiltred:any[] = arraySearched.filter( searched => searched.nombre.toLowerCase().includes(param.toLowerCase()));
      param=""
      return arrayFiltred
    }else
     {
       return arraySearched;
     }
  }
}
