import { Component, OnInit, Inject, ViewChild, EventEmitter, ViewEncapsulation, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ChannelService } from 'src/app/features/channel/channel.service';
import { Subject, forkJoin, Observable } from 'rxjs';
import { ConflowUtils } from 'src/app/shared/utils';
import { MessageTextboxComponent } from 'src/app/features/channel/common/message.textbox/message.textbox.component';
import { Tag } from 'src/app/shared/models/tag';
import { GlobalService } from 'src/app/shared/services/global.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { TagsSelectionComponent } from 'src/app/shared/components/tags-selection/tags-selection.component';
import { ConflowUser } from 'src/app/shared/models/conflow-user';
import { Channel } from 'src/app/shared/models/channel';
import { Message, MessageSendStatus } from 'src/app/shared/models/message';
import { TranslateService } from '@ngx-translate/core';
import { TagService } from 'src/app/shared/services/tag.service';
import * as sha1 from 'js-sha1'
import { resolve } from 'path';
import { ConflowFile } from 'src/app/shared/models/conflow-file';
import { ConflowSettings } from 'src/app/shared/settings/conflow-settings';
import { FilesService, BoxSessionWithParts, BoxUploadSessionModel, BoxDownScopeTokenScopes } from 'src/app/shared/services/files.service';

