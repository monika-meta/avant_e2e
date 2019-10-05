import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConflowSettings } from './shared/settings/conflow-settings';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';


//export let browserRefresh = false;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  subscription: Subscription;

  constructor(private translate: TranslateService,
        private _router: Router) {
    
    // set default language for app
    translate.setDefaultLang(ConflowSettings.defaultLanguage);
    translate.addLangs(ConflowSettings.getLanguagesIdInArray);

      //this.subscription = this._router.events.subscribe((event) => {
      //    if (event instanceof NavigationStart) {
      //        browserRefresh = !this._router.navigated;
      //        if (browserRefresh) {
      //            // re-regester after page load
      //            if (localStorage.getItem('access_token')) {
      //                this._globalService.getSpaceForUser(localStorage.getItem('userID'))
      //                    .subscribe((res) => {
      //                        if (res && res.length > 0) {
      //                            this.chatHubService.createConnectionToHub();
      //                            this._windowNotificationService.requestPermission();
      //                            // set space id
      //                            this._globalService.setSpaceForUser(res);
      //                            this._appInsightService.setAuthenticatedUserId(res[0].id);
      //                            // allow navigate
      //                            this._router.navigate(['dashboard/channel']);
      //                        }
      //                        else {
      //                            // user accociations not found. Logout
      //                            this._alertService.showWarning('You are not associated with any space, Please contact your system administrator', 'Sign in failed!', 'OK', 10000);
      //                            this._authService.logout();
      //                        }
      //                    },
      //                        (err) => {
      //                            // user accociations not found. Logout
      //                            this._alertService.showWarning('You are not associated with any space, Please contact your system administrator', 'Sign in failed!', 'OK', 10000);
      //                            this._authService.logout();
      //                            console.log(err);
      //                        });
      //            }
      //        }
      //    }
      //});
  }
}
