import {  Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { ChannelService } from '../../channel.service';
import { ChannelListItem } from '../model/channel-list-item';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
    selector   : 'channel-list-item',
    templateUrl: './item.component.html',
    styleUrls  : ['./item.component.scss']
})
export class ChannelListItemComponent implements OnInit, OnDestroy
{
    @HostBinding('class')
    classes = 'channel-list-item';

    @Input()
    item: ChannelListItem;

    selectedChannelId: string;
    isActive: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _channelService: ChannelService,
        private _globalService: GlobalService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._channelService.onChannelSelected.subscribe(res => {
            if (res) {
                if (this.item.id == res) {
                    this.isActive = true;
                } else {
                    this.isActive = false;
                }

            }
        }); 

        this._channelService.updateChannelItemUnreadCount.subscribe(data => {
            if (this.item.id == data.channelId) {
                this.item.unread = data.unreadCount;
            }
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
    }
    getConversation(item: any): void {
        this._globalService.setDefaultChannel(item.id);
        this._channelService.selectedChannelId = item.id;
        this._channelService.onChannelSelected.next(item.id);
    } 

}
