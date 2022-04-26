export const locale = {
    lang: 'en',
    data: {
        'LOGIN': "Login",
        'LOGIN_FORM': {
            'USERNAME': "Username",
            'PASSWORD': "Password",
            'USERNAME_REQUIRED': "Username is required",
            'PASSWORD_REQUIRED': "Password is required",
            'FORGOT_PASSWORD': "Forgot password?"
        },
        'RECOVER_YOUR_PASSWORD': "Recover your password",
        'RECOVER_FORM': {
            'EMAIL': "Email",
            'EMAIL_REQUIRED': "Email is required",
            'EMAIL_INVALID': "Please enter a valid email address",
            'SEND_RESET_LINK': "Send reset link",
            "BACK_TO_LOGIN": "Go back to login"
        },
        'CONFIRM_EMAIL_ADDRESS': "Confirm your email address!",
        'CONFIRM_EMAIL': {
            "BODY1": "A confirmation e-mail has been sent to ",
            "BODY2": "Check your inbox and click on the \"Confirm my email\" link to confirm your email address."
        },
        'RESET_YOUR_PASSWORD': "Reset your password",
        'RESET_PASSWORD': {
            'TOKEN_INVALID': "Token for password reset is invalid.",
            'EMAIL': "Email",
            'EMAIL_REQUIRED': "Email is required",
            'EMAIL_INVALID': "Please enter a valid email address",
            'PASSWORD': "Password",
            'PASSWORD_REQUIRED': 'Password is required',
            'PASS_TYPE_DEF': 'Password must include',
            'PASS_REQUIRED_TYPE': 'At least 6 characters in length.&#13;' +
                '            At least 1 lowercase letters.&#13;' +
                '            At least 1 uppercase letters.&#13;' +
                '            At least 1 number.',
            'PASS_REQUIRED_TYPE_ONE_LINE': 'At least 6 characters in length,' +
                '            At least 1 lowercase letters,' +
                '            At least 1 uppercase letters,' +
                '            At least 1 number.',
            'PASSWORD_CONFIRM': 'Password (confirmation)',
            'PASSWORD_CONFIRM_REQUIRED': 'Password confirmation is required',
            'PASSWORDS_NOT_MATCHING': 'Passwords does not match',
            'RESET_PASSWORD': 'Reset my password',
        },
        'MY_PROFILE': "My profile",
        'LOGOUT': "Logout",
        'SAMPLE': {
            'HELLO': 'Hello, World!'
        },
        'ALERTS': {
            'INVALID_PASS': "Password is invalid.",
            'USER_NOT_FOUND': "Provided username does not exists.",
            'GENERIC_ERROR': "Something went wrong.",
            'EMAIL_NOT_FOUND': "Email was not found.",
            'SUCCESS_CHANGE_PASS': "Password reseted successfully.",
            'LOGIN_SUCCESS': "Login successful.",
            'UPDATE_SUCCESSFUL': "Update successful.",
            'INSERT_SUCCESSFUL': "Insert successful.",
            'CANCEL_SUCCESSFUL': "Cancelling successful.",
            'DELETE_SUCCESSFUL': "Delete successful.",
            'CHECK_BEFORE_PROCEED': 'Are you sure you want to continue?',
            'CHANGES_WILL_BE_LOST': 'Changes will be lost.',
            'OK': 'OK',
            'CANCEL': 'Cancel',
        },
        'SOMETHING_WENT_WRONG': "Something went wrong.",
        'INVALID_TOKEN': 'The request is either invalid or expired.',
        'INVALID_REFRESH_TOKEN': "Refresh token is invalid.",
        'LOGIN_AGAIN': 'Please login again.',
        'FORBIDDEN': "Forbidden access",
        'REDIRECTED': "You don't have permissions to access this route. You'll be redirected to the homepage.",
        'ITEMS_PER_PAGE_LABEL': 'Items per page:',
        'NEXT_PAGE_LABEL': 'Next page',
        'PREVIOUS_PAGE_LABEL': 'Previous page',
        'FIRST_PAGE_LABEL': 'First page',
        'LAST_PAGE_LABEL': 'Last page',
        'RANGE_PAGE_LABEL_1': '0 of {{length}}',
        'RANGE_PAGE_LABEL_2': '{{startIndex}} - {{endIndex}} of {{length}}',
        'OF': 'of',

        'USERS': {
            'USERS': "Users",
            "NAME": "Full name",
            "EMAIL": "Email",

            //NEW USER
            'NEW_USER': "New user",
            'USER_DETAILS': "User's details",
            'USER_GENERAL': "General details",
            'USERNAME': "Username",
            'ROLE': "User's role",
            "PASSWORD": "User's password",
            'PASSWORD_CONFIRM': "Confirmation password",
            'WORK_TYPES': "Worker's work types",
            'HOURLY_RATE': "Hourly rate",
            'WORK_TYPE': "Type of work",

            'FORM_FIELDS': {
                'NAME_REQUIRED': "Full name of user is required",
                'USERNAME_REQUIRED': "Username is required",
                'USERNAME_TAKEN': "Username is already taken",
                'EMAIL_REQUIRED': "Email is required",
                'EMAIL_INVALID': "Email is invalid",
                'EMAIL_TAKEN': "Email is already taken",
                'PASSWORD_REQUIRED': "Password is required",
                'ROLE_REQUIRED': "User's role is required",
                'HOURLY_RATE__REQUIRED': "Hourly rate is required",
            },

            'ROLES': {
                'SUPER_ADMIN': "Super admin",
                'ADMIN': "Admin",
                'OFFICE_WORKER': "Office worker",
                'WORKER': "Worker",
                'SCHEDULER': "QR Generator",
            }
        },

        'FILTER': 'Filter',
        'FILTER_BY': {
            'CLEAR_FILTER': 'Reset filter',
            'CANCELLATION': 'Availability',
            'ONLY_NOT_CANCELLED': 'Only available',
            'ONLY_CANCELLED': 'Only unavailable',
            'ALL': 'All',

            'USERS': {
                'TOPIC': "Users filter",
                'ALL_ITEMS': 'All users',
                'SUPER_ADMIN': "Super admin",
                'ADMIN': "Admin",
                'OFFICE_WORKER': "Office worker",
                'WORKER': "Worker",
            },
        },
        'QR_GEN': {
            "SUCCESSFUL_DAY": "We wish you a successful working day!",
            "SCAN_QR_TO_START": "Scan QR code to log your arrival or end of shift"
        },
        'ADD_BTN': "Add",
        'SAVE_BTN': "Save",
        'AVAILABLE': "Available",
        'UNAVAILABLE': "Unavailable",
        'YES': "Yes",
        'NO': "No",
        'COPY_TO_PAYLOAD': "Copy",
        'NO_RESULTS': 'No results found to be displayed.',
        'LOADING': 'Loading...',
        'STORNIRAJ': "Delete",
        'UNIT': "unit",
        'ADD': "Add",
        'SAVE': "Save",
        'DELETE': "Delete",
        'MATERIAL_TAB_PROCEED_BTN': "Proceed",
        'MATERIAL_TAB_BACKWARD_BTN': "Backward",
        'CLOSE': "Close",
        'SELECTED': "Selected",
        'DESELECT_ALL': "Deselect all",
        'CANNOT_SAVE': "Error while saving",
        'WORKER_HAS_NOT_SPECIFIED_WORK_TYPES': "Selected worker does not have specified price per hour for specific work type. Because of that you can not log any types of work on this order for this user."
    }
};