@Component({
    selector: 'app-conversation-file-upload-dialog',
    templateUrl: './conversation-file-upload-dialog.component.html',
    styleUrls: ['./conversation-file-upload-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None 
})
export class ConversationFileUploadDialogComponent implements OnInit {

    file: File;
    fileTags: Tag[];
    user: ConflowUser;
    channelId: string;
    messageContent: string;
    allTags: Tag[];
    defaultTags: Tag[];
    contacts: ConflowUser[];
    selectedChannel: Channel;
    fileSelectionMessage: string;
    fileUploadErrorMessage: string;
    boxSession: BoxSessionWithParts;
    private MINIMUM_SIZE_CHUNKS_UPLOAD: number;
    private boxFolderId;

    @ViewChild('refTagSelection', { static: false })
    tagSelCompRef: TagsSelectionComponent;

    @ViewChild(MessageTextboxComponent, { static: false })
    messgeBoxRef: MessageTextboxComponent;

    public isLoading: boolean;
    public isLoadingEA = new EventEmitter();

    public onSendMessage = new Subject();
    isTagSelectionLoading: boolean;
    @Output() onUploadProgressUpdate = new EventEmitter<number>();

    /**
     * Constructor
     *
     * @param {MatDialogRef} matDialogRef
     * @param {ChannelService} _channelService
     * @param {MAT_DIALOG_DATA} _data
     * @param {GlobalService} _globalService
     * @param {AlertService} alertService
     */
    constructor(
        public matDialogRef: MatDialogRef<ConversationFileUploadDialogComponent>,
        private _channelService: ChannelService,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _globalService: GlobalService,
        private alertService: AlertService,
        private _translateService: TranslateService,
        private _tagService: TagService,
        private _filesService: FilesService
    ) {
        this.fileTags = [];
        this.user = this._globalService.user;
        this.channelId = this._data.channelId;
        this.contacts = this._data.contacts;
        this.MINIMUM_SIZE_CHUNKS_UPLOAD = +ConflowSettings.boxChunksMinimumSize;
    }

    ngOnInit() {
        this.selectedChannel = this._channelService.channelSelected;
        this.isTagSelectionLoading = true;
        forkJoin(
            this._channelService.getCustomTagsOfSpace(),
            this._channelService.getCustomTagsOfChannel(this.selectedChannel.id),
            this._channelService.getTagByTagId(this.selectedChannel.tagId),
            this._tagService.getProjectTagOfChannel(this._channelService.channelSelected.id),
        ).subscribe(
            ([allTags, channelCustomTags, channelTag, projectTag]) => {
                this.allTags = allTags;
                this.defaultTags = projectTag ? [].concat(projectTag).concat(channelTag) : [].concat(channelTag);
                if (channelCustomTags && channelCustomTags.length > 0) {
                    this.defaultTags = this.defaultTags.concat(channelCustomTags);
                }
                this.isTagSelectionLoading = false;
            }, (error) => { }
            , () => {

            });

        this._translateService.get("files.fileSelectionMessage").subscribe(res => {
            this.fileSelectionMessage = res;
        });

        this._translateService.get("files.fileUploadErrorMessage").subscribe(res => {
            this.fileUploadErrorMessage = res;
        });

        this._filesService.getBoxFileFolderId().subscribe(folderId => {
            this.boxFolderId = folderId;
        })
    }


    fileChange(event) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            if (this.file)
                this.removeFile();
            this.file = fileList[0];
            event.target.value = '';
        }
    }

    removeFile() {
        if (this.isLoading) return false;
        this.file = null;
    }

    saveMesage(event): void {
        this.messgeBoxRef.isMentionDialog = false;
        this.messgeBoxRef.createMessage(event);
    }

    // Uploads file along with new message
    upload(event) {
        if (this.isLoading) {
            return;
        }

        if (this.file == null) {
            this.alertService.alertWarning(this._translateService.instant('files.fileSelectionMessage'));
            return;
        }

        let message: Message = {

            who: this.user.id,
            message: event.message,
            time: new Date().toISOString(),
            mentions: event.mentionUsers,
            name: this.user.userName,
            files: [],
            tags: [],
            status: MessageSendStatus.Sending.toString(),
            uniqueKey: ConflowUtils.generateGUID()
        };
        //let msg = new Message();
        //msg.who = this.user.id;
        //msg.name = this.user.userName;
        //msg.message = event.message

        this.isLoading = true;
        this.isLoadingEA.emit(this.isLoading);
        this.onSendMessage.next({ State: FileUploadMessageSendStates.beforeSend.toString(), ChannelId: this.channelId, Message: message });

        if (this.file.size > this.MINIMUM_SIZE_CHUNKS_UPLOAD) {
            this.chunkUpload(this.file, message);
        } else {

            this._filesService.getDownScopeToken([BoxDownScopeTokenScopes.Upload]).subscribe(downScopeToken => {
                let fileName = this.getUpdatedFileName(this.file.name);
                this._filesService.boxSimpleFileUpload(this.boxFolderId, fileName, this.file, downScopeToken)
                    .subscribe(uploadResponse => {
                        let fileData = uploadResponse.entries[0];
                    let responseFile: ConflowFile = {
                        boxId: fileData.id,
                        fileType: this.getFileExtension(fileName),
                        id: null,
                        isDeleted: false,
                        name: this.file.name,
                        sender: null,
                        size: this.file.size.toString(),
                        tags: null,
                        uri: null

                    };

                    this.processMessageAfterUpload(message, [responseFile]);
                    }, (err) => {
                        this.isLoading = false;
                        this.isLoadingEA.emit(this.isLoading);
                        this.alertService.alertDanger(this._translateService.instant('files.fileUploadErrorMessage'), "", 10000);
                        this.onSendMessage.next({ State: FileUploadMessageSendStates.afterMessageSentError.toString(), ChannelId: this.channelId, Message: message });

                    });
            }, (err) => {
                this.isLoading = false;
                this.isLoadingEA.emit(this.isLoading);
                this.alertService.alertDanger(this._translateService.instant('files.fileUploadErrorMessage'), "", 10000);
                this.onSendMessage.next({ State: FileUploadMessageSendStates.afterMessageSentError.toString(), ChannelId: this.channelId, Message: message });

            });
            
        }
        //
        this.matDialogRef.close();
    }
    
    ///Process file upload response to create message
    processMessageAfterUpload(message, res) {
        // update msg object with files info
        message.files.push(res[0]); 
        // add selected tags
        message.files[0].tags = this.tagSelCompRef.defaultTags ? this.tagSelCompRef.defaultTags.concat(this.tagSelCompRef.tags) : this.tagSelCompRef.tags;
        // add channel tag
        // msg.files[0].tags.push(this.tagSelCompRef.defaultTag);

        //msg.files[0].size = this.file.size.toString();
        //msg.files[0].fileType = this.file.type;
        message.files[0].sender = this.user.id;
        this.onSendMessage.next({ State: FileUploadMessageSendStates.afterFileUpload.toString(), ChannelId: this.channelId, Message: message });
        // call upload message api
        this._channelService.addNewMessageToChat(this.channelId, message).subscribe((res) => {
            this.isLoading = false;
            this.isLoadingEA.emit(this.isLoading);
            //this.matDialogRef.close();
            this.onSendMessage.next({ State: FileUploadMessageSendStates.afterMessageSent.toString(), ChannelId: this.channelId, Message: res });

        },
            (error) => {
                this.isLoading = false;
                this.isLoadingEA.emit(this.isLoading);
                console.error(error);
                this.alertService.alertDanger(this._translateService.instant('files.fileUploadErrorMessage'), "", 10000);
                this.onSendMessage.next({ State: FileUploadMessageSendStates.afterMessageSentError.toString(), ChannelId: this.channelId, Message: message });
            })
    }
    getUpdatedFileName(fileName): string {
      return  this.getFileNameWithoutExtension(fileName) + ConflowUtils.generateGUID() +"."+ this.getFileExtension(fileName);
    }
    chunkUpload(file: File, message: Message) {
        this.boxSession = {
            message: message,
            file: file,
            fileName: file.name,
            fileSize: file.size,
            folderId: this.boxFolderId,
            session: null,
            token: "",
            uploadedParts: [],
            uploadProgress: 0
        };
        this.onUploadProgressUpdate.emit(this.boxSession.uploadProgress);
        this._filesService.getDownScopeToken([BoxDownScopeTokenScopes.Upload]).subscribe(downScopeToken => {
            this.boxSession.token = downScopeToken;
            let updatedFileName = this.getUpdatedFileName(this.boxSession.fileName);// this.getFileNameWithoutExtension(this.boxSession.fileName) + ConflowUtils.generateGUID() + this.getFileExtension(this.boxSession.fileName);
            this._filesService.createUploadSession(this.boxSession.folderId, this.boxSession.fileSize, updatedFileName, this.boxSession.token).subscribe((sessionData: BoxUploadSessionModel) => {
                this.boxSession.session = sessionData;
                this.processFilePart(0);

            }, (err) => {
                this.isLoading = false;
                this.isLoadingEA.emit(this.isLoading);
                this.alertService.alertDanger(this._translateService.instant('files.fileUploadErrorMessage'), "", 10000);
                this.onSendMessage.next({ State: FileUploadMessageSendStates.afterMessageSentError.toString(), ChannelId: this.channelId, Message: this.boxSession.message });

            });
        }, (err) => {
            this.isLoading = false;
            this.isLoadingEA.emit(this.isLoading);
            this.alertService.alertDanger(this._translateService.instant('files.fileUploadErrorMessage'), "", 10000);
            this.onSendMessage.next({ State: FileUploadMessageSendStates.afterMessageSentError.toString(), ChannelId: this.channelId, Message: this.boxSession.message });

        });
    }
    getFileNameWithoutExtension(fileName) {
        var lastDotPosition = fileName.lastIndexOf(".");
        if (lastDotPosition === -1) return fileName;
        else return fileName.substr(0, lastDotPosition);
    }
    getFileExtension(fileName) {
        return fileName.split('.').pop();
    }
    //Process part and upload
    processFilePart(index: number) {
        let currentPart = this.getFilePart(index, this.boxSession.session.part_size, this.boxSession.fileSize, this.boxSession.file);
        this.getArrayBufferFromFile(currentPart.file).then(fileBufferData => {
            let digest = this.createSHA1Digest(fileBufferData);
            this._filesService.uploadFilePart(this.boxSession.session.session_endpoints.upload_part, this.boxSession.token, currentPart.Range, this.boxSession.fileSize, digest, fileBufferData)
                .subscribe(res => {
                    this.boxSession.uploadedParts.push(res.part);
                    this.boxSession.uploadProgress = ((this.boxSession.uploadedParts.length * 100) / (this.boxSession.session.total_parts + 1))
                    this.onUploadProgressUpdate.emit(this.boxSession.uploadProgress);
                    if (this.boxSession.uploadedParts.length != this.boxSession.session.total_parts) {
                        this.processFilePart(index + 1)
                    } else {
                        this.commitUpload();
                    }

                }, (err) => {
                    this.abortUpload();
                }, () => {
                });
        });
    }

    ///Create sha1 hash digest for provided data
    createSHA1Digest(data: string | ArrayBuffer): string {
        let hash = sha1.create().update(data).hex();
        let digest = btoa(String.fromCharCode.apply(null, hash.replace(/\r|\n/g, '').replace(/([\da-fA-F]{2}) ?/g, '0x$1 ').replace(/ +$/, '').split(' ')));// "uMM3EZ5tbzGqkrb6saDKC0bECug=";
        return digest;
    }

    ///Get buffer object from file object
    getArrayBufferFromFile(file: Blob): Promise<string | ArrayBuffer> {
        return new Promise((resolve) => {
            let reader = new FileReader();
            reader.onloadend = (e) => {
                resolve(reader.result);
            }
            reader.readAsArrayBuffer(file);
        }
        );
    }
    //Get object with offset and current part size. First part index is 0.
    getFilePart(partIndex, partSize, totalSize, file: File) {
        const offset = partIndex * partSize;
        const currentPartSize = Math.min(offset + partSize, totalSize) - offset;
        const endValue = (offset + currentPartSize);
        const contentRange = offset + "-" + (endValue - 1);//Content range start from 0.
        let filePartData = file.slice(offset, endValue);//endValue index not include in slice as definition of slice

        let filePartObject = {
            Offset: offset,
            PartSize: currentPartSize,
            Range: contentRange,
            file: filePartData
        };
        return filePartObject;
    }
    commitUpload() {
        this._filesService.listUploadedPartsOfSession(this.boxSession.session.session_endpoints.list_parts, this.boxSession.token)
            .subscribe(partsResponse => {
                let parts = partsResponse.entries;

                this.getArrayBufferFromFile(this.boxSession.file).then(fileBufferData => {
                    let digest = this.createSHA1Digest(fileBufferData);

                    this._filesService.commitUploadSession(this.boxSession.session.session_endpoints.commit, this.boxSession.token, digest, parts).subscribe(commitResponse => {
                        console.log(commitResponse);
                        this.boxSession.uploadProgress = 100;
                        let fileData = commitResponse.entries[0];
                        let responseFile: ConflowFile = {
                            boxId: fileData.id,
                            fileType: this.getFileExtension(this.boxSession.fileName),
                            id: null,
                            isDeleted: false,
                            name: this.boxSession.fileName,
                            sender: null,
                            size: this.boxSession.fileSize.toString(),
                            tags: null,
                            uri: null

                        };

                        this.processMessageAfterUpload(this.boxSession.message, [responseFile]);
                        this.onUploadProgressUpdate.emit(this.boxSession.uploadProgress);

                    }, (err) => {
                        this.abortUpload();
                    });
                });
            }, (err) => {
                this.abortUpload();
            });
    }
    abortUpload() {
        this._filesService.abortUploadSession(this.boxSession.session.session_endpoints.abort, this.boxSession.token).subscribe(abortResponse => {
            console.log(abortResponse);
            this.isLoading = false;
            this.isLoadingEA.emit(this.isLoading);
            this.alertService.alertDanger(this._translateService.instant('files.fileUploadErrorMessage'), "", 10000);
            this.onSendMessage.next({ State: FileUploadMessageSendStates.afterMessageSentError.toString(), ChannelId: this.channelId, Message: this.boxSession.message });

        }, (err) => {
            this.isLoading = false;
            this.isLoadingEA.emit(this.isLoading);
            this.alertService.alertDanger(this._translateService.instant('files.fileUploadErrorMessage'), "", 10000);
            this.onSendMessage.next({ State: FileUploadMessageSendStates.afterMessageSentError.toString(), ChannelId: this.channelId, Message: this.boxSession.message });

        });
    }




}
export class FileUploadMessageSendData {
    State: string;
    ChannelId: string;
    Message: any;

}
export enum FileUploadMessageSendStates {
    beforeSend, afterFileUpload, afterMessageSent, afterComplete, afterFileUploadError, afterMessageSentError
}
