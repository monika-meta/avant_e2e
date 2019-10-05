import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule, MatRippleModule, MatBadgeModule } from '@angular/material';

import { ChannelListComponent } from './channel-list.component';
import { ChannelListItemComponent } from './item/item.component';
import { ChannelListCollapsableComponent } from './collapsable/collapsable.component';

@NgModule({ 
    imports     : [
        CommonModule,
        RouterModule,

        MatIconModule,
        MatRippleModule,
        MatBadgeModule
    ],
    exports     : [
        ChannelListComponent
    ],
    declarations: [
        ChannelListComponent,
        ChannelListItemComponent,
        ChannelListCollapsableComponent
    ]
})
export class ChannelListModule
{
}
