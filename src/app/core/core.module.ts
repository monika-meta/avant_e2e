import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './dashboard/header/header.component';
import { NavigationComponent } from './dashboard/navigation/navigation.component';
import { RouterModule } from '@angular/router';
import { BlankComponent } from './dashboard/blank/blank.component';
import { TranslateModule } from '@ngx-translate/core';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from './auth/auth.service';
import { UnauthorizedRequestInterceptor } from '../shared/http-interceptor.service';
import { GlobalErrorHandler } from '../shared/utils/global-error-handler';
import { AUTH_SERVICE } from './auth/util/auth-service.token';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { AlertComponent } from '../shared/components/alert/alert/alert.component';
import { ConfirmComponent } from '../shared/components/alert/confirm/confirm.component';
import { EditProfileComponent } from 'src/app/core/dashboard/edit-profile/edit-profile.component';
import { AppContainerComponent } from './dashboard/app-container/app-container.component';




@NgModule({
    declarations: [
        LoginComponent,
        ForgotPasswordComponent,
        DashboardComponent,
        HeaderComponent,
        NavigationComponent,
        BlankComponent,
        EditProfileComponent,
        AppContainerComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule.forRoot(),
        OAuthModule,
        SharedModule,

    ],
    providers: [
        AuthService,
        { provide: OAuthStorage, useValue: localStorage },
        { provide: HTTP_INTERCEPTORS, useClass: UnauthorizedRequestInterceptor, multi: true },
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        { provide: AUTH_SERVICE, useClass: AuthService },
    ],
    exports: [
        OAuthModule,
        SharedModule
    ],
    entryComponents: [EditProfileComponent]
})
export class CoreModule { }
