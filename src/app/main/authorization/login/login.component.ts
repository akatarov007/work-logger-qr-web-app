import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FuseConfigService} from '@fuse/services/config.service';
import {fuseAnimations} from '@fuse/animations';
import {FuseTranslationLoaderService} from '../../../../@fuse/services/translation-loader.service';
import {locale as english} from '../../../shared/i18n/en';
import {locale as slovenian} from '../../../shared/i18n/sl';
import {AuthService} from '../../../auth.service';
import {Router} from '@angular/router';
import {SnotifyService} from 'ng-snotify';
import {TranslateService} from '@ngx-translate/core';
import {FuseProgressBarService} from '../../../../@fuse/components/progress-bar/progress-bar.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
    progress: boolean = false;

    styleProgressBar(): Object {
        if (this.progress) {
            return {opacity: 1};
        } else {
            return {opacity: 0};
        }
    }

    loginForm: FormGroup;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param _fuseTranslationLoaderService
     * @param {FormBuilder} _formBuilder
     * @param _authService
     * @param _router
     * @param _snotifyService
     * @param translate
     * @param _progressBar
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private _authService: AuthService,
        private _router: Router,
        private _snotifyService: SnotifyService,
        public translate: TranslateService,
        private _progressBar: FuseProgressBarService
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

        this.loginForm = this._formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', Validators.required]
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._authService.clearData();
    }

    /**
     * Method for user login
     *
     */
    login() {
        if (this.loginForm.valid) {
            this._progressBar.show();
            let credentials = this.loginForm.value;
            this._authService.auth(credentials).subscribe(data => {
                let status = data.status;

                this._progressBar.hide();

                if (status) { // check for response success
                    // Parse response object
                    let user = data.user;
                    let role = user.role;
                    let token = data.token;
                    let refresh_token = data.refresh_token;

                    this._authService.setUserDetails(user.name, user.id, user.role, token, refresh_token);

                    this.translate.get('ALERTS.LOGIN_SUCCESS').subscribe(value => {
                        this._snotifyService.success('', value);
                    });

                    if (role !== 99 && role !== 1) { // if user isnt qr generator user, after successful login redirect him to /home
                        this._router.navigateByUrl('/home');
                    } else if (role === 1) {
                        this._router.navigateByUrl('/users');
                    } else { // otherwise to qr component that shows generated qr code
                        this._router.navigateByUrl('/qr')
                    }
                } else {
                    let prompt = data.prompt;
                    if (prompt === 0) { // password is invalid
                        this.translate.get('ALERTS.INVALID_PASS').subscribe(value => {
                            this._snotifyService.error('', value);
                        });
                    } else if (prompt === -1) { // user with provided username does not exists
                        this.translate.get('ALERTS.USER_NOT_FOUND').subscribe(value => {
                            this._snotifyService.warning('', value);
                        });
                    }
                }
            }, error => {
                this._progressBar.hide();
                console.log('Error - ' + error);
            });
        }
    }
}
