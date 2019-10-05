import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../util/user.model';
import { AubeErrorStateMatcher } from 'src/app/shared/utils/error-state-matcher';
import { IAuthService } from '../util/iauth-service.interface';
import { AUTH_SERVICE } from '../util/auth-service.token';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { LaunchDarklyService } from 'src/app/shared/services/launchdarkly.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { conflowAnimations } from 'src/app/shared/animations';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: conflowAnimations
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    matcher = new AubeErrorStateMatcher();
    isLoading: boolean;
    defaultChannel: string;

    /**
     * The user model to use for login
     */
    public user: User;

    /**
    * Constructor
    * @param {AUTH_SERVICE} authService
    * @param {FormBuilder} _formBuilder
    * @param {ConflowConfigService} _conflowConfigService
    * @param {Router} router
    * @param {AlertService} alertService
    * @param {ChatHubService} chatHubService
    * @param {LaunchDarklyService} _launchDarklyService
    * @param {WindowNotificationService} _windowNotificationService
    * @param {ProfileService} _profileService
    * @param {AppInsightService} _appInsightService
    */

    constructor(
        @Inject(AUTH_SERVICE) private authService: IAuthService,
        private _formBuilder: FormBuilder,
        private _translateService: TranslateService,
        public router: Router,
        private alertService: AlertService,
        public _launchDarklyService: LaunchDarklyService,
        public _globalService: GlobalService, ) {
        this.user = new User({});
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }
    /**
     * Handles the login of the form
     */
    public loginOnServer(): void {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.user = this.loginForm.value;

        this._globalService.showProgressBar = true;
        this.authService.loginOnServer(this.user).subscribe(
            (response) => {
                if (response.status === 200) {  // --> user authenticated                
                    // #73960, #74794 : check user's associations with space
                    this._globalService.getUser()
                        .subscribe((res) => {
                            this.isLoading = false;
                            if (res.spaces && res.spaces.length > 0) {
                                // set space 
                                this._globalService.setSpaceForUser(res.spaces);
                                this._globalService.showProgressBar = false;
                                this.defaultChannel = this._globalService.getDefaultChannel();
                                this.router.navigate(['dashboard/channel', this.defaultChannel ? this.defaultChannel:"" ]);
                            }
                            else {
                                // user associations not found. Logout
                                this._globalService.showProgressBar = false;
                                this.alertService.showWarning(this._translateService.instant('login.spaceErrorMessage'), this._translateService.instant('login.signInHeaderMessage'), '', 10000);
                                this.authService.logout();
                            }
                        },
                            (err) => {
                                this.isLoading = false;
                                this._globalService.showProgressBar = false;
                                // user associations not found. Logout
                                this.alertService.showWarning(this._translateService.instant('login.spaceNotFound'), this._translateService.instant('login.signInHeaderMessage'), '', 10000);
                                this.authService.logout();
                                console.log(err);
                            });
                }
            },
            (err) => {
                this.isLoading = false;
                this._globalService.showProgressBar = false;
                this.alertService.showWarning(err.error.title, this._translateService.instant('login.signInHeaderMessage'), '', 2000);
            }
        );
    }


}
