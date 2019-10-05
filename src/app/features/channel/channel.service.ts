import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject, forkJoin, of } from 'rxjs';
import { ConflowSettings } from 'src/app/shared/settings/conflow-settings';
import { map, catchError, tap } from 'rxjs/operators';
import 'rxjs/add/observable/throw';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Tag } from 'src/app/shared/models/tag';
import { Channel } from 'src/app/shared/models/channel';
import { ConflowUser } from 'src/app/shared/models/conflow-user';
import { Message } from 'src/app/shared/models/message';
import { GlobalService } from 'src/app/shared/services/global.service';

export interface userModel {
    userName: string;
}

export interface updateUserModel {
    channelId: string,
    users: string[]
}
export interface updateUnreadCountModel {
    channelId: string,
    unreadCount: string
}
@Injectable({
    providedIn: 'root'
})
export class ChannelService {
    spaceChannelUsers: any[];
    channelUsers: ConflowUser[];
    channelSelected: Channel;
    onChannelSelected: BehaviorSubject<any>;
    onFilterTypeSelected: BehaviorSubject<any>;
    onChannelListToggle: BehaviorSubject<any>;
    selectedChannelId: string;
    selectedTabIndex: any = 0;
    updateChannelItemUnreadCount: EventEmitter<updateUnreadCountModel> = new EventEmitter();

    constructor(private _httpClient: HttpClient, private _matDialog: MatDialog, private _globalService: GlobalService) {
        this.onChannelSelected = new BehaviorSubject(null);
        this.onFilterTypeSelected = new BehaviorSubject(null);
        this.onChannelListToggle = new BehaviorSubject(null);
    }
    fireUnreadCountUpdateEvent(channelId: string, unreadCount: string) {
        let data: updateUnreadCountModel = {
            channelId: channelId,
            unreadCount: unreadCount
        }
        this.updateChannelItemUnreadCount.emit(data);
    }

    /**
    * Returns current user's space id
    * */
    getCurrentSpaceId() {
        return localStorage.getItem("userSpaceID");
    }

    getChannels(): Observable<any> {
        return this._httpClient.get(ConflowSettings.BASE_API_URL + "channel", { headers: ConflowSettings.httpHeaders })
            .pipe(
                map(res => {
                    return res;
                }),
                catchError(error => {
                    return Observable.throw(error);
                })
            );
    }

    getChannelConversation(channelId: string): Observable<any> {

        // static parameters
        const parameters = {
            skipCount: 0,
            count: 20
        }
        // Initialize Params Object
        let params = new HttpParams();

        // Begin assigning parameters
        params = params.append('skipCount', `${parameters.skipCount}`);
        params = params.append('count', `${parameters.count}`);

        return forkJoin(
            [this._httpClient.get(ConflowSettings.BASE_API_URL + "Channel/" + channelId + "/chat", { headers: ConflowSettings.httpHeaders, params: params }),
            this.getChannelUsersById(channelId)]).map(res => {
                const channelMessages = res[0];
                const channelUsers: object[] = res[1];
                const channelData = {
                    channelId: channelId,
                    chatMessages: channelMessages && channelMessages != null ? channelMessages : [],
                    contact: channelUsers,
                    unread: ""// channelItem.unread
                };
                return channelData;
            });
    }

    getChannelUsersById(channelId): Observable<any> {
        return this._httpClient.get(ConflowSettings.BASE_API_URL + "Channel/" + channelId + "/users", { headers: ConflowSettings.httpHeaders })
            .pipe(tap((response: any) => {
                this.channelUsers = response;
            }));
    }

