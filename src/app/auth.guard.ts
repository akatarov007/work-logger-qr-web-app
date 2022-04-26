import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {Globals} from './shared/globals';
import {TranslateService} from '@ngx-translate/core';
import {SnotifyService} from 'ng-snotify';
import {FuseNavigationService} from '../@fuse/components/navigation/navigation.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private _authService: AuthService,
        private _globals: Globals,
        private _router: Router,
        private _translate: TranslateService,
        private _snotifyService: SnotifyService,
        private _fuseNavigationService: FuseNavigationService
    ) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        return new Observable<boolean>(obs => {
            this._authService.checkToken(state.url, next.data['expectedRole']).subscribe(data => {
                    if (data.status) {
                        // set role and userId for further usage
                        this._authService.setRole(data.userRole);
                        this._authService.setUserId(data.userId);
                    }
                    obs.next(data.status);
                }, error => {

                }
            );
        });
    }
}