import { Component, OnInit, Input } from '@angular/core';
import { GlobalService } from '../../../shared/services/global.service';
import { Router } from '@angular/router';
import { Subject } from '../../../../../node_modules/rxjs';
import { LaunchDarklyService } from 'src/app/shared/services/launchdarkly.service';

/**
 * Left sidebar
 */
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

    constructor(public _global: GlobalService, private router: Router, public _launchDarklyService: LaunchDarklyService) { 
    }

    ngOnInit() {
    }

    toggle(){
        this._global.toggleSideBar.next(true);
    }

}
