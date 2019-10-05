import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { GlobalService } from 'src/app/shared/services/global.service';
import { ConflowUser } from 'src/app/shared/models/conflow-user';
import { Message } from 'src/app/shared/models/message';

@Component({
    selector: 'conversation-delete-dialog',
    templateUrl: './conversation-delete-dialog.component.html',
    styleUrls: ['./conversation-delete-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class ConversationDeleteDialogComponent implements OnInit {

    public contactObj: ConflowUser;
    public messageObj: Message;
    public confirmMessage: string;
    public title: string = 'Delete Message';
    public IsFileIncluded: boolean = false;
    /**
       * Constructor
       *
       * @param {MatDialogRef<ConversationDeleteDialogComponent>} matDialogRef
       * @param {GlobalService} _globalService
       */
    constructor(
        public matDialogRef: MatDialogRef<ConversationDeleteDialogComponent>,
        public _globalService: GlobalService
    ) {
    }

    ngOnInit() {
    }

    IsAnyFile(messageObj: Message) {
        return messageObj.files.filter(x => x.isDeleted == false).length > 0

    }
}
