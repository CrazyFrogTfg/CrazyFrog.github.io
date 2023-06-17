import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'byName',
  pure: false
})
export class ByNamePipe implements PipeTransform {

  transform(arraySearched: any[], param: string=""): any[] {
    if(param.trim()){
      return arraySearched.filter( searched => searched.name.toLowerCase().includes(param.toLowerCase()));
    }else
     {
       return arraySearched;
     }
  }
}
