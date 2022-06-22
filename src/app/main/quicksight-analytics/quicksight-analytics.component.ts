import {Component, OnInit} from '@angular/core';
import {Globals} from '../../shared/globals';
import {HttpClient} from '@angular/common/http';

@Component({
    selector   : 'blank',
    templateUrl: './quicksight-analytics.component.html',
    styleUrls  : ['./quicksight-analytics.component.scss']
})
export class QuicksightAnalyticsComponent implements OnInit
{
    /**
     * Constructor
     */
    constructor(
        private _globals: Globals,
        private _httpClient: HttpClient
    )
    {
    }

    ngOnInit() {
        this._httpClient.get(this._globals.BASE_URL + '/quicksight/generateEmbedUrlForAnonymousUser').subscribe(response => {
            console.log("Response: ", response)
        }, err => {
            throw err;
        })
    }


}
