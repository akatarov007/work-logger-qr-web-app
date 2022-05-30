import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';
import {
    MatDialogModule,
    MatFormFieldModule, MatInputModule,
    MatPaginatorIntl, MatPaginatorModule,
    MatSelectModule, MatSortModule, MatTableModule, MatTabsModule,
    MatToolbarModule
} from '@angular/material';
import {TokenInterceptor} from './token.interceptor';
import {PaginatorIntlService} from './shared/PaginatorIntlService';
import {SnotifyModule, SnotifyService, ToastDefaults} from 'ng-snotify';
import {registerLocaleData} from '@angular/common';
import localeSl from '@angular/common/locales/sl';
import {AuthGuard} from './auth.guard';
import {CanDeactivateGuard} from './can-deactivate.guard';
import {QrGeneratorComponent} from './main/qr-generator/qr-generator.component';
import {UserService} from './main/users/user/user.service';
import {UsersComponent} from './main/users/users.component';
import {LoginComponent} from './main/authorization/login/login.component';
import {ForgotPasswordComponent} from './main/authorization/login/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './main/authorization/login/reset-password/reset-password.component';
import {MailConfirmComponent} from './main/authorization/login/mail-confirm/mail-confirm.component';
import {UserComponent} from './main/users/user/user.component';
import {SampleComponent} from './main/sample/sample.component';
import {FilterByComponentDialogComponent} from './main/filter-by/filter-by.component';
import {QRCodeModule} from 'angularx-qrcode';
import {GetRolePipe} from './shared/pipes/get-role.pipe';
import {UsersService} from './main/users/users.service';
import {Globals} from './shared/globals';

// @ts-ignore
ToastDefaults.toast.position = 'rightTop';
ToastDefaults.toast.titleMaxLength = 60;

registerLocaleData(localeSl);

export const MY_FORMATS = {
    parse: {
        dateInput: 'LL',
    },
    display: {
        dateInput: 'LL',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMM YYYY',
    },
};

const appRoutes: Routes = [
    { path: '',   redirectTo: '/home', pathMatch: 'full' },
    {
        path: 'home',
        component: SampleComponent,
        canActivate: [AuthGuard],
        data: {expectedRole: [1,2,3,4]},
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent
    },
    {
        path: 'reset-password',
        component: ResetPasswordComponent
    },
    {
        path: 'mail-confirm',
        component: MailConfirmComponent
    },
    {
        path: 'qr',
        component: QrGeneratorComponent,
        canActivate: [AuthGuard],
        data: {expectedRole: [99]}
    },
    {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuard],
        data: {expectedRole: [1]}
    },
    {
        path: 'users/user/:id',
        component: UserComponent,
        canActivate: [AuthGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {expectedRole: [1]},
        resolve: {
            data: UserService
        }
    }
];

@NgModule({
    declarations: [
        AppComponent,
        QrGeneratorComponent,
        UsersComponent,
        UserComponent,
        LoginComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        MailConfirmComponent,
        FilterByComponentDialogComponent,
        GetRolePipe
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        SampleModule,
        TranslateModule.forRoot(),
        SnotifyModule,
        MatToolbarModule,
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        QRCodeModule,
        MatTableModule,
        MatPaginatorModule,
        MatTabsModule,
        MatInputModule,
        MatSortModule,
    ],
    providers: [
        {provide: 'SnotifyToastConfig', useValue: ToastDefaults},
        SnotifyService,
        UsersService,
        UserService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        {
            provide: MatPaginatorIntl,
            useFactory: (translate) => {
                const service = new PaginatorIntlService();
                service.injectTranslateService(translate);
                return service;
            },
            deps: [TranslateService]
        },
        Globals
    ],
    bootstrap   : [
        AppComponent
    ],
    entryComponents: [FilterByComponentDialogComponent]
})
export class AppModule
{
}
