import { Pipe, PipeTransform } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Pipe({
  name: 'getShippmentStatus'
})
export class GetShippmentStatusPipe implements PipeTransform {
    constructor(
        private _translate: TranslateService
    ) {
    }

    transform(value: any[], args: string[]) : any {
        let type = +args[0];
        let workObj: any = value.filter((workEl: any) =>
            workEl.status === type
        )[0];
        return workObj.label
    }

}
