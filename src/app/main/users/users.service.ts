import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import {Globals} from '../../shared/globals';
import {FuseProgressBarService} from '../../../@fuse/components/progress-bar/progress-bar.service';

@Injectable()
export class UsersService {

    dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    allUsers: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    lengthOfData: number

    filter: any = {}

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     * @param _globals
     * @param _progressBar
     */
    constructor(
        private _httpClient: HttpClient,
        private _globals: Globals,
        private _progressBar: FuseProgressBarService
    ) {
    }

    get data(): any[] {
        return this.dataChange.value;
    }

    get users(): any {
        return this.allUsers.value
    }

    get length(): any {
        return this.lengthOfData
    }

    /**
     * Set filter values
     *
     */
    setFilter(filter) {
        this.filter = filter;
    }

    /**
     * Get filter values
     *
     */
    get getFilter() {
        return this.filter;
    }

    /**
     * Get all users
     *
     * @returns {Promise<any>}
     */
    getUsers(): Promise<any>
    {
        this.dataChange.next([])

        return new Promise((resolve, reject) => {
            this._httpClient.get(this._globals.BASE_URL + '/workLogger/filterBy', {params: this.filter})
                .subscribe((response: any) => {
                    setTimeout(() => {
                        this.lengthOfData = response.all
                        this._globals.progress.next(false)
                        this._progressBar.hide()
                        this.dataChange.next(response.data);
                        resolve(response);
                    }, 250)
                }, error => {
                    this._globals.progress.next(false)
                    this._progressBar.hide()
                    console.log(error)
                    reject
                });
        });
    }

    /**
     * Get all users
     *
     */
    getAllUsers() {
        return this._httpClient.get<any>(this._globals.BASE_URL + '/workLogger/getAllUsers')
    }

    /**
     * Get all workers
     *
     */
    getAllWorkers() {
        return this._httpClient.get<any>(this._globals.BASE_URL + '/workLogger/getAllWorkers')
    }
}
