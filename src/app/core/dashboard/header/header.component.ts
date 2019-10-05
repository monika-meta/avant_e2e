import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlobalService } from '../../../shared/services/global.service';
import { languages } from '../../../shared/const/lang';
import { TranslateService } from '../../../../../node_modules/@ngx-translate/core';
import { ConflowSettings } from '../../../shared/settings/conflow-settings';
import { AuthService } from '../../auth/auth.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '../../../../../node_modules/@angular/material/dialog';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { ConfirmComponent } from 'src/app/shared/components/alert/confirm/confirm.component';
import { LaunchDarklyService } from 'src/app/shared/services/launchdarkly.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

    /**
     * List of all languages
     */
    languages: any;

    /**
     * Current language Code
     */
    currentLangId: string;

    dialogRef: any;

    private _unsubscribeAll: Subject<any>;
    confirmDialogRef: MatDialogRef<ConfirmComponent>;

    constructor(public _global: GlobalService, private translate: TranslateService, public _authService: AuthService,
        public _launchDarklyService: LaunchDarklyService, private _matDialog: MatDialog, private _translateService: TranslateService) {
        this.languages = languages;
        this.currentLangId = ConflowSettings.defaultLanguage;
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
    }

    /**
     * Change language for the application
     * @param langId language code
     */
    changeLang(langId: string) {
        this.translate.use(langId);
        this.currentLangId = langId;
    }


    setSpace(space): void {
        if (space.id == this._global.selectedSpaceId) {
            return;
        }
        this.confirmDialogRef = this._matDialog.open(ConfirmComponent, {
            disableClose: false,
            panelClass: ''
        });

        this.confirmDialogRef.componentInstance.confirmMessage = this._translateService.instant('space.spaceSwitchErrorMessage');
        this.confirmDialogRef.componentInstance.title = this._translateService.instant('space.spaceDialogHeader');
        this.confirmDialogRef.componentInstance.confirmButtonText = this._translateService.instant('confirm');

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._global.setActiveSpaceIdForUser(space);
                this._global.onSpaceChanged.next(space.id);
            }
            this.confirmDialogRef = null;
        });
    }

    toggle() {
        this._global.toggleSideBar.next(true);
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


    /**
     * Open Edit Profile dialog
     *
     */
    openEditProfileDialog(): void {
        this.dialogRef = this._matDialog.open(EditProfileComponent, {
            panelClass: 'edit-profile-dialog',
        });
    }


}
