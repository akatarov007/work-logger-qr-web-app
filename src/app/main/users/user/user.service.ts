import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {Globals} from '../../../shared/globals';
import {FuseProgressBarService} from '../../../../@fuse/components/progress-bar/progress-bar.service';
import {SnotifyService} from 'ng-snotify';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class UserService implements Resolve<any> {
    routeParams: any;
    user: any;
    onUserChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     * @param _globals
     * @param _router
     * @param _snotifyService
     * @param _translate
     * @param _progressBar
     */
    constructor(
        private _httpClient: HttpClient,
        private _globals: Globals,
        private _router: Router,
        private _snotifyService: SnotifyService,
        private _translate: TranslateService,
        private _progressBar: FuseProgressBarService
    ) {
        // Set the defaults
        this.onUserChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        this.routeParams = route.params;
        this._progressBar.show();

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getUser()
            ]).then(
                () => {
                    this._progressBar.hide();
                    resolve();
                },
                () => {
                    this._progressBar.hide();
                    this._router.navigateByUrl('/users');
                    reject();
                }
            );
        });
    }

    /**
     * Get user
     *
     * @returns {Promise<any>}
     */
    getUser(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {
                this.onUserChanged.next(false);
                resolve(false);
            } else {
                this._httpClient.get(this._globals.BASE_URL + '/workLogger/getUser/' + this.routeParams.id)
                    .subscribe((response: any) => {
                        if (response.status) {
                            this.user = response.data;
                            this.onUserChanged.next(this.user);
                            resolve(response);
                        } else {
                            this._translate.get('SOMETHING_WENT_WRONG').subscribe(value => {
                                this._snotifyService.error('', value);
                            });
                            reject();
                        }
                    }, error => {
                        console.log(error);
                        reject();
                        throw error;
                    });
            }
        });
    }

    /**
     * Save user
     *
     */
    saveUser(user) {
        return this._httpClient.post<any>(this._globals.BASE_URL + '/workLogger/updateUser', user);
    }

    /**
     * Add user
     *
     */
    addUser(user) {
        return this._httpClient.post<any>(this._globals.BASE_URL + '/workLogger/addUser', user);
    }

    /**
     * Delete user
     */
    deleteUser(user) {
        return this._httpClient.post<any>(this._globals.BASE_URL + '/workLogger/deleteUser', user);
    }

    /**
     * Validate email
     *
     */
    validateEmail(email) {
        return this._httpClient.post<any>(this._globals.BASE_URL + '/workLogger/validateEmail', {email: email});
    }

    /**
     * Validate username
     *
     */
    validateUsername(username) {
        return this._httpClient.post<any>(this._globals.BASE_URL + '/workLogger/validateUsername', {username: username});
    }
}
