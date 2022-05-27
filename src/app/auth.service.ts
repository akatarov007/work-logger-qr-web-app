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
    userDetails: string = localStorage.getItem("loggedUser") || ''
    token: string = localStorage.getItem("token") || ''
    refresh_token: string = localStorage.getItem("refresh_token") || ''
    role: number = +localStorage.getItem('role') || 0
    userId: number = +localStorage.getItem('user_id') || 0

    constructor(
        private _httpClient: HttpClient,
        private _globals: Globals
    ) {
    }

    /**
     * Send auth request to API
     *
     */
    auth(credentials: any) {
        return this._httpClient.post<any>(this._globals.BASE_URL + '/users/workLogger/auth', credentials)
    }

    /**
     * Set user's details after successful login
     */
    setUserDetails(user: string, user_id: number, user_role: number, token: string, refresh_token: string) {
        localStorage.setItem("loggedUser", user)
        localStorage.setItem("user_id", JSON.stringify(user_id))
        localStorage.setItem("role", JSON.stringify(user_role))
        localStorage.setItem("token", token)
        localStorage.setItem("refresh_token", refresh_token)
        localStorage.setItem("loggedIn", JSON.stringify(true))
        this.userDetails = user
        this.token = token
        this.role = user_role
        this.userId = user_id
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

        return this._httpClient.post<any>(this._globals.BASE_URL + '/users/workLogger/newPass', payload)
    }

    /**
     * Check validity of token for resetting password
     *
     */
    checkResetPasswordTokenValidity(token: string) {
        return this._httpClient.post<any>(this._globals.BASE_URL + '/users/workLogger/checkAuthToken', {token: token})
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
        return this._httpClient.post<any>(this._globals.BASE_URL + '/users/workLogger/logout', {refresh_token: this.refresh_token})
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
        this.role = role
        localStorage.setItem('role', role)
    }

    /**
     * Set user id
     *
     */
    setUserId(user_id) {
        this.userId = user_id
        localStorage.setItem('user_id', user_id)
    }

    /**
     * Check token for accessing page
     *
     */
    checkToken(url, routeAccessCredentials) {
        return this._httpClient.post<any>(this._globals.BASE_URL + '/users/workLogger/check-token', {routeAccessCredentials: routeAccessCredentials, nextPath: url})
    }

    /**
     * Method for refreshing token
     *
     */
    refreshToken() {
        console.log("Refreshing token in progress....")
        let refresh_token = localStorage.getItem("refresh_token") ? localStorage.getItem("refresh_token") : ''
        return this._httpClient.post<any>(this._globals.BASE_URL + '/users/workLogger/refresh-token', {refresh_token: refresh_token},
            {observe: 'response'}).pipe(
            tap((res: HttpResponse<any>) => {
                // save newly generated refresh and access token to localStorage
                this.setUserDetails(this.userDetails, this.userId, this.role, res.body.token, res.body.refresh_token)
            })
        )
    }

}
