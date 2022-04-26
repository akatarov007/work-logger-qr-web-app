export const locale = {
    lang: 'sl',
    data: {
        'LOGIN': "Prijava",
        'LOGIN_FORM': {
            'USERNAME': "Uporabniško ime",
            'PASSWORD': "Geslo",
            'USERNAME_REQUIRED': "Uporabniško ime je obvezno",
            'PASSWORD_REQUIRED': "Geslo je obvezno",
            'FORGOT_PASSWORD': "Ali ste pozabili geslo?"
        },
        'RECOVER_YOUR_PASSWORD': "Obnovite svoje geslo",
        'RECOVER_FORM': {
            'EMAIL': "E-poštni naslov",
            'EMAIL_REQUIRED': "E-poštni naslov je obvezen",
            'EMAIL_INVALID': "Prosimo vnesite veljaven e-poštni naslov",
            'SEND_RESET_LINK': "Pošlji povezavo za obnovitev",
            "BACK_TO_LOGIN": "Nazaj na prijavo"
        },
        'CONFIRM_EMAIL_ADDRESS': "Potrdite svoj e-poštni naslov!",
        'CONFIRM_EMAIL': {
            "BODY1": "Potrditveni email je bil poslan na ",
            "BODY2": "Preverite svoj e-poštni predal in kliknite na povezavo \"Potrdite moj e-poštni naslov\" za potrditev vašega e-poštnega naslova."
        },
        'RESET_YOUR_PASSWORD': "Ponastavite svoje geslo",
        'RESET_PASSWORD': {
            'TOKEN_INVALID': "Žeton za ponastavitev gesla je neveljaven.",
            'EMAIL': "E-poštni naslov",
            'EMAIL_REQUIRED': "E-poštni naslov je obvezen",
            'EMAIL_INVALID': "Prosimo vnesite veljaven e-poštni naslov",
            'PASSWORD': "Geslo",
            'PASSWORD_REQUIRED': 'Geslo je obvezno',
            'PASS_TYPE_DEF': 'Geslo mora vsebovati',
            'PASS_REQUIRED_TYPE': 'Vsaj 6 znakov.&#13;' +
                '            Vsaj 1 malo črko.&#13;' +
                '            Vsaj 1 veliko črko.&#13;' +
                '            Vsaj 1 številko.',
            'PASS_REQUIRED_TYPE_ONE_LINE': 'Vsaj 6 znakov,' +
                '            Vsaj 1 malo črko,' +
                '            Vsaj 1 veliko črko,' +
                '            Vsaj 1 številko.',
            'PASSWORD_CONFIRM': 'Geslo (potrditveno)',
            'PASSWORD_CONFIRM_REQUIRED': 'Potrditveno geslo je obvezno',
            'PASSWORDS_NOT_MATCHING': 'Gesli se ne ujemata',
            'RESET_PASSWORD': 'Ponastavi moje geslo',
        },
        'MY_PROFILE': "Moj profil",
        'LOGOUT': "Odjava",
        'SAMPLE': {
            'HELLO': 'Pozdravljeni'
        },
        'ALERTS': {
            'INVALID_PASS': "Nepravilno geslo.",
            'USER_NOT_FOUND': "Uporabniško ime ne obstaja.",
            'GENERIC_ERROR': "Nekaj je šlo narobe.",
            'EMAIL_NOT_FOUND': "E-poštni naslov ni bil najden.",
            'SUCCESS_CHANGE_PASS': "Geslo je bilo ponastavljeno uspešno.",
            'LOGIN_SUCCESS': "Prijava uspešna.",
            'UPDATE_SUCCESSFUL': "Posodobitev uspešna.",
            'INSERT_SUCCESSFUL': "Dodaja uspešna.",
            'CANCEL_SUCCESSFUL': "Storniranje uspešno.",
            'DELETE_SUCCESSFUL': "Izbris uspesen.",
            'CHECK_BEFORE_PROCEED': 'Ali ste prepričani, da želite nadaljevati?',
            'CHANGES_WILL_BE_LOST': 'Spremembe bodo izgubljene.',
            'OK': 'V redu',
            'CANCEL': 'Prekliči',
        },
        'SOMETHING_WENT_WRONG': "Nekaj je šlo narobe.",
        'INVALID_TOKEN': 'Žeton je neveljaven ali pa je potekel.',
        'INVALID_REFRESH_TOKEN': "Osvežitveni žeton je neveljaven.",
        'LOGIN_AGAIN': ' Prosimo za ponovno prijavo.',
        'FORBIDDEN': "Nedovoljen dostop",
        'REDIRECTED': "Nimate pravic za dostop do te poti. Preusmerjeni boste na domačo stran.",
        'ITEMS_PER_PAGE_LABEL': 'Postavke na stran:',
        'NEXT_PAGE_LABEL': 'Nasljedna stran',
        'PREVIOUS_PAGE_LABEL': 'Prejšnja stran',
        'FIRST_PAGE_LABEL': 'Prva stran',
        'LAST_PAGE_LABEL': 'Zadnja stran',
        'RANGE_PAGE_LABEL_1': '0 od {{length}}',
        'RANGE_PAGE_LABEL_2': '{{startIndex}} - {{endIndex}} od {{length}}',
        'OF': 'od',

        'USERS': {
            'USERS': "Uporabniki",
            "NAME": "Polno ime",
            "EMAIL": "E-poštni naslov",

            //NEW USER
            'NEW_USER': "Novi uporabnik",
            'USER_DETAILS': "Podrobnosti uporabnika",
            'USER_GENERAL': "Splošno o uporabniku",
            'USERNAME': "Uporabniško ime",
            'ROLE': "Uporabniška skupina uporabnika",
            "PASSWORD": "Geslo uporabnika",
            'PASSWORD_CONFIRM': "Potrditveno geslo",
            'WORK_TYPES': "Tipi del delavca",
            'HOURLY_RATE': "Urna postavka",
            'WORK_TYPE': "Tip dela",

            'FORM_FIELDS': {
                'NAME_REQUIRED': "Polno ime uporabnika je obvezno",
                'USERNAME_REQUIRED': "Uporabniško ime je obvezno",
                'USERNAME_TAKEN': "Uporabniško ime je že zasedeno",
                'EMAIL_REQUIRED': "E-poštni naslov uporabnika je obvezen",
                'EMAIL_INVALID': "E-poštni naslov je neveljaven",
                'EMAIL_TAKEN': "E-poštni naslov je že v uporabi",
                'PASSWORD_REQUIRED': "Geslo uporabnika je obvezno",
                'ROLE_REQUIRED': "Uporabniška skupina uporabnika je obvezna",
                'HOURLY_RATE__REQUIRED': "Urna postavka je obvezna",
            },

            'ROLES': {
                'SUPER_ADMIN': "Super skrbnik",
                'ADMIN': "Skrbnik",
                'OFFICE_WORKER': "Pisarniški delavec",
                'WORKER': "Delavec",
                'SCHEDULER': "QR Generator",
            }
        },

        'FILTER': 'Filtriraj',
        'FILTER_BY': {
            'CLEAR_FILTER': 'Ponastavi filter',
            'CANCELLATION': 'Razpoložljivost',
            'NON_PAYER': 'Neplačnik',
            'ONLY_NOT_CANCELLED': 'Samo razpoložljivi',
            'ONLY_CANCELLED': 'Samo nerazpoložljivi',
            'ALL': 'Vsi',

            'USERS': {
                'TOPIC': "Filter uporabnikov",
                'ALL_ITEMS': 'Vsi uporabniki',
                'SUPER_ADMIN': "Super skrbnik",
                'ADMIN': "Skrbnik",
                'OFFICE_WORKER': "Pisarniški delavec",
                'WORKER': "Delavec"
            },
        },
        'QR_GEN': {
            "SCAN_QR_TO_START": "Skeniraj QR kodo znotraj mobilne aplikacije LESKO MOBILE za evidentiranje začetka ali konca tvoje delovne izmene."
        },
        'ADD_BTN': "Dodaj",
        'SAVE_BTN': "Shrani",
        'YES': "Da",
        'NO': "Ne",
        'AVAILABLE': "Razpoložljivo",
        'UNAVAILABLE': "Ne razpoložljivo",
        'NO_RESULTS': 'Ni postavk za prikazati.',
        'LOADING': 'Nalaganje...',
        'STORNIRAJ': "Storniraj",
        'UNIT': "kos",
        'ADD': "Dodaj",
        'COPY_TO_PAYLOAD': "Kopiraj",
        'SAVE': "Shrani",
        'DELETE': "Izbriši",
        'MATERIAL_TAB_PROCEED_BTN': "Naprej",
        'MATERIAL_TAB_BACKWARD_BTN': "Nazaj",
        'CLOSE': "Zapri",
        'SELECTED': "Izbrano",
        'DESELECT_ALL': "Odznači vse",
        'CANNOT_SAVE': "Napaka pri shranjevanju",
        'WORKER_HAS_NOT_SPECIFIED_WORK_TYPES': "Izbrani delavec še nima določenih urnih postavk za določen tip dela zato se predpostavlja da določenih del ne opravlja in se zanj trenuto še nemore zabeležiti delovnega časa. "
    }
};
