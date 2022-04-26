import {BehaviorSubject} from 'rxjs';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {Shippment} from '../main/shippments/shippment/shippment.model';

export class Globals {
    // development
    BASE_URL = 'http://localhost:8080'

    // production
    // BASE_URL = 'https://';

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

    // list of all shipments
    SHIPPMENTS: Shippment[] = [
        {
            id: 1,
            shippmentNo: "3097",
            description: "",
            delivery_address: "Rozmanova ulica, 6250 Ilirska Bistrica",
            status: 1
        },
        {
            id: 2,
            shippmentNo: "3098",
            description: "",
            delivery_address: "Partizanska cesta, 1381 Rakek",
            status: 2
        },
        {
            id: 3,
            shippmentNo: "3099",
            description: "",
            delivery_address: "Kidričevo naselje, 6230 Postojna",
            status: 3
        }
    ]

    // list of all shipment statuses
    SHIPPMENT_STATUSES = [
        {
            status: 1,
            label: {
                "sl": "V izdelavi",
                "en": "In the making",
            }
        },
        {
            status: 2,
            label: {
                "sl": "Predano kurirju",
                "en": "Handed over to the courier",
            }
        },
        {
            status: 3,
            label: {
                "sl": "Na poti",
                "en": "The shipment is on its way",
            }
        },
        {
            status: 4,
            label: {
                "sl": "Dostavljeno",
                "en": "Delivered",
            }
        },
    ]

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