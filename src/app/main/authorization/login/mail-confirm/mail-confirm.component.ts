import { Component, ViewEncapsulation } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import {FuseTranslationLoaderService} from '../../../../../@fuse/services/translation-loader.service';
import {Router} from '@angular/router';
import {locale as english} from '../../../../shared/i18n/en';
import {locale as slovenian} from '../../../../shared/i18n/sl';

@Component({
    selector     : 'mail-confirm',
    templateUrl  : './mail-confirm.component.html',
    styleUrls    : ['./mail-confirm.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class MailConfirmComponent
{
    email: string

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param _fuseTranslationLoaderService
     * @param _router
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _router: Router
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, slovenian);

        let nav = this._router.getCurrentNavigation();

        if (nav.extras.state) {
            this.email = nav.extras.state.email;
        }

        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }
}
