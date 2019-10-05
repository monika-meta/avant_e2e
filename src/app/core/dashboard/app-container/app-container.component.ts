import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { GlobalService } from 'src/app/shared/services/global.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-container',
  templateUrl: './app-container.component.html',
    styleUrls: ['./app-container.component.scss']
})
export class AppContainerComponent implements OnInit, OnDestroy {
    @Input() spaceId: string;
    private _unsubscribeAll = new Subject<any>();
    private shouldReuseRouteValue: any;
    constructor(private _globalService: GlobalService, private router: Router) {
       
    }

    ngOnInit() {
        this._globalService.onSpaceChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(spaceId => {
                this.shouldReuseRouteValue = this.router.routeReuseStrategy.shouldReuseRoute;
                this.router.routeReuseStrategy.shouldReuseRoute = function () {
                    return false;
                } 
                this.router.navigated = false;
                this.router.navigate([this.router.url]);

            });
        
  }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        if (this.shouldReuseRouteValue) {
            this.router.routeReuseStrategy.shouldReuseRoute = this.shouldReuseRouteValue;
        }
    }
}