    makeNestedData(channel: Channel[]) {

        let stack = [];
        let finalResult = [];
        let tags: Tag[];

        channel.forEach(function (item) {
            tags = item.tags
            stack.push(tags)
        });


        for (let el of stack) {
            finalResult.push(this.makeNestedObjWithArrayItemsAsKeys(el, channel))
        }

        return this.removeDuplicateObj(finalResult);

    }
    makeNestedData_V1(channels: Channel[]) {
        let finalResult = [];

        const groupedCollection = channels.reduce((previous, current: Channel) => {
            if (!previous[current.sequenceNo]) {
                previous[current.sequenceNo] = [current];
            } else {
                previous[current.sequenceNo].push(current);
            }

            return previous;
        }, {});

        // this will return an array of objects, each object containing a group of objects
        const groupedItems = Object.keys(groupedCollection).map(key => ({ key, value: groupedCollection[key] })).sort(x => +x.key);

        groupedItems.forEach(groupItem => {
            const groupedChannels: Channel[] = groupItem.value;
            finalResult.push(this.makeNestedObjWithArrayItemsAsKeys(groupedChannels[0].tags, groupedChannels));//According to api grouped channels will have same tags. So taken tags of first channel.

        })

        return finalResult;
    }
    removeDuplicateObj(arr) {
        const unique = arr
            .map(e => e['id'])

            // store the keys of the unique objects
            .map((e, i, final) => final.indexOf(e) === i && i)

            // eliminate the dead keys & store unique objects
            .filter(e => arr[e]).map(e => arr[e]);

        return unique;
    };

    makeNestedObjWithArrayItemsAsKeys(channels, channelList: Channel[]) {
        return channels.reduceRight(
            (accumulator, item) => {
                let newAccumulator = {};
                newAccumulator = Object.assign(
                    {
                        id: item.id,
                        name: item.name,
                        type: item.type,
                        property: "collapsable",
                        badge: item.badge,
                        children: [accumulator]
                    },
                );

                if (this.isEmpty(newAccumulator['children'][0])) {
                    channelList.forEach(function (channel) {
                        for (let tag of channel.tags) {
                            if (newAccumulator['id'] === tag['id']) {
                                newAccumulator['children'].push(channel)
                            }
                        }
                    });
                }
                return newAccumulator;
            },
            {}
        );
    };

    isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    generateChannelPath(channel: Channel) {

        let tagAccumulator = {};
        let channelAccumulator = {};
        let channelListPathBadge = [];

        if (channel !== undefined) {
            for (let tag of channel.tags) {
                tagAccumulator = Object.assign(
                    {
                        id: tag.id,
                        name: tag.name,
                        type: tag.type,
                        badge: tag.badge
                    },
                );
                channelListPathBadge.push(tagAccumulator)
            }

            channelAccumulator = Object.assign(
                {
                    id: channel.id,
                    name: channel.name,
                    type: channel.type,
                    badge: null
                },
            );

            channelListPathBadge.push(channelAccumulator)
        }

        return channelListPathBadge
    };

    /**
  * get Users channel Space
  * 
  * @param {spaceID}
  * @param {channelId}
  * @returns {Observable<any>}
  */

    /**
* update Users channel Space
* 
* @param {channelId}
* @param {userList}
* @returns {Observable<any>}
*/

    UpdateUsersForSpaceAndChannel(channelId, userList): Observable<any> {

        var requestBody: updateUserModel = {
            channelId: channelId,
            users: userList
        }
        return this._httpClient.post(ConflowSettings.BASE_API_URL + "Channel/" + channelId + "/update-users", userList, { headers: ConflowSettings.httpHeaders }).pipe();
    }

    GetUsersForSpaceAndChannel(spaceID, channelId): Observable<any> {
        return this._httpClient.get(ConflowSettings.BASE_API_URL + "Channel/" + spaceID + "/" + channelId + "/users", { headers: ConflowSettings.httpHeaders })
            .pipe(tap((response: any) => {
                this.spaceChannelUsers = response;
            }));
    }


    /**
     * get channel Message On Limit
     *
     * @param channelId
     * @returns {Observable<any>}
     */
    getChannelMessageOnLimit(channelId, parameters): Observable<any> {
        // Initialize Params Object
        let params = new HttpParams();

        // Begin assigning parameters
        params = params.append('skipCount', `${parameters.skipCount}`);
        params = params.append('count', `${parameters.count}`);

        return this._httpClient.get(ConflowSettings.BASE_API_URL + "Channel/" + channelId + "/chat",
            { headers: ConflowSettings.httpHeaders, params: params }).pipe(
                map(response => {
                    return { chatMessages: response };
                }),
                catchError(error => {
                    return Observable.throw(error);
                })
            );
    }



