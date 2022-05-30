import {BehaviorSubject} from 'rxjs';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export class Globals {
    // development
    // BASE_URL = 'http://localhost:8080'

    // production
    BASE_URL = 'https://api.resort-knez.si/';

    USER_ROLES = [
        {
            role: 1,
            label: {
                'sl': 'Super skrbnik',
                'en': 'Super admin',
            }
        },
        // {
        //     role: 2,
        //     label: {
        //         'sl': 'Skrbnik',
        //         'en': 'Admin',
        //     }
        // },
        // {
        //     role: 4,
        //     label: {
        //         'sl': 'Delavec',
        //         'en': 'Worker',
        //     }
        // },
        // {
        //     role: 5,
        //     label: {
        //         'sl': 'Stranka',
        //         'en': 'Customer',
        //     }
        // },
        {
            role: 99,
            label: {
                'sl': 'QR GEN',
                'en': 'QR GEN',
            }
        }
    ];

    // work types for user with role worker(4)
    WORK_TYPES = [
        {
            type: 1,
            work: {
                'en': 'Electric work',
                'sl': 'Električno delo'
            }
        },
        {
            type: 2,
            work: {
                'en': 'Normal work',
                'sl': 'Normalno delo'
            }
        }
    ];

    progress: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    /**
     * Confirm password validator
     *
     * @param {AbstractControl} control
     * @returns {ValidationErrors | null}
     */
    confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

        if (!control.parent || !control) {
            return null;
        }

        const password = control.parent.get('password');
        const passwordConfirm = control.parent.get('passwordConfirm');

        if (!password || !passwordConfirm) {
            return null;
        }

        if (passwordConfirm.value === '') {
            return null;
        }

        if (password.value === passwordConfirm.value) {
            return null;
        }

        return {passwordsNotMatching: true};
    };
}