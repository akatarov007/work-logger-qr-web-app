import {Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {Globals} from '../../shared/globals';
import {FuseConfigService} from '../../../@fuse/services/config.service';
import { interval, Subscription } from 'rxjs';
var CryptoJS = require("crypto-js");

@Component({
    selector: 'app-qr-generator',
    templateUrl: './qr-generator.component.html',
    styleUrls: ['./qr-generator.component.scss']
})
export class QrGeneratorComponent implements OnInit, OnDestroy {
    timestamp: any
    subscription: Subscription;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private translate: TranslateService,
        private httpClient: HttpClient,
        public _globals: Globals,
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    ngOnInit(): void {
        this.timestamp = CryptoJS.AES.encrypt("tmstmp_" + Date.now().toString(), '183129JZXN123DN2JNAD').toString();
        //emit value in sequence every 1 second
        const source = interval(1000 );
        this.subscription = source.subscribe(() => this.refreshQR());
    }

    refreshQR() {
        this.timestamp = CryptoJS.AES.encrypt("tmstmp_" + Date.now().toString(), '183129JZXN123DN2JNAD').toString();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
