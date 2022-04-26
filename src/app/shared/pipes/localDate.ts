/**
 * Usage: dateString | localDate:'format'
 **/

import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';
import {TranslateService} from '@ngx-translate/core';

@Pipe({
    name: 'localDate'
})
export class LocalDatePipe implements PipeTransform {

    constructor(private translate: TranslateService) { }

    transform(value: any, format: string) {

        if (!value) { return ''; }
        if (!format) { format = 'medium'; }
        return formatDate(value, format, this.translate.currentLang);
    }
}