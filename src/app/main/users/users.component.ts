import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, fromEvent, merge, Observable, Subject} from 'rxjs';
import {debounceTime, delay, distinctUntilChanged, map, startWith, tap} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {UsersService} from './users.service';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {Globals} from '../../shared/globals';
import {MatDialog} from '@angular/material/dialog';
import {FormGroup} from '@angular/forms';
import {FilterByComponentDialogComponent} from '../filter-by/filter-by.component';
import {FuseProgressBarService} from '../../../@fuse/components/progress-bar/progress-bar.service';

@Component({
    selector: 'app-users-component',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {
    dialogRef: any;
    progress: boolean;
    progressSubscription: any;

    pageNo: number;
    pageSize: number;

    items: any[] = [];

    displayedColumns = ['name', 'username', 'email', 'role'];

    dataSource: UsersDataSource | null;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild('filter', {static: true}) filter: ElementRef;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    filterValue: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param _usersService
     * @param translate
     * @param httpClient
     * @param _globals
     * @param _matDialog
     * @param _progressBar
     */
    constructor(
        public _usersService: UsersService,
        private translate: TranslateService,
        private httpClient: HttpClient,
        private _globals: Globals,
        private _matDialog: MatDialog,
        private _progressBar: FuseProgressBarService
    ) {
        // Subscribe in order to know when to show and hide progress bar
        this.progressSubscription = this._globals.progress.subscribe(value => {
            this.progress = value;
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
            name: 'all',
            username: 'all',
            role: 'all',
            email: 'all',
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
        this._usersService = new UsersService(this.httpClient, this._globals, this._progressBar);
        this._usersService.setFilter(this.filterValue);
        this.dataSource = new UsersDataSource(this._usersService, this.paginator, this.sort, this._progressBar);
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
                object: 'users'
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
export class UsersDataSource extends DataSource<any> {
    _filterChange = new BehaviorSubject('');

    get filter(): string {
        return this._filterChange.value;
    }

    set filter(filter: string) {
        this._filterChange.next(filter);
    }

    filteredData: any[] = [];
    renderedData: any[] = [];

    constructor(public _usersService: UsersService,
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
        this._progressBar.show();
        // Listen for any changes in the base data, sorting, filtering, or pagination
        const displayDataChanges = [
            this._usersService.dataChange,
            this._sort.sortChange,
            this._filterChange,
            this._paginator.page
        ];

        this._usersService.getUsers();

        return merge(...displayDataChanges).pipe(map(() => {

                // Filter data
                this.filteredData = this._usersService.data.slice();

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
                case 'name':
                    [propertyA, propertyB] = [a.name, b.name];
                    break;
                case 'username':
                    [propertyA, propertyB] = [a.username, b.username];
                    break;
                case 'email':
                    [propertyA, propertyB] = [a.email, b.email];
                    break;
                case 'role':
                    [propertyA, propertyB] = [a.role, b.role];
                    break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }
}
