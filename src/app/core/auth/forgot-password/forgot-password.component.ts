import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AubeErrorStateMatcher } from 'src/app/shared/utils/error-state-matcher';
import { User } from '../util/user.model';
import { IAuthService } from '../util/iauth-service.interface';
import { AUTH_SERVICE } from '../util/auth-service.token';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { conflowAnimations } from 'src/app/shared/animations';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: conflowAnimations
})
export class ForgotPasswordComponent implements OnInit {
    forgotPasswordForm: FormGroup;

    matcher = new AubeErrorStateMatcher();
    isLoading: boolean;
    /**
     * The user model to use for login
     */
    public user: User;
    /**
    * Constructor
    *
    * @param {FormBuilder} _formBuilder
    */
    constructor(
        @Inject(AUTH_SERVICE) private authService: IAuthService,
        private _formBuilder: FormBuilder,
        public router: Router,
        private alertService: AlertService,
        private _translateService: TranslateService) {
        this.user = new User({});


    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    /**
     * The forgot password
     */
    resetPassword(): void {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.user = this.forgotPasswordForm.value;
        this.authService.resetPassword(this.user).subscribe(
            (response) => {
                this.isLoading = false;
                this.alertService.showSuccess(this._translateService.instant('password.forgetPasswordEmailMessage'), this._translateService.instant('password.forgetPasswordDialogHeading'), '', 2000);
            },
            (err) => {
                this.isLoading = false;
                this.alertService.showWarning(this._translateService.instant('errorMessage'), this._translateService.instant('password.forgetPasswordDialogHeading'), 'OK', 2000);
                console.error(err);
            }
        );
    }

}
