import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {locale as english} from '../../shared/i18n/en';
import {locale as slovenian} from '../../shared/i18n/sl';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FuseConfigService} from '../../../@fuse/services/config.service';
import {FuseTranslationLoaderService} from '../../../@fuse/services/translation-loader.service';
import {TranslateService} from '@ngx-translate/core';
import {fuseAnimations} from '../../../@fuse/animations';
import {Globals} from '../../shared/globals';

@Component({
  selector: 'app-check-delivery-status',
  templateUrl: './check-delivery-status.component.html',
  styleUrls: ['./check-delivery-status.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CheckDeliveryStatusComponent implements OnInit {
  checkForm: FormGroup
  status: any;
  checkingInProgress: boolean = false;
  checkPressed: boolean = false;

  constructor(
      private _fuseConfigService: FuseConfigService,
      private _fuseTranslationLoaderService: FuseTranslationLoaderService,
      private _formBuilder: FormBuilder,
      private _globals: Globals,
      public translate: TranslateService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, slovenian);

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

    this.checkForm = this._formBuilder.group({
      shippmentNo: ['', [Validators.required]],
    });

    this.checkingInProgress = false;
  }

  ngOnInit(): void {
    this.checkForm.get('shippmentNo').valueChanges.subscribe(val => {
      this.checkPressed = false;
    })
  }

  /**
   * Method for checking order status
   *
   */
  checkOrderStatus(shippmentNo: string) {
    this.checkPressed = true;
    this.checkingInProgress = false;
    this.checkingInProgress = true;
    let shippment = this._globals.SHIPPMENTS.filter(shippment => shippment.shippmentNo === shippmentNo)[0]
    setTimeout(() => {
      if (shippment) {
        this.status = this._globals.SHIPPMENT_STATUSES.filter(status => status.status === shippment.status)[0]
        this.checkingInProgress = false;
      } else {
        this.status = null
        this.checkingInProgress = false;
      }
    }, 500)
  }

}
