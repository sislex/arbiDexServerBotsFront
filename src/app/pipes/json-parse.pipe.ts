import {Pipe, PipeTransform} from "@angular/core";

@Pipe({ name: 'jsonParse' })
export class JsonParsePipe implements PipeTransform {
  transform(value: any): any {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
      return null;
    }
  }
}
