import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Globals} from './shared/globals';
import {tap} from 'rxjs/operators';

class User {
    id: number // user's id
    name: string // user's full name
    username: string
    email: string
    role: number
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    userDetails: any = {}
    token: string = localStorage.getItem("token") || ''
    refresh_token: string = localStorage.getItem("refresh_token") || ''
    role: number = +localStorage.getItem('role') || 0
    userId: number = +localStorage.getItem('user_id') || 0

    constructor(
        private _httpClient: HttpClient,
        private _globals: Globals
    ) {
        if (localStorage.getItem("loggedUser")) {
            this.userDetails = JSON.parse(localStorage.getItem("loggedUser"))
            this.setRole(this.userDetails.role);
            this.setUserId(this.userDetails.id);
        } else {
            this.userDetails = {}
        }
    }

    /**
     * Send auth request to API
     *
     */
    auth(credentials: any) {
        return this._httpClient.post<any>(this._globals.BASE_URL + '/workLogger/auth', credentials)
    }

    /**
     * Set user's details after successful login
     */
    setUserDetails(user: any, token: string, refresh_token: string) {
        localStorage.setItem('loggedUser', JSON.stringify(user))
        localStorage.setItem('token', token)
        localStorage.setItem('refresh_token', refresh_token)
        this.userDetails = user
        this.token = token
        this.role = user.role
        this.userId = user.id
        this.refresh_token = refresh_token
    }

    /**
     * Send recovery password email
     *
     */
    sendRecoveryLink(email: string) {
        return this._httpClient.post<any>(this._globals.BASE_URL + '/email/workLogger/reset_password', {email: email})
    }

    /**
     * Reset user's password
     *
     */
    resetUserPassword(token: string, password: string) {
        let payload = {
            token: token,
            password: password
        }

        return this._httpClient.post<any>(this._globals.BASE_URL + '/workLogger/newPass', payload)
    }

    /**
     * Check validity of token for resetting password
     *
     */
    checkResetPasswordTokenValidity(token: string) {
        return this._httpClient.post<any>(this._globals.BASE_URL + '/workLogger/checkAuthToken', {token: token})
    }

    /**
     * Clear user details in local storage
     *
     */
    clearData() {
        localStorage.clear()
    }

    /**
     * Logout user
     *
     */
    logout() {
        return this._httpClient.post<any>(this._globals.BASE_URL + '/workLogger/logout', {refresh_token: this.refresh_token})
    }

    /**
     * Get token
     *
     */
    getToken() {
        return localStorage.getItem("token") ? localStorage.getItem("token") : ''
    }

    /**
     * Get user role
     *
     */
    getRole() {
        return +this.role
    }

    /**
     * Get user id
     *
     */
    getUserId() {
        return +this.userId
    }

    /**
     * Set user role
     *
     */
    setRole(role) {
        this.userDetails.role = role;
        this.role = role
        localStorage.setItem('role', role)
    }

    /**
     * Set user id
     *
     */
    setUserId(user_id) {
        this.userDetails.id = user_id;
        this.userId = user_id
        localStorage.setItem('user_id', user_id)
    }

    /**
     * Check token for accessing page
     *
     */
    checkToken(url, routeAccessCredentials) {
        return this._httpClient.post<any>(this._globals.BASE_URL + '/workLogger/check-token', {routeAccessCredentials: routeAccessCredentials, nextPath: url})
    }

    /**
     * Method for refreshing token
     *
     */
    refreshToken() {
        console.log("Refreshing token in progress....")
        let refresh_token = localStorage.getItem("refresh_token") ? localStorage.getItem("refresh_token") : ''
        return this._httpClient.post<any>(this._globals.BASE_URL + '/workLogger/refresh-token', {refresh_token: refresh_token},
            {observe: 'response'}).pipe(
            tap((res: HttpResponse<any>) => {
                // save newly generated refresh and access token to localStorage
                this.setUserDetails(this.userDetails, res.body.token, res.body.refresh_token)
            })
        )
    }

}
