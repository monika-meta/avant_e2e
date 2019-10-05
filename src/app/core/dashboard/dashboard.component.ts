import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NavigationComponent } from './navigation/navigation.component';
import { GlobalService } from 'src/app/shared/services/global.service';
import { ChatHubService } from 'src/app/shared/services/chat-hub.service';
import { WindowNotificationService } from 'src/app/features/Notification/window-notification.service';
import { AppInsightService } from 'src/app/shared/services/app-insight.service';
import { AuthService } from '../auth/auth.service';
import { AlertService } from '../../shared/components/alert/alert.service';
import { Subscription, Subject, forkJoin } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { log } from 'util';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

    opened = true;
    over = 'side';
    expandHeight = '42px';
    collapseHeight = '42px';
    displayMode = 'flat';
    mobileDeviceSize: number = 1280;
    sidenavehover = false;
    isLoading: boolean = true;
    private _unsubscribeAll = new Subject<any>();
    selectedSpaceId: string;
    constructor(
        public _globalService: GlobalService,
        private _chatHubService: ChatHubService,
        private _windowNotificationService: WindowNotificationService,
        private _appInsightService: AppInsightService,
        private alertService: AlertService,
        private authService: AuthService,
        private _translateService: TranslateService,
        media: MediaObserver
    ) {
        media.media$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((change: MediaChange) => {
                if (change.mqAlias === 'sm' || change.mqAlias === 'xs') {
                    this.opened = false;
                    this.over = 'over';
                } else {
                    this.opened = true;
                    this.over = 'side';
                }
            });
    }



    ngOnInit() {
        this.isLoading = true;
        if (localStorage.getItem('access_token')) {
            this._globalService.showProgressBar = true;

            if (this._globalService.spaceForUser) {
                this.selectedSpaceId = this._globalService.selectedSpaceId;
                this.initTasks();
            }
            else {
                //console.log("space info not found");
                this._globalService.getUser()
                    .subscribe((res) => {
                        if (res.spaces && res.spaces.length > 0) {
                            // set space 
                            this._globalService.setSpaceForUser(res.spaces);
                            this.initTasks();
                        }
                        else {
                            // user associations not found. Logout
                            this.alertService.showWarning(this._translateService.instant("login.spaceErrorMessage"), this._translateService.instant("login.signInHeaderMessage"), '', 10000);
                            this.authService.logout();
                        }
                    });
            }
        } else {
            this.authService.logout();
        }

        this._globalService.onSpaceChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(spaceId => {
                this.selectedSpaceId = spaceId;
            });


        this._globalService.toggleSideBar
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                this.drawer.toggle();
            });
        this.authService.scheduleRenewal();


    }


    /**
     * Initialization tasks
     */
    initTasks(): any {
        forkJoin(
            //this._globalService.getUser(),    // user info retrieved in login component
            this._globalService.getUsersForSpace(this._globalService.selectedSpaceId)
        ).subscribe((res) => {
            this._chatHubService.createConnectionToHub();
            this._windowNotificationService.requestPermission();
            this._appInsightService.setAuthenticatedUserId(this._globalService.spaceForUser[0].id);

            this.isLoading = false;
            this._globalService.showProgressBar = false;
        },
            (err) => {
                this._globalService.showProgressBar = false;
                throw (err);
            });

    }

    openSmallNav = false;


    @ViewChild("nav", { static: true })
    nav: NavigationComponent;

    @ViewChild("drawer", { static: true })
    drawer: any;

    public positionChanged(): void {

        //this.openSmallNav = true;
        let windowWidth = window.innerWidth;
        if (windowWidth > this.mobileDeviceSize) {
            setTimeout(function () {
                document.getElementById("mat-content__id").style.marginLeft = "64px";
                document.getElementById("mat-drawer__id").classList.add('small-menu');
            }, 10);

            this.sidenavehover = true;

        } else {
            document.getElementById("mat-drawer__id").classList.add('small-menu');
        }
    }

    public positionRechanged(): void {
        //this.openSmallNav = false;
        let windowWidth = window.innerWidth;
        if (windowWidth > this.mobileDeviceSize) {

            setTimeout(function () {
                document.getElementById("mat-content__id").style.marginLeft = "280px";
                document.getElementById("mat-drawer__id").classList.remove('small-menu');
            }, 10);

            this.sidenavehover = false;

        } else {
            document.getElementById("mat-drawer__id").classList.remove('small-menu');
        }

    }

    public sidenavhoverEffect(): void {
        //this.openSmallNav = false;
        let windowWidth = window.innerWidth;
        if (windowWidth > this.mobileDeviceSize) {
            if (this.sidenavehover == true) {
                setTimeout(function () {
                    document.getElementById("mat-content__id").style.marginLeft = "64px";

                }, 10);
            }
            setTimeout(function () {
                document.getElementById("mat-drawer__id").style.transform = "translate3d(0, 0, 0)";
                document.getElementById("mat-drawer__id").classList.remove('small-menu');
            }, 10);
        }
    }

    public sidenavhoverOutEffect(): void {
        let windowWidth = window.innerWidth;
        if (windowWidth > this.mobileDeviceSize) {
            if (this.sidenavehover == true) {
                //this.openSmallNav = true;
                setTimeout(function () {
                    document.getElementById("mat-content__id").style.marginLeft = "64px";
                    document.getElementById("mat-drawer__id").style.transform = "translate3d(-77%, 0, 0)";
                    document.getElementById("mat-drawer__id").classList.add('small-menu');
                }, 10);
            }
        }
    }
    /**
       * Retrieves user info if not found
       */
    getUserInfo(): void {
        if (!this._globalService.userInfo || !this._globalService.userInfo.id) {
            this._globalService.getUser().subscribe(() => { });
        }
    }

    resizedEvent(): void {

        let windowWidth = window.innerWidth;
        if (windowWidth < this.mobileDeviceSize) {
            this.drawer.close();
            document.getElementById("mat-drawer__id").classList.add('small-menu');
            document.getElementById("mat-content__id").style.marginLeft = "0px";
        } else {
            this.drawer.open();
            document.getElementById("mat-drawer__id").classList.remove('small-menu');
            document.getElementById("mat-content__id").style.marginLeft = "280px";
        }
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
