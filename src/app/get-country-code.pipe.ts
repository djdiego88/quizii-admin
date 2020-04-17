import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getCountryCode'
})
export class GetCountryCodePipe implements PipeTransform {

  transform(value: any, args?: any): unknown {
    return this.getCountryCode(value);
  }

  getCountryCode(country: any): String{
    for (let key in country) {
      if (country.hasOwnProperty(key)) {
        return key; // 'a'
        //alert(object[key]); // 'hello'
      }
    }
  }
}
