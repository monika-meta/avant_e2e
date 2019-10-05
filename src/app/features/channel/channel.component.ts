import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ChannelService } from './channel.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChatHubService } from 'src/app/shared/services/chat-hub.service';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Channel } from 'src/app/shared/models/channel';

@Component({
    selector: 'app-channel',
    templateUrl: './channel.component.html',
    styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit, OnDestroy {
    @ViewChild('drawerUsers', { static: true })
    drawerUsers: any;

    channelList: Channel[];
    nestedChannelList: any;
    selectedChannel: Channel;
    conversationTitleItems: any[];
    selectedChannelId: string;
    isLoading: boolean;
    private _unsubscribeAll = new Subject<any>();

    opened = true;
    over = 'side';
    //expandHeight = '42px';
    //collapseHeight = '42px';
    //displayMode = 'flat';

    constructor(private _channelService: ChannelService,
        private _globalService: GlobalService,
        private _chatHubService: ChatHubService,
        private _router: Router,
        media: MediaObserver,
        private _activatedRoute: ActivatedRoute
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
        this._channelService.selectedChannelId = undefined;
        this.isLoading = true;

        this._channelService.getChannels()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                this.channelList = res;
                this.nestedChannelList = this._channelService.makeNestedData_V1(this.channelList);
                this.isLoading = false;
                this.setDefaultChannel();
            });

        this._channelService.onChannelSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(resChannelId => {
                if (resChannelId) {
                    this.selectedChannelId = resChannelId;
                    this.selectedChannel = this.channelList.find(x => x.id == resChannelId);
                    this._channelService.channelSelected = this.selectedChannel;
                    this.conversationTitleItems = this._channelService.generateChannelPath(this.selectedChannel);
                } else {

                }
            });

        this._chatHubService.OnSignalRMessageRecieved
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(messageData => {

                if (messageData['message'].isEdited == false && messageData['message'].isDeleted == false) {
                    let findChannel = this.channelList.find(x => x.id == messageData['channelId']);
                    if (findChannel) {
                        if (!(findChannel.id == this.selectedChannel.id && this._channelService.selectedTabIndex == 0)) {

                            findChannel.unread = ((findChannel.unread ? +findChannel.unread : 0) + 1) + "";
                            this._channelService.fireUnreadCountUpdateEvent(findChannel.id, findChannel.unread);
                        }

                    }
                }
            });
    }
    setDefaultChannel() {

        if (this.channelList && this.channelList.length > 0) {
            let defaultChannel = this._globalService.getDefaultChannel();
            let routeChannel = this._activatedRoute.snapshot.params['id'];
            if (routeChannel && routeChannel != defaultChannel) {
                this._globalService.setDefaultChannel(routeChannel);
                defaultChannel = routeChannel;
            }
            if (defaultChannel) {
                let findChannel = this.channelList.find(x => x.id == defaultChannel);
                if (findChannel) {
                    this._channelService.selectedChannelId = findChannel.id;
                    this._channelService.onChannelSelected.next(findChannel.id);
                } else {
                    this._globalService.setDefaultChannel(this.channelList[0].id);
                    this._channelService.selectedChannelId = this.channelList[0].id;
                    this._channelService.onChannelSelected.next(this.channelList[0].id);
                }

            } else {
                this._globalService.setDefaultChannel(this.channelList[0].id);
                this._channelService.selectedChannelId = this.channelList[0].id;
                this._channelService.onChannelSelected.next(this.channelList[0].id);
            }
            if (this._router.url == "/dashboard/channel" || this._router.url == "/dashboard/channel/") {
                this._router.navigate(['dashboard/channel', this._globalService.getDefaultChannel()]);
            }
        }
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this._channelService.onChannelSelected = new BehaviorSubject(null);
    }

    // To collapse channel list on clicking group mat icon
    toggleChannelist(): void {
        this.drawerUsers.toggle();
        this._channelService.onChannelListToggle.next(true);
    }

    // To collapse channel list on selecting files tab
    toggleSidePanel(): void {
        if (this.opened) {
            this.drawerUsers.toggle();
            this._channelService.onChannelListToggle.next(false); 
        }
    }
}
