import { Pipe, PipeTransform } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Pipe({
  name: 'getRole'
})
export class GetRolePipe implements PipeTransform {
    constructor(
        private _translate: TranslateService
    ) {
    }

    transform(value: any[], args: string[]) : any {
        let role = +args[0];
        let obj: any = value.filter((roleEl: any) =>
            roleEl.role === role
        )[0];
        return obj.label
    }

}
