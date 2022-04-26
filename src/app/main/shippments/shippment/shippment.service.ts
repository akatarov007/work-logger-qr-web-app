import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {FuseProgressBarService} from '../../../../@fuse/components/progress-bar/progress-bar.service';
import {TranslateService} from '@ngx-translate/core';
import {SnotifyService} from 'ng-snotify';
import {DomSanitizer} from '@angular/platform-browser';
import {Globals} from '../../../shared/globals';

@Injectable()
export class ShippmentService implements Resolve<any> {
    routeParams: any;
    shippment: any;
    onShippmentChange: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     * @param _globals
     * @param _router
     * @param _translate
     * @param _snotifyService
     * @param _progressBar
     * @param sanitizer
     */
    constructor(
        private _httpClient: HttpClient,
        private _globals: Globals,
        private _router: Router,
        private _translate: TranslateService,
        private _snotifyService: SnotifyService,
        private _progressBar: FuseProgressBarService,
        private sanitizer: DomSanitizer
    ) {
        // Set the defaults
        this.onShippmentChange = new BehaviorSubject({});
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
                this.getShipment(),
            ]).then(
                () => {
                    this._progressBar.hide();
                    resolve();
                },
                () => {
                    this._progressBar.hide();
                    this._router.navigateByUrl('/shipments');
                    reject();
                }
            );
        });
    }

    /**
     * Get shipment
     *
     * @returns {Promise<any>}
     */
    getShipment(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {
                this.onShippmentChange.next(false);
                resolve(false);
            } else {

                this.shippment = this._globals.SHIPPMENTS.filter(shipmentEl => shipmentEl.id.toString() === this.routeParams.id)[0];
                this.onShippmentChange.next(this.shippment);
                resolve(true)

                // this._httpClient.get(this._globals.BASE_URL + '/shipments/getShipment/' + this.routeParams.id)
                //     .subscribe((response: any) => {
                //         if (response.status) {
                //             this.shippment = response.data;
                //             this.onShippmentChange.next(this.shippment);
                //             resolve(response);
                //         } else {
                //             this._translate.get('SOMETHING_WENT_WRONG').subscribe(value => {
                //                 this._snotifyService.error('', value);
                //             });
                //             reject();
                //         }
                //     }, error => {
                //         console.log(error);
                //         reject();
                //         throw error;
                //     });
            }
        });
    }

    /**
     * Save shipment
     *
     */
    saveShipment(shipment) {
        return this._httpClient.post<any>(this._globals.BASE_URL + '/shipments/updateShipment/' + shipment.id, shipment);
    }

    /**
     * Add shipment
     *
     */
    addShipment(shipment) {
        return this._httpClient.post<any>(this._globals.BASE_URL + '/shipments/addShipment', shipment);
    }

    /**
     * Delete shipment
     */
    deleteShipment(id) {
        return this._httpClient.get<any>(this._globals.BASE_URL + '/shipments/deleteShipment/' + id);
    }
}

