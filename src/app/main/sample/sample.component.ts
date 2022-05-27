import { Component } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import {AuthService} from '../../auth.service';

@Component({
    selector   : 'sample',
    templateUrl: './sample.component.html',
    styleUrls  : ['./sample.component.scss']
})
export class SampleComponent
{
    /**
     * Constructor
     *
     * @param authService
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        public authService: AuthService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english);
    }
}
