import {Injectable} from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import {BehaviorSubject, EMPTY, Observable, Subject} from 'rxjs';
import {catchError, switchMap, tap} from 'rxjs/operators';
import {SnotifyService} from 'ng-snotify';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    token: string;
    refreshingAccessToken = false;
    refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    accessTokenRefreshed: Subject<any> = new Subject();

    constructor(public authService: AuthService,
                private snotifyService: SnotifyService,
                private translate: TranslateService,
                private router: Router) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.token = this.authService.getToken()

        // skip appending token to the request if the request is to an external API - DATABASE ONE VEHICLE API
        // if (!request.url.includes(this.globals.VEHICLES_API_KEY)) {
        request = request.clone({
            setHeaders: {
                'Content-Type' : 'application/json',
                'Accept'       : 'application/json',
                'Authorization': `Bearer ${this.token}`,
            }
        });
        // }

        // call next() and handle the response
        return next.handle(request).pipe(
            tap((event) => {
                // console.log(request)
            }),
            catchError((err: HttpErrorResponse) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status == 401) {
                        if (err.error.msg === 'No token provided.') {
                            this.translate.get(['INVALID_TOKEN', 'LOGIN_AGAIN']).subscribe(val => {
                                this.snotifyService.warning(val.LOGIN_AGAIN, val.INVALID_TOKEN, {
                                    timeout: 4000
                                });
                            });
                            this.authService.clearData()
                            this.router.navigateByUrl("/login")
                            throw err
                        }
                        // We don't want to refresh token for some requests like login or refresh token itself
                        // So we verify url and we throw an error if it's the case
                        if (
                            request.url.includes("refresh-token") ||
                            request.url.includes("logout") ||
                            request.url.includes("auth")
                        ) {
                            this.translate.get(['INVALID_REFRESH_TOKEN', 'LOGIN_AGAIN']).subscribe(val => {
                                this.snotifyService.warning(val.LOGIN_AGAIN, val.INVALID_REFRESH_TOKEN, {
                                    timeout: 4000
                                });
                            });
                            this.refreshingAccessToken = false;
                            this.authService.clearData()
                            this.router.navigateByUrl("/login")
                            throw err
                        } else {
                            // refresh the access token
                            return this.refreshAccessToken()
                                .pipe(
                                    switchMap(() => {
                                        let new_request  = this.addAuthenticationToken(request)
                                        return next.handle(new_request);
                                    }),
                                    catchError((err: any) => {
                                        console.log(err);
                                        this.authService.clearData()
                                        this.router.navigateByUrl("/login")
                                        throw err
                                        return EMPTY;
                                    })
                                )
                        }
                    } else if (err.status == 403) { // forbidden access
                        this.translate.get(['FORBIDDEN', 'REDIRECTED']).subscribe(val => {
                            this.snotifyService.warning(val.REDIRECTED, val.FORBIDDEN, {
                                timeout: 4000
                            });
                            this.router.navigateByUrl("/login")
                            throw err
                        });
                    } else {
                        this.translate.get('SOMETHING_WENT_WRONG').subscribe(val => {
                            this.snotifyService.error('', val);
                        });
                        throw err
                    }
                }
            })
        )
    }

    refreshAccessToken() {
        // console.log("Refresh access token bool", this.refreshingAccessToken)
        if (this.refreshingAccessToken) {
            return new Observable(observer => {
                this.accessTokenRefreshed.subscribe(() => {
                    // this code will run when the access token has been refreshed
                    observer.next();
                    observer.complete();
                })
            })
        } else {
            this.refreshingAccessToken = true;
            // we want to call a method in the auth service to send a request to refresh the access token
            return this.authService.refreshToken().pipe(
                tap(() => { // same like subscribe but wont execute observable
                    console.log("Access token refreshed");
                    this.refreshingAccessToken = false;
                    this.accessTokenRefreshed.next();
                }),
                catchError((err: any) => {
                    console.log(err);
                    throw err
                })
            )
        }

    }

    addAuthenticationToken(request) {
        // Get access token from Local Storage
        const accessToken = this.authService.token;

        // If access token is null this means that user is not logged in
        // And we return the original request
        if (!accessToken) {
            return request;
        }
        // We clone the request, because the original request is immutable
        return request.clone({
            setHeaders: {
                'Content-Type' : 'application/json',
                'Accept'   : 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        });

    }
}