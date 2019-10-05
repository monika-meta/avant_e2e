// import { ChannelListTag } from './channel-list-tag.model'

export interface ChannelListItem
{
    id: string;
    name: string;
    property:  'item' | 'collapsable';
    type: string;
    parentAreaRef?: object;
    unread?: string;
    users?: Array<string>;
    tags?: Array<string>;
    badge?: {
        icon?: string;
        translate?: string;
        bg?: string;
        fg?: string;
    };
    children?: ChannelListItem[];
}

export interface ChannelList extends ChannelListItem
{
    children?: ChannelListItem[];
}
