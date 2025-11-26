import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformObjectToKeyValue',
  standalone: true
})
export class TransformObjectToKeyValuePipe implements PipeTransform {
  transform(value: any): any[] {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value.flatMap(obj =>
        Object.entries(obj).map(([key, value]) => ({ key, value }))
      );
    }

    if (typeof value === 'object') {
      return Object.entries(value).map(([key, value]) => ({ key, value }));
    }

    return [];
  }
}
