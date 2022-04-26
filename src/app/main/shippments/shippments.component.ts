import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, merge, Observable, Subject} from 'rxjs';
import {delay, map} from 'rxjs/operators';
import {fuseAnimations} from '../../../../src/@fuse/animations';
import {ShippmentsService} from './shippments.service';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {FormGroup} from '@angular/forms';
import {FilterByComponentDialogComponent} from '../filter-by/filter-by.component';
import {FuseProgressBarService} from '../../../@fuse/components/progress-bar/progress-bar.service';
import * as moment from 'moment';
import {Globals} from '../../shared/globals';

@Component({
    selector: 'app-shippments-component',
    templateUrl: './shippments.component.html',
    styleUrls: ['./shippments.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ShippmentsComponent implements OnInit, OnDestroy, AfterViewInit {
    dialogRef: any;
    progress: boolean = false;
    progressSubscription: any;

    pageNo: number;
    pageSize: number;

    shippments: any[] = [];

    displayedColumns = ['shippmentNo', 'delivery_address', 'status'];

    dataSource: ShipmentsDataSource | null;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild('filter', {static: true}) filter: ElementRef;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    filterValue: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param shippmentsService
     * @param translate
     * @param httpClient
     * @param _globals
     * @param _chgDetector
     * @param _matDialog
     * @param _progressBar
     */
    constructor(
        public shippmentsService: ShippmentsService,
        public translate: TranslateService,
        private httpClient: HttpClient,
        public _globals: Globals,
        private _chgDetector: ChangeDetectorRef,
        private _matDialog: MatDialog,
        public _progressBar: FuseProgressBarService
    ) {
        // Subscribe in order to know when to show and hide progress bar
        this.progressSubscription = this._globals.progress.subscribe(value => {
            this.progress = value;

            // mark for check
            this._chgDetector.markForCheck();
        });

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
        this.pageNo = 0;
        this.pageSize = 10;

        this.filterValue = {
            how_many: this.pageSize,
            offset: this.pageNo * this.pageSize,
            shippmentNo: ''
        };

        this.loadData();
    }


    ngAfterViewInit() {

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

    /**
     * Load data into the table
     */
    public loadData() {
        this._progressBar.show();
        this._globals.progress.next(true);
        this.shippmentsService = new ShippmentsService(this.httpClient, this._globals, this._progressBar);
        this.shippmentsService.setFilter(this.filterValue);
        this.dataSource = new ShipmentsDataSource(this.shippmentsService, this.paginator, this.sort, this._progressBar);
    }

    /**
     * Method for opening filter modal
     *
     */
    openFilter(): void {
        this.dialogRef = this._matDialog.open(FilterByComponentDialogComponent, {
            panelClass: 'contact-form-dialog',
            data: {
                filter: this.filterValue,
                object: 'shipments'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    return;
                }
                let how_many = this.filterValue.how_many;
                let offset = this.filterValue.offset;
                this.filterValue = response.getRawValue();
                this.filterValue.how_many = how_many;
                this.filterValue.offset = offset;
                this.shippmentsService.setFilter(this.filterValue);
                this.refreshTable();
            });
    }

    /**
     * Reload data on paginator page size or page index change
     *
     */
    reloadData(event) {
        if (this.pageNo !== event.pageIndex || this.pageSize !== event.pageSize) {
            this._globals.progress.next(true);
            this._progressBar.show();

            // parse event values
            let offset = event.pageIndex * event.pageSize;
            let how_many = event.pageSize;

            this.pageSize = how_many;

            this.filterValue.how_many = how_many;
            this.filterValue.offset = offset;

            this.shippmentsService.setFilter(this.filterValue);

            if (event.pageIndex > this.pageNo) {
                // Clicked on next button
                this.pageNo = event.pageIndex;
                this.refreshTable();
            } else {
                // Clicked on previous button
                this.pageNo = event.pageIndex;
                this.refreshTable();
            }
        }
    }


    /**
     * Helper function to refresh the paginator number
     */
    refreshTable() {
        this.paginator._changePageSize(this.paginator.pageSize);
        this.loadData();
    }
}

/**
 * DataSource extension for convenience
 *
 */
export class ShipmentsDataSource extends DataSource<any> {
    _filterChange = new BehaviorSubject('');

    get filter(): string {
        return this._filterChange.value;
    }

    set filter(filter: string) {
        this._filterChange.next(filter);
    }

    filteredData: any[] = [];
    renderedData: any[] = [];

    constructor(public _shippmentsService: ShippmentsService,
                public _paginator: MatPaginator,
                public _sort: MatSort,
                private _progressBar: FuseProgressBarService
    ) {
        super();

        // Reset to the first page when the user changes the filter.
        this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     */
    connect(): Observable<any[]> {

        // Listen for any changes in the base data, sorting, filtering, or pagination
        const displayDataChanges = [
            this._shippmentsService.dataChange,
            this._sort.sortChange,
            this._filterChange,
            this._paginator.page
        ];

        this._shippmentsService.getFilteredShipments();

        return merge(...displayDataChanges).pipe(delay(0), map(() => {

                // Filter data
                this.filteredData = this._shippmentsService.data.slice();

                // Sort filtered data
                const sortedData = this.sortData(this.filteredData.slice());

                this.renderedData = sortedData;
                return this.renderedData;
            }
        ));
    }

    disconnect() {
        this._filterChange.complete();
    }

    /**
     * Returns a sorted copy of the database data.
     */
    sortData(data: any[]): any[] {
        if (!this._sort.active || this._sort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch (this._sort.active) {
                case 'serial_num':
                    [propertyA, propertyB] = [a.model, b.model];
                    break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }
}
