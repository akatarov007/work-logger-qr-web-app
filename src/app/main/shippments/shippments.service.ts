import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {FuseProgressBarService} from '../../../@fuse/components/progress-bar/progress-bar.service';
import {Globals} from '../../shared/globals';

@Injectable()
export class ShippmentsService {

    dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    allShipments: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    lengthOfData: number;

    filter: any = {};

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

    get shipments(): any {
        return this.allShipments.value;
    }

    get length(): any {
        return this.lengthOfData;
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
     * Get all shipments based on filter
     *
     * @returns {Promise<any>}
     */
    getFilteredShipments(): Promise<any> {
        // this.dataChange.next([]);

        return new Promise((resolve, reject) => {
            if (this.filter.shippmentNo) {
                this.dataChange.next([... this._globals.SHIPPMENTS.filter(el => el.shippmentNo === this.filter.shippmentNo)]);
            } else {
                this.dataChange.next(this._globals.SHIPPMENTS);
            }
            this._globals.progress.next(false);
            this._progressBar.hide()
            resolve(this._globals.SHIPPMENTS);
            this._progressBar.hide();
        });

        // return new Promise((resolve, reject) => {
        //     this._httpClient.get(this._globals.BASE_URL + '/shipments/filterBy', {params: this.filter})
        //         .subscribe((response: any) => {
        //             setTimeout(() => {
        //                 this.lengthOfData = response.all
        //                 this._globals.progress.next(false)
        //                 this._progressBar.hide()
        //                 this.dataChange.next(response.data);
        //                 resolve(response);
        //             }, 250)
        //         }, error => {
        //             this._globals.progress.next(false)
        //             this._progressBar.hide()
        //             console.log(error)
        //             reject
        //         });
        // });
    }

    /**
     * Get all shipments
     *
     */
    getAllShipments() {
        return this._globals.SHIPPMENTS;

        // return this._httpClient.get<any>(this._globals.BASE_URL + '/shipments/getAllShipments');
    }
}
