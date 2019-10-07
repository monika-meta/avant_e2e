import { browser, by, element, protractor } from 'protractor';
import { BASE_URL, USERNAME, PASSWORD } from '../../e2e-config';

export class ConversationPage {
    EC = protractor.ExpectedConditions;

    navigateTo() {
        return browser.get('/');
    }

    getConversationTabEle() {
        const child = element(by.cssContainingText('.mat-tab-label-content', 'Conversation'));
        return child.element(by.xpath('..'));
    }
    getMiddlePanChannel() {
        return element(by.xpath('//*[@id="spaceCollapsable"]/ul[1]/li[1]/channel-list-collapsable[1]/ul[1]/li[2]/channel-list-item[1]/a[1]'));
    }

    getMessageEditorEle() {
        return element(by.css('div[contenteditable="true"][data-placeholder="Type your message here. Type @ to mention someone."]'));
    }

    getmessageSendEle() {
        return element(by.id('messageSend'));
    }
    getEditMessageEditorEle() {
        return element(by.id('editMessageTextInput'));
    }
    getMessageEditPopupBtnEle() {
        return element(by.id('editMessage'));

    }

    getLastMessageDiv(){
        return element(by.xpath('//*[@id="messageRow"][last()]/div[2]/div[1]'));
    }

    getTextMessageByTextEle(text) {
        return element(by.cssContainingText('.messag .ng-star-inserted', text));
    }
    getEditMessageEle() {
        return element(by.id('editMessageTextInput'))
            .all(by.css('div[contenteditable="true"][data-placeholder="Type your message here. Type @ to mention someone."]')).first();
    }
    getDeleteMessageEle() {
        return element(by.id('deleteMessage'));
    }
    getEditMessageTranslateEnEle() {
        return element(by.id('editMessageTranslateEN'));
    }
    getEditMessageTranslateJAEle() {
        return element(by.id('editMessageTranslateJA'));
    }
    getLastMessageRowEle() {
        return element.all(by.id('messageRow')).last();
    }
    getLastMessageRowEleMoreMenuIcon() {
        return element(by.xpath(`//div[@id="messageRow"][last()]//button[contains(@class,"message-more-menu-icon")]`));
    }
    getMenuIconInLastMessageRow() {
        return element(`//*[@id="messageRow"]/div[1]/div[2]/button[1]`);
    }
    getsaveEditMessageEle() {
        return element(by.id('messageEditSave'));
    }
    getDeletePopupEle() {
        return element(by.xpath('//conversation-delete-dialog'));
    }
    getDeletePopUpUserNameEle() {
        return element(by.xpath('//div[@class="wrap-contact-name-time"]//span[@class="contact-name"]'));
    }
    getDeletePopUpTimeEle() {
        return element(by.xpath('//div[@class="wrap-contact-name-time"]//span[@class="time secondary-text"]'));
    }
    getDeletePopUpMessageEle() {
        return element(by.css('div[class="message"]'));
    }
    getDeletePopUpDeleteBtnEle() {
        return element(by.css('button[aria-label="Delete"]'));
    }
    getDeletePopUpCancelBtnEle() {
        return element(by.css('button[aria-label="Cancel"]'));
    }
    getSideNavHeader(){
        return element(by.xpath('//div[@class="sidebar-bottom"]//div[@class="side-menu"]//li[@class="side-nav-head"][1]'))
    }

}
