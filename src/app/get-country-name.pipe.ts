import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getCountryName'
})
export class GetCountryNamePipe implements PipeTransform {

  transform(value: any, args?: any): unknown {
    return this.getCountryName(value);
  }

  getCountryName(country: any): String{
    for (let key in country) {
      if (country.hasOwnProperty(key)) {
        return country[key];
      }
    }
  }
}
