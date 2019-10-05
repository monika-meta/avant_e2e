import { Component, ViewEncapsulation, Output, EventEmitter } from '@angular/core';

import { conflowAnimations } from 'src/app/shared/animations';


@Component({
    selector: 'channel-start',
    templateUrl: './channel-start.component.html',
    styleUrls: ['./channel-start.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: conflowAnimations
})
export class ChannelStartComponent {
    @Output() toggleChannel = new EventEmitter();


    constructor() {
    }

    toggleChannelList() {
        this.toggleChannel.emit("true");
    }
}
