import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'jalali-moment';

@Pipe({
    name: 'jdate'
})
export class JdatePipe implements PipeTransform {

    transform(value: Date, format: string): string {
        try {
            return moment(value).format(format);
        } catch (exception) {
            return '---';
        }
    }

}
