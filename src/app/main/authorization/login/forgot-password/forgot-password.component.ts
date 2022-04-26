import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FuseConfigService} from '@fuse/services/config.service';
import {fuseAnimations} from '@fuse/animations';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../../../auth.service';
import {SnotifyService} from 'ng-snotify';
import {NavigationExtras, Router} from '@angular/router';
import {FuseProgressBarService} from '../../../../../@fuse/components/progress-bar/progress-bar.service';

@Component({
    selector: 'forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ForgotPasswordComponent implements OnInit {
    progress: boolean = false;

    styleProgressBar(): Object {
        if (this.progress) {
            return {opacity: 1};
        } else {
            return {opacity: 0};
        }
    }

    forgotPasswordForm: FormGroup;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     * @param translate
     * @param _authService
     * @param _snotifyService
     * @param _router
     * @param _progressBar
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        public translate: TranslateService,
        private _authService: AuthService,
        private _snotifyService: SnotifyService,
        private _router: Router,
        private _progressBar: FuseProgressBarService
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

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    /**
     * Send password recovery link
     *
     */
    sendPassRecoveryLink() {
        if (this.forgotPasswordForm.valid) {
            let email = this.forgotPasswordForm.value.email;
            // this._authService.sendRecoveryLink(email).subscribe()

            this._progressBar.show();
            this._authService.sendRecoveryLink(email).subscribe(data => {
                this._progressBar.hide();

                if (data.status) {
                    let opts: NavigationExtras = {
                        state: {
                            email: this.forgotPasswordForm.get('email').value
                        }
                    };
                    this._router.navigate(['/mail-confirm'], opts);
                } else {
                    this.translate.get('ALERTS.EMAIL_NOT_FOUND').subscribe(value => {
                        this._snotifyService.error('', value);
                    });
                }
            }, error => {
                this._progressBar.hide();
                console.log(error);
            });
        }
    }
}