    /**
     * Add new message to channel chatMessages
     *
     * @param channelId
     * @param chatMessages
     * @returns {Observable<any>}
     */
    addNewMessageToChat(channelId, chatMessages: Message): Observable<any> {
        return this._httpClient.post(ConflowSettings.BASE_API_URL + "Chat/" + channelId + "/message", chatMessages, { headers: ConflowSettings.httpHeaders }).pipe();
    }


    /**
     * Translates message text
     * @param textStr 
     * @param targetLang 
     */
    translateMessage(textStr: string, targetLang: string): Observable<any> {
        let reqObj = { text: textStr, to: targetLang };
        return this._httpClient.post(ConflowSettings.BASE_API_URL + "Chat/message/translate", reqObj, { headers: ConflowSettings.httpHeaders });
    }


    /**
     * Returns list of all system tags
     */
    getSystemTags(): Observable<any> {
        let spaceId = localStorage.getItem('userSpaceID');
        return this._httpClient.get(ConflowSettings.BASE_API_URL + "Space/" + spaceId + "/system-tags", { headers: ConflowSettings.httpHeaders });
    }




    /**
     * Uploads file to server and returns its metadata
     * @param file
     */
    uploadFile(file: File): Observable<any> {
        let formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this._httpClient.post(ConflowSettings.BASE_API_URL + "Files/", formData, { headers: ConflowSettings.httpHeaders }).pipe();
    }


    /**
    * Delete Messgae
    * @param id
    */


    deleteMessage(channelId, message: Message): Observable<any> {
        return this._httpClient.put(ConflowSettings.BASE_API_URL + "Chat/" + channelId + "/delete/" + message.id, "", { headers: ConflowSettings.httpHeaders }).pipe();
    }


    /**
     * Edit Message 
     *
     * @param channelId
     * @param chatMessages
     * @returns {Observable<any>}
     */
    editMessage(channelId, message: Message): Observable<any> {

        return this._httpClient.put(ConflowSettings.BASE_API_URL + "Chat/" + channelId + "/" + message.id + "/message", message, { headers: ConflowSettings.httpHeaders }).pipe();
    }


    getTagsOfChannel(channelId): Observable<any> {
        return this._httpClient.get(ConflowSettings.BASE_API_URL + "Channel/" + channelId + "/tags", { headers: ConflowSettings.httpHeaders })
            .pipe(tap((response: any) => {

            }));
    }
    getCustomTagsOfSpace(): Observable<any> {
        var spaceId = this.getCurrentSpaceId();
        return this._httpClient.get(ConflowSettings.BASE_API_URL + "Space/" + spaceId + "/custom-tags", { headers: ConflowSettings.httpHeaders });
    }

    getCustomTagsOfChannel(channelId): Observable<any> {
        return this._httpClient.get(ConflowSettings.BASE_API_URL + "Channel/" + channelId + "/custom-tags", { headers: ConflowSettings.httpHeaders })
            .pipe(tap((response: any) => {

            }));
    }

    /**
    * Returns list of all custom categories
    * */
    getCustomTagCategories(): Observable<any> {
        var spaceId = this.getCurrentSpaceId();
        return this._httpClient.get(ConflowSettings.BASE_API_URL + "channel/custom/" + spaceId, { headers: ConflowSettings.httpHeaders });
    }
    

    /**
 * Returns tag by tag id
 * @param tagId
 */
    getTagByTagId(tagId: string): Observable<any> {
        return this._httpClient.get(ConflowSettings.BASE_API_URL + "Tag/" + tagId, { headers: ConflowSettings.httpHeaders });
    }


    /**
    * Returns User Tag Id
    */
    getUserTagId(): Observable<any> {
        return this._httpClient.get(ConflowSettings.BASE_API_URL + "Users/user-tag", { headers: ConflowSettings.httpHeaders });
    }

    

    /**
  * Update File Tags
  * @param file
  */
    updateFileTags(channelId, fileId, tags): Observable<any> {
        return this._httpClient.post(ConflowSettings.BASE_API_URL + "Chat/UpdateFileTags/" + channelId + "/" + fileId, tags, { headers: ConflowSettings.httpHeaders }).pipe();
    }

    getEditableTags(IsEditableTagList): Observable<any> {
        return this._httpClient.post(ConflowSettings.BASE_API_URL + "Tag/EditableTags", IsEditableTagList, { headers: ConflowSettings.httpHeaders }).pipe();
    }

    
}
