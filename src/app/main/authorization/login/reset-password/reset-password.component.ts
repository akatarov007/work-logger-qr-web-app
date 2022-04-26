import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FuseConfigService} from '@fuse/services/config.service';
import {fuseAnimations} from '@fuse/animations';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../../../auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SnotifyService} from 'ng-snotify';
import {Globals} from '../../../../shared/globals';
import {FuseProgressBarService} from '../../../../../@fuse/components/progress-bar/progress-bar.service';

@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
    resetPasswordForm: FormGroup;
    token: string;
    validToken: boolean; // token validity

    progress: boolean = false;

    styleProgressBar(): Object {
        if (this.progress) {
            return {opacity: 1};
        } else {
            return {opacity: 0};
        }
    }

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        public _translate: TranslateService,
        private _authService: AuthService,
        private route: ActivatedRoute,
        private _snotifyService: SnotifyService,
        private _router: Router,
        private globals: Globals,
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
        this.token = this.route.snapshot.queryParamMap.get('token');

        // check if provided token in route query param is valid or no
        this._authService.checkResetPasswordTokenValidity(this.token).subscribe(data => {
            this.validToken = data.status;
        }, error => {
            this.validToken = false;
            throw error;
        });

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.resetPasswordForm = this._formBuilder.group({
            password: ['', [Validators.required, Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{6,30}')]],
            passwordConfirm: ['', [Validators.required, this.globals.confirmPasswordValidator]]
        });

        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.resetPasswordForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.resetPasswordForm.get('passwordConfirm').updateValueAndValidity();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Reset password
     *
     */
    resetPassword() {
        this._progressBar.show();
        this._authService.resetUserPassword(this.token, this.resetPasswordForm.get('password').value).subscribe(data => {
            let status = data.status;
            this._progressBar.hide();

            if (status) {
                this._translate.get('ALERTS.SUCCESS_CHANGE_PASS').subscribe(value => {
                    this._snotifyService.success('', value, {
                        timeout: 3000,
                        backdrop: 0.4
                    }).on('beforeHide', (toast) => {
                        setTimeout(() => {
                            this._router.navigate(['/login']);
                        }, 200);
                    });
                });
            } else {
                this._translate.get('ALERTS.SOMETHING_WENT_WRONG').subscribe(val => {
                    this._snotifyService.error('', val);
                });
            }
        }, error => {
            this._progressBar.hide();
            console.log(error);
        });
    }
}