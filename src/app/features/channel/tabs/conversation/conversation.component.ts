import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { filter, takeUntil, switchMap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MatSpinner } from '@angular/material/progress-spinner'
import { ConflowInfiniteScrollerDirective } from 'src/app/shared/directives/conflow-infinite-scroller/conflow-infinite-scroller.directive';
import { ConversationDeleteDialogComponent } from './conversation-dialog/conversation-delete-dialog/conversation-delete-dialog.component';
import { conflowAnimations } from 'src/app/shared/animations';
import { Router, NavigationEnd } from "@angular/router";
import { ConversationFileUploadDialogComponent, FileUploadMessageSendData, FileUploadMessageSendStates } from './conversation-dialog/conversation-file-upload-dialog/conversation-file-upload-dialog.component';
//import { forEach } from '@angular/router/src/utils/collection';
import { QuillInitializeService } from 'src/app/shared/quill-editor/services/quillInitialize.service';
import 'quill-mention';
import 'quill-emoji';
import { parse } from 'querystring';
import { MessageTextboxComponent } from '../../common/message.textbox/message.textbox.component';
import { ConflowUtils } from 'src/app/shared/utils';
import { GlobalService } from 'src/app/shared/services/global.service';
import { ChannelService } from '../../channel.service';
import { ChatHubService } from 'src/app/shared/services/chat-hub.service';
import { FilePreviewComponent } from 'src/app/shared/components/file-preview/file-preview.component';
import { ConfirmComponent } from 'src/app/shared/components/alert/confirm/confirm.component';
import { Message, MessageSendStatus } from 'src/app/shared/models/message';
import { ConflowUser } from 'src/app/shared/models/conflow-user';
import { TranslateService } from '@ngx-translate/core';
import { LaunchDarklyService } from 'src/app/shared/services/launchdarkly.service';
import { FilesService } from 'src/app/shared/services/files.service';


