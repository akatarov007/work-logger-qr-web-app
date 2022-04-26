import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BehaviorSubject, merge, Observable, Subject} from 'rxjs';
import {debounceTime, finalize, map, takeUntil, tap} from 'rxjs/operators';
import {fuseAnimations} from '../../../../../src/@fuse/animations';
import {ShippmentService} from './shippment.service';
import {Shippment} from './shippment.model';
import {TranslateService} from '@ngx-translate/core';
import {SnotifyService} from 'ng-snotify';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FuseProgressBarService} from '../../../../@fuse/components/progress-bar/progress-bar.service';
import {Globals} from '../../../shared/globals';
import {ShippmentsService} from '../shippments.service';
import {uuid} from 'ng-snotify/lib/utils';
import {FuseUtils} from '../../../../@fuse/utils';

@Component({
    selector: 'app-shippment-component',
    templateUrl: './shippment.component.html',
    styleUrls: ['./shippment.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ShippmentComponent implements OnInit, OnDestroy, AfterViewInit {
    shippment: Shippment;
    pageType: string;
    shipmentForm: FormGroup;
    progress: boolean;
    progressSubscription: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    // Image upload
    response: string;

    alertText: string = '';
    alertOk: string = '';
    alertCancel: string = '';

    customers: any[] = [];
    loadingCustomers: boolean = false;

    /**
     * Constructor
     *
     * @param _shippmentService
     * @param _shippmentsService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param translate
     * @param _snotifyService
     * @param _router
     * @param _httpClient
     * @param globals
     * @param _fuseUtils
     * @param _progressBar
     */
    constructor(
        private _shippmentService: ShippmentService,
        private _shippmentsService: ShippmentsService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        public translate: TranslateService,
        private _snotifyService: SnotifyService,
        private _router: Router,
        private _httpClient: HttpClient,
        public globals: Globals,
        private _progressBar: FuseProgressBarService
    ) {

        // Set the default
        this.shippment = new Shippment();

        // Set the private defaults
        this._unsubscribeAll = new Subject();

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        // subscribe on _progressBar value changes
        this.progressSubscription = this._progressBar.visible.subscribe(val => {
            this.progress = val;
        })

        // Subscribe to update item on changes
        this._shippmentService.onShippmentChange
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(async shipment => {

                if (shipment) {
                    this._progressBar.show();
                    this.shippment = new Shippment(shipment);
                    this.pageType = 'edit';
                    this._progressBar.hide();
                } else {
                    this.pageType = 'new';
                    this.shippment = new Shippment();
                }

                this.shipmentForm = this.createShippmentForm();
            });

    }

    ngAfterViewInit() {
        // this.dataSource.paginator = this.paginator;
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.progressSubscription.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    public canDeactivate() {
        this._progressBar.hide()
        return new Promise<any>((resolve, reject) => {
            if (this.shipmentForm.dirty) {
                let alertText = ''
                let alertOk = ''
                let alertCancel = ''
                let alertLost = ''

                this.translate.get('ALERTS.CHECK_BEFORE_PROCEED').subscribe(value => {
                    alertText = value;
                });
                this.translate.get('ALERTS.OK').subscribe(value => {
                    alertOk = value;
                });
                this.translate.get('ALERTS.CANCEL').subscribe(value => {
                    alertCancel = value;
                });
                this.translate.get('ALERTS.CHANGES_WILL_BE_LOST').subscribe(value => {
                    alertLost = value;
                });

                this._snotifyService.confirm(alertLost, alertText, {
                    // timeout: 5000,
                    // showProgressBar: true,
                    closeOnClick: false,
                    backdrop: 0.5,
                    // pauseOnHover: true,
                    buttons: [
                        {
                            text: alertOk, action: (toast) => {

                                resolve(true)
                                this._snotifyService.remove(toast.id)

                            }, bold: false
                        },
                        {
                            text: alertCancel, action: (toast) => {
                                this._snotifyService.remove(toast.id)
                                resolve(false)
                            }
                        },
                    ]
                });
            } else {
                resolve(true)
            }
        })
    }

    /**
     * Create shipment form
     *
     * @returns {FormGroup}
     */
    createShippmentForm(): FormGroup {
        return this._formBuilder.group({
            id: [this.shippment.id ? this.shippment.id : FuseUtils.generateGUID()],
            shippmentNo: [this.shippment.shippmentNo, Validators.required],
            delivery_address: [this.shippment.delivery_address, Validators.required],
            status: [this.shippment.status, Validators.required],
            description: [this.shippment.description, Validators.required],
        });
    }

    /**
     * Save shipment
     */
    saveShipment(): void {
        this._progressBar.show();
        const data = this.shipmentForm.getRawValue();

        console.log(data);

        this.shipmentForm.markAsPristine()
        this._router.navigateByUrl('/shipments');

        // this._shippmentService.saveShipment(data).subscribe((data) => {
        //     this._progressBar.hide();
        //
        //     if (data.status) {
        //         this.translate.get('ALERTS.UPDATE_SUCCESSFUL').subscribe(value => {
        //             this._snotifyService.success('', value);
        //         });
        //         this.shipmentForm.markAsPristine()
        //         this._router.navigateByUrl('/shipments');
        //     } else {
        //         this.translate.get('SOMETHING_WENT_WRONG').subscribe(value => {
        //             this._snotifyService.error('', value);
        //         });
        //     }
        // }, error => {
        //     console.log(error);
        //     this._progressBar.hide();
        //     throw error;
        // });
    }

    /**
     * Add shipment
     */
    addShipment(): void {
        this._progressBar.show();

        const data = this.shipmentForm.getRawValue();

        this.globals.SHIPPMENTS.push(data);
        this.translate.get('ALERTS.INSERT_SUCCESSFUL').subscribe(value => {
            this._snotifyService.success('', value);
        });
        this.shipmentForm.markAsPristine()
        this._router.navigateByUrl('/shipments');
        this._progressBar.hide();

        // this._shippmentService.addShipment(data).subscribe((data) => {
        //     this._progressBar.hide();
        //     if (data.status) {
        //         this.translate.get('ALERTS.INSERT_SUCCESSFUL').subscribe(value => {
        //             this._snotifyService.success('', value);
        //         });
        //         this.shipmentForm.markAsPristine()
        //         this._router.navigateByUrl('/shipments');
        //     } else {
        //         this.translate.get('SOMETHING_WENT_WRONG').subscribe(value => {
        //             this._snotifyService.error('', value);
        //         });
        //     }
        // }, error => {
        //     this._progressBar.hide();
        //     console.log(error);
        //     throw error;
        // });
    }

    /**
     * Delete shipment
     *
     */
    deleteShipment() {
        this._progressBar.show();

        this._shippmentService.deleteShipment(this.shippment.id).subscribe(data => {

            if (data.status) {
                this._progressBar.hide();

                this.translate.get('ALERTS.DELETE_SUCCESSFUL').subscribe(value => {
                    this._snotifyService.success('', value);
                });
                this._router.navigateByUrl('/shipments');
            } else {
                this._progressBar.hide();

                this.translate.get('SOMETHING_WENT_WRONG').subscribe(value => {
                    this._snotifyService.error('', value);
                });
            }
        }, error => {
            this._progressBar.hide();
            console.log(error);
            throw error;
        });
    }
}
