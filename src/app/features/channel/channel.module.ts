import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelComponent } from './channel.component';
import { MatSidenavModule, MatTabsModule, MatTableModule, MatTooltipModule, MatIconModule, MAT_DIALOG_DATA, MatSelectModule, MatDatepickerModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChannelListModule } from './channel-list/channel-list.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChannelTabsComponent } from './tabs/tabs.component';
import { DxTemplateModule, DxPivotGridModule, DxPopupModule, DxSelectBoxModule } from 'devextreme-angular';
import { StatusService } from './tabs/status/status.service';
import { ChannelService } from './channel.service';
import { StatusDialogComponent } from './tabs/status/status-dialog/status-dialog.component';
import { ChannelMembersComponent } from './tabs/members/members.component';
import { ChannelStatusComponent } from './tabs/status/status.component';
import { TagService } from 'src/app/shared/services/tag.service';
import { ChannelConversationComponent } from './tabs/conversation/conversation.component';
import { AvatarModule } from 'ngx-avatar';
import { ReplaceEmojisPipe } from 'src/app/shared/pipes/replace-emoji.pipe';
import { HyperlinkPipe } from 'src/app/shared/pipes/hyperlink.pipe';
import { HighLightPipe } from 'src/app/shared/pipes/highlight-pipe';
import { MessageTextboxComponent } from './common/message.textbox/message.textbox.component';
import { QuillInitializeService } from 'src/app/shared/quill-editor/services/quillInitialize.service';
import { QuillModule } from 'ngx-quill'
import { ConversationFileUploadDialogComponent } from './tabs/conversation/conversation-dialog/conversation-file-upload-dialog/conversation-file-upload-dialog.component';
import { ConversationDeleteDialogComponent } from './tabs/conversation/conversation-dialog/conversation-delete-dialog/conversation-delete-dialog.component';
import { ChannelFilesComponent } from './tabs/files/files.component';
import { ChannelStartComponent } from './channel-start/channel-start.component';
import { FileTagEditDialogComponent } from './tabs/files/file-dialog/file-tag-edit-dialog/file-tag-edit-dialog.component';


@NgModule({
    declarations: [
        ChannelComponent,
        ChannelTabsComponent,
        ChannelStatusComponent,
        StatusDialogComponent,
        ChannelMembersComponent,
        ChannelConversationComponent,
        ReplaceEmojisPipe,
        HyperlinkPipe,
        HighLightPipe,
        MessageTextboxComponent,
        ConversationFileUploadDialogComponent,
        ConversationDeleteDialogComponent,
        ChannelFilesComponent,
        ChannelStartComponent,
        FileTagEditDialogComponent
    ],
    imports: [
        CommonModule,
        MatSidenavModule,
        MatTabsModule,
        MatTableModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatTooltipModule,
        MatIconModule,
        ChannelListModule,
        SharedModule,
        DxPivotGridModule,
        DxSelectBoxModule,
        DxPopupModule,
        DxTemplateModule, 
        AvatarModule,
        QuillModule,
        MatSelectModule,
        MatDatepickerModule
    ],
    providers: [
        ChannelService,
        QuillInitializeService,
        StatusService,
        TagService,
        { provide: MAT_DIALOG_DATA, useValue: {} },
    ],
    entryComponents: [
        StatusDialogComponent,
        ConversationDeleteDialogComponent,
        ConversationFileUploadDialogComponent,
        FileTagEditDialogComponent,
    ]

})
export class ChannelModule { }
