export class User {
    id: string;
    name: string;
    username: string;
    email: string;
    role: number;
    password: string;
    passwordConfirm: string;
    work_types: {
        type: number,
        hourly_rate: number,
    }[];

    /**
     * Constructor
     *
     * @param user
     */
    constructor(user?)
    {
        user = user || {};
        this.id = user.id || '';
        this.name = user.name || '';
        this.username = user.username || '';
        this.email = user.email || '';
        this.password = '';
        this.passwordConfirm = '';
        this.role = user.role || 3;
        this.work_types = user.work_types || [];
    }
}
