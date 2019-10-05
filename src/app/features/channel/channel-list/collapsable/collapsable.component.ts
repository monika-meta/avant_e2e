import { ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { merge, Subject } from 'rxjs';

import { conflowAnimations } from 'src/app/shared/animations';
import { ChannelListItem } from '../model/channel-list-item';
import { ChannelService } from '../../channel.service';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
    selector: 'channel-list-collapsable',
    templateUrl: './collapsable.component.html',
    styleUrls: ['./collapsable.component.scss'],
    animations : conflowAnimations
})
export class ChannelListCollapsableComponent implements OnInit, OnDestroy {
    @Input()
    item: ChannelListItem;

    @HostBinding('class')
    classes = 'channel-list-collapsable channel-list-item';

    @HostBinding('class.open')
    public isOpen = false;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ChannelListService} _channelListService
     * @param {Router} _router
     */
    constructor(
        private _router: Router,
        private _channelService: ChannelService,
        private _globalService: GlobalService,
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        if (this.isIdInChildren(this.item, this._globalService.getDefaultChannel())) {
            this.expand();
        } else {
            this.collapse();
        }


    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle collapse
     *
     * @param ev
     */
    toggleOpen(ev): void {
        ev.preventDefault();
        this.isOpen = !this.isOpen;
    }

    /**
     * Expand the collapsable channelList
     */
    expand(): void {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;
    }

    /**
     * Collapse the collapsable channelList
     */
    collapse(): void {
        if (!this.isOpen) {
            return;
        }

        this.isOpen = false;
    }

    /**
     * Check if the given parent has the
     * given item in one of its children
     *
     * @param parent
     * @param item
     * @returns {boolean}
     */
    isChildrenOf(parent, item): boolean {
        if (!parent.children) {
            return false;
        }

        if (parent.children.indexOf(item) !== -1) {
            return true;
        }

        for (const children of parent.children) {
            if (children.children) {
                return this.isChildrenOf(children, item);
            }
        }
    }

    /**
     * Check if the given url can be found
     * in one of the given parent's children
     *
     * @param parent
     * @param id
     * @returns {boolean}
     */
    isIdInChildren(parent, id): boolean {
        if (!parent.children) {
            return false;
        }

        for (let i = 0; i < parent.children.length; i++) {
            if (parent.children[i].children) {
                if (this.isIdInChildren(parent.children[i], id)) {
                    return true;
                }
            }
            if (parent.children[i].id === id) {
                return true;
            }
        }

        return false;
    }

}
