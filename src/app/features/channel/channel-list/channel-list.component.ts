import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { takeUntil, isEmpty } from 'rxjs/operators';
import { ChannelService } from '../channel.service';

@Component({
  selector: 'channel-list',
  templateUrl: './channel-list.component.html',
  styleUrls: ['./channel-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChannelListComponent implements OnInit {

  @Input()
  channelList: any;

  // Private
  private _unsubscribeAll: Subject<any>;


  constructor(
  ) {
  }

  /**
   * On init
   */
    ngOnInit(): void {

  }

}