@Component({
    selector: 'channel-conversation',
    templateUrl: './conversation.component.html',
    styleUrls: ['./conversation.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: conflowAnimations
})


export class ChannelConversationComponent implements OnInit, OnDestroy, AfterViewInit {

    selectedChannelId: string;
    user: ConflowUser;
    chatMessages: Message[];
    contacts: ConflowUser[];
    replyInput: any;
    selectedChat: any;
    searchUserByMentionTyping: string = '';
    showMentionDialog: boolean = false;
    isMention: boolean = false;
    messageInArray: Array<string>;
    confirmDeleteDialogRef: MatDialogRef<ConversationDeleteDialogComponent>;
    fileUploadDialogRef: MatDialogRef<ConversationFileUploadDialogComponent>;
    confirmDialogRef: MatDialogRef<ConfirmComponent>;
    isFileUploading: boolean = false;
    fileUploadSub: any;
    selectedFile: any;
    fileInfo: any;
    isFileDeleting: boolean = false;

    @ViewChild(ConflowInfiniteScrollerDirective, { static: false })
    directiveScroll: ConflowInfiniteScrollerDirective;

    filePreviewDialogRef: MatDialogRef<FilePreviewComponent>;
    // Private
    private _unsubscribeAll = new Subject<any>();


    scrollCallback;

    limitedMessageParam: object = {
        skipCount: 0,
        count: 5
    }


    hasFocus = false;

    isMentionDialog: boolean = false;

    hashValues = []

    @ViewChild(MessageTextboxComponent, { static: false })
    messgeBoxRef: MessageTextboxComponent;
    isLoading: boolean = false;

    /**
     * Constructor
     *
     * @param {ChannelService} _channelService
     * @param {ChatHubService} _chatHubService
     * @param {ConversationMentionDialogService} _conversationMentionDialogService
     * @param {MatDialog} _matDialog
     * @param {Router} _router
     * @param {QuillInitializeService} quillInitializeService
     * @param {GlobalService} _globalService
     * @param {AppInsightService} _appInsightService
     */
    constructor(
        private _channelService: ChannelService,
        private _chatHubService: ChatHubService,
        public _matDialog: MatDialog,
        private _router: Router,
        private quillInitializeService: QuillInitializeService,
        private _globalService: GlobalService,
        private _translateService: TranslateService,
        public _launchDarklyService: LaunchDarklyService,
        private _filesService: FilesService
    ) {
        // Set the private defaults
        // this._unsubscribeAll = new Subject();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /** 
     * On init
     */
    ngOnInit(): void {
        this.isLoading = true;
        this._channelService.onChannelSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(channelId => {
                this.isLoading = true;
                this.user = this._globalService.user;
                this.selectedChannelId = channelId;
                this._channelService.getChannelConversation(channelId).subscribe(
                    channelData => {
                        this.isLoading = false;
                        if (channelData) {

                            this.selectedChat = channelData;
                            this.contacts = channelData.contact;
                            this.chatMessages = channelData.chatMessages;
                            this.readyToReply();

                            this.isInitializeChatHistoryDown = false;
                            //Update unread count to zero on database.
                            if (this._channelService.channelSelected && +this._channelService.channelSelected.unread > 0) {
                                this._chatHubService.MarkAllChatMessageStatusAsRead(channelId, this.user.id);
                                //Update unread count to Zero for selected conversation.
                                this._channelService.fireUnreadCountUpdateEvent(channelId, "0");
                            }

                        }

                    }
                )
            });

        this._chatHubService.OnSignalRMessageRecieved
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(messageData => {
                if (this.selectedChannelId && this.selectedChannelId === messageData['channelId']) {

                    if (messageData['message'].isEdited || messageData['message'].isDeleted) {
                        this.chatMessages = this.chatMessages.map(message => message.id == messageData['message'].id ? messageData['message'] : message)
                    } else {
                        //Call api to update unread count of this message for this user.
                        this._chatHubService.MarkChatMessagesStatusAsRead(this.selectedChannelId, localStorage.getItem("userID"), [messageData['message'].id]);

                        let findMessage = this.chatMessages.find(x => x.id == messageData['message'].id || x.uniqueKey == messageData['message'].uniqueKey);
                        if (findMessage) {
                            if (this.chatMessages && this.chatMessages != null) {
                                this.chatMessages[this.chatMessages.indexOf(findMessage)] = messageData['message'];
                            } else {
                                this.chatMessages.push(messageData['message']);
                            }
                        } else {
                            this.chatMessages.push(messageData['message']);

                        }
                        this.readyToReply();

                    }
                }
            });
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        this.readyToReply();
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
  * set mention users
  *
  * @param contacts
  */

    /**
     * Ready to reply
     */
    readyToReply(): void {
        setTimeout(() => {
            this.scrollToBottom();
        });
    }


    /**
     * Scroll to the bottom
     *
     * @param {number} speed
     */
    scrollToBottom(speed?: number): void {
        speed = speed || 400;
        if (this.directiveScroll) {
            this.directiveScroll.update();

            setTimeout(() => {
                this.directiveScroll.scrollToBottom(0, speed);
            });
        }
    }


    /**
     * Translates message to English
     * @param message 
     */
    translateToEnglish(message) {
        if (message.message.length == 0) return;

        message.isTranslating = true;
        this._channelService.translateMessage(message.message, "en").subscribe((res) => {
            this.renderTranslatedMessage(message.id, res.text);
            message.isTranslating = false;
        },
            (err) => {
                message.isTranslating = false;
                console.log(err);
            })
    }

    /**
     * Translates message to Japanese
     * @param message 
     */
    translateToJapanese(message) {
        if (message.message.length == 0) return;

        message.isTranslating = true;
        this._channelService.translateMessage(message.message, "ja").subscribe((res) => {
            this.renderTranslatedMessage(message.id, res.text);
            message.isTranslating = false;
        },
            (err) => {
                message.isTranslating = false;
                console.log(err);
            })
    }


    /**
     * Renders translated message
     * @param msgId 
     * @param text 
     */
    private renderTranslatedMessage(msgId: string, text: string) {
        let targetMsg = this.chatMessages.find((msg) => msg.id == msgId);
        targetMsg.translatedMessage = text;
    }



    /**
    * push contact mentioned
    *
    * @param contact
    */

    /**
     * Reply
     */
    reply(event): void {
        // Message
        const message: Message = {

            who: this.user.id,
            message: event.message,
            time: new Date().toISOString(),
            mentions: event.mentionUsers,
            name: this.user.userName,
            uniqueKey: ConflowUtils.generateGUID(),
            status: MessageSendStatus.Sending.toString(),
            tags: []
        };

        // Update the server
        this._channelService.addNewMessageToChat(this.selectedChat.channelId, message).subscribe(response => {
            this.UpdateMessageAfterSend(response.id, response.uniqueKey, response);

        });
        
    }


    saveNewMessage(event): void {
        this.messgeBoxRef.isMentionDialog = false;
        this.messgeBoxRef.createMessage(event);
    }


    isInitializeChatHistoryDown: boolean = false;
    isScrollLoadingMsgUp: boolean = false;
    isScrollLoadingMsgDown: boolean = false;

    /**
    *  on Scroll 
    * @param event
    */

    onScroll(event) {
        event.preventDefault();

        if (event.target.scrollTop === 0) {
            this.isScrollLoadingMsgUp = true;
            this._channelService.getChannelMessageOnLimit(this.selectedChat.channelId, this.getChatQueryParam()).subscribe(channel => {
                this.isScrollLoadingMsgUp = false;
                if (channel.chatMessages.length === 0) {
                    return
                }

                this.chatMessages = channel.chatMessages.concat(this.chatMessages);
                event.target.scrollTop = 5;
            });
        }
    }

    getSavedMessageCount() {
       return ( this.chatMessages && this.chatMessages.length > 0 ? this.chatMessages.filter(x => x.status != MessageSendStatus.Sending.toString() && x.status != MessageSendStatus.Failed.toString()).length : 0);
    }

    setSkipCount() {
        this.limitedMessageParam['skipCount'] = this.getSavedMessageCount();
    }

    getChatQueryParam() {
        this.setSkipCount();
        return this.limitedMessageParam;
    }
    /**
    * Delete Messgae
    * @param message
    */
    deleteMessage(message: Message, contact: ConflowUser): void {

        this.confirmDeleteDialogRef = this._matDialog.open(ConversationDeleteDialogComponent, {
            panelClass: 'conversation-delete-dialog',
            disableClose: false
        });
        this.confirmDeleteDialogRef.componentInstance.contactObj = contact;
        this.confirmDeleteDialogRef.componentInstance.messageObj = message;
        this.confirmDeleteDialogRef.componentInstance.title = this._translateService.instant("conversation.messageDeleteConfirmationDialogHeader");
        this.confirmDeleteDialogRef.componentInstance.confirmMessage = this._translateService.instant("conversation.messageDeleteConfirmationMessage");

        this.confirmDeleteDialogRef.afterClosed().subscribe(result => {
            switch (result[0]) {
                case "delete":
                    message.uniqueKey = ConflowUtils.generateGUID();
                    message.status = MessageSendStatus.Sending.toString();
                    if (this.confirmDeleteDialogRef.componentInstance.IsFileIncluded && message.files && message.files.length > 0) {
                        this.confirmDeleteDialogRef.componentInstance.IsFileIncluded = false;
                        this._filesService.deleteFile(message.files[0].id).subscribe(response => {
                            if (response) {
                                message.files[0].isDeleted = true;
                                this.deleteAndUpdateMessageOnUI(this.selectedChat.channelId, message);
                            }
                        });
                    } else {
                        this.deleteAndUpdateMessageOnUI(this.selectedChat.channelId, message);
                    }

                    break;
                case "cancel":
                    return
                    break
            }
            this.confirmDeleteDialogRef = null;
        });

    }
    deleteAndUpdateMessageOnUI(channelId: string, message: Message) {
        this._channelService.deleteMessage(channelId, message).subscribe(response => {

            this.UpdateMessageAfterSend(response.id, response.uniqueKey, response);

        });
    }
    onDeleteFile(file): void {
        this.fileInfo = file.id;
        this.isFileDeleting = true;
        this.confirmDialogRef = this._matDialog.open(ConfirmComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = this._translateService.instant('files.fileDeletionConfirmationMessage');
        this.confirmDialogRef.componentInstance.title = this._translateService.instant('files.fileDeleteConfirmationDialogHeader');
        this.confirmDialogRef.componentInstance.confirmButtonText = this._translateService.instant('Delete');


        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._filesService.deleteFile(file.id).subscribe(response => {
                    if (response) {
                        file.isDeleted = true;
                        this.isFileDeleting = false;
                    }
                });
            }
            else {
                this.fileInfo = null;
                this.isFileDeleting = false;
            }
            this.confirmDialogRef = null;
        });
    }

    /**
     *  Opens dialog to upload file
     * */
    openFileUploadDialog() {
        this.fileUploadDialogRef = this._matDialog.open(ConversationFileUploadDialogComponent, {
            panelClass: 'conversation-file-upload-dialog',
            disableClose: false,
            height: '90%',
            width: '70%',
            maxHeight: '100vh',
            maxWidth: '100vw',
            data: {
                'channelId': this.selectedChat.channelId,
                'contacts': this.contacts,

            }
        });

        this.fileUploadDialogRef.afterOpen().subscribe(() => {
            this.fileUploadSub = this.fileUploadDialogRef.componentInstance.isLoadingEA.subscribe((val) => {
                this.isFileUploading = val;
            })

            this.fileUploadDialogRef.componentInstance.onSendMessage.subscribe((res: FileUploadMessageSendData) => {
                if (res.State == FileUploadMessageSendStates.beforeSend.toString()) {
                    this.chatMessages.push(res.Message);
                    // Reset the reply form
                    this.readyToReply();
                } else if (res.State == FileUploadMessageSendStates.afterMessageSent.toString()) {
                    this.UpdateMessageAfterSend(res.Message.id, res.Message.uniqueKey, res.Message);
                }
            });
        });

    }


    /**
     * Save Message On Edit
     *
     * @param chatMessages
     */
    updateMessage(event): void {
        let chatMessages = event.messageObj;
        chatMessages.status = MessageSendStatus.Sending.toString();
        // Message
        const message = {
            id: chatMessages.id,
            who: chatMessages.who,
            message: event.message,
            time: chatMessages.time,
            isEdited: true,
            name: this.user.userName,
            mentions: event.mentionUsers,
            files: chatMessages.files,
            tags: [],
            uniqueKey: chatMessages.id,
            status: chatMessages.status
        };
        this._channelService.editMessage(this.selectedChat.channelId, message).subscribe(response => {
            this.UpdateMessageAfterSend(response.id, response.uniqueKey, response);
        });
    }
    UpdateMessageAfterSend(id: any, key: any, message: any) {
        let findMessage = this.chatMessages.find(x => x.id == id || x.uniqueKey == key);
        if (findMessage) {
            if (this.chatMessages && this.chatMessages != null) {
                this.chatMessages[this.chatMessages.indexOf(findMessage)] = message;
            } else {
                this.chatMessages.push(message);
            }
        }
    }

    saveEditedMessage(event): void {
        this.messgeBoxRef.isMentionDialog = false;
        this.messgeBoxRef.createMessage(event);
    }

    downloadFile(file): void {
        file.showProgress = true;

        file.isDownloading = true;
        this._filesService.downloadFileFromBox(file.boxId, file.name).subscribe(res => {

        }, (err) => {
            console.log(err);
        }, () => {
            file.showProgress = false;
        });
    }

    
    ///**
    // * Change taps nav view
    // *
    // * @param view
    // */
    //changeTabsnavView(view): void {
    //  this._channelService.onTabsnavViewChanged.next(view);
    //}

    onSelect(selected): void {
        this.selectedFile = selected;
        this.openFilePreviwDialog(selected);

    }
    openFilePreviwDialog(selectedFile) {
        this.filePreviewDialogRef = this._matDialog.open(FilePreviewComponent, {
            panelClass: 'file-preview-dialog',
            disableClose: false,
            height: '98vh',
            width: '90vw',
            maxHeight: '100vh',
            maxWidth: '100vw',
            data: {
                'fileData': {
                    id: selectedFile.id,
                    name: selectedFile.name
                }
            }
        });

        this.filePreviewDialogRef.afterOpen().subscribe(() => {

        });
    }

    findContact(contactId) {
        return this.contacts.find(x => x.id == contactId);
    }

    isFileExist(files) {
        return files ? files.find(x => x.isDeleted == false) : false;
    }
}
