import { Component, OnInit, Input, ViewChildren, Output, EventEmitter, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { GlobalService } from 'src/app/shared/services/global.service';
import { NgForm } from '@angular/forms';
import { QuillInitializeService } from 'src/app/shared/quill-editor/services/quillInitialize.service';
import 'quill-mention';
import 'quill-emoji';
//import { forEach } from '@angular/router/src/utils/collection';
import { MatInput } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { HighLightPipe } from 'src/app/shared/pipes/highlight-pipe';
import { ReplaceEmojisPipe } from 'src/app/shared/pipes/replace-emoji.pipe';
import { MentionUser, Message } from 'src/app/shared/models/message';
import { ConflowUser } from 'src/app/shared/models/conflow-user';

@Component({
    selector: 'app-messagetextbox',
    templateUrl: './message.textbox.component.html',
    styleUrls: ['./message.textbox.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MessageTextboxComponent implements OnInit, AfterViewInit {

    @ViewChildren('replyInput')
    replyInputField;

    isMentionDialog: boolean = false;
    hashValues = []
    mentionsUser: Array<MentionUser> = [];
    quillOnContentChangedEvent: any;

    @Input() contacts: ConflowUser[];

    @Input() user: ConflowUser;

    @Input() channelId: string;

    @Input() isEditMessage: boolean;

    @Input() message: Message;

    @Input() isEmptyMessageAllowed: boolean = false;

    @Output() messageObject = new EventEmitter();

    messagetoPost: any;
    escapeChar = "a&#769;";
    escapeCharVal = "á";

    quillConfig = {
        toolbar: false,
        autoLink: true,

        mention: {
            allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
            mentionDenotationChars: ["@", "#"],
            renderItem(item) {
                return `<div class="ql-mention-list-item-inner">
                  <img class="ql-mention-list-item-inner-avatar" src="${item.avatar}">
                  <span class="ql-mention-list-item-inner-text">${item.value}</span>
                </div>`;
            },
            source: (searchTerm, renderList, mentionChar) => {
                let values;
                if (mentionChar === "@") {
                    values = this.mentionUsers();
                    this.isMentionDialog = true;
                } else {
                    values = this.hashValues;
                }

                if (searchTerm.length === 0) {
                    renderList(values, searchTerm);
                } else {
                    const matches = [];
                    for (var i = 0; i < values.length; i++)
                        if (~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())) matches.push(values[i]);
                    renderList(matches, searchTerm);
                }
            },
        },
        "emoji-toolbar": true,
        "emoji-textarea": true,
        "emoji-shortname": true,
        keyboard: {
            bindings: {
                shiftEnter: {
                    key: 13,
                    shiftKey: true
                },
                enter: {
                    key: 13,
                    handler: (range, context) => {
                        if (this.isMentionDialog) {
                            this.isMentionDialog = false;
                            return false;
                        }
                        return true;
                    }
                }
            }
        }
    }

    constructor(
        private _globalService: GlobalService,
        private quillInitializeService: QuillInitializeService,
        private domSanitizer: DomSanitizer
    ) { }

    ngOnInit() {
    }

    processMessageForEdit(): any {

        let contentsForEdit = { "ops": [] };
        if (this.message !== undefined) {
            let messageForEdit = this.message.message;
            if (this.message.mentions !== undefined && this.message.mentions.length > 0) {
                this.message.mentions.forEach((match) => {
                    const filterUsersBySpace = this._globalService.usersForSpace.find((contact) => {
                        return contact['id'] === match['userId'];
                    });

                    if (messageForEdit) {
                        messageForEdit = filterUsersBySpace && filterUsersBySpace['userName'] ?
                            messageForEdit.replace(new RegExp('@' + filterUsersBySpace['id'], 'gi'), ' @' + filterUsersBySpace['id'] + ' ') : messageForEdit;
                    }
                })
                var contentCollection = messageForEdit.split(' ')
                if (contentCollection.length > 0) {
                    contentCollection.forEach((subString) => {
                        if (subString.startsWith("@")) {
                            var mentionedUser = this._globalService.usersForSpace.find((contact) => {
                                return contact['id'] === subString.slice(1);
                            });
                            if (mentionedUser) {
                                contentsForEdit.ops.push({ "insert": { "mention": { "denotationChar": "@", "id": mentionedUser['id'], "value": mentionedUser['userName'] } } });
                            }
                        }
                        else {
                            contentsForEdit.ops.push({ "insert": ' '+subString });
                        }
                    }
                    )
                }

            }
            else {
                contentsForEdit.ops.push({
                    "insert": messageForEdit,
                })
            }

        }
        console.log(contentsForEdit);
        return contentsForEdit;
    }



    ngAfterViewInit() {

    }

    mentionUsers() {
        let atMentionValues = [];
        for (let contact of this.contacts) {
            atMentionValues.push(
                {
                    id: contact.id,
                    value: contact.userName,
                    avatar: contact.avatar,
                    status: contact.status
                },
            );
        }
        this._globalService.usersForSpace.filter(function (usersForSpace) {
            atMentionValues.filter((mentionValue: any) => {
                if (usersForSpace['id'] == mentionValue.id) {
                    atMentionValues['id'] = usersForSpace['id']
                    atMentionValues['value'] = usersForSpace['userName']
                }
            })
        })
        return atMentionValues
    }

    onSelectionChanged(event) {
        if (event.oldRange == null) {
            this.onFocus();
        }
        if (event.range == null) {
            this.onBlur();
        }
    }

    onContentChanged(event) {
        this.quillOnContentChangedEvent = event;
    }

    onFocus() {
        console.log("On Focus");
    }
    onBlur() {
        console.log("Blurred");
    }

    setQuillEditorFocus(event) {
        if (this.message !== undefined) {
            event.setContents(this.processMessageForEdit())
        }
        event.focus();
    }

    /**
    * push contact mentioned
    *
    * @param contact
    */

    pushMentionToMessage(): void {
        let userMentioned;
        if (this.quillOnContentChangedEvent !== undefined) {
            this.quillOnContentChangedEvent.content.ops.forEach(element => {
                if (element.insert instanceof Object) {
                    if (element.insert.mention) {
                        userMentioned = {
                            userId: element.insert.mention.id,
                            name: element.insert.mention.value
                        };
                        this.mentionsUser.push(userMentioned)
                    }
                }
            });
        }
    }


    /**
     * Reply
     */
    createMessage(event): void {
        if (this.isMentionDialog) {
            return;
        }
        event.preventDefault();
        this.pushMentionToMessage();
        let inputMessage = "";
        if (this.quillOnContentChangedEvent !== undefined) {
            // handle extra new lines
            if (this.quillOnContentChangedEvent.editor.root.textContent === "") {
                return;
            }
            this.quillOnContentChangedEvent.editor.root.innerHTML = this.quillOnContentChangedEvent.editor.root.innerHTML.split("<br>").join(this.escapeChar);
            inputMessage = this.quillOnContentChangedEvent.editor.root.innerText.split(this.escapeCharVal).join("");
            inputMessage = inputMessage.trim();
        }

        if (!this.isEmptyMessageAllowed && (!inputMessage || this.isMentionDialog)) {
            return;
        }

        if (this.mentionsUser) {
            this.mentionsUser.forEach(mentionUser => {
                let mentionUserName = new RegExp(mentionUser.name, 'ig');
                inputMessage = inputMessage.replace(mentionUserName, mentionUser.userId);
            });
        }


        this.messageObject.emit({ message: inputMessage, mentionUsers: this.mentionsUser, messageObj: this.message });
        if (!this.isEmptyMessageAllowed) {
            this.quillOnContentChangedEvent.editor.root.textContent = "";
            this.mentionsUser = [];
        }
    }
}
