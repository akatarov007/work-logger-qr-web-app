import {Component, Inject, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {SnotifyService} from 'ng-snotify';
import {Globals} from '../../shared/globals';
import {UsersService} from '../users/users.service';
import {AuthService} from '../../auth.service';

@Component({
    selector     : 'contacts-contact-form-dialog',
    templateUrl  : './filter-by.component.html',
    styleUrls    : ['./filter-by.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class FilterByComponentDialogComponent
{
    object: string;
    filterValue: any;
    filterForm: FormGroup;
    dialogTitle: string;
    users: any[] = [];
    loadingUsers: boolean = false;

    /**
     * Constructor
     *
     * @param {MatDialogRef<ContactsContactFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _usersService
     * @param globals
     * @param authService
     * @param translate
     * @param _snotifyService
     */
    constructor(
        public matDialogRef: MatDialogRef<FilterByComponentDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _usersService: UsersService,
        public globals: Globals,
        public authService: AuthService,
        public translate: TranslateService,
        private _snotifyService: SnotifyService,
    )
    {
        this.object = this._data.object
        this.filterValue = this._data.filter

        // parse parameters and check for which object type filter needs to be shown
        if ( this.object === 'users' ) {
            this.translate.get('FILTER_BY.USERS.TOPIC').subscribe(value => {
                this.dialogTitle = value;
            })
            this.filterForm = this.createUsersFilterForm();
        }

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create filter form for users
     *
     * @returns {FormGroup}
     */
    createUsersFilterForm(): FormGroup
    {
        return this._formBuilder.group({
            name: [this.filterValue.name !== 'all' ? this.filterValue.name : ''],
            username: [this.filterValue.username !== 'all' ? this.filterValue.username : ''],
            role: [this.filterValue.role !== 'all' ? this.filterValue.role : ''],
            email: [this.filterValue.email !== 'all' ? this.filterValue.email : ''],
        });
    }

    /**
     * Method for resetting filter
     *
     */
    resetFilter() {
        if (this.object === 'users') {
            this.filterValue = {
                name: "all",
                username: "all",
                role: "all",
                email: "all",
            }
            this.filterForm = this.createUsersFilterForm()
        }
    }

    /**
     * Clear event handler on ng-select component for
     * setting empty string value of form control in form group
     *
     */
    clearNgSelectParam(control: string) {
        this.filterForm.get(control).setValue('')
    }

}
