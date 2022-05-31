import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {Subject} from 'rxjs';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {User} from './user.model';
import {fuseAnimations} from '@fuse/animations';
import {UserService} from './user.service';
import {TranslateService} from '@ngx-translate/core';
import {SnotifyService} from 'ng-snotify';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Globals} from '../../../shared/globals';
import {FuseProgressBarService} from '../../../../@fuse/components/progress-bar/progress-bar.service';

@Component({
    selector: 'app-user-component',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class UserComponent implements OnInit, OnDestroy {
    user: User;
    pageType: string;
    userForm: FormGroup;
    progressSubscription: any;
    materialTabsIndex: number = 0;

    // Private
    private _unsubscribeAll: Subject<any>;

    progress: boolean = false;

    /**
     * Constructor
     *
     * @param _userService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param translate
     * @param _snotifyService
     * @param _router
     * @param _httpClient
     * @param _globals
     * @param _progressBar
     */
    constructor(
        private _userService: UserService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        public translate: TranslateService,
        private _snotifyService: SnotifyService,
        private _router: Router,
        private _httpClient: HttpClient,
        public _globals: Globals,
        private _progressBar: FuseProgressBarService
    ) {
        // Set the default
        this.user = new User();

        this.materialTabsIndex = 0;

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
        this.progressSubscription = this._progressBar.visible.subscribe( val => {
            this.progress = val;
        })

        // Subscribe to update user on changes
        this._userService.onUserChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(async user => {

                if (user) {
                    this.user = new User(user);
                    this.pageType = 'edit';
                    this.userForm = this.createUserEditForm();

                    console.log("User: ", this.user)

                    // this.specifyWorkTypePrices();
                } else {
                    this.pageType = 'new';
                    this.user = new User();
                    this.userForm = this.createUserAddForm();
                    // this.specifyWorkTypePrices();
                }


            });

        this.userForm.get('username').valueChanges.pipe(
            debounceTime(500)
        ).subscribe(username => {
            this.validateUsername(username);
        });

        this.userForm.get('email').valueChanges.pipe(
            debounceTime(500)
        ).subscribe(email => {
            this.validateEmail(email);
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.progressSubscription.complete()
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Method which notifies user of changes made to object in
     * case of user's request for leaving the component with unsaved changes
     *
     */
    public canDeactivate() {
        this._progressBar.hide()
        return new Promise<any>((resolve, reject) => {
            if (this.userForm.dirty) {
                let alertText = '';
                let alertOk = '';
                let alertCancel = '';
                let alertLost = '';

                this.translate.get('ALERTS.CHECK_BEFORE_PROCEED').subscribe(value => {
                    alertText = value;
                });
                this.translate.get('ALERTS.OK').subscribe(value => {
                    alertOk = value;
                });
                this.translate.get('ALERTS.CANCEL').subscribe(value => {
                    alertCancel = value;
                });
                this.translate.get('ALERTS.CHANGES_WILL_BE_LOST').subscribe(value => {
                    alertLost = value;
                });

                this._snotifyService.confirm(alertLost, alertText, {
                    // timeout: 5000,
                    // showProgressBar: true,
                    closeOnClick: false,
                    backdrop: 0.5,
                    // pauseOnHover: true,
                    buttons: [
                        {
                            text: alertOk, action: (toast) => {

                                resolve(true);
                                this._snotifyService.remove(toast.id);

                            }, bold: false
                        },
                        {
                            text: alertCancel, action: (toast) => {
                                this._snotifyService.remove(toast.id);
                                resolve(false);
                            }
                        },
                    ]
                });
            } else {
                resolve(true);
            }
        });
    }

    /**
     * Create user add form
     *
     * @returns {FormGroup}
     */
    createUserAddForm(): FormGroup {
        return this._formBuilder.group({
            id: [this.user.id],
            name: [this.user.name, Validators.required],
            surname: [this.user.surname, Validators.required],
            email: [this.user.email, [Validators.required, Validators.email]],
            username: [this.user.username, Validators.required],
            role: [this.user.role, Validators.required],
            password: ['', [Validators.required, Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{6,30}')]],
            passwordConfirm: ['', [Validators.required, this._globals.confirmPasswordValidator]],
            work_types: new FormArray([]),
        });
    }

    /**
     * Create user edit form
     *
     * @returns {FormGroup}
     */
    createUserEditForm(): FormGroup {
        return this._formBuilder.group({
            id: [this.user.id],
            name: [this.user.name, Validators.required],
            surname: [this.user.surname, Validators.required],
            email: [this.user.email, [Validators.required, Validators.email]],
            username: [this.user.username, Validators.required],
            role: [this.user.role, Validators.required],
            work_types: new FormArray([]),
        });
    }

    /**
     * Event handler for click event button for changing material tab
     *
     */
    tabForward() {  this.materialTabsIndex += 1; }

    /**
     * Event handler for click event button for changing material tab
     *
     */
    tabBackward() { this.materialTabsIndex -= 1; }


    /**
     * User role change event handler
     *
     * If role is 4 = worker, specify hourly rate for each work type
     *
     */
    userRoleChange(event) {
        if (event === 4) {
            let work_type_controls = this.getWorkTypesFormArray;
            work_type_controls.controls.forEach(form_group => {
                form_group.get('hourly_rate').setValidators(Validators.required);
                form_group.updateValueAndValidity();
            });
            this.userForm.updateValueAndValidity();
        } else {
            let work_type_controls = this.getWorkTypesFormArray;
            work_type_controls.controls.forEach(form_group => {
                form_group.get('hourly_rate').clearValidators();
                form_group.updateValueAndValidity();
            });
            this.userForm.updateValueAndValidity();
        }

    }


    /**
     * Method for validating email after email changes
     *
     */
    validateEmail(email) {
        if (email !== this.user.email) {
            this._progressBar.show()
            this._userService.validateEmail(email).subscribe(data => {
                setTimeout(() => {
                    this._progressBar.hide()
                }, 250)
                if (data.status) {
                    let errors = this.userForm.get('email').errors;
                    this.userForm.get('email').setErrors(null);
                    this.userForm.get('email').setErrors(errors);
                } else {
                    this.userForm.get('email').setErrors({'taken': true});
                }
            }, error => {
                console.log(error);
                this._progressBar.hide()
                throw error;
            });
        }
    }

    /**
     * Method for validating username after username changes
     *
     */
    validateUsername(username) {
        if (username !== this.user.username) {
            this._progressBar.show()
            this._userService.validateUsername(username).subscribe(data => {
                setTimeout(() => {
                    this._progressBar.hide()
                }, 250)
                if (data.status) {
                    let errors = this.userForm.get('username').errors;
                    this.userForm.get('username').setErrors(null);
                    this.userForm.get('username').setErrors(errors);
                } else {
                    this.userForm.get('username').setErrors({'taken': true});
                }
            }, error => {
                this._progressBar.hide()
                console.log(error);
                throw error;
            });
        }
    }

    /**
     * Specify work type prices for each work type of user worker
     *
     */
    specifyWorkTypePrices() {
        this._globals.WORK_TYPES.forEach((work_type) => {
            let exists = this.user.work_types.filter(workTypeEl => workTypeEl.type === work_type.type);

            // check if user already has hourly rate for some work type
            // if has set existing values
            if (exists.length > 0) {
                let work = {
                    work: work_type.work,
                    ...exists[0]
                };
                this.addHourlyRate(work);
            } else {
                let work = {
                    hourly_rate: 0,
                    ...work_type
                };
                this.addHourlyRate(work);
            }
        });
    }

    /**
     * Method which returns FormArray of work_types in userForm
     *
     */
    get getWorkTypesFormArray() {
        return this.userForm.get('work_types') as FormArray;
    }

    /**
     * Add hourly rate price of customer for specific work type
     *
     * @param work_type
     */
    addHourlyRate(work_type: any) {
        let work_types_prices = this.getWorkTypesFormArray;

        work_types_prices.push(
            this._formBuilder.group({
                type: [work_type.type],
                work_type: [{value: work_type.work, disabled: true}],
                work_type_name: [{value: '', disabled: true}],
                hourly_rate: [work_type.hourly_rate, [Validators.required]],
            }));
    }

    /**
     * Save user
     */
    saveUser(): void {
        this._progressBar.show();
        const data = this.userForm.getRawValue();

        this._userService.saveUser(data).subscribe((data) => {
            this._progressBar.hide();

            if (data.status) {
                this.translate.get('ALERTS.UPDATE_SUCCESSFUL').subscribe(value => {
                    this._snotifyService.success('', value);
                });
                this.userForm.markAsPristine();
                this._router.navigateByUrl('/users');
            } else {
                this.translate.get('SOMETHING_WENT_WRONG').subscribe(value => {
                    this._snotifyService.error('', value);
                });
            }
        }, error => {
            console.log(error);
            this._progressBar.hide();
            throw error;
        });
    }

    /**
     * Add user
     */
    addUser(): void {
        this._progressBar.show();

        const data = this.userForm.getRawValue();

        this._userService.addUser(data).subscribe((data) => {
            this._progressBar.hide();
            if (data.status) {
                this.translate.get('ALERTS.INSERT_SUCCESSFUL').subscribe(value => {
                    this._snotifyService.success('', value);
                });
                this.userForm.markAsPristine();
                this._router.navigateByUrl('/users');
            } else {
                this.translate.get('SOMETHING_WENT_WRONG').subscribe(value => {
                    this._snotifyService.error('', value);
                });
            }
        }, error => {
            this._progressBar.hide();
            console.log(error);
            throw error;
        });
    }

    /**
     * Delete user
     *
     */
    deleteUser() {

        // display prompt for deleting the user
        let alertText = '';
        let alertOk = '';
        let alertCancel = '';
        let alertLost = '';

        this.translate.get('ALERTS.CHECK_BEFORE_PROCEED').subscribe(value => {
            alertText = value;
        });
        this.translate.get('ALERTS.OK').subscribe(value => {
            alertOk = value;
        });
        this.translate.get('ALERTS.CANCEL').subscribe(value => {
            alertCancel = value;
        });
        this.translate.get('ALERTS.ACTION_CANNOT_BE_UNDONE').subscribe(value => {
            alertLost = value;
        });

        this._snotifyService.confirm(alertLost, alertText, {
            // timeout: 5000,
            // showProgressBar: true,
            closeOnClick: false,
            backdrop: 0.5,
            // pauseOnHover: true,
            buttons: [
                {
                    text: alertOk, action: (toast) => {
                        this._progressBar.show();

                        // remove user in case the user prompted to delete the user
                        this._userService.deleteUser(this.user).subscribe(data => {
                            this._progressBar.hide();

                            if (data.status) {
                                this.translate.get('ALERTS.DELETE_SUCCESSFUL').subscribe(value => {
                                    this._snotifyService.success('', value);
                                });
                                this.userForm.markAsPristine();
                                this._router.navigateByUrl('/users');
                            } else {
                                this._progressBar.hide();

                                this.translate.get('SOMETHING_WENT_WRONG').subscribe(value => {
                                    this._snotifyService.error('', value);
                                });
                            }
                        }, error => {
                            this._progressBar.hide();
                            console.log(error);
                            throw error;
                        });

                        this._snotifyService.remove(toast.id);

                    }, bold: false
                },
                {
                    text: alertCancel, action: (toast) => {
                        this._snotifyService.remove(toast.id);
                    }
                },
            ]
        });
    }
}
