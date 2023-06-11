import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(duration: number): string {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    const secondsFormateados = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${minutes}:${secondsFormateados}`;
  }
}
